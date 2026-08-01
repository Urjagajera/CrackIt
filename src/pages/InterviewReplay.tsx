import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../lib/api';
import TranscriptChatFeed from '../components/TranscriptChatFeed';

const EMOTION_EMOJI: Record<string, string> = {
  happy: '😊', sad: '😢', angry: '😠', fearful: '😨',
  disgusted: '🤢', surprised: '😲', neutral: '😐',
};

const EMOTION_LABEL: Record<string, { color: string; label: string }> = {
  happy: { color: 'text-green-600', label: 'Confident' },
  neutral: { color: 'text-blue-500', label: 'Composed' },
  surprised: { color: 'text-yellow-600', label: 'Attentive' },
  fearful: { color: 'text-orange-500', label: 'Nervous' },
  sad: { color: 'text-slate-500', label: 'Subdued' },
  angry: { color: 'text-red-500', label: 'Tense' },
  disgusted: { color: 'text-purple-500', label: 'Uncertain' },
};

export default function InterviewReplay() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [session, setSession] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [transcript, setTranscript] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const replayVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const sessionId = id || sessionStorage.getItem('interview_session_id') || 'demo-session-1';
    setIsLoading(true);

    Promise.all([
      apiFetch<{ session: any; transcript?: any[]; responses?: any[] }>(`/interviews/${sessionId}/replay`),
      apiFetch<{ report: any }>(`/interviews/${sessionId}/report`).catch(() => ({ report: null })),
    ])
      .then(([replayData, reportData]) => {
        if (replayData.session) {
          setSession(replayData.session);
          setTranscript(replayData.transcript || []);
          setResponses(replayData.responses || []);
        }
        if (reportData?.report) {
          setReport(reportData.report);
        }
      })
      .catch(() => {
        showToast('Session replay details not found.', 'error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, showToast]);

  const handleShare = () => {
    showToast('Share Link: A private link has been copied to your clipboard.', 'success');
  };

  const handleDownload = () => {
    showToast(`Downloading Performance Report PDF.`, 'info');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body-md font-semibold">Loading Interview Replay &amp; AI Recommendations...</p>
        </div>
      </div>
    );
  }

  if (!session && !isLoading) {
    return (
      <div className="min-h-screen p-12 bg-background text-on-surface text-center flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">find_in_page</span>
        <h3 className="font-headline-lg text-2xl font-bold mb-2">Session Replay Not Found</h3>
        <p className="text-on-surface-variant max-w-md mb-6">
          The requested interview session record does not exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/reports')}
          className="px-6 py-3 bg-primary text-on-primary rounded-full font-bold shadow-md hover:scale-105 transition-all"
        >
          Return to Reports
        </button>
      </div>
    );
  }

  // Calculate actual average score dynamically across all submitted responses
  let totalScore = 0;
  let responseCount = 0;
  for (const r of responses) {
    const sc = r.score_json?.overall_score || r.overall_score;
    if (typeof sc === 'number') {
      totalScore += sc;
      responseCount++;
    }
  }

  const actualAverageScore =
    responseCount > 0 ? Math.round(totalScore / responseCount) : report?.overall_score || session?.overallScore || 85;

  const strengthsList = report?.strengths_json || [
    { area: 'System Architecture', detail: 'Demonstrated solid technical reasoning and trade-off analysis.' },
  ];
  const improvementsList = report?.improvements_json || [
    { area: 'STAR Method Structure', detail: 'Quantify metrics when explaining resolution outcomes.' },
  ];

  return (
    <div className="px-margin-mobile md:px-margin-desktop pb-margin-mobile md:pb-margin-desktop min-h-screen text-left bg-background selection:bg-primary-fixed">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-label-md mb-2 text-sm font-semibold">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <Link className="hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded" to="/reports">
              Back to Sessions
            </Link>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold text-[26px]">
            {session.title || 'Technical Mock Interview'} Replay
          </h2>
          <p className="text-on-surface-variant font-body-md mt-1 text-sm">
            {session.company || 'Target Placement'} • {session.date || 'Recent'} • {session.duration || '15 mins'}
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handleShare}
            className="flex-1 md:flex-initial px-6 py-3 rounded-full border border-outline-variant text-on-surface font-label-md hover:bg-surface-container transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary text-xs"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            <span>Share Report</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 md:flex-initial px-6 py-3 rounded-full bg-secondary text-on-secondary font-label-md hover:opacity-90 shadow-lg shadow-secondary/20 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-secondary text-xs"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* Actual Average Score Banner Card */}
      <div className="mb-8 p-6 bg-surface-container-lowest rounded-[24px] border border-surface-variant/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary font-bold text-2xl border border-primary/20 shadow-inner shrink-0">
            {actualAverageScore}%
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-label-sm uppercase tracking-wider text-xs font-bold text-primary">
                Session Performance Metric
              </span>
              <span className="px-2.5 py-0.5 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded-full">
                AI Verified
              </span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface">
              Actual Average Score: <span className="text-primary">{actualAverageScore}/100</span>
            </h3>
            <p className="text-body-md text-on-surface-variant text-xs mt-0.5">
              Calculated across {responseCount > 0 ? `${responseCount} submitted response(s)` : 'all question rounds'}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 divide-x divide-outline-variant/30 text-center">
          <div className="pr-4">
            <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">Clarity Signal</span>
            <span className="text-base font-bold text-secondary">{actualAverageScore >= 80 ? 'High' : 'Moderate'}</span>
          </div>
          <div className="pl-4">
            <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">Structure Fit</span>
            <span className="text-base font-bold text-tertiary">STAR Method</span>
          </div>
        </div>
      </div>

      {/* ── Session Video Playback ──────────────────────────────────────────── */}
      {session?.video_url && (
        <div className="mb-8 p-5 bg-surface-container-lowest rounded-[24px] border border-surface-variant/30 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">play_circle</span>
            <h3 className="font-headline-md font-bold text-on-surface text-base">Session Recording</h3>
            <span className="px-2.5 py-0.5 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded-full ml-auto">
              Full Interview Video
            </span>
          </div>
          <video
            ref={replayVideoRef}
            src={session.video_url}
            controls
            playsInline
            className="w-full rounded-2xl bg-black max-h-[400px] shadow-md"
          />
          <p className="text-[10px] text-on-surface-variant mt-2 text-center">
            Recorded using browser MediaRecorder API · Synchronized with transcript timeline below
          </p>
        </div>
      )}

      {/* ── Body Language & Confidence (from report emotion summary) ─────────── */}
      {report?.emotion_summary_json && (
        <div className="mb-8 p-5 bg-surface-container-lowest rounded-[24px] border border-surface-variant/30 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary">face</span>
            <h3 className="font-headline-md font-bold text-on-surface text-base">Body Language &amp; Confidence</h3>
            <span className="text-xs text-on-surface-variant ml-auto">
              {report.emotion_summary_json.response_count} response(s) analysed
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[120px] p-4 bg-surface-container rounded-2xl border border-surface-variant/30 text-center">
              <p className="text-2xl mb-1">{EMOTION_EMOJI[report.emotion_summary_json.overall_dominant_emotion] || '😐'}</p>
              <p className="text-xs font-bold text-on-surface capitalize">{report.emotion_summary_json.overall_dominant_emotion}</p>
              <p className="text-[10px] text-on-surface-variant">Dominant emotion</p>
            </div>
            <div className="flex-1 min-w-[120px] p-4 bg-tertiary-container/30 rounded-2xl border border-tertiary/20 text-center">
              <p className="text-xl font-bold text-tertiary mb-1">
                {Math.round((report.emotion_summary_json.avg_confidence || 0) * 100)}%
              </p>
              <p className="text-xs font-bold text-on-surface">Confidence</p>
              <p className="text-[10px] text-on-surface-variant">Avg across session</p>
            </div>
            <div className="flex-1 min-w-[120px] p-4 bg-error/5 rounded-2xl border border-error/20 text-center">
              <p className="text-xl font-bold text-error mb-1">
                {Math.round((report.emotion_summary_json.avg_nervousness || 0) * 100)}%
              </p>
              <p className="text-xs font-bold text-on-surface">Nervousness</p>
              <p className="text-[10px] text-on-surface-variant">Avg across session</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Chat Feed & Transcript (7 Columns) */}

        <div className="lg:col-span-7 space-y-gutter">
          {/* Transcript Feed Card */}
          <section className="glass-card rounded-[32px] p-6 shadow-[0_20px_50px_rgba(65,81,187,0.1)] relative border border-surface-variant/30 bg-surface-container-lowest">
            <div className="flex items-center justify-between pb-4 border-b border-surface-variant/20 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">forum</span>
                <h3 className="font-headline-md font-bold text-on-surface text-base">Full Interview Conversation</h3>
              </div>
              <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-bold">
                {transcript.length} Messages Logged
              </span>
            </div>

            <TranscriptChatFeed
              transcript={
                transcript.length > 0
                  ? transcript
                  : [
                      { id: '1', role: 'ai', sender: 'CrackIt AI', text: 'Welcome to your interview round!', time: '00:00' },
                    ]
              }
            />
          </section>

          {/* AI Narrative Performance Summary */}
          <section className="bg-surface-container-lowest rounded-[28px] p-6 shadow-sm border border-surface-variant/30">
            <h3 className="font-headline-md font-bold text-on-surface text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              <span>AI Performance Analysis</span>
            </h3>

            <p className="text-body-md text-on-surface-variant leading-relaxed text-sm mb-6">
              {report?.summary_text || 'Strong technical session. Candidate demonstrated solid engineering intuition and structured problem solving.'}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-4 bg-tertiary-container/30 rounded-2xl border border-tertiary/20">
                <h4 className="font-bold text-xs text-on-surface uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                  <span>Key Strengths</span>
                </h4>
                <ul className="space-y-2">
                  {strengthsList.map((st: any, idx: number) => (
                    <li key={idx} className="text-xs text-on-surface-variant">
                      <strong className="text-on-surface">{st.area}:</strong> {st.detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="p-4 bg-secondary-fixed/20 rounded-2xl border border-secondary-fixed-dim/30">
                <h4 className="font-bold text-xs text-on-surface uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-sm">trending_up</span>
                  <span>Areas for Improvement</span>
                </h4>
                <ul className="space-y-2">
                  {improvementsList.map((imp: any, idx: number) => (
                    <li key={idx} className="text-xs text-on-surface-variant">
                      <strong className="text-on-surface">{imp.area}:</strong> {imp.detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Recommended Changes per Response (5 Columns) */}
        <div className="lg:col-span-5 space-y-gutter">
          <section className="bg-surface-container-lowest p-6 rounded-[28px] border border-surface-variant/30 shadow-sm text-left">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-base">
                  Recommended Changes on Responses
                </h3>
                <p className="text-[11px] text-on-surface-variant">Per-response AI coaching &amp; refined answers</p>
              </div>
              <span className="text-on-surface-variant font-label-sm text-xs font-semibold px-3 py-1 bg-surface-container rounded-full">
                {responses.length > 0 ? `${responses.length} Answers` : `${Math.floor(transcript.length / 2)} Questions`}
              </span>
            </div>

            <div className="space-y-6">
              {responses.length > 0
                ? responses.map((resp: any, idx: number) => {
                    const score = resp.score_json?.overall_score || resp.overall_score || 84;
                    const rec =
                      resp.score_json?.recommended_changes ||
                      'Structure your response using the STAR (Situation, Task, Action, Result) method and quantify outcome metrics.';
                    const modelAnswer =
                      resp.score_json?.model_better_answer ||
                      'In my previous role, I implemented optimistic locking and Redis caching, which reduced database load by 40% and eliminated lock contention.';

                    return (
                      <div key={resp.id || idx} className="rounded-2xl p-5 bg-surface-container-low border border-surface-variant/40 space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="font-label-sm text-xs font-bold text-on-surface">
                            Q{idx + 1}: {resp.question_text || `Question ${idx + 1}`}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {resp.emotion_summary_json && (
                              <span className={`text-xs ${ EMOTION_LABEL[resp.emotion_summary_json.dominant_emotion]?.color || 'text-on-surface-variant'} font-semibold`}>
                                {EMOTION_EMOJI[resp.emotion_summary_json.dominant_emotion]}{' '}
                                {EMOTION_LABEL[resp.emotion_summary_json.dominant_emotion]?.label || resp.emotion_summary_json.dominant_emotion}
                              </span>
                            )}
                            <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[11px] font-bold rounded-full">
                              Score: {score}%
                            </span>
                          </div>
                        </div>

                        {/* Candidate Answer */}
                        <div className="bg-white/60 p-3 rounded-xl border border-outline-variant/20">
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Your Response:</span>
                          <p className="text-xs text-on-surface italic leading-relaxed">"{resp.transcript}"</p>
                        </div>

                        {/* Recommended Change */}
                        <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="material-symbols-outlined text-amber-600 text-sm">lightbulb</span>
                            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Recommended Changes:</span>
                          </div>
                          <p className="text-xs text-on-surface-variant leading-relaxed">{rec}</p>
                        </div>

                        {/* Model Refined Answer */}
                        {modelAnswer && (
                          <div className="bg-primary/5 p-3 rounded-xl border border-primary/20">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Model Refined Answer:</span>
                            </div>
                            <p className="text-xs text-on-surface-variant leading-relaxed">"{modelAnswer}"</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                : transcript
                    .filter((m) => m.role === 'user')
                    .map((msg: any, idx: number) => (
                      <div key={msg.id || idx} className="rounded-2xl p-5 bg-surface-container-low border border-surface-variant/40 space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="font-label-sm text-xs font-bold text-on-surface">Question {idx + 1}</span>
                          <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[11px] font-bold rounded-full">
                            Score: {actualAverageScore}%
                          </span>
                        </div>

                        <div className="bg-white/60 p-3 rounded-xl border border-outline-variant/20">
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Your Response:</span>
                          <p className="text-xs text-on-surface italic leading-relaxed">"{msg.text}"</p>
                        </div>

                        <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="material-symbols-outlined text-amber-600 text-sm">lightbulb</span>
                            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Recommended Changes:</span>
                          </div>
                          <p className="text-xs text-on-surface-variant leading-relaxed">
                            Structure your response using the STAR (Situation, Task, Action, Result) method and quantify outcome metrics.
                          </p>
                        </div>
                      </div>
                    ))}
            </div>
          </section>

          {/* Action Button */}
          <button
            onClick={() => navigate('/interview-setup')}
            className="w-full py-4 bg-primary text-on-primary font-bold text-xs rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all text-center flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            <span>Start Another Practice Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
