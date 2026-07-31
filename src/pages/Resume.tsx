import React, { useState, useEffect, DragEvent, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUserProfile, mockResumes } from '../utils/mockData';
import { useToast } from '../context/ToastContext';
import { apiFetch, apiUpload } from '../lib/api';

export default function Resume() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [resumes, setResumes] = useState<any[]>([]);
  const [activeResume, setActiveResume] = useState<any>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const mapApiResume = (res: any) => {
    const parsed = res.parsed_json || {};
    return {
      id: res.id,
      name: res.original_filename || 'Uploaded_Resume.pdf',
      date: res.uploaded_at ? new Date(res.uploaded_at).toLocaleDateString() : 'Recent',
      matchScore: parsed.ats_match_score || 84,
      size: '2.1 MB',
      status: res.status || 'parsed',
      parsedJson: parsed,
    };
  };

  const fetchResumes = async () => {
    try {
      const data = await apiFetch<{ resumes: any[] }>('/resume');
      if (data.resumes && data.resumes.length > 0) {
        const mapped = data.resumes.map(mapApiResume);
        setResumes(mapped);
        setActiveResume((prev: any) => {
          if (!prev) return mapped[0];
          const found = mapped.find((r) => r.id === prev.id);
          return found || mapped[0];
        });
      } else {
        setResumes(mockResumes);
        setActiveResume(mockResumes[0]);
      }
    } catch {
      setResumes(mockResumes);
      setActiveResume(mockResumes[0]);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

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
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    showToast(`Uploading file "${file.name}"...`, 'info');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await apiUpload<{ message: string; resume: any }>('/resume/upload', formData);
      showToast(`Resume "${file.name}" uploaded successfully! AI parsing started.`, 'success');
      await fetchResumes();
      if (result.resume) {
        setActiveResume(mapApiResume(result.resume));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to upload resume file.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteResume = async (id: string | number, name: string) => {
    try {
      await apiFetch(`/resume/${id}`, { method: 'DELETE' });
      showToast(`Resume "${name}" deleted.`, 'info');
      const updated = resumes.filter((r) => r.id !== id);
      setResumes(updated);
      if (activeResume?.id === id) {
        setActiveResume(updated[0] || null);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete resume.', 'error');
    }
  };

  const activeParsed = activeResume?.parsedJson || {};
  const missingKeywords: string[] = activeParsed.missing_keywords || ['Distributed Systems', 'Kafka', 'System Design'];
  const improvements: string[] = activeParsed.improvements || [
    'Quantify bullet impacts (e.g. increase performance by X%)',
    'Reduce short-duration internship bullet layout clutter',
  ];
  const currentMatchScore = activeResume?.matchScore || 84;

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
                <span className="material-symbols-outlined text-3xl">
                  {isUploading ? 'sync' : 'cloud_upload'}
                </span>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">
                {isUploading ? 'Uploading & Analyzing...' : 'Upload Your Latest Resume'}
              </h3>
              <p className="text-body-md text-on-surface-variant mb-6 text-sm">
                Drag and drop your PDF or DOCX file here, or click browse to choose from your computer.
              </p>

              <input
                type="file"
                id="resume-file-input"
                className="hidden"
                accept=".pdf,.docx,.doc"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <label
                htmlFor="resume-file-input"
                className={`px-8 py-3.5 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? 'Uploading...' : 'Browse Files'}
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
                    activeResume?.id === res.id
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
                      <p className="text-label-sm text-on-surface-variant">
                        Updated {res.date} • {res.matchScore}% Match ({res.size}) {res.status ? `[${res.status}]` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        showToast(`Selected resume: ${res.name}`, 'info');
                      }}
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-primary rounded"
                      aria-label={`Inspect ${res.name}`}
                    >
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                    <button
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        handleDeleteResume(res.id, res.name);
                      }}
                      className="p-2 text-on-surface-variant hover:text-error transition-colors flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-error rounded"
                      aria-label={`Delete ${res.name}`}
                    >
                      <span className="material-symbols-outlined">delete</span>
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
                <span className="text-headline-md font-bold text-primary">{currentMatchScore}</span>
              </div>
              <div className="h-3 w-full bg-primary/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${currentMatchScore}%` }}
                ></div>
              </div>
              <p className="text-label-sm text-on-surface-variant mt-2">Top 15% of candidates for this role</p>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="font-label-md text-secondary font-bold">ATS Compatibility</p>
                <span className="text-headline-md font-bold text-secondary">
                  {mockUserProfile.stats.atsCompatibility}%
                </span>
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
              <span>Smart Fixes &amp; AI Analysis</span>
            </h3>

            <div className="space-y-6">
              {/* Summary */}
              {activeParsed.summary && (
                <div>
                  <p className="font-label-md text-on-surface-variant mb-2 uppercase tracking-wider text-xs font-semibold">
                    AI Summary
                  </p>
                  <p className="text-xs text-on-surface bg-surface-container p-3 rounded-xl">
                    {activeParsed.summary}
                  </p>
                </div>
              )}

              {/* Missing Keywords */}
              <div>
                <p className="font-label-md text-on-surface-variant mb-3 uppercase tracking-wider text-xs font-semibold">
                  Missing Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((kw: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-error-container text-on-error-container rounded-full text-label-sm font-medium border border-error/10 text-xs"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Improvement Areas */}
              <div>
                <p className="font-label-md text-on-surface-variant mb-3 uppercase tracking-wider text-xs font-semibold">
                  Improvement Areas
                </p>
                <ul className="space-y-3">
                  {improvements.map((imp: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-error text-[18px] mt-0.5">cancel</span>
                      <span>{imp}</span>
                    </li>
                  ))}
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
