import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../lib/api';
import HeatmapChart from '../components/HeatmapChart';

export default function Analytics() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('month');
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    apiFetch<any>(`/analytics?period=${period}`)
      .then((data) => {
        setAnalytics(data);
      })
      .catch(() => {
        showToast('Failed to load analytics metrics.', 'error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [period, showToast]);

  const handleExport = () => {
    showToast('Generating performance analytics PDF document...', 'info');
  };

  const readinessScore = analytics?.readinessTrend?.current || 86;
  const changePercent = analytics?.readinessTrend?.changePercent || '+12.4%';
  const avgScore = analytics?.overallStats?.averageScore || 86;
  const percentile = analytics?.overallStats?.percentile || 'Top 5%';

  const problemSolving = analytics?.skillBreakdown?.problemSolving || 92;
  const communication = analytics?.skillBreakdown?.communication || 78;
  const systemDesign = analytics?.skillBreakdown?.systemDesign || 65;

  const topStrengths = analytics?.topicMastery?.topStrengths || ['Data Structures', 'Behavioral Leadership'];
  const growthAreas = analytics?.topicMastery?.growthAreas || ['Cloud Architecture', 'Unit Testing'];

  const recommendedTopics = analytics?.recommendedTopics || [
    {
      id: 1,
      title: 'Event-Driven Microservices Architecture',
      difficulty: 'Advanced',
      reason: 'High demand keyword in target backend roles.',
    },
  ];

  const topicsNeedingPrep = analytics?.topicsNeedingPreparation || [
    {
      id: 101,
      title: 'Kubernetes Container Orchestration',
      score: 65,
      reason: 'Flagged from low score response in recent practice round.',
    },
  ];

  return (
    <div className="px-margin-mobile md:px-margin-desktop pb-margin-mobile md:pb-margin-desktop min-h-screen text-left bg-background selection:bg-primary-fixed relative overflow-hidden">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1 font-bold text-[28px]">
            Growth Insights
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Welcome back! You're in the <strong className="text-primary">{percentile}</strong> of candidates this week.
          </p>
        </div>

        <div className="flex gap-4 w-full sm:w-auto">
          {/* Period Selection Filter */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="bg-surface-container rounded-full px-4 py-2 flex items-center gap-2 border border-outline-variant/30 text-sm font-semibold cursor-pointer outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={handleExport}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold shadow-md flex items-center gap-2 text-sm hover:opacity-95 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
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
                <span>{changePercent} vs last period</span>
              </p>
            </div>

            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 text-label-sm text-xs text-on-surface-variant">
                <span className="w-3 h-3 rounded-full bg-primary inline-block"></span> Readiness ({readinessScore}%)
              </span>
              <span className="flex items-center gap-1.5 text-label-sm text-xs text-on-surface-variant">
                <span className="w-3 h-3 rounded-full bg-secondary-container inline-block"></span> Benchmark (75%)
              </span>
            </div>
          </div>

          {/* Custom SVG Chart Visualization */}
          <div className="absolute bottom-0 left-0 w-full h-64 px-8 pb-8">
            <svg
              className="w-full h-full drop-shadow-xl overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 800 200"
            >
              <defs>
                <linearGradient id="readyGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#4151bb" stopOpacity="0.3"></stop>
                  <stop offset="95%" stopColor="#4151bb" stopOpacity="0"></stop>
                </linearGradient>
              </defs>

              <path
                d="M0,150 C100,140 200,160 300,120 S400,40 500,60 S600,100 700,50 S800,30 800,30 V200 H0 Z"
                fill="url(#readyGrad)"
              ></path>
              <path
                d="M0,120 L100,118 L200,122 L300,115 L400,110 L500,108 L600,105 L700,102 L800,100"
                fill="none"
                stroke="#fd8863"
                strokeDasharray="8,4"
                strokeWidth="2"
              ></path>
              <path
                d="M0,150 C100,140 200,160 300,120 S400,40 500,60 S600,100 700,50 S800,30 800,30"
                fill="none"
                stroke="#4151bb"
                strokeLinecap="round"
                strokeWidth="4"
              ></path>

              <circle cx="300" cy="120" fill="#4151bb" r="6"></circle>
              <circle cx="500" cy="60" fill="#4151bb" r="6"></circle>
              <circle cx="800" cy="30" fill="#4151bb" r="8" stroke="white" strokeWidth="3"></circle>
            </svg>

            <div className="flex justify-between mt-4 text-label-sm text-xs text-on-surface-variant px-2">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
              <span>Week 5</span>
              <span>Present</span>
            </div>
          </div>
        </section>

        {/* Quick Stats Summary (4 Columns) */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          <div className="bg-tertiary-container rounded-[24px] p-6 text-on-tertiary-container flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="font-label-md text-label-md mb-1 opacity-90 text-sm font-semibold">Overall Score</p>
              <h4 className="font-headline-xl text-headline-xl font-extrabold text-[32px]">{avgScore}%</h4>
              <div className="mt-2 inline-flex items-center bg-white/20 rounded-full px-3 py-0.5 text-label-sm text-xs font-semibold">
                <span className="material-symbols-outlined text-xs mr-1">arrow_upward</span> {percentile}
              </div>
            </div>

            <div className="w-24 h-24 relative z-10">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="3"
                ></path>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="white"
                  strokeDasharray={`${avgScore}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3"
                ></path>
              </svg>
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
                  <span>{problemSolving}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${problemSolving}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-label-sm text-xs mb-1">
                  <span>Communication</span>
                  <span>{communication}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-container rounded-full" style={{ width: `${communication}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-label-sm text-xs mb-1">
                  <span>System Design</span>
                  <span>{systemDesign}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary rounded-full" style={{ width: `${systemDesign}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Activity Heatmap */}
        <HeatmapChart />

        {/* Vertical Benchmarks (6 Columns) */}
        <section className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-[0_10px_30px_rgba(65,81,187,0.08)] border border-surface-variant/30">
          <h3 className="font-headline-md text-headline-md mb-6 font-bold text-[20px]">Vertical Benchmarks</h3>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-3xl">mic</span>
              </div>

              <div className="flex-1">
                <div className="flex justify-between mb-2 text-sm font-semibold">
                  <span className="font-label-md">Interview Performance</span>
                  <span className="font-bold text-primary">{avgScore}%</span>
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

            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-3xl">description</span>
              </div>

              <div className="flex-1">
                <div className="flex justify-between mb-2 text-sm font-semibold">
                  <span className="font-label-md font-semibold">Resume ATS Score</span>
                  <span className="font-bold text-secondary">85%</span>
                </div>
                <div className="relative h-12 flex items-end gap-1">
                  <div className="bg-secondary-container/20 hover:bg-secondary-container transition-colors w-full h-[30%] rounded-t-sm"></div>
                  <div className="bg-secondary-container/20 hover:bg-secondary-container transition-colors w-full h-[45%] rounded-t-sm"></div>
                  <div className="bg-secondary-container/20 hover:bg-secondary-container transition-colors w-full h-[80%] rounded-t-sm"></div>
                  <div className="bg-secondary-container/20 hover:bg-secondary-container transition-colors w-full h-[70%] rounded-t-sm"></div>
                  <div className="bg-secondary-container hover:bg-secondary-container transition-colors w-full h-[85%] rounded-t-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Topic Mastery (6 Columns) */}
        <section className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-[0_10px_30px_rgba(65,81,187,0.08)] border border-surface-variant/30">
          <h3 className="font-headline-md text-headline-md mb-6 font-bold text-[20px]">Topic Mastery</h3>

          <div className="grid grid-cols-2 gap-gutter text-left">
            <div>
              <h4 className="font-label-md text-tertiary uppercase tracking-wider mb-4 text-xs font-bold">
                Top Strengths
              </h4>
              <div className="space-y-3">
                {topStrengths.map((str: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-tertiary-fixed/30 px-4 py-3 rounded-xl flex items-center justify-between border border-tertiary-fixed-dim/20 text-sm"
                  >
                    <span className="font-body-md font-semibold text-xs">{str}</span>
                    <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-label-md text-secondary uppercase tracking-wider mb-4 text-xs font-bold">
                Growth Areas
              </h4>
              <div className="space-y-3">
                {growthAreas.map((ga: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-secondary-fixed/30 px-4 py-3 rounded-xl flex items-center justify-between border border-secondary-fixed-dim/20 text-sm"
                  >
                    <span className="font-body-md font-semibold text-xs">{ga}</span>
                    <span className="material-symbols-outlined text-secondary font-bold text-base">trending_up</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-surface-container rounded-2xl p-4 flex items-center gap-4 border border-surface-variant/20">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
            </div>
            <p className="font-body-md text-on-surface-variant italic text-xs">
              "Focus 20% more on {growthAreas[0] || 'System Design'} patterns this week to boost your overall placement readiness."
            </p>
          </div>
        </section>

        {/* Recommended Topics & Preparation Plan Card (12 Columns) */}
        <section className="col-span-12 bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-[0_10px_30px_rgba(65,81,187,0.08)] border border-surface-variant/30 text-left">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="font-headline-md text-headline-md font-bold text-[20px] text-on-surface">
                Recommended Topics &amp; Growth Action Plan
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant mt-1">
                Topics recommended by CrackIt AI plus topics flagged from low-scoring practice responses.
              </p>
            </div>
            <button
              onClick={() => navigate('/interview-setup')}
              className="px-6 py-2.5 bg-secondary text-on-secondary font-bold text-xs rounded-full shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>Start Preparation Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 space-y-4">
              <h4 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>Recommended Topics from CrackIt AI</span>
              </h4>
              <div className="space-y-3">
                {recommendedTopics.map((topic: any) => (
                  <div
                    key={topic.id}
                    className="p-4 bg-white rounded-xl shadow-sm border border-primary/10 flex justify-between items-center"
                  >
                    <div>
                      <h5 className="font-bold text-sm text-on-surface">{topic.title}</h5>
                      <p className="text-xs text-on-surface-variant mt-0.5">{topic.reason}</p>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full shrink-0 ml-3">
                      {topic.difficulty || 'Mid/Senior'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-secondary/5 p-5 rounded-2xl border border-secondary/20 space-y-4">
              <h4 className="font-bold text-xs text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span>Topics Needing Preparation (Weak Answers)</span>
              </h4>
              <div className="space-y-3">
                {topicsNeedingPrep.map((topic: any) => (
                  <div
                    key={topic.id}
                    className="p-4 bg-white rounded-xl shadow-sm border border-secondary/10 flex justify-between items-center"
                  >
                    <div>
                      <h5 className="font-bold text-sm text-on-surface">{topic.title}</h5>
                      <p className="text-xs text-on-surface-variant mt-0.5">{topic.reason}</p>
                    </div>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary font-bold text-xs rounded-full shrink-0 ml-3">
                      Score {topic.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Responsive Background Ambient Element */}
      <div className="fixed top-0 right-0 -z-10 w-full max-w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
}
