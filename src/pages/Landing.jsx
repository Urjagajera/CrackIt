import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simple intersection observer for reveal animations, matching Stitch behavior
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.bento-card-animate').forEach(el => {
      el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="font-body-md text-body-md overflow-x-hidden bg-background text-on-surface">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-3 rounded-full mt-4 mx-auto w-[95%] max-w-container-max bg-surface/80 backdrop-blur-md shadow-[0_10px_30px_rgba(65,81,187,0.08)]">
        <div className="flex items-center gap-2">
          <span className="text-headline-md font-headline-md font-extrabold text-primary">CrackIt</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#features">Features</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#how-it-works">How It Works</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#pricing">Pricing</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#faq">FAQ</a>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')} 
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors active:scale-95 duration-200"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/signup')} 
            className="px-6 py-2.5 bg-secondary text-on-secondary rounded-full font-label-md text-label-md shadow-lg shadow-secondary/20 hover:bg-secondary-fixed-dim transition-all active:scale-95 duration-200"
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
                Master Your Interviews with <span className="text-primary underline decoration-secondary/30 decoration-4 underline-offset-8">AI Voice Practice</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto lg:mx-0">
                Practice real-time conversations with a friendly AI mentor. Get instant feedback on your tone, pacing, and answers to land your dream job with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => navigate('/signup')} 
                  className="px-8 py-4 bg-secondary text-on-secondary rounded-full font-label-md text-label-md flex items-center justify-center gap-2 shadow-xl shadow-secondary/30 hover:-translate-y-1 transition-all"
                >
                  Get Started
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button 
                  onClick={() => navigate('/login')} 
                  className="px-8 py-4 border-2 border-outline-variant rounded-full font-label-md text-label-md hover:bg-surface-container transition-all"
                >
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="relative lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0">
              {/* Quirky Illustration Mockup */}
              <div className="relative z-10 w-full max-w-md floating-hand-drawn">
                <div className="bg-white p-6 rounded-[32px] shadow-[0_30px_60px_rgba(159,65,34,0.12)] border-4 border-surface-variant">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">psychology</span>
                    </div>
                    <div className="text-left">
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
                  <div className="grid grid-cols-2 gap-3 text-left">
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
                {/* Decorative Shapes */}
                <div className="absolute -top-12 -right-8 w-32 h-32 opacity-20 pointer-events-none">
                  <img 
                    className="w-full h-full object-contain" 
                    alt="Yellow Sun doodle" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuyiok2yPEWeZp5qMxRNypc5sujjYu1aWF08NIZvDyqxkKrurk3K_YmlXokT8Lp6REEmbd0_ImgdCbyEuC_IC7xKktkmGk1aiXDemaIAVHTyO8cwSHs9vyJ-znIbx6PknyauCi_I_XfZgq0_lTfSOBRhf1FjfDmNMIbgNwVJiDRsRIHfEG1KtnEneGPK9vqY_tN2XXXSrEjWgkTWvRRZZpD-Oq5eFhP-GSVHYfye8ix3h2p6_KFIaJXQ"
                  />
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
        <section className="py-24 px-margin-mobile md:px-margin-desktop" id="features">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl text-left">
                <h2 className="font-headline-lg text-headline-lg mb-4">Features Built for Success</h2>
                <p className="text-on-surface-variant">Everything you need to turn performance anxiety into performance excellence.</p>
              </div>
              <button onClick={() => navigate('/signup')} className="px-6 py-3 text-primary font-bold hover:bg-primary/5 rounded-full transition-all flex items-center gap-2">
                View All Features <span class="material-symbols-outlined">trending_flat</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-auto md:h-[600px]">
              {/* Large Card */}
              <div className="md:col-span-8 bento-card bento-card-animate bg-white rounded-[32px] p-8 shadow-sm border border-surface-variant flex flex-col justify-between overflow-hidden relative group text-left">
                <div className="z-10">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary">voice_chat</span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg mb-4">Adaptive AI Voices</h3>
                  <p className="text-on-surface-variant max-w-sm">Choose from different interviewer personas—from the "Friendly HR" to the "Strict Tech Lead"—to prep for any situation.</p>
                </div>
                <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="AI Personas illustration" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhuqmEWo3y-xm-WNa3FFj6dE0bzDCNfSG8gcmswEuCx5oU4_KpUqvbscYZl6M1APGYRt3F-k8OGKwpr0L6jQaAsdiDihNgCwrvxYDuSwe2TkrCcl-7Tqgc26pbgyrWPKwKrV-0fcZxpvkOU7LoE6tWYlT35INZUwWZDKT5hXofOMWqyx1kEOBgKOFlJsBv_EVOfd-uaBuyv-G6YwKHhdfppRLoZ2hxRTNFhkTY0J4aNFtum2mIXWn7FQ"
                  />
                </div>
              </div>
              
              {/* Small Card 1 */}
              <div className="md:col-span-4 bento-card bento-card-animate bg-secondary/5 rounded-[32px] p-8 border border-secondary/10 flex flex-col justify-center text-center">
                <div className="mx-auto w-16 h-16 bg-secondary text-on-secondary rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl">timer</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-2">Real-time Pacing</h3>
                <p className="text-on-surface-variant text-sm">Visual feedback on your speaking speed helps you stay calm and articulate.</p>
              </div>

              {/* Small Card 2 */}
              <div className="md:col-span-4 bento-card bento-card-animate bg-tertiary/5 rounded-[32px] p-8 border border-tertiary/10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl">verified_user</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-2">Plagiarism Shield</h3>
                <p className="text-on-surface-variant text-sm">Ensure your stories are unique and authentic to your personal brand.</p>
              </div>

              {/* Medium Card */}
              <div className="md:col-span-8 bento-card bento-card-animate bg-surface-container-highest rounded-[32px] p-8 border border-surface-variant flex items-center gap-8 text-left">
                <div className="flex-1">
                  <h3 className="font-headline-md text-headline-md mb-4">Industry-Specific Scenarios</h3>
                  <p className="text-on-surface-variant text-sm mb-6">Over 500+ bank of questions tailored for FAANG, Startups, and Fortune 500 companies.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Product Management</span>
                    <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Software Engineering</span>
                    <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Data Science</span>
                  </div>
                </div>
                <div className="hidden sm:block w-32 h-32">
                  <img 
                    className="w-full h-full object-contain" 
                    alt="Office building doodle" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXvzB1R0ciu_s-xsoOI0WOlOthn-hRa77XL17xXruKM4VrphvkuGFK0iUpJie3Pf1xG1jsCeJ_r3WxejEEX5dEIAUnAGLWpvgeEbPLd957E-4c1zqwkYTTgIUfyOfmM2cEhVEGBSq_jF-pspVALEU4uBN89zX1-O6sNs9eWpCfsRlx7oMxJiCJgsQBJ2d_Y1vh_7Q7lGVkkc0rLjsgheKqVDX-xHHMcHeKne_Wv14Z7NzrztW8_yTomQ"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-surface" id="pricing">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg mb-4">Simple, Transparent Pricing</h2>
              <p className="text-on-surface-variant">Invest in your career growth with plans that fit your needs.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {/* Basic */}
              <div className="p-10 rounded-[32px] border border-surface-variant bg-white flex flex-col h-full">
                <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-2">Free</h4>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-headline-xl text-headline-xl">$0</span>
                  <span className="text-on-surface-variant">/mo</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-tertiary text-lg">check_circle</span> 3 practice interviews</li>
                  <li className="flex items-center gap-3 text-sm"><span class="material-symbols-outlined text-tertiary text-lg">check_circle</span> Basic tone analysis</li>
                  <li className="flex items-center gap-3 text-sm text-on-surface-variant/50"><span class="material-symbols-outlined text-lg">cancel</span> Custom AI Personas</li>
                </ul>
                <button onClick={() => navigate('/signup')} className="w-full py-4 border-2 border-outline-variant rounded-full font-label-md text-label-md hover:bg-surface-container transition-all">Start for Free</button>
              </div>
              
              {/* Pro */}
              <div className="p-10 rounded-[32px] bg-primary text-on-primary shadow-2xl shadow-primary/20 flex flex-col h-full relative overflow-hidden transform md:scale-105">
                <div className="absolute top-0 right-0 bg-secondary px-4 py-1 text-[10px] font-bold uppercase tracking-tighter">Most Popular</div>
                <h4 className="font-label-md text-label-md uppercase tracking-widest mb-2 opacity-80">Professional</h4>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-headline-xl text-headline-xl">$19</span>
                  <span className="opacity-80">/mo</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-white text-lg">check_circle</span> Unlimited practice sessions</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-white text-lg">check_circle</span> Advanced behavioral feedback</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-white text-lg">check_circle</span> All 12 AI interview personas</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-white text-lg">check_circle</span> PDF performance reports</li>
                </ul>
                <button onClick={() => navigate('/signup')} className="w-full py-4 bg-white text-primary rounded-full font-label-md text-label-md shadow-lg shadow-black/10 hover:bg-surface-bright transition-all">Go Pro</button>
              </div>
              
              {/* Team */}
              <div className="p-10 rounded-[32px] border border-surface-variant bg-white flex flex-col h-full">
                <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-2">Career Coach</h4>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-headline-xl text-headline-xl">$49</span>
                  <span className="text-on-surface-variant">/mo</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-tertiary text-lg">check_circle</span> Shared team dashboard</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-tertiary text-lg">check_circle</span> White-label reports</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-tertiary text-lg">check_circle</span> Custom question bank creation</li>
                </ul>
                <button onClick={() => navigate('/signup')} className="w-full py-4 border-2 border-outline-variant rounded-full font-label-md text-label-md hover:bg-surface-container transition-all">Contact Sales</button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Anchor wrapper */}
        <section id="faq" className="py-16 bg-surface-container-low text-center">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-headline-lg mb-4">Frequently Asked Questions</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto mb-10">Got questions? We've got answers. Here are some of our most common inquiries.</p>
            <div className="max-w-3xl mx-auto space-y-4 text-left">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-surface-variant">
                <h4 className="font-bold text-body-lg mb-2">How does the voice practice work?</h4>
                <p className="text-on-surface-variant text-sm">CrackIt uses advanced voice synthesizers and AI models. You speak into your microphone, and our AI listens, evaluates your words and vocal properties, and responds naturally.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-surface-variant">
                <h4 className="font-bold text-body-lg mb-2">Can I upload my own custom resume?</h4>
                <p className="text-on-surface-variant text-sm">Yes, you can upload PDFs and Word documents in our Resume Management dashboard. The AI will customize mock interview questions tailored directly to your experience.</p>
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
              <button onClick={() => navigate('/signup')} className="px-12 py-5 bg-secondary text-on-secondary rounded-full font-label-md text-label-md shadow-2xl shadow-secondary/30 hover:-translate-y-1 transition-all">
                Get Started for Free
              </button>
            </div>
            {/* Abstract hand-drawn background elements */}
            <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10 pointer-events-none">
              <img 
                className="w-full h-full object-contain" 
                alt="Cheering stick figure" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGRm1r2TAszwDbNYIUmCfiW1FNp7AAZCnHCcMgqptqvt7vSff2oFUI2Y90TRNRbl5ouNwran5jxm1n0rXd9Lvlt39zXPVfaN24-1UY3LFa3IBcLSaW5jCzsLQLxDzfe6mS2ImdNGKfztH1AU4DXFeYAOde5lnh51uwsi6hm_0RncaTdiovhXFXE7_5EqKKPB5hUYabDdRdlYluix19Ctdxu_KYuntWvXIjcSQEQGLGPvw0JHIUb0xiDQ"
              />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none rotate-180">
              <img 
                className="w-full h-full object-contain" 
                alt="Floating sparkles doodle" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFONh66EbOBRA3QGvf_nKZ0yM8ZMyZXCd_x7bACypLDpij-khiUsCujQjq6xdXkQbV2aWWZYgpC8qOfMrpunkjQLvTDYk5L0adkTVfXDm2cI-2DxQjv_THUbd_TXUVJRyU_eGynT5zQmS_N_4mQYfhMeRJkKygFKK8wDCl_PEYzdZa7lo5D897zElVll0QkTgd9pq3iWHwFCiidP-ugiMoAcjCiWalsB6GMqI-kCYZU0orR4GTlx4l6Q"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest w-full py-12 px-margin-desktop text-center md:text-left">
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
