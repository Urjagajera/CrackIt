import React, { useState, useEffect } from 'react';
import { mockUserProfile } from '../utils/mockData';

export default function Analytics() {
  const profile = mockUserProfile;
  const [heatmapCells, setHeatmapCells] = useState([]);

  useEffect(() => {
    // Generate 364 cells for the practice activity heatmap
    const cells = [];
    const colors = ['bg-surface-container', 'bg-tertiary-fixed-dim', 'bg-tertiary-fixed', 'bg-tertiary'];
    for (let i = 0; i < 364; i++) {
      const level = Math.floor(Math.random() * 4);
      cells.push({
        id: i,
        level,
        colorClass: colors[level]
      });
    }
    setHeatmapCells(cells);
  }, []);

  const handleExport = () => {
    alert("Export PDF: Generating performance analytics document (Simulation).");
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop min-h-screen text-left bg-background selection:bg-primary-fixed relative">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1 font-bold text-[28px]">Growth Insights</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Welcome back! You're in the top 15% of candidates this week.
          </p>
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="bg-surface-container rounded-full px-4 py-2 flex items-center gap-2 border border-outline-variant/30 text-sm cursor-pointer select-none">
            <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
            <span className="font-label-md font-semibold">Last 30 Days</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </div>
          
          <button 
            onClick={handleExport}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold shadow-md flex items-center gap-2 text-sm hover:opacity-95 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Readiness Trend - Large Hero Card (8 Columns) */}
        <section className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[24px] p-8 shadow-[0_10px_30px_rgba(65,81,187,0.08)] relative overflow-hidden h-[400px] border border-surface-variant/30">
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="font-headline-md text-headline-md font-bold text-[20px]">Placement Readiness</h3>
              <p className="font-label-md text-tertiary font-bold flex items-center gap-1 text-sm">
                <span className="material-symbols-outlined text-sm">trending_up</span> 
                <span>+12.4% vs last month</span>
              </p>
            </div>
            
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 text-label-sm text-xs text-on-surface-variant">
                <span className="w-3 h-3 rounded-full bg-primary inline-block"></span> Readiness
              </span>
              <span className="flex items-center gap-1.5 text-label-sm text-xs text-on-surface-variant">
                <span className="w-3 h-3 rounded-full bg-secondary-container inline-block"></span> Market Average
              </span>
            </div>
          </div>

          {/* Custom SVG Chart Visualization */}
          <div className="absolute bottom-0 left-0 w-full h-64 px-8 pb-8">
            <svg className="w-full h-full drop-shadow-xl overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="readyGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#4151bb" stopOpacity="0.3"></stop>
                  <stop offset="95%" stopColor="#4151bb" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              
              {/* Area path */}
              <path d="M0,150 C100,140 200,160 300,120 S400,40 500,60 S600,100 700,50 S800,30 800,30 V200 H0 Z" fill="url(#readyGrad)"></path>
              
              {/* Market Average Line */}
              <path d="M0,120 L100,118 L200,122 L300,115 L400,110 L500,108 L600,105 L700,102 L800,100" fill="none" stroke="#fd8863" strokeDasharray="8,4" strokeWidth="2"></path>
              
              {/* Readiness Line */}
              <path d="M0,150 C100,140 200,160 300,120 S400,40 500,60 S600,100 700,50 S800,30 800,30" fill="none" stroke="#4151bb" strokeLinecap="round" strokeWidth="4"></path>
              
              {/* Data Points */}
              <circle cx="300" cy="120" fill="#4151bb" r="6"></circle>
              <circle cx="500" cy="60" fill="#4151bb" r="6"></circle>
              <circle cx="800" cy="30" fill="#4151bb" r="8" stroke="white" strokeWidth="3"></circle>
            </svg>
            
            <div className="flex justify-between mt-4 text-label-sm text-xs text-on-surface-variant px-2">
              <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span><span>Week 5</span><span>Present</span>
            </div>
          </div>
        </section>

        {/* Quick Stats Summary (4 Columns) */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          {/* Overall score card */}
          <div className="bg-tertiary-container rounded-[24px] p-6 text-on-tertiary-container flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="font-label-md text-label-md mb-1 opacity-90 text-sm font-semibold">Overall Score</p>
              <h4 className="font-headline-xl text-headline-xl font-extrabold text-[32px]">{profile.stats.averageScore}%</h4>
              <div className="mt-2 inline-flex items-center bg-white/20 rounded-full px-2 py-0.5 text-label-sm text-xs font-semibold">
                <span className="material-symbols-outlined text-xs">arrow_upward</span> Top 5%
              </div>
            </div>
            
            <div className="w-24 h-24 relative z-10">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3"></path>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="white" strokeDasharray="84, 100" strokeLinecap="round" strokeWidth="3"></path>
              </svg>
            </div>
            
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-[120px]">stars</span>
            </div>
          </div>

          {/* Skill Breakdown */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-[0_10px_30px_rgba(65,81,187,0.08)] flex-grow border border-surface-variant/30">
            <h5 className="font-label-md text-label-md text-on-surface-variant mb-4 flex items-center justify-between font-bold text-sm">
              <span>Skill Breakdown</span>
              <span className="material-symbols-outlined text-primary text-xl">info</span>
            </h5>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-label-sm text-xs mb-1">
                  <span>Problem Solving</span>
                  <span>92%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-label-sm text-xs mb-1">
                  <span>Communication</span>
                  <span>78%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-container rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-label-sm text-xs mb-1">
                  <span>System Design</span>
                  <span>65%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Activity Heatmap (12 Columns) */}
        <section className="col-span-12 bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-[0_10px_30px_rgba(65,81,187,0.08)] border border-surface-variant/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md font-bold text-[20px]">Practice Activity</h3>
            <div className="flex items-center gap-2 text-label-sm text-xs text-on-surface-variant font-semibold">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-[3px] bg-surface-container"></div>
                <div className="w-3 h-3 rounded-[3px] bg-tertiary-fixed-dim"></div>
                <div className="w-3 h-3 rounded-[3px] bg-tertiary-fixed"></div>
                <div className="w-3 h-3 rounded-[3px] bg-tertiary"></div>
              </div>
              <span>More</span>
            </div>
          </div>
          
          <div className="overflow-x-auto pb-2 custom-scrollbar">
            <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-[900px]">
              {heatmapCells.map((cell) => (
                <div
                  key={cell.id}
                  className={`w-[14px] h-[14px] rounded-[3px] transition-all cursor-pointer ${cell.colorClass} hover:ring-2 hover:ring-primary/40`}
                  title={`Activity level: ${cell.level}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Score Trend Charts & Benchmarks (6 Columns) */}
        <section className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-[0_10px_30px_rgba(65,81,187,0.08)] border border-surface-variant/30">
          <h3 className="font-headline-md text-headline-md mb-6 font-bold text-[20px]">Vertical Benchmarks</h3>
          
          <div className="space-y-6">
            {/* Interview Performance */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-3xl">mic</span>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between mb-2 text-sm font-semibold">
                  <span className="font-label-md">Interview Performance</span>
                  <span className="font-bold text-primary">88%</span>
                </div>
                <div className="relative h-12 flex items-end gap-1">
                  <div className="bg-primary/20 hover:bg-primary transition-colors w-full h-[40%] rounded-t-sm"></div>
                  <div className="bg-primary/20 hover:bg-primary transition-colors w-full h-[60%] rounded-t-sm"></div>
                  <div className="bg-primary/20 hover:bg-primary transition-colors w-full h-[55%] rounded-t-sm"></div>
                  <div className="bg-primary/20 hover:bg-primary transition-colors w-full h-[75%] rounded-t-sm"></div>
                  <div className="bg-primary/20 hover:bg-primary transition-colors w-full h-[88%] rounded-t-sm"></div>
                  <div className="bg-primary hover:bg-primary transition-colors w-full h-[92%] rounded-t-sm"></div>
                </div>
              </div>
            </div>

            {/* Resume Score */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-3xl">description</span>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between mb-2 text-sm font-semibold">
                  <span className="font-label-md">Resume Score (ATS)</span>
                  <span className="font-bold text-secondary">72%</span>
                </div>
                <div className="relative h-12 flex items-end gap-1">
                  <div className="bg-secondary-container/20 hover:bg-secondary-container transition-colors w-full h-[30%] rounded-t-sm"></div>
                  <div className="bg-secondary-container/20 hover:bg-secondary-container transition-colors w-full h-[45%] rounded-t-sm"></div>
                  <div className="bg-secondary-container/20 hover:bg-secondary-container transition-colors w-full h-[80%] rounded-t-sm"></div>
                  <div className="bg-secondary-container/20 hover:bg-secondary-container transition-colors w-full h-[65%] rounded-t-sm"></div>
                  <div className="bg-secondary-container/20 hover:bg-secondary-container transition-colors w-full h-[70%] rounded-t-sm"></div>
                  <div className="bg-secondary-container hover:bg-secondary-container transition-colors w-full h-[72%] rounded-t-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Weak/Strong Topics (6 Columns) */}
        <section className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-[0_10px_30px_rgba(65,81,187,0.08)] border border-surface-variant/30">
          <h3 className="font-headline-md text-headline-md mb-6 font-bold text-[20px]">Topic Mastery</h3>
          
          <div className="grid grid-cols-2 gap-gutter text-left">
            {/* Top Strengths */}
            <div>
              <h4 className="font-label-md text-tertiary uppercase tracking-wider mb-4 text-xs font-bold">Top Strengths</h4>
              <div className="space-y-3">
                <div className="bg-tertiary-fixed/30 px-4 py-3 rounded-xl flex items-center justify-between border border-tertiary-fixed-dim/20 text-sm">
                  <span className="font-body-md font-semibold">Data Structures</span>
                  <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div className="bg-tertiary-fixed/30 px-4 py-3 rounded-xl flex items-center justify-between border border-tertiary-fixed-dim/20 text-sm">
                  <span className="font-body-md font-semibold">Behavioral</span>
                  <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div className="bg-tertiary-fixed/30 px-4 py-3 rounded-xl flex items-center justify-between border border-tertiary-fixed-dim/20 text-sm">
                  <span className="font-body-md font-semibold">Algorithms</span>
                  <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              </div>
            </div>
            
            {/* Growth Areas */}
            <div>
              <h4 className="font-label-md text-secondary uppercase tracking-wider mb-4 text-xs font-bold">Growth Areas</h4>
              <div className="space-y-3">
                <div className="bg-secondary-fixed/30 px-4 py-3 rounded-xl flex items-center justify-between border border-secondary-fixed-dim/20 text-sm">
                  <span className="font-body-md font-semibold">Cloud Architecture</span>
                  <span className="material-symbols-outlined text-secondary font-bold">trending_up</span>
                </div>
                <div className="bg-secondary-fixed/30 px-4 py-3 rounded-xl flex items-center justify-between border border-secondary-fixed-dim/20 text-sm">
                  <span className="font-body-md font-semibold">Unit Testing</span>
                  <span className="material-symbols-outlined text-secondary font-bold">trending_up</span>
                </div>
                <div className="bg-secondary-fixed/30 px-4 py-3 rounded-xl flex items-center justify-between border border-secondary-fixed-dim/20 text-sm">
                  <span className="font-body-md font-semibold">Security Basics</span>
                  <span className="material-symbols-outlined text-secondary font-bold">trending_up</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mentor Quote */}
          <div className="mt-8 bg-surface-container rounded-2xl p-4 flex items-center gap-4 border border-surface-variant/20">
            <img 
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm" 
              alt="Mentor avatar" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiiNXiQlsE0oQ2HYfv54NB40tFqLD0SLIiHhBx7ihhl-QoImSynRFZmuWiG8F321d3ANagucoaZ99X4NR1gI9dTTAHAFHzs2UmT96oc3xKcS1OqB3ioHsGqntbUaTjw7cmxB-l8OhXi1k5XeacCeY7OpYlzdt7TcRWGpbCU9Kgo-tWXxRZFs27VNseNyuleL4D1rWFuB39baaCVXDz7If3-EkuSMfbBkX8nMhH2c4rHwGvaow-AJk28g"
            />
            <p className="font-body-md text-on-surface-variant italic text-sm">
              "You're making great strides in Algorithms. Focus 20% more on Cloud patterns this week to reach Elite status."
            </p>
          </div>
        </section>
      </div>

      {/* Floating Action Component - Insight Card */}
      <div className="mt-gutter flex flex-col md:flex-row gap-gutter">
        <div className="flex-1 glass-card p-6 md:p-8 rounded-[32px] flex items-center gap-8 shadow-xl border border-surface-variant/30 text-left">
          <div className="bg-primary w-20 h-20 md:w-24 md:h-24 rounded-[28px] flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary/30 text-on-primary">
            <span className="material-symbols-outlined text-5xl">auto_awesome</span>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-primary font-bold text-lg">AI Career Prediction</h3>
            <p className="font-body-lg text-sm text-on-surface-variant max-w-2xl mt-2 leading-relaxed">
              Based on your growth trajectory, you are highly likely to secure a <strong>Senior Engineer</strong> role at a Tier-1 firm within the next 45 days. Keep up the consistency!
            </p>
          </div>
        </div>
      </div>
      
      {/* Background Decorations */}
      <div className="fixed top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-64 -z-10 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
}
