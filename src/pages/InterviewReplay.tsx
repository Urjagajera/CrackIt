import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { mockInterviews, mockRecommendedTopics, mockTopicsNeedingPreparation } from '../utils/mockData';
import { useToast } from '../context/ToastContext';
import TranscriptChatFeed from '../components/TranscriptChatFeed';

export default function InterviewReplay() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  
  const interview = mockInterviews.find(item => item.id === id) || mockInterviews[0];

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(252);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<number>(2);
  const duration = 765;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlaybackTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = () => {
    showToast("Share Link: A private link has been copied to your clipboard.", "success");
  };

  const handleDownload = () => {
    showToast(`Downloading PDF Performance Report for "${interview.title}".`, "info");
  };

  return (
    <div className="px-margin-mobile md:px-margin-desktop pb-margin-mobile md:pb-margin-desktop min-h-screen text-left bg-background selection:bg-primary-fixed">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-label-md mb-2 text-sm font-semibold">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <Link className="hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded" to="/reports">Back to Sessions</Link>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">{interview.title} Details</h2>
          <p className="text-on-surface-variant font-body-md mt-1">Mock Interview with AI Mentor • {interview.date}</p>
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
        {/* Left Column: Video & Chat Transcript (7 Columns) */}
        <div className="lg:col-span-7 space-y-gutter">
          
          {/* Video Player Card */}
          <section className="glass-card rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(65,81,187,0.1)] relative group border border-surface-variant/30">
            <div className="aspect-video bg-on-background/5 relative">
              <img 
                className="w-full h-full object-cover" 
                alt="Interview Split Screen Mock" 
                loading="lazy"
                decoding="async"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60'; }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmbyVdev6YF-DHwIlmX4_0ohNEBV1v6iwmurjqOQer9Tk3rB7s0qHXj1DIpVmEZsTKN9lmv5uq6kMYn0hOQmNyrNe0iZeOVxKgNGs_e9WCiXte50PwpMbvWdoa_f6d2Mi2Z_FqwzPQxxHnGZqWbP1ONkgXt6o1mrlZ23am9tsdSRERSHbmlxwf_4s4Nhuapf8YIhU4O6IX65K0T20wp6puiZTGl1qu_NIpKdwbzwra3-A5YiTJoDjHUA"
              />
              
              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/25 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <div className="flex flex-col gap-4">
                  {/* Progress Seek Bar */}
                  <div className="w-full h-1.5 bg-white/30 rounded-full relative overflow-hidden cursor-pointer">
                    <div 
                      className="absolute top-0 left-0 h-full bg-secondary rounded-full"
                      style={{ width: `${(playbackTime / duration) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="hover:scale-110 transition-transform flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                      >
                        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                      </button>
                      
                      <button 
                        onClick={() => setPlaybackTime(Math.max(0, playbackTime - 10))}
                        className="hover:scale-110 transition-transform flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-white rounded-full"
                      >
                        <span className="material-symbols-outlined">replay_10</span>
                      </button>
                      
                      <button 
                        onClick={() => setPlaybackTime(Math.min(duration, playbackTime + 10))}
                        className="hover:scale-110 transition-transform flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-white rounded-full"
                      >
                        <span className="material-symbols-outlined">forward_10</span>
                      </button>
                      
                      <span className="font-label-md text-sm font-semibold">
                        {formatTime(playbackTime)} / {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Transcript Section - Rendered via TranscriptChatFeed subcomponent */}
          <section className="glass-card rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col h-[520px] border border-surface-variant/30 text-left">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-surface-variant/20">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Interview Conversation</h3>
                <p className="text-xs text-on-surface-variant">Left: AI Questions | Right: Candidate Responses</p>
              </div>
            </div>
            
            <TranscriptChatFeed transcript={interview.transcript} />
          </section>
        </div>

        {/* Right Column: Timeline & Evaluation (5 Columns) */}
        <div className="lg:col-span-5 space-y-gutter">
          
          {/* Performance Score Card */}
          <section className="bg-surface-container rounded-[32px] p-6 md:p-8 flex items-center justify-between border border-surface-variant/50">
            <div className="text-left">
              <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-semibold">Overall Performance</p>
              <h4 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-bold">
                {interview.score >= 80 ? "Excellent" : "Needs Work"}
              </h4>
              <p className="text-tertiary font-label-md mt-2 flex items-center gap-1 text-xs font-bold">
                <span className="material-symbols-outlined text-sm">trending_up</span> 
                <span>Top 15% of candidates</span>
              </p>
            </div>
            
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-white" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                <circle 
                  className="text-secondary" 
                  cx="48" 
                  cy="48" 
                  fill="transparent" 
                  r="40" 
                  stroke="currentColor" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 * (1 - interview.score / 100)} 
                  strokeWidth="8"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-headline-md text-on-surface font-bold text-lg">
                {interview.score}
              </div>
            </div>
          </section>

          {/* Recommended Topics & Preparation Plan Card */}
          <section className="bg-surface-container-lowest rounded-[32px] p-6 shadow-sm border border-surface-variant/40 text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                <h3 className="font-headline-md text-on-surface font-bold text-base">Recommended Topics & Growth Areas</h3>
              </div>
            </div>

            {/* Topics Needing Preparation */}
            <div className="mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-xs">warning</span>
                Topics Needing Preparation (Based on Low Answers)
              </span>
              <div className="space-y-2.5">
                {mockTopicsNeedingPreparation.map((topic) => (
                  <div key={topic.id} className="p-3 bg-secondary-fixed/20 rounded-2xl border border-secondary-fixed-dim/30 flex items-start justify-between gap-3">
                    <div>
                      <h5 className="font-bold text-xs text-on-surface">{topic.title}</h5>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">{topic.reason}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-secondary/10 text-secondary font-bold text-[10px] rounded-full shrink-0">
                      Score {topic.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended from CrackIt AI */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-xs">verified</span>
                Recommended Topics from CrackIt AI
              </span>
              <div className="space-y-2">
                {mockRecommendedTopics.slice(0, 2).map((topic) => (
                  <div key={topic.id} className="p-3 bg-primary-fixed/20 rounded-2xl border border-primary-fixed/40 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-on-surface">{topic.title}</h5>
                      <span className="text-[10px] text-primary font-semibold">{topic.category} • {topic.estimatedMinutes} mins</span>
                    </div>
                    <button 
                      onClick={() => navigate('/interview-setup')}
                      className="px-3 py-1 bg-primary text-on-primary rounded-full text-[10px] font-bold hover:opacity-90 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      Practice
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => navigate('/interview-setup')}
              className="w-full mt-4 py-3 bg-secondary text-on-secondary font-bold text-xs rounded-2xl shadow-md hover:scale-[1.01] active:scale-95 transition-all text-center flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>Start Preparation Session for Needing Topics</span>
            </button>
          </section>

          {/* Interview Timeline */}
          <section className="flex-1 flex flex-col text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Question Timeline</h3>
              <span className="text-on-surface-variant font-label-sm text-xs font-semibold">6 Questions total</span>
            </div>
            
            <div className="relative border-l-2 border-surface-variant ml-5 pl-1 space-y-6">
              {/* Timeline Item 1 */}
              <div className="relative pl-8">
                <button
                  type="button"
                  onClick={() => setSelectedTimelineItem(1)}
                  className={`w-full text-left rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer border focus:outline-none focus:ring-2 focus:ring-primary ${
                    selectedTimelineItem === 1 
                      ? 'bg-white border-2 border-primary shadow-lg' 
                      : 'glass-card border-surface-variant/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-3 py-1 bg-tertiary/10 text-tertiary text-[10px] font-bold rounded-full uppercase">Strong Impact</span>
                    <span className="font-mono text-xs text-on-surface-variant">00:05</span>
                  </div>
                  <h5 className={`font-label-md font-bold mb-2 ${selectedTimelineItem === 1 ? 'text-primary' : 'text-on-surface'}`}>
                    Experience Walkthrough
                  </h5>
                  <p className="text-xs text-on-surface-variant line-clamp-2 italic">
                    "You clearly articulated the balance between tech and UX. Great use of the STAR method here."
                  </p>
                </button>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative pl-8">
                <button 
                  type="button"
                  onClick={() => setSelectedTimelineItem(2)}
                  className={`w-full text-left rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer border focus:outline-none focus:ring-2 focus:ring-primary ${
                    selectedTimelineItem === 2 
                      ? 'bg-white border-2 border-primary shadow-lg shadow-primary/10' 
                      : 'glass-card border-surface-variant/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase">Needs Clarity</span>
                    <span className="font-mono text-xs text-on-surface-variant">03:45</span>
                  </div>
                  <h5 className={`font-label-md font-bold mb-2 ${selectedTimelineItem === 2 ? 'text-primary' : 'text-on-surface'}`}>
                    Technical Validation
                  </h5>
                  <p className="text-xs text-on-surface-variant mb-4">
                    "You hesitated when explaining the metrics. Try to be more precise about the 'perceived accuracy' data points."
                  </p>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
