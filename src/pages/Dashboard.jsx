import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUserProfile, mockInterviews } from '../utils/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const profile = mockUserProfile;
  const interviews = mockInterviews;

  return (
    <div className="p-margin-mobile md:p-margin-desktop min-h-screen text-left">
      {/* Header / Welcome Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Good morning, {profile.name.split(' ')[0]}!</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Your mock interview with {profile.targetCompany} is in 3 days. Let's sharpen those skills.</p>
        </div>
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 p-1 pr-4 bg-surface-container rounded-full hover:bg-surface-container-high transition-colors text-left"
        >
          <img 
            className="w-10 h-10 rounded-full object-cover border border-primary/20" 
            alt="User profile avatar" 
            src={profile.avatar}
          />
          <div>
            <p className="font-label-sm text-on-surface font-semibold leading-tight">{profile.name}</p>
            <p className="text-[10px] text-on-surface-variant leading-none">{profile.role}</p>
          </div>
        </button>
      </header>

      {/* Grid of Key Performance Indicators */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-10">
        {/* Practice Sessions */}
        <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Interviews</span>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl">mic</span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold leading-none">{profile.stats.interviewsCompleted}</h3>
            <p className="text-xs text-on-surface-variant mt-1">Practice sessions completed</p>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Avg Score</span>
            <span className="material-symbols-outlined text-secondary bg-secondary/10 p-2 rounded-xl">insights</span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold leading-none">{profile.stats.averageScore}%</h3>
            <p className="text-xs text-on-surface-variant mt-1">Overall readiness index</p>
          </div>
        </div>

        {/* Resume Score */}
        <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Resume Match</span>
            <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-2 rounded-xl">description</span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold leading-none">{profile.stats.atsCompatibility}%</h3>
            <p className="text-xs text-on-surface-variant mt-1">ATS benchmark compatibility</p>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Daily Streak</span>
            <span className="material-symbols-outlined text-error bg-error/10 p-2 rounded-xl">local_fire_department</span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold leading-none">{profile.stats.streak} Days</h3>
            <p className="text-xs text-on-surface-variant mt-1">Consecutive prep days</p>
          </div>
        </div>
      </section>

      {/* Main Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Side (8 Columns) */}
        <div className="lg:col-span-8 space-y-gutter">
          {/* Practice Action Banner */}
          <section className="bg-primary text-on-primary rounded-[32px] p-8 relative overflow-hidden shadow-xl shadow-primary/10">
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-80 h-80 bg-primary-container rounded-full opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-lg">
              <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">Next Prep Target</span>
              <h3 className="font-headline-lg text-headline-lg text-white mb-2">{profile.targetRole} practice for {profile.targetCompany}</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                We've configured a strict tech lead persona to ask architectural questions regarding caching and event-driven architectures.
              </p>
              <button 
                onClick={() => navigate('/interview-setup')}
                className="px-8 py-4 bg-secondary text-on-secondary rounded-full font-bold shadow-lg hover:bg-secondary-fixed-dim hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Start Practice Session</span>
                <span className="material-symbols-outlined">play_arrow</span>
              </button>
            </div>
          </section>

          {/* Recent Practice History */}
          <section className="bg-surface-container-lowest rounded-[32px] p-6 shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface">Recent Practice Reports</h3>
              <button onClick={() => navigate('/reports')} className="text-primary font-bold text-sm hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-2xl border border-surface-variant/50 hover:border-primary/20 transition-all gap-4 group">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined">forum</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-on-surface font-semibold">{interview.title}</h4>
                      <p className="text-xs text-on-surface-variant">{interview.company} • {interview.date} • {interview.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <p className="font-bold text-body-lg text-primary">{interview.score}% Score</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{interview.status}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/interview-replay/${interview.id}`)}
                      className="px-5 py-2.5 bg-surface-container rounded-full text-sm font-semibold group-hover:bg-primary-fixed group-hover:text-on-primary-fixed transition-colors"
                    >
                      View Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side (4 Columns) */}
        <div className="lg:col-span-4 space-y-gutter">
          {/* AI Recommendations */}
          <section className="bg-surface-container-lowest rounded-[32px] p-6 shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-secondary">psychology</span>
              <h3 className="font-headline-md text-headline-md text-on-surface">AI Coach Tips</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                <p className="font-bold text-sm text-secondary mb-1">Tone & Communication</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Your speech speed reached 160 wpm during behavioral answers. Try breathing between sentences to aim for 130 wpm.
                </p>
              </div>

              <div className="p-4 bg-tertiary/5 rounded-2xl border border-tertiary/10">
                <p className="font-bold text-sm text-tertiary mb-1">Technical Keyword Gaps</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Stitch analysis shows your resume misses "Distributed Event Bus" which is highly searched by {profile.targetCompany}.
                </p>
              </div>
            </div>
          </section>

          {/* Resume Matching Quick Widget */}
          <section className="bg-surface-container-lowest rounded-[32px] p-6 shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30 flex flex-col justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Resume Intelligence</h3>
              <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                Evaluate your resume files against target profiles to match corporate job description parameters.
              </p>
              
              <div className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">description</span>
                <div>
                  <p className="font-bold text-sm leading-tight">Senior_SWE_v4.pdf</p>
                  <p className="text-[10px] text-on-surface-variant">ATS Compatibility: 94%</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/resume')}
              className="w-full py-3 bg-surface-container hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface font-semibold rounded-full text-sm transition-colors active:scale-95 duration-200"
            >
              Optimize Resume
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
