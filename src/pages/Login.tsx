import React, { useEffect, useState, FormEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { trimInput, isNonEmptyString } from '../lib/sanitize';
import HexMeshBackground from '../components/HexMeshBackground';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

interface LoginProps {
  onLogin?: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Subtle parallax effect for the background mesh on mouse move
    const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      document.body.style.backgroundPosition = `${x * 20}px ${y * 20}px`;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.style.backgroundPosition = ''; // Cleanup global DOM mutation
    };
  }, []);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = trimInput(email);
    const cleanPassword = trimInput(password);
    
    if (e && (!isNonEmptyString(cleanEmail) || !isNonEmptyString(cleanPassword))) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    if (onLogin) onLogin();
    showToast('Welcome back! Login successful.', 'success');
    navigate('/dashboard');
  };

  const handleForgotPassword = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetEmail = trimInput(email) || 'your email';
    showToast(`Password reset link has been sent to ${targetEmail}.`, 'info');
  };

  return (
    <div className="relative min-h-screen flex flex-col font-body-md text-on-surface overflow-x-hidden">
      <HexMeshBackground />
      {/* Top Navigation */}
      <PublicNavbar className="sticky top-0 mt-4 mx-auto" />

      {/* Main Form */}
      <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop pb-margin-mobile md:pb-margin-desktop">
        <div className="w-full max-w-[480px]">
          <div className="bg-surface-container-lowest p-8 md:p-12 rounded-[32px] login-card-shadow relative overflow-hidden text-left border border-surface-variant/30">
            {/* Subtle Decorative Accent */}
            <div className="absolute top-0 left-0 w-2 h-full bg-secondary-container"></div>
            
            <div className="mb-10">
              <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Welcome Back</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Your interview mentor is ready to help you practice today.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface ml-1" htmlFor="email">Email Address</label>
                <div className="relative flex items-center rounded-2xl group border border-outline-variant focus-within:border-primary transition-all">
                  <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors">mail</span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low rounded-2xl focus:ring-0 focus:border-none border-none outline-none text-body-md" 
                    id="email" 
                    placeholder="mentor@crackit.ai" 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
                  <a 
                    className="font-label-sm text-label-sm text-primary hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded" 
                    href="#" 
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative flex items-center rounded-2xl group border border-outline-variant focus-within:border-primary transition-all">
                  <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    className="w-full pl-12 pr-12 py-4 bg-surface-container-low rounded-2xl focus:ring-0 border-none outline-none text-body-md" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3 px-1">
                <input 
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer" 
                  id="remember" 
                  type="checkbox"
                />
                <label className="font-body-md text-body-md text-on-surface-variant cursor-pointer select-none" htmlFor="remember">Remember me for 30 days</label>
              </div>

              {/* Login Button */}
              <button 
                className="w-full py-4 bg-secondary-container hover:bg-secondary text-white font-headline-md text-headline-md rounded-full shadow-lg shadow-secondary-container/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 focus:outline-none focus:ring-2 focus:ring-primary" 
                type="submit"
              >
                <span>Login</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-variant"></div></div>
              <div className="relative flex justify-center text-label-sm"><span className="bg-surface-container-lowest px-4 text-outline">OR CONTINUE WITH</span></div>
            </div>

            {/* Social Login */}
            <div className="w-full">
              <button 
                type="button"
                onClick={() => handleSubmit()} 
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-outline-variant rounded-2xl hover:bg-surface-container hover:border-outline transition-all active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmz2OcFtIkjWEOXAPxUIlvwv6obt9MZ23c3Fix_7afzuxRNdcgBNlg1EwZoactjnYj9sr8awB_r7gte8JfKLImN5DjJTyRZdhFbw1JhYkxIRLrGykmxPNYNf-JhNGo89Fxio0wUBs1XGLEVAbfhka36fUjggrMF-TeBc93lvJVPyzpoWXCi0zcPdYdn9e_RsMLArwV0v-OV-dE8duJA3svg-l2Iu6SxTiuNmUMyNmLz_bcmuuviZdhgw" />
                <span className="font-label-md text-label-md font-semibold">Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
