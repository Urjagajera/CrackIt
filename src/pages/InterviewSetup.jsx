import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPersonas } from '../utils/mockData';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [selectedPersona, setSelectedPersona] = useState(mockPersonas[0].id);
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Mid/Senior');
  const [numQuestions, setNumQuestions] = useState('10 Questions');
  const [language, setLanguage] = useState('English (US)');
  const [topics, setTopics] = useState(['React.js', 'System Design']);
  const [newTopic, setNewTopic] = useState('');
  const [isAddingTopic, setIsAddingTopic] = useState(false);

  // Toggle settings
  const [voiceAudio, setVoiceAudio] = useState(true);
  const [cameraPreview, setCameraPreview] = useState(false);
  const [realtimeTranscripts, setRealtimeTranscripts] = useState(true);

  const handleAddTopicSubmit = (e) => {
    e.preventDefault();
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic('');
      setIsAddingTopic(false);
    }
  };

  const handleStartInterview = () => {
    // Store configurations in sessionStorage to simulate transfer of parameters
    sessionStorage.setItem('interview_persona', selectedPersona);
    sessionStorage.setItem('interview_type', interviewType);
    sessionStorage.setItem('interview_difficulty', difficulty);
    sessionStorage.setItem('interview_questions', numQuestions);
    sessionStorage.setItem('interview_language', language);
    sessionStorage.setItem('interview_topics', JSON.stringify(topics));
    
    navigate('/interview');
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop min-h-screen text-left bg-background selection:bg-primary-fixed">
      {/* Header Section */}
      <header className="mb-10">
        <h2 className="font-headline-xl text-headline-xl text-primary mb-2 font-extrabold text-[28px] md:text-[36px]">Configure Interview</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Tailor your practice session to your specific role and anxiety level. Our AI mentor adjusts its personality based on your selection.
        </p>
      </header>

      {/* Configuration Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Interview Persona Selection (8 Columns) */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest rounded-[24px] p-6 md:p-8 custom-shadow border border-surface-variant/30">
            <h3 className="font-headline-md text-headline-md mb-6 flex items-center gap-2 font-bold text-[20px]">
              <span className="material-symbols-outlined text-primary">person_search</span>
              <span>Select Your Interviewer</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockPersonas.map((persona) => (
                <div key={persona.id} className="relative group">
                  <input 
                    type="radio" 
                    id={persona.id} 
                    name="persona" 
                    className="hidden"
                    checked={selectedPersona === persona.id}
                    onChange={() => setSelectedPersona(persona.id)}
                  />
                  <label 
                    htmlFor={persona.id}
                    className={`block p-6 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${
                      selectedPersona === persona.id 
                        ? 'border-primary bg-primary-fixed/10' 
                        : 'border-surface-variant bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-high border border-surface-variant shadow-sm">
                        <img 
                          className="w-full h-full object-cover" 
                          alt={persona.name} 
                          src={persona.avatar}
                        />
                      </div>
                      <div>
                        <h4 className="font-headline-md text-[18px] font-bold text-on-surface leading-tight">{persona.name}</h4>
                        <p className="text-label-sm text-on-surface-variant">{persona.role}</p>
                      </div>
                    </div>
                    <p className="text-body-md text-on-surface-variant leading-relaxed text-sm">{persona.description}</p>
                  </label>
                  
                  {selectedPersona === persona.id && (
                    <span className="material-symbols-outlined absolute top-4 right-4 text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Parameters Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type & Difficulty */}
            <div className="bg-surface-container-lowest rounded-[24px] p-6 md:p-8 custom-shadow border border-surface-variant/30">
              <h3 className="font-headline-md text-[20px] font-bold mb-6">Type &amp; Difficulty</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="font-label-md text-on-surface-variant block mb-2 uppercase tracking-wider text-xs font-semibold">Interview Type</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container rounded-xl">
                    {['Technical', 'HR/Behavioral'].map(type => (
                      <button
                        key={type}
                        onClick={() => setInterviewType(type)}
                        className={`py-2 px-4 rounded-lg font-bold transition-all text-sm ${
                          interviewType === type 
                            ? 'bg-surface text-primary shadow-sm' 
                            : 'text-on-surface-variant hover:bg-surface/50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="font-label-md text-on-surface-variant block mb-2 uppercase tracking-wider text-xs font-semibold">Difficulty Level</label>
                  <div className="flex gap-2">
                    {['Junior', 'Mid/Senior', 'Lead/Staff'].map(diff => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        className={`flex-grow py-2 rounded-lg border text-xs font-bold transition-all ${
                          difficulty === diff 
                            ? 'bg-primary text-on-primary border-primary' 
                            : 'bg-surface border-surface-variant hover:border-primary text-on-surface-variant'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Scope & Language */}
            <div className="bg-surface-container-lowest rounded-[24px] p-6 md:p-8 custom-shadow border border-surface-variant/30">
              <h3 className="font-headline-md text-[20px] font-bold mb-6">Scope &amp; Language</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="font-label-md text-on-surface-variant block mb-2 uppercase tracking-wider text-xs font-semibold">Questions</label>
                    <select 
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(e.target.value)}
                      className="w-full bg-surface-container border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm cursor-pointer"
                    >
                      <option>5 Questions</option>
                      <option>10 Questions</option>
                      <option>15 Questions</option>
                      <option>Unlimited</option>
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="font-label-md text-on-surface-variant block mb-2 uppercase tracking-wider text-xs font-semibold">Language</label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-surface-container border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm cursor-pointer"
                    >
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Spanish</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-2">
                  <label className="font-label-md text-on-surface-variant block mb-2 uppercase tracking-wider text-xs font-semibold flex justify-between items-center">
                    <span>Topic Tags</span>
                    {!isAddingTopic ? (
                      <span 
                        onClick={() => setIsAddingTopic(true)}
                        className="text-primary font-bold cursor-pointer normal-case tracking-normal hover:underline"
                      >
                        + Add Topic
                      </span>
                    ) : (
                      <form onSubmit={handleAddTopicSubmit} className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Topic..." 
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          className="px-2 py-0.5 text-xs border rounded outline-none"
                          autoFocus
                        />
                        <button type="submit" className="text-primary font-bold text-xs">Add</button>
                      </form>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {topics.map(t => (
                      <span 
                        key={t} 
                        className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-semibold text-xs flex items-center gap-1.5"
                      >
                        {t}
                        <span 
                          onClick={() => setTopics(topics.filter(top => top !== t))}
                          className="material-symbols-outlined text-[14px] cursor-pointer hover:text-error"
                        >
                          close
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preview & Controls Panel (4 Columns) */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          {/* Preview Panel */}
          <div className="bg-primary rounded-[24px] p-6 md:p-8 text-on-primary custom-shadow relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container rounded-full opacity-50 blur-2xl"></div>
            <h3 className="font-headline-md text-headline-md text-white mb-6 relative z-10 font-bold text-[20px]">Interview Preview</h3>
            
            <div className="space-y-6 relative z-10 text-white">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                <p className="text-[10px] opacity-80 mb-1 font-bold uppercase tracking-wider">SELECTED FOCUS</p>
                <p className="font-bold text-sm leading-snug">
                  {interviewType === 'Technical' 
                    ? 'Scalable Architecture & Front-end State Management' 
                    : 'Behavioral & Core Competencies fit'
                  }
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-label-md text-sm">
                  <span>Voice &amp; Audio</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={voiceAudio} 
                      onChange={(e) => setVoiceAudio(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-primary-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-container"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center text-label-md text-sm">
                  <span>Camera Preview</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cameraPreview} 
                      onChange={(e) => setCameraPreview(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-primary-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-container"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center text-label-md text-sm">
                  <span>Real-time Transcripts</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={realtimeTranscripts} 
                      onChange={(e) => setRealtimeTranscripts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-primary-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-container"></div>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <span className="material-symbols-outlined text-white">avg_time</span>
                  </div>
                  <div>
                    <p className="text-[10px] opacity-80 uppercase tracking-wider">ESTIMATED DURATION</p>
                    <p className="font-bold text-sm">25 - 35 Minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-surface-container-lowest rounded-[24px] p-8 custom-shadow border border-surface-variant/30 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-secondary-fixed rounded-full flex items-center justify-center mb-6 animate-pulse text-on-secondary-fixed">
              <span className="material-symbols-outlined text-4xl">rocket_launch</span>
            </div>
            <h4 className="font-headline-md text-[20px] font-bold mb-2">Ready to CrackIt?</h4>
            <p className="text-on-surface-variant mb-8 text-body-md text-sm">Take a deep breath. You've got this.</p>
            <button 
              onClick={handleStartInterview}
              className="w-full bg-secondary text-on-secondary font-bold py-5 rounded-full text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-secondary/30"
            >
              <span>Start Interview</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <p className="mt-4 text-label-sm text-on-surface-variant flex items-center gap-1 text-xs">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Your session is private &amp; secure</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
