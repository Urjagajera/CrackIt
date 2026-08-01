import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { trimInput, isNonEmptyString } from '../lib/sanitize';
import { TranscriptItem } from '../types';

export default function InterviewScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
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

  const [messages, setMessages] = useState<TranscriptItem[]>([
    {
      id: 'welcome-1',
      sender: 'CrackIt',
      role: 'ai',
      text: "Welcome to your AI Mock Interview! I will guide you through question rounds.",
      time: '00:00',
    },
  ] as (TranscriptItem & { sender: string })[]);

  const [userInput, setUserInput] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndInterview = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'end_session' }));
    }
    showToast('Interview complete! Analysis reports are being generated.', 'success');
    navigate('/reports');
  }, [navigate, showToast]);

  // Connect to WebSocket Server
  useEffect(() => {
    const wsUrl = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:4000/ws';
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setStatusText('AI Interviewer is active.');
      // Join session room
      ws.send(
        JSON.stringify({
          type: 'join_session',
          payload: {
            session_id: 'demo-session-1',
            user_id: 'demo-user-urja-12345',
          },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type, payload } = message;

        switch (type) {
          case 'session_state': {
            if (payload.remaining_seconds) setTimeLeft(payload.remaining_seconds);
            if (payload.current_question_index !== undefined) setCurrentQuestionIdx(payload.current_question_index);
            if (payload.messages && Array.isArray(payload.messages)) {
              setMessages(payload.messages);
            }
            break;
          }

          case 'timer_tick': {
            if (payload.remaining_seconds !== undefined) {
              setTimeLeft(payload.remaining_seconds);
            }
            break;
          }

          case 'question_delivered': {
            if (payload.question_index !== undefined) setCurrentQuestionIdx(payload.question_index);
            setStatusText('The AI Interviewer is speaking...');
            if (payload.message) {
              setMessages((prev) => [...prev, payload.message]);
            }
            break;
          }

          case 'transcription_update': {
            setStatusText('AI Mentor is analyzing response...');
            if (payload.message) {
              setMessages((prev) => [...prev, payload.message]);
            }
            break;
          }

          case 'response_scored': {
            showToast(`Response Scored: ${payload.overall_score}%`, 'info');
            break;
          }

          case 'session_completed': {
            handleEndInterview();
            break;
          }
        }
      } catch {
        // Fallback
      }
    };

    ws.onerror = () => {
      setStatusText('Offline mode (WebSocket unavailable)');
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [handleEndInterview, showToast]);

  const handleSubmitAnswer = () => {
    const rawAnswer = trimInput(userInput);
    const answerText = isNonEmptyString(rawAnswer)
      ? rawAnswer
      : 'In my last project, we resolved caching lock issues by introducing optimistic concurrency and Redis read-through caching.';

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'submit_response',
          payload: {
            text: answerText,
            response_time_sec: 45,
          },
        })
      );
    } else {
      // Local fallback simulation if offline
      const currentTimeStr = formatTime(timeLeft);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'You',
          role: 'user',
          text: answerText,
          time: currentTimeStr,
        },
      ]);
      setStatusText('AI Mentor is analyzing response...');
      setTimeout(() => {
        if (currentQuestionIdx + 1 < questionsList.length) {
          setCurrentQuestionIdx((prev) => prev + 1);
          setStatusText('The AI Interviewer is speaking...');
        } else {
          handleEndInterview();
        }
      }, 1500);
    }

    setUserInput('');
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-primary-fixed">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 mx-auto w-[95%] max-w-container-max mt-4 bg-surface/80 backdrop-blur-md rounded-full shadow-[0_10px_30px_rgba(65,81,187,0.08)] border border-surface-variant/30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="font-headline-md text-headline-md font-extrabold text-primary cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          >
            CrackIt
          </button>
          <div className="h-6 w-px bg-outline-variant hidden md:block"></div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full">
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span className="font-label-md text-label-md text-xs font-bold uppercase tracking-wider">
              {isConnected ? 'Live WebSocket Round' : 'Practice Round'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">
              Time Remaining
            </span>
            <span className="font-headline-md text-headline-md text-primary font-bold text-lg" id="timer">
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="h-10 w-px bg-outline-variant"></div>
          <div className="flex flex-col items-start">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">
              Progress
            </span>
            <span className="font-body-md text-body-md font-bold text-on-surface text-sm">
              Question {currentQuestionIdx + 1} of {questionsList.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-margin-desktop py-6 relative overflow-hidden text-left">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {/* Question Banner Card */}
          <section className="bg-surface-container-lowest rounded-[28px] p-6 md:p-8 shadow-[0_15px_40px_rgba(65,81,187,0.06)] text-center relative overflow-hidden border border-surface-variant/30">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-secondary-container to-primary/20"></div>

            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-label-md text-xs font-semibold mb-3">
              {statusText}
            </span>

            <h1 className="font-headline-lg text-lg md:text-xl font-bold text-on-surface leading-snug max-w-2xl mx-auto">
              "{questionsList[currentQuestionIdx] || 'Loading Question...'}"
            </h1>

            {/* Waveform Visualizer */}
            <div className="mt-4 flex items-center justify-center gap-1.5 h-8">
              <div className="waveform-bar w-1.5 bg-primary rounded-full h-3 animate-[wave_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }}></div>
              <div className="waveform-bar w-1.5 bg-secondary rounded-full h-5 animate-[wave_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }}></div>
              <div className="waveform-bar w-1.5 bg-primary rounded-full h-2 animate-[wave_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }}></div>
              <div className="waveform-bar w-1.5 bg-secondary rounded-full h-6 animate-[wave_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }}></div>
              <div className="waveform-bar w-1.5 bg-primary rounded-full h-4 animate-[wave_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }}></div>
              <div className="waveform-bar w-1.5 bg-secondary rounded-full h-5 animate-[wave_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </section>

          {/* Interactive Chat Format Container */}
          <section className="bg-surface-container-lowest/80 backdrop-blur-md rounded-[32px] p-6 shadow-md border border-surface-variant/30 flex flex-col h-[380px]">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant/20 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
                <h3 className="font-label-md text-on-surface uppercase tracking-wider text-xs font-bold">
                  Interview Conversation
                </h3>
              </div>
              <span className="text-xs text-on-surface-variant font-mono">Live WebSocket Feed</span>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {messages.map((msg, idx) => {
                const isAI = msg.role === 'ai';
                const messageKey = msg.id || `${msg.role}-${msg.time}-${idx}`;
                return (
                  <div key={messageKey} className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
                    {isAI && (
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/20 mt-1">
                        <span className="material-symbols-outlined text-lg">smart_toy</span>
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] md:max-w-[65%] p-4 rounded-2xl ${
                        isAI
                          ? 'bg-surface-container-low text-on-surface rounded-tl-none border border-surface-variant/40 shadow-sm'
                          : 'bg-primary text-on-primary rounded-tr-none shadow-md'
                      }`}
                    >
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

          {/* User Input Response Box */}
          <section className="bg-surface-container rounded-2xl p-3.5 flex gap-3 items-center border border-surface-variant/30">
            <input
              type="text"
              placeholder="Type your answer to submit response..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer()}
              className="flex-1 bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              onClick={handleSubmitAnswer}
              className="px-6 py-3 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span>Submit Answer</span>
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </section>
        </div>
      </main>

      {/* Bottom Action Pill */}
      <footer className="pb-10 pt-4 px-6 md:px-margin-desktop text-center">
        <div className="max-w-fit mx-auto flex items-center justify-center bg-surface-container-high/50 p-2 rounded-full backdrop-blur-sm border border-surface-variant/20 shadow-lg">
          <button
            onClick={handleEndInterview}
            className="px-8 py-3 rounded-full bg-error text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-error"
          >
            End Interview
          </button>
        </div>
      </footer>
    </div>
  );
}
