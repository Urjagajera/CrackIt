import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { trimInput, isNonEmptyString } from '../lib/sanitize';
import HexMeshBackground from '../components/HexMeshBackground';

interface SignupProps {
  onLogin?: () => void;
}

export default function Signup({ onLogin }: SignupProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { signup } = useAuth();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = trimInput(name);
    const cleanEmail = trimInput(email);
    const cleanPass = trimInput(password);
    const cleanConfirm = trimInput(confirmPassword);

    if (!isNonEmptyString(cleanName) || !isNonEmptyString(cleanEmail) || !isNonEmptyString(cleanPass)) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    if (cleanPass !== cleanConfirm) {
      showToast("Passwords do not match!", 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(cleanEmail, cleanPass, cleanName);
      if (onLogin) onLogin();
      showToast('Account created successfully! Welcome to CrackIt AI.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Signup failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative font-body-md text-body-md overflow-x-hidden bg-background text-on-surface min-h-screen flex flex-col">
      <HexMeshBackground />
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-3 bg-surface/80 backdrop-blur-md rounded-full mt-4 mx-auto w-[95%] max-w-container-max shadow-[0_10px_30px_rgba(65,81,187,0.08)]">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-headline-md font-headline-md font-extrabold text-primary">CrackIt</Link>
        </div>
        <nav className="hidden md:flex gap-gutter items-center">
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded" to="/#features">Features</Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded" to="/#how-it-works">How It Works</Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded" to="/#faq">FAQ</Link>
        </nav>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/login')} 
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary px-4 py-2 transition-all active:scale-95 duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          >
            Login
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-margin-mobile md:px-margin-desktop py-6">
        <div className="w-full max-w-[500px]">
          {/* Signup Form Card */}
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
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-on-primary font-bold text-sm rounded-full shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all mt-4 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account & Begin Practice'}
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

            <p className="text-center text-on-surface-variant text-xs mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 w-full py-6 px-margin-mobile md:px-margin-desktop bg-surface-container-highest flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left border-t border-surface-variant/30">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-headline-md text-headline-md font-extrabold text-primary">CrackIt</span>
          <p className="font-body-md text-body-md text-on-surface-variant opacity-80">© 2026 CrackIt AI. Friendly Professional Mentor.</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 mt-4 md:mt-0">
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Support</a>
        </nav>
      </footer>
    </div>
  );
}
