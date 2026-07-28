import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const bentoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    if (bentoRef.current) {
      bentoRef.current.querySelectorAll('.bento-card').forEach(el => {
        el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
        observer.observe(el);
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="font-body-md text-body-md overflow-x-hidden bg-background text-on-surface scroll-smooth">
      {/* TopNavBar — Floating Pill */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex justify-between items-center px-6 py-3 rounded-full w-[95%] max-w-container-max bg-surface/80 backdrop-blur-md shadow-[0_10px_30px_rgba(65,81,187,0.08)]">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-headline-md font-headline-md font-extrabold text-primary">CrackIt</Link>
        </div>
        <nav className="hidden md:flex gap-8">
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded" href="#features">Features</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded" href="#how-it-works">How It Works</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded" href="#faq">FAQ</a>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors active:scale-95 duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 py-1"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2.5 bg-secondary text-on-secondary rounded-full font-label-md text-label-md shadow-lg shadow-secondary/20 hover:bg-secondary-fixed-dim transition-all active:scale-95 duration-200 focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            Sign Up
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-margin-mobile md:px-margin-desktop overflow-hidden">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center">
            <div className="z-10 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full font-label-sm text-label-sm mb-6">AI-Powered Interview Coach</span>
              <h1 className="font-headline-xl text-headline-xl mb-6 tracking-tight">
                Master Your Interviews with{' '}
                <span className="text-primary underline decoration-secondary/30 decoration-4 underline-offset-8">AI Voice Practice</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto lg:mx-0">
                Practice real-time conversations with a friendly AI mentor. Get instant feedback on your tone, pacing, and answers to land your dream job with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-secondary text-on-secondary rounded-full font-label-md text-label-md flex items-center justify-center gap-2 shadow-xl shadow-secondary/30 hover:-translate-y-1 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  Get Started
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 border-2 border-outline-variant rounded-full font-label-md text-label-md hover:bg-surface-container transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Hero — AI Mentor Mockup Card */}
            <div className="relative lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0">
              <div className="relative z-10 w-full max-w-md floating-hand-drawn">
                <div className="bg-white p-6 rounded-[32px] shadow-[0_30px_60px_rgba(159,65,34,0.12)] border-4 border-surface-variant">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">psychology</span>
                    </div>
                    <div>
                      <h4 className="font-headline-md text-headline-md text-sm">CrackIt Mentor</h4>
                      <p className="text-xs text-on-surface-variant">Listening to your response...</p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                    <div className="h-3 w-3/4 bg-surface-container rounded-full animate-pulse"></div>
                    <div className="h-3 w-1/2 bg-surface-container rounded-full animate-pulse"></div>
                    <div className="h-12 w-full bg-primary/5 rounded-2xl flex items-center px-4 gap-3">
                      <div className="flex gap-1 h-4 items-center">
                        <div className="w-1 h-3 bg-primary rounded-full animate-[bounce_1s_infinite]"></div>
                        <div className="w-1 h-5 bg-primary rounded-full animate-[bounce_1.2s_infinite]"></div>
                        <div className="w-1 h-2 bg-primary rounded-full animate-[bounce_0.8s_infinite]"></div>
                        <div className="w-1 h-6 bg-primary rounded-full animate-[bounce_1.1s_infinite]"></div>
                      </div>
                      <span className="text-xs font-label-sm text-primary">Voice Analysis Active</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-tertiary/10 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-tertiary mb-1">Pacing</p>
                      <p className="font-bold">Perfect</p>
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-secondary mb-1">Tone</p>
                      <p className="font-bold">Confident</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/2">
            <div className="w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]"></div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-surface-container-low" id="how-it-works">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-20">
              <h2 className="font-headline-lg text-headline-lg mb-4">Master Your Prep in 3 Easy Steps</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">Our AI-driven process is designed to mimic the actual interview pressure in a safe, supportive environment.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant/30 -z-10"></div>
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-surface mb-6 relative z-10">
                  <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-3">Upload Resume</h3>
                <p className="text-on-surface-variant px-4">Our AI analyzes your skills and experience to generate tailored questions.</p>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-surface mb-6 relative z-10">
                  <span className="material-symbols-outlined text-secondary text-3xl">mic</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-3">Live Practice</h3>
                <p className="text-on-surface-variant px-4">Engage in a voice-based conversation with our AI mentor who asks dynamic follow-ups.</p>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-surface mb-6 relative z-10">
                  <span className="material-symbols-outlined text-tertiary text-3xl">insights</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-3">Get Analysis</h3>
                <p className="text-on-surface-variant px-4">Receive a detailed breakdown of your performance, including tone and keyword usage.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop" id="features" ref={bentoRef}>
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="font-headline-lg text-headline-lg mb-4">Features Built for Success</h2>
                <p className="text-on-surface-variant">Everything you need to turn performance anxiety into performance excellence.</p>
              </div>
              <button className="px-6 py-3 text-primary font-bold hover:bg-primary/5 rounded-full transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary">
                View All Features <span className="material-symbols-outlined">trending_flat</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-auto md:h-[600px]">
              {/* Large Card */}
              <div className="md:col-span-8 bento-card bg-white rounded-[32px] p-8 shadow-sm border border-surface-variant flex flex-col justify-between overflow-hidden relative group">
                <div className="z-10">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary">voice_chat</span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg mb-4">Adaptive AI Voices</h3>
                  <p className="text-on-surface-variant max-w-sm">Choose from different interviewer personas—from the "Friendly HR" to the "Strict Tech Lead"—to prep for any situation.</p>
                </div>
              </div>
              {/* Small Card 1 */}
              <div className="md:col-span-4 bento-card bg-secondary/5 rounded-[32px] p-8 border border-secondary/10 flex flex-col justify-center text-center">
                <div className="mx-auto w-16 h-16 bg-secondary text-on-secondary rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl">timer</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-2">Real-time Pacing</h3>
                <p className="text-on-surface-variant text-sm">Visual feedback on your speaking speed helps you stay calm and articulate.</p>
              </div>
              {/* Small Card 2 */}
              <div className="md:col-span-4 bento-card bg-tertiary/5 rounded-[32px] p-8 border border-tertiary/10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl">verified_user</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-2">Plagiarism Shield</h3>
                <p className="text-on-surface-variant text-sm">Ensure your stories are unique and authentic to your personal brand.</p>
              </div>
              {/* Medium Card */}
              <div className="md:col-span-8 bento-card bg-surface-container-highest rounded-[32px] p-8 border border-surface-variant flex items-center gap-8">
                <div className="flex-1">
                  <h3 className="font-headline-md text-headline-md mb-4">Industry-Specific Scenarios</h3>
                  <p className="text-on-surface-variant text-sm mb-6">Over 500+ bank of questions tailored for FAANG, Startups, and Fortune 500 companies.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Product Management</span>
                    <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Software Engineering</span>
                    <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Data Science</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low" id="faq">
          <div className="max-w-4xl mx-auto text-left">
            <h2 className="font-headline-lg text-headline-lg text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="p-6 bg-surface-container-lowest rounded-2xl border border-surface-variant/30">
                <h4 className="font-bold text-base text-on-surface mb-2">How accurate is the AI feedback?</h4>
                <p className="text-on-surface-variant text-sm">Our AI models evaluate technical depth, STAR method structure, and clarity based on thousands of real tech interviews.</p>
              </div>
              <div className="p-6 bg-surface-container-lowest rounded-2xl border border-surface-variant/30">
                <h4 className="font-bold text-base text-on-surface mb-2">Can I practice specific tech stacks?</h4>
                <p className="text-on-surface-variant text-sm">Yes, you can configure focus topics like React.js, Distributed Systems, Kafka, System Design, or Behavioral questions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto bg-surface-container rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="font-headline-xl text-headline-xl mb-6">Ready to Ace Your Next Interview?</h2>
              <p className="text-on-surface-variant font-body-lg text-body-lg mb-10 max-w-2xl mx-auto">Join 50,000+ candidates who used CrackIt to build confidence and secure high-paying offers.</p>
              <button
                onClick={() => navigate('/signup')}
                className="px-12 py-5 bg-secondary text-on-secondary rounded-full font-label-md text-label-md shadow-2xl shadow-secondary/30 hover:-translate-y-1 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                Get Started for Free
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest w-full py-12 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-gutter">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="font-headline-md text-headline-md font-extrabold text-primary">CrackIt</span>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs text-center md:text-left">© 2024 CrackIt AI. Friendly Professional Mentor.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Cookie Policy</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Support</a>
          </div>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform" href="#">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform" href="#">
              <span className="material-symbols-outlined">brand_awareness</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
