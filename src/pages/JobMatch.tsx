import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockResumes } from '../utils/mockData';
import { useToast } from '../context/ToastContext';
import { trimInput, isNonEmptyString } from '../lib/sanitize';

export default function JobMatch() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedResume, setSelectedResume] = useState<string>(mockResumes[0].name);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [score, setScore] = useState<number>(75);
  const [showResults, setShowResults] = useState<boolean>(true);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '+ Upload New Resume') {
      navigate('/resume');
    } else {
      setSelectedResume(val);
    }
  };

  const handleCalculate = (e: FormEvent) => {
    e.preventDefault();
    const cleanJD = trimInput(jobDescription);
    if (!isNonEmptyString(cleanJD)) {
      showToast("Please paste a job description first!", "error");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newScore = Math.floor(Math.random() * 20) + 70;
      setScore(newScore);
      setShowResults(true);
      showToast(`AI Gap Analysis completed! Matching score: ${newScore}%`, "success");
    }, 1500);
  };

  return (
    <div className="px-margin-mobile md:px-margin-desktop pb-margin-mobile md:pb-margin-desktop min-h-screen text-left bg-background selection:bg-primary-fixed">
      {/* Header Section */}
      <header className="mb-10">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Job Match &amp; ATS Intelligence</h2>
        <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Optimize your chances. Our AI analyzes your experience against the job description to bridge the gap between "Qualified" and "Hired".
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Input Bento Area (7 Columns) */}
        <section className="col-span-12 lg:col-span-7 flex flex-col gap-gutter">
          
          {/* Resume Selection */}
          <div className="bento-card bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">upload_file</span>
              </div>
              <h3 className="font-headline-md text-[20px] font-bold text-on-surface">Select Resume</h3>
            </div>
            
            <select 
              value={selectedResume}
              onChange={handleSelectChange}
              className="w-full p-4 bg-surface-container rounded-[16px] border-none focus:ring-2 focus:ring-primary font-body-md text-on-surface font-semibold cursor-pointer outline-none"
            >
              {mockResumes.map(r => (
                <option key={r.id} value={r.name}>{r.name} ({r.date})</option>
              ))}
              <option value="+ Upload New Resume">+ Upload New Resume</option>
            </select>
          </div>

          {/* Job Description Text Area */}
          <form onSubmit={handleCalculate} className="bento-card bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined">work</span>
                  </div>
                  <h3 className="font-headline-md text-[20px] font-bold text-on-surface">Target Job Description</h3>
                </div>
                <span className="text-label-sm text-outline-variant font-medium text-xs">Paste Plain Text</span>
              </div>
              
              <textarea 
                className="w-full min-h-[320px] p-6 bg-surface-container rounded-[20px] border-none focus:ring-2 focus:ring-primary font-body-md text-on-surface-variant resize-none placeholder:text-outline-variant outline-none" 
                placeholder="Paste the target job description (responsibilities, requirements, technical stack)..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-primary text-on-primary font-headline-md px-8 py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 font-bold disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span>{isLoading ? "Running AI Gap Analysis..." : "Calculate Match & Gaps"}</span>
                <span className="material-symbols-outlined">bolt</span>
              </button>
            </div>
          </form>
        </section>

        {/* Results Area (5 Columns) */}
        <section className="col-span-12 lg:col-span-5">
          {showResults && (
            <div className="space-y-gutter">
              {/* Match Score Card */}
              <div className="bento-card bg-surface-container-lowest p-8 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-label-sm rounded-full font-bold text-xs">AI Verified</span>
                </div>

                {/* Score Gauge Circle */}
                <div className="relative w-40 h-40 my-4 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-surface-variant" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                    <circle 
                      className="text-primary transition-all duration-1000" 
                      cx="80" 
                      cy="80" 
                      fill="transparent" 
                      r="70" 
                      stroke="currentColor" 
                      strokeDasharray="439.8" 
                      strokeDashoffset={439.8 * (1 - score / 100)} 
                      strokeLinecap="round" 
                      strokeWidth="12"
                    ></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-headline-xl text-[44px] font-extrabold text-on-surface leading-none">{score}%</span>
                    <span className="text-label-sm text-outline text-xs font-semibold mt-1">Match Score</span>
                  </div>
                </div>

                <h4 className="font-headline-md text-xl font-bold text-on-surface mb-1">
                  {score >= 80 ? "Strong Placement Match" : "Good Fit with Missing Keywords"}
                </h4>
                <p className="text-body-md text-on-surface-variant text-sm">Your resume aligns well with core technical requirements.</p>
              </div>

              {/* Actionable Gaps List */}
              <div className="bento-card bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30">
                <h4 className="font-headline-md text-base font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">warning</span>
                  <span>Missing Keywords &amp; Gaps</span>
                </h4>
                
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-secondary-fixed/20 border border-secondary-fixed-dim/30 flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-sm mt-0.5">add_circle</span>
                    <div>
                      <h5 className="font-bold text-xs text-on-surface">Kubernetes / Helm Charts</h5>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">Required in JD 4x, missing in current resume draft.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary-fixed/20 border border-secondary-fixed-dim/30 flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-sm mt-0.5">add_circle</span>
                    <div>
                      <h5 className="font-bold text-xs text-on-surface">System Scalability Metrics</h5>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">Quantify requests per second on your event broker project.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/interview-setup')}
                  className="w-full mt-6 py-3 bg-secondary text-on-secondary font-bold text-xs rounded-full shadow-md hover:scale-[1.01] active:scale-95 transition-all text-center flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  <span>Practice Questions for Missing Keywords</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
