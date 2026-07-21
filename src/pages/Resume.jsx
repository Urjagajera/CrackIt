import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUserProfile, mockResumes } from '../utils/mockData';

export default function Resume() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState(mockResumes);
  const [activeResume, setActiveResume] = useState(mockResumes[0]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Simulate drop / upload
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleUploadSimulation(files[0].name, files[0].size);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleUploadSimulation(files[0].name, files[0].size);
    }
  };

  const handleUploadSimulation = (fileName, fileSize) => {
    // Generate mock size representation
    const sizeMB = (fileSize / (1024 * 1024)).toFixed(1) + " MB";
    const newResumeItem = {
      id: resumes.length + 1,
      name: fileName,
      date: "Just now",
      matchScore: Math.floor(Math.random() * 20) + 75, // Random score between 75 and 95
      size: sizeMB
    };
    
    const updatedList = [newResumeItem, ...resumes];
    setResumes(updatedList);
    setActiveResume(newResumeItem);
    alert(`File "${fileName}" uploaded successfully. AI analysis generated a score of ${newResumeItem.matchScore}%.`);
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop min-h-screen text-left bg-background selection:bg-primary-fixed">
      {/* Header Section */}
      <header className="mb-10">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Resume Optimization</h2>
        <p className="font-body-md text-on-surface-variant mt-2 max-w-2xl">
          Refine your resume with AI-powered ATS analysis. We match your profile against industry benchmarks to ensure you get through the door.
        </p>
      </header>

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Left Column: Upload & History (8 Columns) */}
        <div className="lg:col-span-8 space-y-gutter">
          
          {/* Large Drag-and-Drop Area */}
          <section 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative group cursor-pointer h-72 border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center transition-all shadow-[0_10px_30px_rgba(65,81,187,0.04)] ${
              isDragging 
                ? 'border-primary bg-primary-fixed/20' 
                : 'border-primary/30 bg-surface-container-lowest hover:border-primary hover:bg-primary-fixed/10'
            }`}
          >
            <div className="w-20 h-20 bg-primary-fixed/50 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined !text-4xl">upload_file</span>
            </div>
            <div className="text-center">
              <p className="font-headline-md text-on-surface mb-1">Upload New Resume</p>
              <p className="font-body-md text-on-surface-variant">
                Drag and drop or <span className="text-primary font-bold">browse</span> PDF, DOCX (Max 10MB)
              </p>
            </div>
            <input 
              aria-label="Upload resume" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              type="file"
              onChange={handleFileSelect}
            />
          </section>

          {/* History Line Chart */}
          <section className="bg-surface-container-lowest rounded-[24px] p-6 shadow-[0_10px_30px_rgba(65,81,187,0.06)] border border-surface-variant/25">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface">Improvement History</h3>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span> +12% Growth
                </span>
              </div>
            </div>
            
            <div className="h-48 w-full relative flex items-end justify-between px-2">
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-surface-variant"></div>
              
              {/* Jan */}
              <div className="flex flex-col items-center group w-full">
                <div className="w-3 h-3 bg-primary rounded-full mb-1 translate-y-[24px]"></div>
                <div className="w-[2px] h-[40px] bg-primary/20"></div>
                <span className="text-label-sm text-on-surface-variant mt-2">Jan</span>
              </div>
              
              {/* Feb */}
              <div className="flex flex-col items-center group w-full">
                <div className="w-3 h-3 bg-primary rounded-full mb-1 translate-y-[18px]"></div>
                <div className="w-[2px] h-[46px] bg-primary/20"></div>
                <span className="text-label-sm text-on-surface-variant mt-2">Feb</span>
              </div>
              
              {/* Mar */}
              <div className="flex flex-col items-center group w-full">
                <div className="w-3 h-3 bg-primary rounded-full mb-1 translate-y-[32px]"></div>
                <div className="w-[2px] h-[32px] bg-primary/20"></div>
                <span className="text-label-sm text-on-surface-variant mt-2">Mar</span>
              </div>
              
              {/* Apr */}
              <div className="flex flex-col items-center group w-full">
                <div className="w-3 h-3 bg-primary rounded-full mb-1 translate-y-[12px]"></div>
                <div className="w-[2px] h-[52px] bg-primary/20"></div>
                <span className="text-label-sm text-on-surface-variant mt-2">Apr</span>
              </div>
              
              {/* May */}
              <div className="flex flex-col items-center group w-full">
                <div className="w-3 h-3 bg-primary rounded-full mb-1 translate-y-[4px] ring-4 ring-primary-fixed"></div>
                <div className="w-[2px] h-[60px] bg-primary/20"></div>
                <span className="text-label-sm text-on-surface-variant mt-2 font-bold text-primary">May</span>
              </div>

              {/* Line graph overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
                {/* Visual line matching standard layout coordinates */}
                <path className="text-primary opacity-30" d="M 50 120 L 175 114 L 300 128 L 425 108 L 550 100" fill="none" stroke="currentColor" strokeWidth="3"></path>
              </svg>
            </div>
          </section>

          {/* Resume Versions List */}
          <section className="bg-surface-container-lowest rounded-[24px] p-6 shadow-[0_10px_30px_rgba(65,81,187,0.06)] border border-surface-variant/25">
            <h3 className="font-headline-md text-on-surface mb-6">Recent Versions</h3>
            <div className="space-y-4">
              {resumes.map((res) => (
                <div 
                  key={res.id} 
                  onClick={() => setActiveResume(res)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-colors group cursor-pointer ${
                    activeResume.id === res.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-surface-variant hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined">article</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-on-surface font-semibold">{res.name}</h4>
                      <p className="text-label-sm text-on-surface-variant">Updated {res.date} • {res.matchScore}% Match ({res.size})</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Downloading file: ${res.name}`);
                      }}
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined">download</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/job-match');
                      }}
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Stats & Analysis (4 Columns) */}
        <div className="lg:col-span-4 space-y-gutter">
          
          {/* Resume Score & ATS Score Display */}
          <section className="bg-surface-container-highest rounded-[24px] p-6 space-y-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] text-left">
            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="font-label-md text-primary font-bold">Resume Score</p>
                <span className="text-headline-md font-bold text-primary">{activeResume.matchScore}</span>
              </div>
              <div className="h-3 w-full bg-primary/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500" 
                  style={{ width: `${activeResume.matchScore}%` }}
                ></div>
              </div>
              <p className="text-label-sm text-on-surface-variant mt-2">Top 15% of candidates for this role</p>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="font-label-md text-secondary font-bold">ATS Compatibility</p>
                <span className="text-headline-md font-bold text-secondary">{mockUserProfile.stats.atsCompatibility}%</span>
              </div>
              <div className="h-3 w-full bg-secondary/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary rounded-full transition-all duration-500" 
                  style={{ width: `${mockUserProfile.stats.atsCompatibility}%` }}
                ></div>
              </div>
              <p className="text-label-sm text-on-surface-variant mt-2">Highly readable by Workday & Greenhouse</p>
            </div>
          </section>

          {/* Suggestions Card */}
          <section className="bg-surface-container-lowest rounded-[24px] p-6 shadow-[0_10px_30px_rgba(65,81,187,0.06)] border border-primary/5 text-left">
            <h3 className="font-headline-md text-on-surface mb-6 flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-secondary">tips_and_updates</span>
              <span>Smart Fixes</span>
            </h3>
            
            <div className="space-y-6">
              {/* Missing Keywords */}
              <div>
                <p className="font-label-md text-on-surface-variant mb-3 uppercase tracking-wider text-xs font-semibold">Missing Keywords</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full text-label-sm font-medium border border-error/10">Distributed Systems</span>
                  <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full text-label-sm font-medium border border-error/10">Kafka</span>
                  <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full text-label-sm font-medium border border-error/10">System Design</span>
                </div>
              </div>
              
              {/* Improvement Areas */}
              <div>
                <p className="font-label-md text-on-surface-variant mb-3 uppercase tracking-wider text-xs font-semibold">Improvement Areas</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-error text-[18px] mt-0.5">cancel</span>
                    <span>Quantify bullet impacts (e.g. increase performance by X%)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-error text-[18px] mt-0.5">cancel</span>
                    <span>Reduce short-duration internship bullet layout clutter</span>
                  </li>
                </ul>
              </div>

              {/* Match Call to Action */}
              <button 
                onClick={() => navigate('/job-match')}
                className="w-full mt-4 py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Compare Against Target JD</span>
                <span className="material-symbols-outlined">bolt</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
