import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockResumes } from '../utils/mockData';

export default function JobMatch() {
  const navigate = useNavigate();
  const [selectedResume, setSelectedResume] = useState(mockResumes[0].name);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(75);
  const [showResults, setShowResults] = useState(true);

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === '+ Upload New Resume') {
      navigate('/resume');
    } else {
      setSelectedResume(val);
    }
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      alert("Please paste a job description first!");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newScore = Math.floor(Math.random() * 20) + 70; // 70 to 90
      setScore(newScore);
      setShowResults(true);
      alert(`AI Gap Analysis completed! Matching score: ${newScore}%`);
    }, 1500);
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop min-h-screen text-left bg-background selection:bg-primary-fixed">
      {/* Header Section */}
      <header className="mb-10">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Resume Intelligence</h2>
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
            
            <div className="relative group">
              <select 
                value={selectedResume}
                onChange={handleSelectChange}
                className="w-full h-14 pl-4 pr-10 bg-surface-container rounded-2xl border-none focus:ring-2 focus:ring-primary appearance-none font-body-md text-on-surface cursor-pointer group-hover:bg-surface-container-high transition-colors"
              >
                {mockResumes.map(r => (
                  <option key={r.id} value={r.name}>{r.name} ({r.matchScore}% base)</option>
                ))}
                <option value="+ Upload New Resume">+ Upload New Resume</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>

          {/* Job Description Input */}
          <div className="bento-card flex-grow bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">work_outline</span>
                  </div>
                  <h3 className="font-headline-md text-[20px] font-bold text-on-surface">Job Description</h3>
                </div>
                <button 
                  type="button" 
                  onClick={() => setJobDescription("We are looking for a Senior Software Engineer with strong expertise in Distributed Systems, event streaming platforms (Kafka), and Microservices architecture. Experience with Java, Spring Boot, Kubernetes, and SQL/NoSQL databases is required.")}
                  className="text-primary font-label-md hover:underline font-semibold"
                >
                  Load Example JD
                </button>
              </div>
              
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full min-h-[320px] p-6 bg-surface-container rounded-[20px] border-none focus:ring-2 focus:ring-primary font-body-md text-on-surface-variant resize-none placeholder:text-outline-variant outline-none" 
                placeholder="Paste the full job description here. Our AI will extract requirements, technical skills, and cultural nuances..."
              ></textarea>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleCalculate}
                disabled={isLoading}
                className="px-8 py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span>{isLoading ? "Analyzing..." : "Calculate Match"}</span>
                <span className="material-symbols-outlined">bolt</span>
              </button>
            </div>
          </div>
        </section>

        {/* Results Bento Area (5 Columns) */}
        <section className="col-span-12 lg:col-span-5 flex flex-col gap-gutter">
          {showResults && (
            <>
              {/* Match Score Circular Progress */}
              <div className="bento-card flex flex-col items-center justify-center text-center py-10 bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30">
                <h3 className="font-label-md text-primary uppercase tracking-widest mb-6 font-semibold">Match Compatibility</h3>
                
                <div className="relative flex items-center justify-center">
                  <svg className="w-48 h-48">
                    <circle className="text-secondary/10" cx="96" cy="96" fill="transparent" r="84" stroke="currentColor" strokeWidth="12"></circle>
                    <circle 
                      className="text-secondary progress-ring-circle" 
                      cx="96" 
                      cy="96" 
                      fill="transparent" 
                      r="84" 
                      stroke="currentColor" 
                      strokeDasharray="527.7" 
                      strokeDashoffset={527.7 * (1 - score / 100)} 
                      strokeLinecap="round" 
                      strokeWidth="12"
                    ></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-extrabold text-on-surface">{score}%</span>
                    <span className="font-label-md text-secondary font-bold mt-1">
                      {score >= 85 ? "Excellent Fit" : score >= 75 ? "Strong Match" : "Fair Match"}
                    </span>
                  </div>
                </div>
                
                <p className="mt-8 text-body-md text-on-surface-variant px-6">
                  {score >= 85 
                    ? "Your background aligns extremely well with this job specification! You are ready to apply."
                    : `You're highly compatible! Adding just 3 missing keywords could boost this to ${Math.min(score + 15, 98)}%.`
                  }
                </p>
              </div>

              {/* Missing Skills & Keywords */}
              <div className="bento-card bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.04)] border border-surface-variant/30">
                <h3 className="font-headline-md text-headline-md mb-6 font-bold">Gap Analysis</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-error">dangerous</span>
                      <h4 className="font-label-md text-on-surface font-semibold text-sm">Missing Technical Skills</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-error-container/30 text-on-error-container rounded-full font-label-sm border border-error/5">Distributed Systems</span>
                      <span className="px-4 py-2 bg-error-container/30 text-on-error-container rounded-full font-label-sm border border-error/5">Message Brokers (Kafka)</span>
                      <span className="px-4 py-2 bg-error-container/30 text-on-error-container rounded-full font-label-sm border border-error/5">Go Lang Concurrency</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-secondary">info</span>
                      <h4 className="font-label-md text-on-surface font-semibold text-sm">Target Behavioral Focus</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-label-sm border border-primary/5">Cross-team Collaboration</span>
                      <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-label-sm border border-primary/5">Failure Recovery Stories</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
