import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup({ onLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Simulate authentication/registration
    if (onLogin) onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="font-body-md text-body-md overflow-x-hidden bg-background text-on-surface">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-3 bg-surface/80 backdrop-blur-md rounded-full mt-4 mx-auto w-[95%] max-w-container-max shadow-[0_10px_30px_rgba(65,81,187,0.08)]">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-headline-md font-headline-md font-extrabold text-primary">CrackIt</Link>
        </div>
        <nav className="hidden md:flex gap-gutter items-center">
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/#features">Features</Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/#how-it-works">How It Works</Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/#pricing">Pricing</Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/#faq">FAQ</Link>
        </nav>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/login')} 
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary px-4 py-2 transition-all active:scale-95 duration-200"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/signup')} 
            className="font-label-md text-label-md bg-primary text-on-primary px-6 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Signup Layout */}
      <main className="min-h-[calc(100vh-180px)] flex items-center justify-center py-16 px-margin-mobile md:px-margin-desktop relative">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-[1100px] grid md:grid-cols-2 gap-12 items-center text-left">
          {/* Content Side */}
          <div className="hidden md:flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full w-fit">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span className="font-label-md text-label-md">Personalized Mentor AI</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-background leading-tight">
              Your dream career <br /><span className="text-primary">starts here.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[440px]">
              Join 25,000+ candidates who use CrackIt to master technical interviews through friendly, AI-driven mock sessions.
            </p>
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl soft-shadow border border-surface-variant/30">
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold">Adaptive Difficulty</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Real-time interview scaling</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl soft-shadow border border-surface-variant/30">
                <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                  <span className="material-symbols-outlined">leaderboard</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold">Performance Analytics</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Deep insights into your growth</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signup Card */}
          <div className="bg-surface-container-lowest rounded-[32px] p-8 md:p-12 soft-shadow border border-white/50 relative overflow-hidden">
            {/* Soft Glow behind form */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Create Account</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Welcome! Let's get you ready for success.</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant px-1" htmlFor="name">Full Name</label>
                  <div className="relative group border border-surface-variant rounded-2xl focus-within:border-primary transition-all">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
                    <input 
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-2xl outline-none text-body-md focus:ring-0" 
                      id="name" 
                      placeholder="Alex Johnson" 
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant px-1" htmlFor="email">Email</label>
                  <div className="relative group border border-surface-variant rounded-2xl focus-within:border-primary transition-all">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">mail</span>
                    <input 
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-2xl outline-none text-body-md focus:ring-0" 
                      id="email" 
                      placeholder="alex@example.com" 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant px-1" htmlFor="password">Password</label>
                    <div className="relative group border border-surface-variant rounded-2xl focus-within:border-primary transition-all">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                      <input 
                        className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-2xl outline-none text-body-md focus:ring-0" 
                        id="password" 
                        placeholder="••••••••" 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant px-1" htmlFor="confirm_password">Confirm</label>
                    <div className="relative group border border-surface-variant rounded-2xl focus-within:border-primary transition-all">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock_reset</span>
                      <input 
                        className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-2xl outline-none text-body-md focus:ring-0" 
                        id="confirm_password" 
                        placeholder="••••••••" 
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-2">
                  <input 
                    className="w-5 h-5 rounded-lg border-surface-variant text-primary focus:ring-primary/20 cursor-pointer transition-all mt-1" 
                    id="terms" 
                    type="checkbox"
                    required
                  />
                  <label className="font-label-sm text-label-sm text-on-surface-variant leading-relaxed cursor-pointer select-none" htmlFor="terms">
                    I agree to the <a className="text-primary font-semibold hover:underline" href="#">Terms of Service</a> and <a className="text-primary font-semibold hover:underline" href="#">Privacy Policy</a>.
                  </label>
                </div>

                <button 
                  className="w-full py-4 bg-primary text-on-primary font-headline-md text-headline-md rounded-full shadow-lg shadow-primary/20 hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] transition-all duration-200 mt-4" 
                  type="submit"
                >
                  Sign Up
                </button>

                <div className="flex flex-col gap-4 mt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-px bg-surface-variant/50 flex-1"></div>
                    <span className="text-label-sm text-on-surface-variant px-2">OR</span>
                    <div className="h-px bg-surface-variant/50 flex-1"></div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      if (onLogin) onLogin();
                      navigate('/dashboard');
                    }}
                    className="w-full py-3.5 bg-surface-container-lowest border border-surface-variant/50 text-on-surface font-label-md rounded-full soft-shadow flex items-center justify-center gap-3 hover:bg-surface-container-low transition-all active:scale-[0.98]"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                    <span>Continue with Google</span>
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-8 border-t border-surface-variant/50">
                <p className="text-center font-body-md text-body-md text-on-surface-variant">
                  Already have an account? <Link className="text-primary font-bold hover:underline" to="/login">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest dark:bg-surface-variant w-full py-12 px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter text-center md:text-left">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <span className="font-headline-md text-headline-md font-extrabold text-primary">CrackIt</span>
          <p className="font-label-sm text-label-sm text-on-surface-variant">© 2024 CrackIt AI. Friendly Professional Mentor.</p>
        </div>
        <div className="flex gap-gutter flex-wrap justify-center mt-4 md:mt-0">
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Cookie Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}
