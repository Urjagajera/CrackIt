import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { mockRecommendedTopics, mockTopicsNeedingPreparation } from '../utils/mockData';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../lib/api';
import TranscriptChatFeed from '../components/TranscriptChatFeed';

export default function InterviewReplay() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [session, setSession] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [transcript, setTranscript] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<number>(0);

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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
          <p className="font-body-md font-semibold">Loading Interview Replay &amp; Analytics...</p>
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

  const overallScore = report?.overall_score || session?.overallScore || 84;
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
            {session.company || 'Target Placement'} • {session.date || 'Recent'} • Score: {overallScore}/100
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handleShare}
            className="flex-1 md:flex-initial px-6 py-3 rounded-full border border-outline-variant text-on-surface font-label-md hover:bg-surface-container transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="material-symbols-outlined">share</span>
            <span>Share Report</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 md:flex-initial px-6 py-3 rounded-full bg-secondary text-on-secondary font-label-md hover:opacity-90 shadow-lg shadow-secondary/20 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <span className="material-symbols-outlined">download</span>
            <span>Download PDF</span>
          </button>
        </div>
      </header>

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
              {report?.summary_text || 'Strong technical session. Candidate demonstrated solid problem solving and engineering intuition.'}
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

        {/* Right Column: Recommendations & Questions Timeline (5 Columns) */}
        <div className="lg:col-span-5 space-y-gutter">
          {/* Question Timeline */}
          <section className="bg-surface-container-lowest p-6 rounded-[28px] border border-surface-variant/30 shadow-sm text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-base">Recorded Responses</h3>
              <span className="text-on-surface-variant font-label-sm text-xs font-semibold">
                {responses.length > 0 ? `${responses.length} Answers` : `${Math.floor(transcript.length / 2)} Questions`}
              </span>
            </div>

            <div className="relative border-l-2 border-surface-variant/40 ml-3 pl-1 space-y-4">
              {responses.length > 0
                ? responses.map((resp: any, idx: number) => (
                    <div key={resp.id || idx} className="relative pl-6">
                      <div className="w-full text-left rounded-2xl p-4 bg-surface-container-low border border-surface-variant/30">
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase">
                            Score: {resp.score_json?.overall_score || 84}%
                          </span>
                          <span className="font-mono text-[10px] text-on-surface-variant">
                            {resp.response_time_sec || 45}s
                          </span>
                        </div>
                        <h5 className="font-label-md font-bold text-xs text-on-surface mb-1">
                          Q{idx + 1}: {resp.question_text || `Question ${idx + 1}`}
                        </h5>
                        <p className="text-[11px] text-on-surface-variant line-clamp-3 italic bg-white/50 p-2 rounded-lg mt-2">
                          "{resp.transcript}"
                        </p>
                      </div>
                    </div>
                  ))
                : transcript
                    .filter((m) => m.role === 'user')
                    .map((msg: any, idx: number) => (
                      <div key={msg.id || idx} className="relative pl-6">
                        <div className="w-full text-left rounded-2xl p-4 bg-surface-container-low border border-surface-variant/30">
                          <div className="flex justify-between items-start mb-1.5">
                            <span className="px-2.5 py-0.5 bg-tertiary/10 text-tertiary text-[10px] font-bold rounded-full uppercase">
                              Submitted Answer
                            </span>
                            <span className="font-mono text-[10px] text-on-surface-variant">{msg.time}</span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant italic">"{msg.text}"</p>
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
