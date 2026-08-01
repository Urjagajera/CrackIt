import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUserProfile, mockInterviews } from '../utils/mockData';
import { apiFetch } from '../lib/api';
import { useToast } from '../context/ToastContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const profile = mockUserProfile;
  const interviews = mockInterviews;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);

  const fetchNotifications = async () => {
    try {
      const data = await apiFetch<{ notifications: any[]; unread_count: number }>('/notifications');
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count || 0);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (notifId: string, linkUrl?: string) => {
    try {
      await apiFetch(`/notifications/${notifId}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (linkUrl) {
        setShowNotifDropdown(false);
        navigate(linkUrl);
      }
    } catch {
      // Fallback
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiFetch('/notifications/read-all', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      showToast('All notifications marked as read.', 'info');
    } catch {
      // Fallback
    }
  };

  return (
    <div className="px-margin-mobile md:px-margin-desktop pb-margin-mobile md:pb-margin-desktop min-h-screen text-left">
      {/* Header / Welcome Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Good morning, {profile.name.split(' ')[0]}!</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Your mock interview with {profile.targetCompany} is in 3 days. Let's sharpen those skills.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-center text-on-surface"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 w-80 md:w-96 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-variant/40 z-50 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-surface-variant/30">
                  <span className="font-bold text-xs text-on-surface uppercase tracking-wider">Notifications ({notifications.length})</span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-primary font-bold text-xs hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleMarkRead(notif.id, notif.link_url)}
                        className={`p-3 rounded-xl cursor-pointer transition-all border ${
                          !notif.read
                            ? 'bg-primary-fixed/15 border-primary/30 font-semibold'
                            : 'bg-surface-container-low border-surface-variant/20 opacity-75'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-on-surface">{notif.title}</span>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                          )}
                        </div>
                        <p className="text-[11px] text-on-surface-variant leading-snug">{notif.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-on-surface-variant italic text-center py-4">No notifications yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-1 pr-4 bg-surface-container rounded-full hover:bg-surface-container-high transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <img
              className="w-10 h-10 rounded-full object-cover border border-primary/20"
              alt="User profile avatar"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60';
              }}
              src={profile.avatar}
            />
            <div>
              <p className="font-label-sm text-on-surface font-semibold leading-tight">{profile.name}</p>
              <p className="text-[10px] text-on-surface-variant leading-none">{profile.role}</p>
            </div>
          </button>
        </div>
      </header>

      {/* Grid of Key Performance Indicators */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-10">
        {/* Practice Sessions */}
        <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-xs">Interviews</span>
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
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-xs">Avg Score</span>
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
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-xs">Resume Score</span>
            <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-2 rounded-xl">description</span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold leading-none">{profile.stats.resumeScore}/100</h3>
            <p className="text-xs text-on-surface-variant mt-1">ATS Optimization rating</p>
          </div>
        </div>

        {/* Daily Streak */}
        <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-xs">Day Streak</span>
            <span className="material-symbols-outlined text-secondary bg-secondary/10 p-2 rounded-xl">local_fire_department</span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold leading-none">{profile.stats.streak} Days</h3>
            <p className="text-xs text-on-surface-variant mt-1">Consistent practice streak</p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Actions & Recommended Topics (8 Columns) */}
        <div className="lg:col-span-8 space-y-gutter">
          
          {/* Hero Action Card */}
          <section className="bg-gradient-to-br from-primary via-primary/90 to-primary-container p-8 rounded-[32px] text-on-primary shadow-xl relative overflow-hidden">
            <div className="max-w-md relative z-10">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-3">
                Targeting {profile.targetCompany} • {profile.targetRole}
              </span>
              <h3 className="font-headline-lg text-2xl md:text-3xl font-extrabold mb-3 leading-tight">
                Ready for your next AI Voice Mock?
              </h3>
              <p className="text-on-primary/80 text-sm mb-6 leading-relaxed">
                Practice technical &amp; behavioral questions with custom difficulty personas designed for high-growth tech companies.
              </p>
              <button 
                onClick={() => navigate('/interview-setup')}
                className="px-8 py-3.5 bg-white text-primary rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span>Start Mock Session</span>
                <span className="material-symbols-outlined text-lg">play_arrow</span>
              </button>
            </div>
          </section>

          {/* Recommended Topics & Preparation Plan Card */}
          <section className="bg-surface-container-lowest rounded-[32px] p-6 md:p-8 shadow-sm border border-surface-variant/30 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="font-headline-md text-on-surface font-bold text-lg">Recommended Topics &amp; Focus Areas</h3>
                <p className="text-xs text-on-surface-variant mt-1">Recommended by CrackIt AI &amp; topics needing improvement from past sessions</p>
              </div>
              <button 
                onClick={() => navigate('/interview-setup')}
                className="px-5 py-2 bg-secondary text-on-secondary font-bold text-xs rounded-full shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span>Prepare Weak Topics</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recommended Topics */}
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  Recommended Topics from CrackIt AI
                </span>
                {mockRecommendedTopics.slice(0, 2).map((topic) => (
                  <div key={topic.id} className="p-3 bg-white rounded-xl shadow-sm border border-primary/10">
                    <h5 className="font-bold text-xs text-on-surface">{topic.title}</h5>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">{topic.reason}</p>
                  </div>
                ))}
              </div>

              {/* Topics Needing Preparation */}
              <div className="p-4 bg-secondary/5 rounded-2xl border border-secondary/20 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">warning</span>
                  Topics Needing Preparation
                </span>
                {mockTopicsNeedingPreparation.map((topic) => (
                  <div key={topic.id} className="p-3 bg-white rounded-xl shadow-sm border border-secondary/10 flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-bold text-xs text-on-surface">{topic.title}</h5>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{topic.reason}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-secondary/10 text-secondary font-bold text-[10px] rounded-full shrink-0">
                      {topic.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recent Mock Interviews */}
          <section className="bg-surface-container-lowest rounded-[32px] p-6 md:p-8 shadow-sm border border-surface-variant/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface font-bold text-lg">Recent Interviews</h3>
              <button onClick={() => navigate('/reports')} className="text-primary font-label-md text-xs font-bold hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded">View All</button>
            </div>

            <div className="space-y-4">
              {interviews.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/interview-replay/${item.id}`)}
                  className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-surface-variant/30 hover:border-primary/40 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-lg">mic</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-on-surface">{item.title}</h4>
                      <p className="text-xs text-on-surface-variant">{item.company} • {item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm text-primary">{item.score}/100</span>
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Fast Tools & Quick Launch (4 Columns) */}
        <div className="lg:col-span-4 space-y-gutter">
          <section className="bg-surface-container-lowest rounded-[32px] p-6 shadow-sm border border-surface-variant/30 space-y-4">
            <h3 className="font-headline-md text-on-surface font-bold text-lg mb-2">Quick AI Tools</h3>
            
            <button 
              onClick={() => navigate('/job-match')}
              className="w-full p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left border border-surface-variant/30 transition-all flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">work</span>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">Job Description Match</h4>
                  <p className="text-xs text-on-surface-variant">Check resume alignment &amp; keyword gaps</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all text-sm">arrow_forward</span>
            </button>

            <button 
              onClick={() => navigate('/project-intelligence')}
              className="w-full p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left border border-surface-variant/30 transition-all flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">neurology</span>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">Project Intelligence</h4>
                  <p className="text-xs text-on-surface-variant">Generate architectural Q&amp;A from docs</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary group-hover:translate-x-1 transition-all text-sm">arrow_forward</span>
            </button>

            <button 
              onClick={() => navigate('/resume')}
              className="w-full p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left border border-surface-variant/30 transition-all flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">description</span>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">Resume ATS Audit</h4>
                  <p className="text-xs text-on-surface-variant">Get instant score &amp; formatting feedback</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all text-sm">arrow_forward</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
