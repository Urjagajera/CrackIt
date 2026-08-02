import React, { useState, DragEvent, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUserProfile, mockResumes } from '../utils/mockData';
import { useToast } from '../context/ToastContext';
import { ResumeItem } from '../types';

export default function Resume() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [resumes, setResumes] = useState<ResumeItem[]>(mockResumes);
  const [activeResume, setActiveResume] = useState<ResumeItem>(mockResumes[0]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleUploadSimulation(files[0].name, files[0].size);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUploadSimulation(files[0].name, files[0].size);
    }
  };

  const handleUploadSimulation = (fileName: string, fileSize: number) => {
    const sizeMB = (fileSize / (1024 * 1024)).toFixed(1) + " MB";
    const newResumeItem: ResumeItem = {
      id: Date.now(),
      name: fileName,
      date: "Just now",
      matchScore: Math.floor(Math.random() * 20) + 75,
      size: sizeMB
    };
    
    setResumes(prev => [newResumeItem, ...prev]);
    setActiveResume(newResumeItem);
    showToast(`File "${fileName}" uploaded. Score generated: ${newResumeItem.matchScore}%.`, "success");
  };

  return (
    <div className="px-margin-mobile md:px-margin-desktop pb-margin-mobile md:pb-margin-desktop min-h-screen text-left bg-background selection:bg-primary-fixed">
      {/* Header Section */}
      <header className="mb-10">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Resume Optimization</h2>
        <p className="font-body-md text-on-surface-variant mt-2 max-w-2xl">
          Upload and analyze your resume against industry standards and target tech roles.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Upload & History (8 Columns) */}
        <div className="lg:col-span-8 space-y-gutter">
          
          {/* Drag & Drop Upload Zone */}
          <section 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-[32px] p-8 md:p-12 text-center transition-all border-2 border-dashed relative overflow-hidden ${
              isDragging 
                ? 'border-primary bg-primary/10 scale-[1.01]' 
                : 'border-outline-variant bg-surface-container-lowest hover:border-primary/50'
            }`}
          >
            <div className="max-w-md mx-auto flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">cloud_upload</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">Upload Your Latest Resume</h3>
              <p className="text-body-md text-on-surface-variant mb-6 text-sm">
                Drag and drop your PDF or DOCX file here, or click browse to choose from your computer.
              </p>
              
              <input 
                type="file" 
                id="resume-file-input"
                className="hidden"
                accept=".pdf,.docx,.doc"
                onChange={handleFileSelect}
              />
              <label 
                htmlFor="resume-file-input"
                className="px-8 py-3.5 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Browse Files
              </label>
            </div>
          </section>

          {/* Resume Versions List */}
          <section className="bg-surface-container-lowest rounded-[24px] p-6 shadow-[0_10px_30px_rgba(65,81,187,0.06)] border border-surface-variant/25">
            <h3 className="font-headline-md text-on-surface mb-6 font-bold">Recent Versions</h3>
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
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        showToast(`Downloading file: ${res.name}`, "info");
                      }}
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-primary rounded"
                      aria-label={`Download ${res.name}`}
                    >
                      <span className="material-symbols-outlined">download</span>
                    </button>
                    <button 
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        navigate('/job-match');
                      }}
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-primary rounded"
                      aria-label={`Inspect ${res.name}`}
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
              <p className="text-label-sm text-on-surface-variant mt-2">Highly readable by Workday &amp; Greenhouse</p>
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
                  <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full text-label-sm font-medium border border-error/10 text-xs">Distributed Systems</span>
                  <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full text-label-sm font-medium border border-error/10 text-xs">Kafka</span>
                  <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full text-label-sm font-medium border border-error/10 text-xs">System Design</span>
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
                className="w-full mt-4 py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
