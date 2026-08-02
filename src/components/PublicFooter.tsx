import React from 'react';

export default function PublicFooter() {
  return (
    <footer className="bg-surface-container-highest w-full py-12 px-margin-mobile md:px-margin-desktop border-t border-surface-variant/30">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-gutter text-center md:text-left">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-headline-md text-headline-md font-extrabold text-primary">CrackIt</span>
          <p className="font-body-md text-body-md text-on-surface-variant opacity-80">© 2026 CrackIt AI. Friendly Professional Mentor.</p>
        </div>
        
        <nav className="flex flex-wrap justify-center gap-6 mt-4 md:mt-0">
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Cookie Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Support</a>
        </nav>
        
        <div className="flex gap-4 mt-4 md:mt-0">
          <a className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform" href="#" aria-label="Web">
            <span className="material-symbols-outlined">public</span>
          </a>
          <a className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform" href="#" aria-label="Brand">
            <span className="material-symbols-outlined">brand_awareness</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
