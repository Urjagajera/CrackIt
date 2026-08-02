import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { trimInput, isNonEmptyString } from '../lib/sanitize';
import HexMeshBackground from '../components/HexMeshBackground';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

interface SignupProps {
  onLogin?: () => void;
}

export default function Signup({ onLogin }: SignupProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = trimInput(name);
    const cleanEmail = trimInput(email);
    const cleanPass = trimInput(password);
    const cleanConfirm = trimInput(confirmPassword);

    if (e && (!isNonEmptyString(cleanName) || !isNonEmptyString(cleanEmail) || !isNonEmptyString(cleanPass))) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    if (cleanPass !== cleanConfirm) {
      showToast("Passwords do not match!", 'error');
      return;
    }

    if (onLogin) onLogin();
    showToast('Account created successfully! Welcome to CrackIt AI.', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="relative font-body-md text-body-md overflow-x-hidden bg-background text-on-surface">
      <HexMeshBackground />
      {/* Top Navigation */}
      <PublicNavbar className="sticky top-0 mt-4 mx-auto" />

      {/* Main Content */}
      <main className="py-16 px-margin-mobile md:px-margin-desktop flex items-center justify-center">
        <div className="w-full max-w-[1100px] grid md:grid-cols-2 gap-12 items-center text-left">
          
          {/* Left Column: Value Prop */}
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full font-label-sm text-xs font-semibold">
              Free 14-Day Trial Included
            </span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold text-[32px] md:text-[44px] leading-tight">
              Start Practicing Real AI Interviews Today
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[440px]">
              Join thousands of engineers and product leaders mastering high-stakes interviews with personalized AI voice mentors.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <span className="font-body-md text-sm">Adaptive technical &amp; behavioral AI personas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <span className="font-body-md text-sm">Instant STAR method &amp; confidence analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <span className="font-body-md text-sm">Resume ATS alignment &amp; project prep</span>
              </div>
            </div>
          </div>

          {/* Right Column: Signup Form Card */}
          <div className="bg-surface-container-lowest p-8 md:p-10 rounded-[32px] shadow-xl border border-surface-variant/30 relative">
            <div className="mb-8">
              <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-bold">Create Account</h3>
              <p className="text-on-surface-variant text-sm">No credit card required. Free tier forever.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-label-sm text-xs font-semibold text-on-surface px-1" htmlFor="name">Full Name</label>
                <input 
                  id="name"
                  type="text"
                  required
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/40 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-sm text-xs font-semibold text-on-surface px-1" htmlFor="email">Email Address</label>
                <input 
                  id="email"
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/40 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-sm text-xs font-semibold text-on-surface px-1" htmlFor="password">Password</label>
                <input 
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/40 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-sm text-xs font-semibold text-on-surface px-1" htmlFor="confirmPassword">Confirm Password</label>
                <input 
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/40 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-primary text-on-primary font-bold text-sm rounded-full shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all mt-4 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Create Account &amp; Begin Practice
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-variant"></div></div>
              <div className="relative flex justify-center text-label-sm"><span className="bg-surface-container-lowest px-4 text-outline text-xs">OR</span></div>
            </div>

            <button 
              type="button"
              onClick={() => handleSubmit()}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-outline-variant rounded-2xl hover:bg-surface-container transition-all active:scale-95 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
