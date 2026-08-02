import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [micTestActive, setMicTestActive] = useState<boolean>(false);
  const [micLevel, setMicLevel] = useState<number>(66);
  
  const [reminders, setReminders] = useState<boolean>(true);
  const [reports, setReports] = useState<boolean>(true);
  const [marketing, setMarketing] = useState<boolean>(false);

  const handleTestMic = () => {
    setMicTestActive(true);
    let counter = 0;
    const interval = setInterval(() => {
      setMicLevel(Math.floor(Math.random() * 50) + 40);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        setMicTestActive(false);
        setMicLevel(66);
        showToast("Microphone test complete! Audio levels are normal.", "success");
      }
    }, 200);
  };

  const handleDeleteAccount = () => {
    if (confirm("WARNING: Are you absolutely sure you want to delete your account? This action is irreversible.")) {
      showToast("Account deleted. Redirecting...", "info");
      navigate('/');
    }
  };

  return (
    <div className="px-margin-mobile md:px-margin-desktop pb-margin-mobile md:pb-margin-desktop min-h-screen text-left bg-surface-bright selection:bg-primary-fixed">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-10">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-bold text-[28px]">Account Settings</h2>
          <p className="text-on-surface-variant font-body-md">Manage your mentor experience, platform preferences, and security.</p>
        </header>

        <div className="grid grid-cols-1 gap-gutter">
          
          {/* Hardware & Testing Section */}
          <section className="settings-card bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-[0_10px_30px_rgba(65,81,187,0.05)] border border-transparent focus-within:border-primary/45 transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                <span className="material-symbols-outlined">videocam</span>
              </div>
              <div>
                <h3 className="font-headline-md text-base font-bold text-on-surface">Hardware &amp; Testing</h3>
                <p className="text-on-surface-variant text-xs">Ensure your gear is ready for practice.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mic Test */}
              <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-label-md text-sm font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">mic</span>
                      <span>Microphone</span>
                    </span>
                    <span className="text-tertiary font-label-sm text-xs font-bold">{micTestActive ? "Testing..." : "Active"}</span>
                  </div>
                  <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden mb-6">
                    <div 
                      className={`h-full bg-tertiary rounded-full transition-all duration-150 ${micTestActive ? '' : 'animate-pulse'}`}
                      style={{ width: `${micLevel}%` }}
                    ></div>
                  </div>
                </div>
                <button 
                  onClick={handleTestMic}
                  disabled={micTestActive}
                  className="w-full py-2.5 rounded-xl border border-primary text-primary font-label-md text-xs font-bold hover:bg-primary-fixed/30 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {micTestActive ? "Testing Mic..." : "Test Mic"}
                </button>
              </div>
              
              {/* Camera Preview */}
              <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-left">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label-md text-sm font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">photo_camera</span>
                    <span>Camera</span>
                  </span>
                  <button 
                    onClick={() => showToast("Camera devices list toggled.", "info")} 
                    className="text-primary font-label-sm text-xs font-bold hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded"
                  >
                    Change Device
                  </button>
                </div>
                <div className="aspect-video rounded-xl bg-surface-dim overflow-hidden relative group border border-surface-variant/30">
                  <img 
                    className="w-full h-full object-cover opacity-60" 
                    alt="Webcam placeholder preview" 
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60'; }}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC40r2_YifydW27cEXJyU-9ypD1VkSoQaj8SLu34Ef1aO0Nu1aqkcGqFA-VMuWSpGRAiHI1qtSn4l_ZqJNZDjHDRLeM52RJ1ic_KcWrKFtU_ol3uQfZvE4ro_IhS1cGzJmRFWSObOBDl-nSusgx7J08zckfJ8d7OoJOztGk-UOF3FuRd6B1JmvmAza3gUv8AWMBgHnP1z_xgiYw_7yQ4ba88YW0l2vJxuAhO1tEHbosFIXAVpIkrHiYig"
                  />
                  <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                    <span className="material-symbols-outlined text-white text-4xl hover:scale-115 transition-transform">play_circle</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="settings-card bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-[0_10px_30px_rgba(65,81,187,0.05)] border border-transparent focus-within:border-primary/45 transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined">notifications</span>
              </div>
              <div>
                <h3 className="font-headline-md text-base font-bold text-on-surface">Notifications</h3>
                <p className="text-on-surface-variant text-xs">Stay on track with interview reminders.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container transition-all cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-label-md text-sm font-semibold">Practice Reminders</span>
                  <span className="text-on-surface-variant text-xs">Nudges to keep your daily streak alive.</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={reminders}
                    onChange={(e) => setReminders(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>
              
              <label className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container transition-all cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-label-md text-sm font-semibold">Analytical Reports</span>
                  <span className="text-on-surface-variant text-xs">Weekly summary of your progress and AI feedback.</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={reports}
                    onChange={(e) => setReports(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>
              
              <label className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container transition-all cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-label-md text-sm font-semibold">Marketing &amp; Tips</span>
                  <span className="text-on-surface-variant text-xs">Exclusive interview tips and platform updates.</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>
            </div>
          </section>

          {/* Danger Zone Section */}
          <section className="settings-card bg-surface-container-lowest rounded-[24px] p-6 md:p-8 border border-error/20 shadow-sm mt-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center text-error shrink-0">
                <span className="material-symbols-outlined">dangerous</span>
              </div>
              <div>
                <h3 className="font-headline-md text-base font-bold text-error">Danger Zone</h3>
                <p className="text-on-surface-variant text-xs">Irreversible account actions.</p>
              </div>
            </div>
            
            <div className="bg-error-container/20 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="font-label-md font-bold text-error text-sm">Delete My Account</span>
                <span className="text-on-surface-variant text-xs">Permanently erase your data, history, and AI insights.</span>
              </div>
              <button 
                onClick={handleDeleteAccount}
                className="px-8 py-3 bg-error text-on-error rounded-full font-label-md text-xs font-semibold hover:brightness-110 active:scale-95 transition-all w-full md:w-auto text-center focus:outline-none focus:ring-2 focus:ring-error"
              >
                Delete Account
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-outline-variant/30 py-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <span className="font-headline-md text-headline-md font-extrabold text-primary opacity-50">CrackIt</span>
            <p className="font-body-md text-body-md text-on-surface-variant">© 2026 CrackIt AI. Friendly Professional Mentor.</p>
          </div>
          <div className="flex gap-8">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Support</a>
          </div>
        </footer>
      </div>

      {/* FAB Support (Contextual) */}
      <button 
        onClick={() => showToast("Support Chat widget opened.", "info")}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50 text-white focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Support Chat"
      >
        <span className="material-symbols-outlined">chat_bubble</span>
      </button>
    </div>
  );
}
