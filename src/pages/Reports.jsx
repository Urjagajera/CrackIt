import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockInterviews, mockResumes } from '../utils/mockData';

export default function Reports() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [interviews, setInterviews] = useState(mockInterviews);
  const [resumes, setResumes] = useState(mockResumes);

  const filteredInterviews = interviews.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResumes = resumes.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteInterview = (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this report?")) {
      setInterviews(interviews.filter(item => item.id !== id));
    }
  };

  const handleDeleteResume = (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this resume analysis?")) {
      setResumes(resumes.filter(item => item.id !== id));
    }
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop min-h-screen text-left bg-background selection:bg-primary-fixed">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-gutter mb-12">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-2 font-bold text-[28px]">Performance Reports</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Deep-dive insights from your AI-led mock sessions, resume audits, and job description alignments.
          </p>
        </div>
        
        <div className="flex items-center gap-base mt-4 md:mt-0">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">search</span>
            <input 
              className="bg-surface-container-lowest border border-outline-variant/30 rounded-full pl-12 pr-6 py-3 w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm" 
              placeholder="Search reports..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => alert("Simulation: Filters list toggled.")}
            className="bg-surface-container text-on-surface px-6 py-3 rounded-full font-label-md text-xs font-semibold flex items-center gap-2 hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            <span>Filter</span>
          </button>
        </div>
      </header>

      {/* Reports Content */}
      <div className="space-y-12">
        
        {/* Section: Interview Reports */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3 font-bold text-[20px]">
              <span className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">mic_external_on</span>
              </span>
              <span>Interview Sessions</span>
            </h3>
            <button onClick={() => alert("Viewing all mock interviews")} className="text-primary font-label-md font-semibold hover:underline text-sm">View all</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {filteredInterviews.length > 0 ? (
              <>
                {/* Featured Card (Left side, takes 8 columns if multiple, or full) */}
                <div className="md:col-span-8 report-card bg-surface-container-lowest p-6 rounded-[24px] border border-outline-variant/10 flex flex-col md:flex-row gap-6 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-label-sm rounded-full text-[10px] font-bold uppercase tracking-wider">Most Recent</span>
                  </div>
                  
                  <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden shrink-0 border border-surface-variant/30 bg-surface-container">
                    <img 
                      className="w-full h-full object-cover" 
                      alt="Interviewer avatar" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsZm5BVBqWWwCTgYCIL7fGUKE7PAtyju-f3VZTT5i1RfT5jNCIW84Yu7zecCRI9RUkxAw5ZtYDSg9Pe61xVRXHDTbnAgk1Bxk1GLHk3_lwLQPuu2LWmPsJwCW1N5ZR1DS_bouAaRWM4pxqRQMpmxQBldvcGX3YCQKIB6QSoP2YE7sOf2ZGgecGA15SvkM5GERr2KIXgqb6pZMo1pP8c1ZqEpQsaCIVLHxTn93ftF3SroXLh3j1giNnJg"
                    />
                  </div>
                  
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-headline-md text-[20px] font-bold text-on-surface mb-1">{filteredInterviews[0].title}</h4>
                      <p className="text-on-surface-variant font-label-sm text-xs font-semibold mb-4">
                        {filteredInterviews[0].company} • {filteredInterviews[0].date} • {filteredInterviews[0].duration}
                      </p>
                      
                      <div className="flex gap-4 mb-6">
                        <div className="flex flex-col">
                          <span className="text-label-sm text-on-surface-variant opacity-60 text-xs">Score</span>
                          <span className="text-headline-md text-primary font-bold text-[20px]">{filteredInterviews[0].score}/100</span>
                        </div>
                        <div className="w-px h-10 bg-outline-variant self-center"></div>
                        <div className="flex flex-col">
                          <span className="text-label-sm text-on-surface-variant opacity-60 text-xs">Confidence</span>
                          <span className="text-headline-md text-tertiary font-bold text-[20px]">High</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => navigate(`/interview-replay/${filteredInterviews[0].id}`)}
                        className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md text-xs font-semibold hover:opacity-90 active:scale-95 transition-all"
                      >
                        Review Feedback
                      </button>
                      <button 
                        onClick={() => alert("Downloading PDF...")}
                        className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[20px]">download</span>
                      </button>
                      <button 
                        onClick={(e) => handleDeleteInterview(filteredInterviews[0].id, e)}
                        className="p-2 text-on-surface-variant hover:text-error transition-colors flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Secondary Cards (Right side, taking remaining 4 columns) */}
                <div className="md:col-span-4 flex flex-col gap-gutter">
                  {filteredInterviews.slice(1).map((interview) => (
                    <div 
                      key={interview.id}
                      onClick={() => navigate(`/interview-replay/${interview.id}`)}
                      className="report-card bg-surface-container-lowest p-6 rounded-[24px] border border-outline-variant/10 flex flex-col justify-between h-48 shadow-sm cursor-pointer hover:border-primary/20 transition-all text-left"
                    >
                      <div className="mb-4">
                        <span className="text-on-surface-variant font-label-sm text-xs font-semibold">{interview.date}</span>
                        <h4 className="font-headline-md text-base font-bold text-on-surface mt-1">{interview.title}</h4>
                        <p className="text-on-surface-variant font-body-md text-xs">{interview.company} • {interview.duration}</p>
                      </div>
                      
                      <div>
                        <div className="w-full bg-primary-fixed/30 h-2 rounded-full mb-3">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${interview.score}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-on-surface">{interview.score}% Overall Match</span>
                          <span className="text-primary material-symbols-outlined text-[18px]">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="col-span-12 text-on-surface-variant p-6 text-center italic">No interview reports matching your query.</p>
            )}
          </div>
        </section>

        {/* Section: Resume & ATS Analysis */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3 font-bold text-[20px]">
              <span className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">description</span>
              </span>
              <span>Resume &amp; ATS Audit</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {filteredResumes.length > 0 ? (
              filteredResumes.map((res) => (
                <div 
                  key={res.id}
                  onClick={() => navigate('/resume')}
                  className="report-card bg-surface-container-lowest p-6 rounded-[24px] border border-outline-variant/10 flex flex-col h-64 shadow-sm cursor-pointer hover:border-primary/20 transition-all text-left"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-2 bg-surface-container rounded-lg text-primary material-symbols-outlined">article</span>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={() => alert(`Downloading resume: ${res.name}`)}
                        className="p-1 hover:text-primary transition-colors flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[20px]">download</span>
                      </button>
                      <button 
                        onClick={(e) => handleDeleteResume(res.id, e)}
                        className="p-1 hover:text-error transition-colors flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>
                  
                  <h5 className="font-label-md text-sm font-bold mb-1 leading-tight truncate">{res.name}</h5>
                  <p className="text-on-surface-variant text-label-sm text-xs font-semibold mb-auto">Analyzed {res.date}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${
                      res.matchScore >= 80 
                        ? 'bg-tertiary-container text-on-tertiary-container border-tertiary/10' 
                        : 'bg-error-container text-on-error-container border-error/10'
                    }`}>
                      {res.matchScore >= 80 ? 'ATS Optimized' : 'Needs Optimization'}
                    </span>
                    <span className="text-sm font-bold text-tertiary">{res.matchScore}/100</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-4 text-on-surface-variant p-6 text-center italic">No resume audits matching your query.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
