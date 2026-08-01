import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { trimInput, isNonEmptyString } from '../lib/sanitize';
import { apiUpload } from '../lib/api';
import { TranscriptItem } from '../types';

// ─── Browser capability detection ────────────────────────────────────────────
const SpeechRecognitionAPI =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const HAS_STT = Boolean(SpeechRecognitionAPI);

// face-api.js loaded from CDN in index.html — we reference it via window
declare const faceapi: any;

// ─── Emotion helpers ──────────────────────────────────────────────────────────
interface EmotionSummary {
  dominant_emotion: string;
  avg_confidence: number;
  avg_nervousness: number;
}

function aggregateEmotions(frames: Record<string, number>[]): EmotionSummary | null {
  if (!frames.length) return null;
  const totals: Record<string, number> = {};
  for (const f of frames) {
    for (const [emotion, val] of Object.entries(f)) {
      totals[emotion] = (totals[emotion] || 0) + val;
    }
  }
  const averaged: Record<string, number> = {};
  for (const [k, v] of Object.entries(totals)) {
    averaged[k] = v / frames.length;
  }
  const dominant = Object.entries(averaged).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
  const avgConfidence = averaged['happy'] || averaged['neutral'] || 0;
  const avgNervousness = ((averaged['fearful'] || 0) + (averaged['surprised'] || 0)) / 2;
  return { dominant_emotion: dominant, avg_confidence: avgConfidence, avg_nervousness: avgNervousness };
}

// ─── Emotion display helpers ──────────────────────────────────────────────────
const EMOTION_EMOJI: Record<string, string> = {
  happy: '😊', sad: '😢', angry: '😠', fearful: '😨',
  disgusted: '🤢', surprised: '😲', neutral: '😐',
};

export default function InterviewScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // ── Core interview state ───────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState<number>(900);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Connecting to AI Interview Engine...');
  const [questionsList, setQuestionsList] = useState<string[]>([
    'Tell me about yourself and your background.',
    'Why are you interested in joining our company?',
    'Describe a challenging technical problem you solved recently.',
    'Could you describe a time you handled a conflict in your team?',
    'How do you prioritize tasks when working on multiple projects with tight deadlines?',
    'Explain hexagonal architecture and why you would use it.',
    'What is your approach to handling database failure in production?',
    'Tell me about a time you had to deliver negative feedback to a peer.',
    'How do you stay up-to-date with emerging software technologies?',
    'Do you have any questions for me?',
  ]);
  const [messages, setMessages] = useState<(TranscriptItem & { sender?: string })[]>([
    {
      id: 'welcome-1',
      sender: 'CrackIt',
      role: 'ai',
      text: 'Welcome to your AI Mock Interview! Grant camera & mic permissions, then press Start Answer when ready.',
      time: '00:00',
    },
  ]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // ── STT state ─────────────────────────────────────────────────────────────
  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // ── Camera / recording state ───────────────────────────────────────────────
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const emotionFramesRef = useRef<Record<string, number>[]>([]);
  const currentResponseEmotionRef = useRef<Record<string, number>[]>([]);
  const faceApiReadyRef = useRef<boolean>(false);
  const faceDetectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const wsRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const responseStartTimeRef = useRef<number>(Date.now());

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id') ||
    sessionStorage.getItem('interview_session_id') ||
    `session-${Date.now()}`;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ── Scroll to bottom ───────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── TTS: speak a question aloud ────────────────────────────────────────────
  const speakText = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.lang = 'en-US';
    // Prefer a natural-sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
    );
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }, []);

  // ── face-api.js: load models + start frame detection ─────────────────────
  const loadFaceApi = useCallback(async () => {
    if (typeof faceapi === 'undefined') return;
    try {
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      faceApiReadyRef.current = true;
      console.log('😊 [face-api] Models loaded.');
    } catch {
      console.warn('⚠️ [face-api] Could not load emotion detection models.');
    }
  }, []);

  const startFaceDetection = useCallback(() => {
    if (!faceApiReadyRef.current || !videoRef.current) return;
    faceDetectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || !faceApiReadyRef.current) return;
      try {
        const result = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();
        if (result?.expressions) {
          const expressions = result.expressions as Record<string, number>;
          emotionFramesRef.current.push(expressions);
          currentResponseEmotionRef.current.push(expressions);
          // Update live emotion badge
          const dominant = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
          setCurrentEmotion(dominant);
        }
      } catch { /* ignore frame errors */ }
    }, 1000);
  }, []);

  const stopFaceDetection = useCallback(() => {
    if (faceDetectionIntervalRef.current) {
      clearInterval(faceDetectionIntervalRef.current);
      faceDetectionIntervalRef.current = null;
    }
  }, []);

  // ── Camera: request access + start recording ───────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
      setCameraError(null);

      // Start session recording
      const mr = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm',
      });
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      mr.start(1000); // collect chunks every 1s
      mediaRecorderRef.current = mr;

      // Load face-api models and start frame detection
      await loadFaceApi();
      startFaceDetection();
    } catch (err: any) {
      const msg = err?.name === 'NotAllowedError'
        ? 'Camera / mic permission denied. Click the camera icon in your browser address bar to allow access.'
        : `Could not access camera: ${err?.message || 'Unknown error'}`;
      setCameraError(msg);
    }
  }, [loadFaceApi, startFaceDetection]);

  useEffect(() => {
    startCamera();
    return () => {
      stopFaceDetection();
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      window.speechSynthesis?.cancel();
    };
  }, [startCamera, stopFaceDetection]);

  // ── STT: start listening ───────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!HAS_STT) return;
    if (recognitionRef.current) recognitionRef.current.stop();

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setLiveTranscript((prev) => prev + final);
      if (interim) setUserInput(interim);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.warn('STT error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    currentResponseEmotionRef.current = []; // reset per-response emotion frames
    responseStartTimeRef.current = Date.now();
    setStatusText('Listening… speak your answer');
    setLiveTranscript('');
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setStatusText('Processing your answer…');
  }, []);

  // ── End session: stop recording, upload video, navigate ────────────────────
  const handleEndInterview = useCallback(async (fromSocket = false) => {
    // 1. Stop recognition
    recognitionRef.current?.stop();

    // 2. Stop face detection
    stopFaceDetection();

    // 3. Stop MediaRecorder and collect final blob
    const recorder = mediaRecorderRef.current;
    let videoBlob: Blob | null = null;

    if (recorder && recorder.state !== 'inactive') {
      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
        recorder.stop();
      });
    }

    if (recordedChunksRef.current.length > 0) {
      videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
    }

    // 4. Stop camera tracks
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    window.speechSynthesis?.cancel();

    // 5. Send end_session via WebSocket if not already triggered by server
    if (!fromSocket && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'end_session' }));
    }

    // 6. Upload video in background (non-blocking)
    if (videoBlob) {
      const formData = new FormData();
      formData.append('video', videoBlob, `${sessionId}.webm`);
      try {
        await apiUpload(`/interviews/${sessionId}/video`, formData);
        console.log('🎬 Session video uploaded.');
      } catch (err) {
        console.warn('⚠️ Video upload failed (non-fatal):', err);
      }
    }

    showToast('Interview complete! Generating your performance report…', 'success');
    navigate(`/interview-replay/${sessionId}`);
  }, [navigate, sessionId, showToast, stopFaceDetection]);

  // ── WebSocket connection ───────────────────────────────────────────────────
  useEffect(() => {
    const wsUrl = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:4000/ws';
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setStatusText('AI Interviewer is active.');
      ws.send(JSON.stringify({
        type: 'join_session',
        payload: { session_id: sessionId, user_id: 'demo-user-urja-12345' },
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type, payload } = message;

        switch (type) {
          case 'session_state': {
            if (payload.remaining_seconds) setTimeLeft(payload.remaining_seconds);
            if (payload.current_question_index !== undefined)
              setCurrentQuestionIdx(payload.current_question_index);
            if (payload.messages?.length) setMessages(payload.messages);
            if (payload.questions?.length) setQuestionsList(payload.questions);
            // Speak first question on connect
            const q = payload.questions?.[payload.current_question_index] || questionsList[0];
            setTimeout(() => speakText(q), 800);
            setStatusText('Ready — press Start Answer when you begin speaking.');
            break;
          }
          case 'timer_tick': {
            if (payload.remaining_seconds !== undefined) setTimeLeft(payload.remaining_seconds);
            break;
          }
          case 'question_delivered': {
            if (payload.question_index !== undefined) setCurrentQuestionIdx(payload.question_index);
            if (payload.message) setMessages((prev) => [...prev, payload.message]);
            // Speak the new question via TTS
            speakText(payload.question_text || '');
            setStatusText('Ready — press Start Answer when you begin speaking.');
            break;
          }
          case 'transcription_update': {
            if (payload.message) setMessages((prev) => [...prev, payload.message]);
            setStatusText('AI Mentor is analysing your response…');
            break;
          }
          case 'response_scored': {
            showToast(`✅ Scored: ${payload.overall_score}%`, 'info');
            setLiveTranscript('');
            setUserInput('');
            break;
          }
          case 'session_completed': {
            handleEndInterview(true);
            break;
          }
        }
      } catch { /* ignore parse errors */ }
    };

    ws.onerror = () => setStatusText('Offline mode (WebSocket unavailable)');
    ws.onclose = () => setIsConnected(false);

    return () => ws.close();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Submit answer ──────────────────────────────────────────────────────────
  const handleSubmitAnswer = useCallback(() => {
    // Stop STT if active
    if (isListening) stopListening();

    const elapsed = Math.round((Date.now() - responseStartTimeRef.current) / 1000);

    // Prefer STT transcript → live transcript → manual input → fallback
    const rawText = liveTranscript || userInput;
    const answerText = isNonEmptyString(trimInput(rawText))
      ? trimInput(rawText)
      : 'I approached this by breaking the problem into smaller parts and iterating on each step.';

    // Aggregate emotion data for this response
    const emotionSummary = aggregateEmotions(currentResponseEmotionRef.current);
    currentResponseEmotionRef.current = []; // reset for next response

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'submit_response',
        payload: {
          text: answerText,
          response_time_sec: elapsed || 45,
          emotion_summary: emotionSummary,
        },
      }));
    } else {
      // Offline fallback
      const timeStr = formatTime(timeLeft);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: 'You', role: 'user', text: answerText, time: timeStr },
      ]);
      setStatusText('AI Mentor is analysing response…');
      setTimeout(() => {
        if (currentQuestionIdx + 1 < questionsList.length) {
          setCurrentQuestionIdx((prev) => prev + 1);
          speakText(questionsList[currentQuestionIdx + 1]);
          setStatusText('Ready — press Start Answer when you begin speaking.');
        } else {
          handleEndInterview();
        }
      }, 1500);
    }

    setLiveTranscript('');
    setUserInput('');
  }, [isListening, stopListening, liveTranscript, userInput, timeLeft, currentQuestionIdx, questionsList, speakText, handleEndInterview]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col overflow-x-hidden">

      {/* ── Browser Compat Banner (Firefox/Safari STT fallback) ─────────────── */}
      {!HAS_STT && (
        <div className="w-full bg-amber-500/15 border-b border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm px-6 py-2.5 flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-500 text-lg">warning</span>
          <span>
            <strong>Your browser doesn't support live speech recognition.</strong>{' '}
            SpeechRecognition requires Chrome or Edge. Type your answers in the text box below — the interview is fully functional.
          </span>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 mx-auto w-[95%] max-w-container-max mt-4 bg-surface/80 backdrop-blur-md rounded-full shadow-[0_10px_30px_rgba(65,81,187,0.08)] border border-surface-variant/30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="font-headline-md text-headline-md font-extrabold text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          >
            CrackIt
          </button>
          <div className="h-6 w-px bg-outline-variant hidden md:block" />
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full">
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span className="font-label-md text-xs font-bold uppercase tracking-wider">
              {isConnected ? 'Live WebSocket Round' : 'Practice Round'}
            </span>
          </div>
          {/* Live emotion badge */}
          {cameraReady && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full border border-surface-variant/30 text-xs text-on-surface-variant">
              <span>{EMOTION_EMOJI[currentEmotion] || '😐'}</span>
              <span className="capitalize">{currentEmotion}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Time Remaining</span>
            <span className={`font-headline-md font-bold text-lg ${timeLeft < 120 ? 'text-error animate-pulse' : 'text-primary'}`} id="timer">
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="h-10 w-px bg-outline-variant" />
          <div className="flex flex-col items-start">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Progress</span>
            <span className="font-body-md font-bold text-on-surface text-sm">
              Q {currentQuestionIdx + 1} / {questionsList.length}
            </span>
          </div>
        </div>
      </header>

      {/* ── Main Layout: two-column on large screens ─────────────────────────── */}
      <main className="flex-grow flex flex-col lg:flex-row gap-6 items-stretch px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">

        {/* ── Left: Interview canvas ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">

          {/* Question banner */}
          <section className="bg-surface-container-lowest rounded-[28px] p-6 md:p-8 shadow-[0_15px_40px_rgba(65,81,187,0.06)] text-center relative overflow-hidden border border-surface-variant/30">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-secondary-container to-primary/20" />
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-label-md text-xs font-semibold mb-3">
              {statusText}
            </span>
            <h1 className="font-headline-lg text-lg md:text-xl font-bold text-on-surface leading-snug max-w-2xl mx-auto">
              "{questionsList[currentQuestionIdx] || 'Loading Question…'}"
            </h1>

            {/* Waveform visualiser (animated when listening) */}
            <div className="mt-4 flex items-center justify-center gap-1.5 h-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isListening ? 'bg-tertiary animate-[wave_1.0s_ease-in-out_infinite]' : 'bg-primary/40 h-2'
                  }`}
                  style={isListening ? {
                    animationDelay: `${i * 0.12}s`,
                    height: `${Math.random() * 16 + 8}px`,
                  } : { height: '8px' }}
                />
              ))}
            </div>
          </section>

          {/* Live transcript strip (visible when STT is active) */}
          {isListening && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl px-5 py-3 flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse flex-shrink-0 mt-1.5" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Live Transcription</p>
                <p className="text-sm text-on-surface leading-relaxed">
                  {liveTranscript || userInput || <span className="text-on-surface-variant italic">Listening for your voice…</span>}
                </p>
              </div>
            </div>
          )}

          {/* Chat feed */}
          <section className="bg-surface-container-lowest/80 backdrop-blur-md rounded-[32px] p-6 shadow-md border border-surface-variant/30 flex flex-col flex-1 min-h-[280px] max-h-[380px]">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant/20 mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-tertiary animate-pulse' : 'bg-outline'}`} />
                <h3 className="font-label-md text-on-surface uppercase tracking-wider text-xs font-bold">
                  Interview Conversation
                </h3>
              </div>
              <span className="text-xs text-on-surface-variant font-mono">
                {isConnected ? 'Live WebSocket Feed' : 'Offline Mode'}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {messages.map((msg, idx) => {
                const isAI = msg.role === 'ai';
                const key = msg.id || `${msg.role}-${idx}`;
                return (
                  <div key={key} className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
                    {isAI && (
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/20 mt-1">
                        <span className="material-symbols-outlined text-lg">smart_toy</span>
                      </div>
                    )}
                    <div className={`max-w-[75%] md:max-w-[65%] p-4 rounded-2xl ${
                      isAI
                        ? 'bg-surface-container-low text-on-surface rounded-tl-none border border-surface-variant/40 shadow-sm'
                        : 'bg-primary text-on-primary rounded-tr-none shadow-md'
                    }`}>
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className={`font-bold text-xs ${isAI ? 'text-primary' : 'text-on-primary/90'}`}>
                          {(msg as any).sender || (isAI ? 'CrackIt' : 'You')}
                        </span>
                        <span className={`text-[10px] ${isAI ? 'text-on-surface-variant' : 'text-on-primary/70'}`}>
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    {!isAI && (
                      <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0 shadow-sm border border-secondary/20 mt-1">
                        <span className="material-symbols-outlined text-lg">person</span>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
          </section>

          {/* Answer controls */}
          <section className="bg-surface-container rounded-2xl p-3.5 flex flex-col gap-3 border border-surface-variant/30">
            {HAS_STT ? (
              <div className="flex gap-3">
                <button
                  id="btn-start-answer"
                  onClick={startListening}
                  disabled={isListening}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                    isListening
                      ? 'bg-error/10 text-error border border-error/30 cursor-not-allowed'
                      : 'bg-tertiary/10 text-tertiary border border-tertiary/30 hover:bg-tertiary/20 active:scale-95'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{isListening ? 'mic' : 'mic_none'}</span>
                  {isListening ? 'Recording…' : 'Start Answer'}
                </button>
                <button
                  id="btn-submit-answer"
                  onClick={handleSubmitAnswer}
                  disabled={!isListening && !liveTranscript && !userInput}
                  className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <span>Submit Answer</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            ) : (
              /* Manual fallback input for Firefox/Safari */
              <div className="flex gap-3">
                <input
                  id="manual-answer-input"
                  type="text"
                  placeholder="Type your answer here…"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                  className="flex-1 bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  id="btn-submit-manual"
                  onClick={handleSubmitAnswer}
                  className="px-6 py-3 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-1.5"
                >
                  <span>Submit</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ── Right: Camera self-view ────────────────────────────────────────── */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-[28px] overflow-hidden border border-surface-variant/30 shadow-md relative aspect-[3/4]">
            {/* Camera video element */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover transition-opacity duration-500 ${cameraReady ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Placeholder if camera not ready */}
            {!cameraReady && !cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container gap-3">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-pulse">videocam</span>
                <p className="text-xs text-on-surface-variant text-center px-4">
                  Starting camera…<br/>Allow access in your browser.
                </p>
              </div>
            )}

            {/* Camera error state */}
            {cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container gap-3 p-4">
                <span className="material-symbols-outlined text-4xl text-error">videocam_off</span>
                <p className="text-xs text-error text-center leading-relaxed">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="mt-2 px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-full hover:opacity-90 transition-all"
                >
                  Retry Camera
                </button>
              </div>
            )}

            {/* Recording indicator */}
            {cameraReady && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                REC
              </div>
            )}

            {/* Emotion overlay */}
            {cameraReady && (
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span>{EMOTION_EMOJI[currentEmotion] || '😐'}</span>
                  <span className="capitalize">{currentEmotion}</span>
                </div>
                <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                  {isListening
                    ? <span className="text-red-400 font-bold">● LIVE</span>
                    : <span className="text-gray-400">Standby</span>
                  }
                </div>
              </div>
            )}
          </div>

          {/* Tips card */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-variant/30 shadow-sm">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">💡 Tips</p>
            <ul className="space-y-1.5 text-xs text-on-surface-variant leading-relaxed">
              <li>• Press <strong>Start Answer</strong> then speak clearly.</li>
              <li>• Press <strong>Submit</strong> when done — AI scores automatically.</li>
              <li>• Look at the camera — eye contact matters.</li>
              <li>• Questions are read aloud via TTS — listen first.</li>
            </ul>
          </div>
        </div>
      </main>

      {/* ── Footer: End Interview ─────────────────────────────────────────────── */}
      <footer className="pb-10 pt-4 px-6 text-center">
        <div className="max-w-fit mx-auto flex items-center justify-center bg-surface-container-high/50 p-2 rounded-full backdrop-blur-sm border border-surface-variant/20 shadow-lg">
          <button
            id="btn-end-interview"
            onClick={() => handleEndInterview(false)}
            className="px-8 py-3 rounded-full bg-error text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-error"
          >
            End Interview
          </button>
        </div>
      </footer>
    </div>
  );
}
