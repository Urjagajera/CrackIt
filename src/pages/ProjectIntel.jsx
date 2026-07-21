import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockProjectIntel } from '../utils/mockData';

export default function ProjectIntel() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(mockProjectIntel);
  const [activeProject, setActiveProject] = useState(mockProjectIntel[0]);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: "System Design",
      bgClass: "bg-primary-fixed text-primary group-hover:bg-white/20 group-hover:text-white",
      hoverClass: "hover:bg-primary-container hover:text-on-primary-container",
      question: "How did you handle eventual consistency between your microservices when using Kafka for transaction events?"
    },
    {
      id: 2,
      type: "Scalability",
      bgClass: "bg-secondary-fixed text-secondary group-hover:bg-white/20 group-hover:text-white",
      hoverClass: "hover:bg-secondary-container hover:text-on-secondary-container",
      question: "Why did you choose Redis for caching instead of a simple local memory cache like Caffeine?"
    },
    {
      id: 3,
      type: "Resilience",
      bgClass: "bg-tertiary-fixed text-tertiary group-hover:bg-white/20 group-hover:text-white",
      hoverClass: "hover:bg-tertiary-container hover:text-on-tertiary-container",
      question: "Explain your disaster recovery strategy for the PostgreSQL database in the event of a region failure."
    }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ entity: 85, arch: 42 });

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress({ entity: 0, arch: 0 });
      
      // Simulate analysis steps
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev.entity < 85) {
            return { entity: prev.entity + 17, arch: prev.arch + 8 };
          } else if (prev.arch < 42) {
            return { entity: 85, arch: prev.arch + 7 };
          } else {
            clearInterval(interval);
            setIsUploading(false);
            alert("Project document uploaded and analyzed! Generated 3 predictive questions.");
            return { entity: 85, arch: 42 };
          }
        });
      }, 300);
    }
  };

  const handleAddQuestion = () => {
    const customQ = prompt("Enter your custom question related to this project architecture:");
    if (customQ) {
      setQuestions([
        ...questions,
        {
          id: questions.length + 1,
          type: "Custom",
          bgClass: "bg-primary-fixed text-primary group-hover:bg-white/20 group-hover:text-white",
          hoverClass: "hover:bg-primary-container hover:text-on-primary-container",
          question: `"${customQ}"`
        }
      ]);
    }
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop min-h-screen text-left bg-background selection:bg-primary-fixed">
      {/* Header Section */}
      <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Project Intelligence</h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            Upload your project documentation or presentation to extract architectural insights and generate tailored interview questions.
          </p>
        </div>
        <button 
          onClick={() => alert("Simulation: Displaying recent project upload history log.")}
          className="flex items-center gap-2 px-6 py-3 border border-outline-variant rounded-full text-on-surface font-label-md hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined">history</span>
          <span>Recent History</span>
        </button>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Upload Control Card & Progress (4 Columns) */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          
          {/* File Upload Zone */}
          <div className="bg-surface-container-lowest rounded-[24px] p-8 custom-shadow border border-surface-variant/30 flex flex-col items-center justify-center text-center group cursor-pointer border-dashed border-2 hover:border-primary/50 transition-all min-h-[300px]">
            <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-[32px]">cloud_upload</span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-2">Upload Project</h3>
            <p className="text-body-md text-on-surface-variant mb-6 px-4">PDF, PPTX, or DOCX supported. Max file size 25MB.</p>
            <input 
              className="hidden" 
              id="project-upload" 
              type="file"
              onChange={handleUpload}
            />
            <label className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold cursor-pointer hover:shadow-lg transition-all active:scale-95" htmlFor="project-upload">
              {isUploading ? "Uploading..." : "Select File"}
            </label>
          </div>

          {/* Analysis Status Card */}
          <div className="bg-surface-container-high/50 rounded-[24px] p-6 custom-shadow border border-surface-variant/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-label-md text-on-surface-variant uppercase tracking-wider text-xs font-semibold">Analysis Engine</span>
              <span className={`px-3 py-1 rounded-full text-label-sm font-bold ${
                isUploading ? 'bg-secondary-fixed text-on-secondary-fixed animate-pulse' : 'bg-tertiary-fixed text-on-tertiary-fixed'
              }`}>
                {isUploading ? "Running AI" : "AI Idle"}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-label-sm">
                  <span>Entity Extraction</span>
                  <span className="font-bold">{uploadProgress.entity}%</span>
                </div>
                <div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${uploadProgress.entity}%` }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-label-sm">
                  <span>Architecture Mapping</span>
                  <span className="font-bold">{uploadProgress.arch}%</span>
                </div>
                <div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all duration-300" style={{ width: `${uploadProgress.arch}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Summary & Intel (8 Columns) */}
        <section className="col-span-12 lg:col-span-8 space-y-gutter">
          
          {/* Summary Card */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 md:p-8 custom-shadow border border-surface-variant/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                  <span className="material-symbols-outlined">article</span>
                  <span className="font-label-md font-semibold text-xs uppercase tracking-wider">Current Analysis</span>
                </div>
                <h3 className="font-headline-lg text-[22px] md:text-[26px] font-bold text-on-surface">{activeProject.name}</h3>
              </div>
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-variant flex items-center justify-center text-label-sm font-bold shadow-sm">JD</div>
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-primary-fixed flex items-center justify-center text-label-sm font-bold text-primary shadow-sm animate-pulse">AI</div>
              </div>
            </div>
            
            <p className="text-body-md text-on-surface-variant mb-8 leading-relaxed">
              {activeProject.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-4 py-2 bg-surface-container-highest rounded-full text-label-md font-medium text-on-surface-variant flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span> Java 17
              </span>
              <span className="px-4 py-2 bg-surface-container-highest rounded-full text-label-md font-medium text-on-surface-variant flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> Spring Boot
              </span>
              <span className="px-4 py-2 bg-surface-container-highest rounded-full text-label-md font-medium text-on-surface-variant flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span> Kubernetes
              </span>
              <span className="px-4 py-2 bg-surface-container-highest rounded-full text-label-md font-medium text-on-surface-variant flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span> Apache Kafka
              </span>
              <span className="px-4 py-2 bg-surface-container-highest rounded-full text-label-md font-medium text-on-surface-variant flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary-container"></span> PostgreSQL
              </span>
            </div>

            {/* Architecture Overview Visualization Placeholder */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 pointer-events-none"></div>
              
              <div className="text-center z-10 px-8">
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <span className="material-symbols-outlined text-[64px] text-primary/30">schema</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>
                <h4 className="font-headline-md text-headline-md text-base font-bold mb-2">Generating Architectural Visualizer</h4>
                <p className="text-label-md text-on-surface-variant text-xs">Mapping service dependencies and data flow patterns...</p>
              </div>

              {/* Backdrop placeholder image */}
              <div className="absolute inset-0 -z-0 opacity-20">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBwmGbDF51fLDzm0COAj0zGZgOqWoYzxLqHhbmLkZapGYUTtRprIh_LRUnsq8H12PEmOBpXouaL58BO8VfcsTxy1Mk6-wbv1txp4aYZZ3c6wSyvi_YPVGJlDrLFokiLRSke5xMEdUf6dONja4sRB1NRXLwh56WmkaPwP7aguDjs-sUwngc-Z2gPGJk6vnQKwXy2XLJ1Gtybqk0-ONYVN9HfZJ-wh2psJR0LOSXXqtC4dE65bD7DcX32HA')" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="space-y-4">
            <h4 className="font-headline-md px-2 font-bold text-[18px]">Predictive Interview Questions</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              {questions.map((q) => (
                <div 
                  key={q.id}
                  onClick={() => alert(`Reviewing model answer for: ${q.question}`)}
                  className={`bg-surface-container-lowest p-6 rounded-[24px] border border-surface-variant/30 custom-shadow flex flex-col justify-between group transition-all cursor-pointer ${q.hoverClass}`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-label-sm font-bold text-xs ${q.bgClass}`}>{q.type}</span>
                      <span className="material-symbols-outlined text-surface-variant group-hover:text-white/50">more_horiz</span>
                    </div>
                    <p className="font-body-md font-semibold leading-snug">{q.question}</p>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-label-sm font-bold text-xs">View Model Answer</span>
                    <span className="material-symbols-outlined text-body-md">arrow_forward</span>
                  </div>
                </div>
              ))}
              
              {/* Add Custom Question Button */}
              <div 
                onClick={handleAddQuestion}
                className="border-2 border-dashed border-outline-variant p-6 rounded-[24px] flex flex-col items-center justify-center text-on-surface-variant hover:border-primary/50 hover:bg-primary-fixed/20 transition-all cursor-pointer group min-h-[170px]"
              >
                <span className="material-symbols-outlined text-[32px] mb-2 group-hover:scale-110 transition-transform">add_circle</span>
                <span className="text-label-md font-bold text-sm">Add Custom Question</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
