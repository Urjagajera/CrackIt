import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockProjectIntel } from '../utils/mockData';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../lib/api';

interface QuestionItem {
  id: number | string;
  type: string;
  bgClass: string;
  hoverClass: string;
  question: string;
  model_answer?: string;
}

export default function ProjectIntel() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [projects, setProjects] = useState<any[]>(mockProjectIntel);
  const [activeProject, setActiveProject] = useState<any>(mockProjectIntel[0]);
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: 1,
      type: 'System Design',
      bgClass: 'bg-primary-fixed text-primary group-hover:bg-white/20 group-hover:text-white',
      hoverClass: 'hover:bg-primary-container hover:text-on-primary-container',
      question:
        'How did you handle eventual consistency between your microservices when using Kafka for transaction events?',
    },
    {
      id: 2,
      type: 'Scalability',
      bgClass: 'bg-secondary-fixed text-secondary group-hover:bg-white/20 group-hover:text-white',
      hoverClass: 'hover:bg-secondary-container hover:text-on-secondary-container',
      question: 'Why did you choose Redis for caching instead of a simple local memory cache like Caffeine?',
    },
    {
      id: 3,
      type: 'Resilience',
      bgClass: 'bg-tertiary-fixed text-tertiary group-hover:bg-white/20 group-hover:text-white',
      hoverClass: 'hover:bg-tertiary-container hover:text-on-tertiary-container',
      question: 'Explain your disaster recovery strategy for the PostgreSQL database in the event of a region failure.',
    },
  ]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{ entity: number; arch: number }>({ entity: 85, arch: 42 });

  const fetchProjects = async () => {
    try {
      const data = await apiFetch<{ projects: any[] }>('/projects');
      if (data.projects && data.projects.length > 0) {
        const mapped = data.projects.map((p) => ({
          id: p.id,
          name: p.title || 'Untitled Project',
          description: p.description || 'Custom portfolio project.',
          tech_stack: p.tech_stack || ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL'],
        }));
        setProjects(mapped);
        setActiveProject(mapped[0]);
        // Trigger initial AI analysis for active project
        analyzeProject(mapped[0].id);
      }
    } catch {
      // Use fallback mock data
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const analyzeProject = async (projId: string) => {
    try {
      const data = await apiFetch<{ message: string; analysis: any }>(`/projects/${projId}/analyze`, {
        method: 'POST',
      });
      if (data.analysis?.suggested_talking_points) {
        const points = data.analysis.suggested_talking_points.map((tp: any, index: number) => ({
          id: tp.id || index + 1,
          type: tp.type || 'System Design',
          bgClass: 'bg-primary-fixed text-primary group-hover:bg-white/20 group-hover:text-white',
          hoverClass: 'hover:bg-primary-container hover:text-on-primary-container',
          question: tp.question,
          model_answer: tp.model_answer,
        }));
        setQuestions(points);
      }
    } catch {
      // Keep existing questions on fallback
    }
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress({ entity: 0, arch: 0 });

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev.entity < 85) {
            return { entity: prev.entity + 17, arch: prev.arch + 8 };
          } else if (prev.arch < 42) {
            return { entity: 85, arch: prev.arch + 7 };
          } else {
            clearInterval(interval);
            return { entity: 85, arch: 42 };
          }
        });
      }, 300);

      try {
        const titleName = file.name.replace(/\.[^/.]+$/, '');
        const newProjData = await apiFetch<{ message: string; project: any }>('/projects', {
          method: 'POST',
          body: JSON.stringify({
            title: titleName,
            description: `Project documentation imported from ${file.name}. High availability microservice architecture.`,
            tech_stack: ['Java 17', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Kubernetes'],
          }),
        });

        const created = newProjData.project;
        if (created) {
          const mapped = {
            id: created.id,
            name: created.title,
            description: created.description,
            tech_stack: created.tech_stack || ['Java 17', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Kubernetes'],
          };
          setProjects((prev) => [mapped, ...prev]);
          setActiveProject(mapped);
          await analyzeProject(created.id);
        }
        showToast('Project document uploaded and analyzed! Generated AI predictive questions.', 'success');
      } catch (err: any) {
        showToast(err.message || 'Failed to analyze project document.', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddQuestion = () => {
    const customQ = prompt('Enter your custom question related to this project architecture:');
    if (customQ) {
      setQuestions((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'Custom',
          bgClass: 'bg-primary-fixed text-primary group-hover:bg-white/20 group-hover:text-white',
          hoverClass: 'hover:bg-primary-container hover:text-on-primary-container',
          question: `"${customQ}"`,
          model_answer: 'Focus on explaining trade-offs, architecture decisions, and metrics.',
        },
      ]);
      showToast('Custom project question added.', 'info');
    }
  };

  const techStackList: string[] = activeProject?.tech_stack || [
    'Java 17',
    'Spring Boot',
    'Kubernetes',
    'Apache Kafka',
    'PostgreSQL',
  ];

  return (
    <div className="px-margin-mobile md:px-margin-desktop pb-margin-mobile md:pb-margin-desktop min-h-screen text-left bg-background selection:bg-primary-fixed">
      {/* Header Section */}
      <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Project Intelligence</h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            Upload your project documentation or presentation to extract architectural insights and generate tailored
            interview questions.
          </p>
        </div>
        <button
          onClick={() => showToast(`Loaded ${projects.length} project(s) in system.`, 'info')}
          className="flex items-center gap-2 px-6 py-3 border border-outline-variant rounded-full text-on-surface font-label-md hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
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
          <div className="bg-surface-container-lowest rounded-[24px] p-8 custom-shadow border border-surface-variant/30 flex flex-col items-center justify-center text-center group border-dashed border-2 hover:border-primary/50 transition-all min-h-[300px]">
            <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-[32px]">
                {isUploading ? 'sync' : 'cloud_upload'}
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-2">
              {isUploading ? 'Analyzing Document...' : 'Upload Project'}
            </h3>
            <p className="text-body-md text-on-surface-variant mb-6 px-4">
              PDF, PPTX, or DOCX supported. Max file size 25MB.
            </p>
            <input className="hidden" id="project-upload" type="file" onChange={handleUpload} disabled={isUploading} />
            <label
              className={`bg-primary text-on-primary px-8 py-3 rounded-full font-bold cursor-pointer hover:shadow-lg transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              htmlFor="project-upload"
            >
              {isUploading ? 'Uploading...' : 'Select File'}
            </label>
          </div>

          {/* Analysis Status Card */}
          <div className="bg-surface-container-high/50 rounded-[24px] p-6 custom-shadow border border-surface-variant/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-label-md text-on-surface-variant uppercase tracking-wider text-xs font-semibold">
                Analysis Engine
              </span>
              <span
                className={`px-3 py-1 rounded-full text-label-sm font-bold ${
                  isUploading
                    ? 'bg-secondary-fixed text-on-secondary-fixed animate-pulse'
                    : 'bg-tertiary-fixed text-on-tertiary-fixed'
                }`}
              >
                {isUploading ? 'Running AI' : 'AI Verified'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-label-sm">
                  <span>Entity Extraction</span>
                  <span className="font-bold">{uploadProgress.entity}%</span>
                </div>
                <div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.entity}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-label-sm">
                  <span>Architecture Mapping</span>
                  <span className="font-bold">{uploadProgress.arch}%</span>
                </div>
                <div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.arch}%` }}
                  ></div>
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
                  <span className="font-label-md font-semibold text-xs uppercase tracking-wider">
                    Current Analysis
                  </span>
                </div>
                <h3 className="font-headline-lg text-[22px] md:text-[26px] font-bold text-on-surface">
                  {activeProject?.name || activeProject?.title}
                </h3>
              </div>
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-variant flex items-center justify-center text-label-sm font-bold shadow-sm">
                  JD
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-primary-fixed flex items-center justify-center text-label-sm font-bold text-primary shadow-sm animate-pulse">
                  AI
                </div>
              </div>
            </div>

            <p className="text-body-md text-on-surface-variant mb-8 leading-relaxed">
              {activeProject?.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {techStackList.map((tech: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-surface-container-highest rounded-full text-label-md font-medium text-on-surface-variant flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-primary"></span> {tech}
                </span>
              ))}
            </div>

            {/* Architecture Overview Visualization Placeholder */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant flex items-center justify-center">
              <div className="text-center z-10 px-8">
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <span className="material-symbols-outlined text-[64px] text-primary/30">schema</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>
                <h4 className="font-headline-md text-headline-md text-base font-bold mb-2">
                  Architectural Insights &amp; Service Mapping
                </h4>
                <p className="text-label-md text-on-surface-variant text-xs">
                  Event-driven partition strategy with Redis write-through caching.
                </p>
              </div>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="space-y-4">
            <h4 className="font-headline-md px-2 font-bold text-[18px]">Predictive Interview Questions</h4>

            <div className="grid md:grid-cols-2 gap-4">
              {questions.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() =>
                    showToast(
                      `Model Answer: ${q.model_answer || 'Focus on trade-offs and architectural decisions.'}`,
                      'info'
                    )
                  }
                  className={`bg-surface-container-lowest p-6 rounded-[24px] border border-surface-variant/30 custom-shadow flex flex-col justify-between group transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary ${q.hoverClass}`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-label-sm font-bold text-xs ${q.bgClass}`}>
                        {q.type}
                      </span>
                      <span className="material-symbols-outlined text-surface-variant group-hover:text-white/50">
                        more_horiz
                      </span>
                    </div>
                    <p className="font-body-md font-semibold leading-snug">{q.question}</p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-label-sm font-bold text-xs">View Model Answer</span>
                    <span className="material-symbols-outlined text-body-md">arrow_forward</span>
                  </div>
                </button>
              ))}

              {/* Add Custom Question Button */}
              <button
                type="button"
                onClick={handleAddQuestion}
                className="border-2 border-dashed border-outline-variant p-6 rounded-[24px] flex flex-col items-center justify-center text-on-surface-variant hover:border-primary/50 hover:bg-primary-fixed/20 transition-all cursor-pointer group min-h-[170px] focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span className="material-symbols-outlined text-[32px] mb-2 group-hover:scale-110 transition-transform">
                  add_circle
                </span>
                <span className="text-label-md font-bold text-sm">Add Custom Question</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
