import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { mockInterviews } from '../utils/mockData';

export default function InterviewReplay() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Find matching mock interview or default to the first one
  const interview = mockInterviews.find(item => item.id === id) || mockInterviews[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(252); // 4:12 in seconds
  const [selectedTimelineItem, setSelectedTimelineItem] = useState(2); // Default to item 2 (Technical Validation)
  const duration = 765; // 12:45 in seconds

  useEffect(() => {
    let timer;
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
  }, [isPlaying]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = () => {
    alert("Share Link: A private link has been copied to your clipboard (Simulation).");
  };

  const handleDownload = () => {
    alert(`Downloading PDF Performance Report for "${interview.title}" (Simulation).`);
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop min-h-screen text-left bg-background selection:bg-primary-fixed">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
        <div>
          <div className="flex items-center gap-2 text-primary font-label-md mb-2 text-sm font-semibold">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <Link className="hover:underline" to="/reports">Back to Sessions</Link>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">{interview.title} Details</h2>
          <p className="text-on-surface-variant font-body-md mt-1">Mock Interview with AI Mentor • {interview.date}</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleShare}
            className="flex-1 md:flex-initial px-6 py-3 rounded-full border border-outline-variant text-on-surface font-label-md hover:bg-surface-container transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">share</span> 
            <span>Share Report</span>
          </button>
          <button 
            onClick={handleDownload}
            className="flex-1 md:flex-initial px-6 py-3 rounded-full bg-secondary text-on-secondary font-label-md hover:opacity-90 shadow-lg shadow-secondary/20 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">download</span> 
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Video & Transcript (7 Columns) */}
        <div className="lg:col-span-7 space-y-gutter">
          
          {/* Video Player Card */}
          <section className="glass-card rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(65,81,187,0.1)] relative group border border-surface-variant/30">
            <div className="aspect-video bg-on-background/5 relative">
              <img 
                className="w-full h-full object-cover" 
                alt="Interview Split Screen Mock" 
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
                        className="hover:scale-110 transition-transform flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                      </button>
                      
                      <button 
                        onClick={() => setPlaybackTime(Math.max(0, playbackTime - 10))}
                        className="hover:scale-110 transition-transform flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined">replay_10</span>
                      </button>
                      
                      <button 
                        onClick={() => setPlaybackTime(Math.min(duration, playbackTime + 10))}
                        className="hover:scale-110 transition-transform flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined">forward_10</span>
                      </button>
                      
                      <span className="font-label-md text-sm font-semibold">
                        {formatTime(playbackTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <button className="hover:scale-110 transition-transform"><span className="material-symbols-outlined">volume_up</span></button>
                      <button className="hover:scale-110 transition-transform"><span className="material-symbols-outlined">settings</span></button>
                      <button className="hover:scale-110 transition-transform"><span className="material-symbols-outlined">fullscreen</span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Transcript Section */}
          <section className="glass-card rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col h-[500px] border border-surface-variant/30 text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Full Transcript</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-surface-container rounded-full text-on-surface font-label-sm hover:bg-surface-container-high transition-colors text-xs font-semibold">
                  Search...
                </button>
                <button className="p-2 hover:bg-surface-container rounded-full transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar pr-4 space-y-6">
              {interview.transcript.map((item, index) => (
                <div 
                  key={index}
                  className={`flex gap-4 p-3 rounded-2xl transition-all ${
                    item.role === 'user' ? 'bg-primary-fixed/20' : 'bg-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.role === 'user' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-sm">
                      {item.role === 'user' ? 'person' : 'robot_2'}
                    </span>
                  </div>
                  
                  <div className="space-y-1 flex-grow">
                    <div className="flex justify-between items-center">
                      <p className={`font-label-md font-bold text-xs uppercase ${
                        item.role === 'user' ? 'text-secondary' : 'text-primary'
                      }`}>
                        {item.role === 'user' ? 'You' : 'Interviewer (AI)'}
                      </p>
                      <span className="text-[10px] text-on-surface-variant font-mono">{item.time}</span>
                    </div>
                    
                    <p className="text-on-surface leading-relaxed text-sm">{item.text}</p>
                    
                    {item.feedback && (
                      <div className={`mt-2 p-3 rounded-xl border text-xs ${
                        item.feedback.type === 'good' 
                          ? 'bg-tertiary/5 border-tertiary/20 text-tertiary' 
                          : 'bg-error-container/20 border-error-container text-on-error-container'
                      }`}>
                        <p className="font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">
                            {item.feedback.type === 'good' ? 'check_circle' : 'warning'}
                          </span>
                          <span>AI Feedback:</span>
                        </p>
                        <p className="mt-1">{item.feedback.text}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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

          {/* Interview Timeline */}
          <section className="flex-1 flex flex-col text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Question Timeline</h3>
              <span className="text-on-surface-variant font-label-sm text-xs font-semibold">6 Questions total</span>
            </div>
            
            <div className="relative border-l-2 border-surface-variant ml-5 pl-1 space-y-6">
              {/* Timeline Item 1 */}
              <div className="relative pl-8">
                <div className={`absolute -left-[21px] top-1 w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-background ${
                  selectedTimelineItem === 1 ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-tertiary-fixed text-on-tertiary-fixed'
                }`}>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {selectedTimelineItem === 1 ? 'play_arrow' : 'check_circle'}
                  </span>
                </div>
                
                <div 
                  onClick={() => setSelectedTimelineItem(1)}
                  className={`rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer border ${
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
                </div>
              </div>

              {/* Timeline Item 2 - Active/Selected */}
              <div className="relative pl-8">
                <div className={`absolute -left-[21px] top-1 w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-background ${
                  selectedTimelineItem === 2 ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-surface-dim text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined text-lg">
                    {selectedTimelineItem === 2 ? 'play_arrow' : 'lock'}
                  </span>
                </div>
                
                <div 
                  onClick={() => setSelectedTimelineItem(2)}
                  className={`rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer border ${
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
                  
                  {selectedTimelineItem === 2 && (
                    <div className="bg-surface-container rounded-xl p-4 space-y-2 border border-surface-variant/50">
                      <p className="font-label-sm text-on-surface-variant flex items-center gap-2 text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm text-secondary">tips_and_updates</span> 
                        <span>Mentor Tip:</span>
                      </p>
                      <p className="text-xs text-on-surface font-medium leading-relaxed">
                        "Mention specific NPS score changes or bounce rate reductions to ground your design decisions in data."
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative pl-8">
                <div className={`absolute -left-[21px] top-1 w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-background ${
                  selectedTimelineItem === 3 ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-surface-dim text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined text-lg">
                    {selectedTimelineItem === 3 ? 'play_arrow' : 'lock'}
                  </span>
                </div>
                
                <div 
                  onClick={() => setSelectedTimelineItem(3)}
                  className={`rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer border opacity-60 ${
                    selectedTimelineItem === 3 
                      ? 'bg-white border-2 border-primary shadow-lg' 
                      : 'glass-card border-surface-variant/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-3 py-1 bg-surface-variant text-on-surface-variant text-[10px] font-bold rounded-full uppercase">Pending</span>
                    <span className="font-mono text-xs text-on-surface-variant">07:12</span>
                  </div>
                  <h5 className="font-label-md font-semibold text-on-surface">Conflict Resolution</h5>
                  <p className="text-xs text-on-surface-variant">Evaluation for this segment will unlock as you reach it in playback.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Activity Heatmap Mockup */}
          <section className="glass-card rounded-[32px] p-6 shadow-sm border border-surface-variant/30 text-left">
            <h4 className="font-label-md text-on-surface font-bold text-sm mb-4">Focus Intensity Heatmap</h4>
            <div className="flex items-end gap-1.5 h-16">
              <div className="flex-1 bg-primary/10 h-4 rounded-full"></div>
              <div className="flex-1 bg-primary/30 h-8 rounded-full"></div>
              <div className="flex-1 bg-primary/50 h-12 rounded-full"></div>
              <div className="flex-1 bg-primary/40 h-6 rounded-full"></div>
              <div className="flex-1 bg-secondary h-16 rounded-full animate-pulse"></div>
              <div className="flex-1 bg-primary/60 h-10 rounded-full"></div>
              <div className="flex-1 bg-primary/20 h-4 rounded-full"></div>
              <div className="flex-1 bg-primary/10 h-3 rounded-full"></div>
              <div className="flex-1 bg-primary/70 h-14 rounded-full"></div>
              <div className="flex-1 bg-primary/40 h-7 rounded-full"></div>
              <div className="flex-1 bg-primary/10 h-2 rounded-full"></div>
            </div>
            <div className="flex justify-between mt-2 font-mono text-[10px] text-on-surface-variant">
              <span>0:00</span>
              <span>Midway</span>
              <span>12:45</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
