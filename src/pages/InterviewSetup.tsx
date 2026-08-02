import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPersonas, mockRecommendedTopics } from '../utils/mockData';
import { useToast } from '../context/ToastContext';
import { trimInput, isNonEmptyString } from '../lib/sanitize';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedPersona, setSelectedPersona] = useState<string>(mockPersonas[0].id);
  const [interviewType, setInterviewType] = useState<string>('Technical');
  const [difficulty, setDifficulty] = useState<string>('Mid/Senior');
  const [numQuestions] = useState<string>('10 Questions');
  const [language] = useState<string>('English (US)');
  const [topics, setTopics] = useState<string[]>(['React.js', 'System Design']);
  const [newTopic, setNewTopic] = useState<string>('');
  const [isAddingTopic, setIsAddingTopic] = useState<boolean>(false);

  // Toggle settings
  const [voiceAudio, setVoiceAudio] = useState<boolean>(true);
  const [realtimeTranscripts, setRealtimeTranscripts] = useState<boolean>(true);

  const handleAddTopicSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanTopic = trimInput(newTopic);
    if (isNonEmptyString(cleanTopic) && !topics.includes(cleanTopic)) {
      setTopics(prev => [...prev, cleanTopic]);
      setNewTopic('');
      setIsAddingTopic(false);
      showToast(`Topic "${cleanTopic}" added to session.`, 'info');
    }
  };

  const handleStartInterview = () => {
    sessionStorage.setItem('interview_persona', selectedPersona);
    sessionStorage.setItem('interview_type', interviewType);
    sessionStorage.setItem('interview_difficulty', difficulty);
    sessionStorage.setItem('interview_questions', numQuestions);
    sessionStorage.setItem('interview_language', language);
    sessionStorage.setItem('interview_topics', JSON.stringify(topics));
    
    showToast('Interview session configured. Launching session...', 'success');
    navigate('/interview');
  };

  return (
    <div className="px-margin-mobile md:px-margin-desktop pb-margin-mobile md:pb-margin-desktop min-h-screen text-left bg-background selection:bg-primary-fixed">
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
                          loading="lazy"
                          decoding="async"
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=60'; }}
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

          {/* Recommended Core Topics Card */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 md:p-8 custom-shadow border border-surface-variant/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                <h3 className="font-headline-md font-bold text-[18px] text-on-surface">Recommended CrackIt Practice Topics</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {mockRecommendedTopics.map((topic) => (
                <div key={topic.id} className="p-3 bg-primary-fixed/15 rounded-xl border border-primary-fixed/30 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{topic.badge}</span>
                  <h5 className="font-bold text-xs text-on-surface mt-0.5">{topic.title}</h5>
                  <p className="text-[10px] text-on-surface-variant mt-1">{topic.category} • {topic.estimatedMinutes}m</p>
                </div>
              ))}
            </div>
          </div>

          {/* Target Topics & Focus Areas */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 md:p-8 custom-shadow border border-surface-variant/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md flex items-center gap-2 font-bold text-[20px]">
                <span className="material-symbols-outlined text-secondary">label</span>
                <span>Focus Topics</span>
              </h3>
              
              {!isAddingTopic ? (
                <button 
                  onClick={() => setIsAddingTopic(true)}
                  className="px-4 py-2 bg-secondary/10 text-secondary font-label-sm rounded-full hover:bg-secondary/20 transition-colors text-xs font-semibold flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Add Topic</span>
                </button>
              ) : (
                <form onSubmit={handleAddTopicSubmit} className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    placeholder="Topic name..."
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="bg-surface border border-surface-variant rounded-xl px-3 py-1.5 text-xs outline-none focus:border-secondary"
                    autoFocus
                  />
                  <button type="submit" className="text-secondary font-bold text-xs">Add</button>
                  <button type="button" onClick={() => setIsAddingTopic(false)} className="text-on-surface-variant text-xs">Cancel</button>
                </form>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <span key={t} className="px-4 py-2 bg-surface-container-high rounded-full font-label-md text-xs text-on-surface flex items-center gap-2 border border-surface-variant/40">
                  {t}
                  <button 
                    onClick={() => setTopics(topics.filter(item => item !== t))}
                    className="material-symbols-outlined text-[14px] hover:text-error cursor-pointer focus:outline-none focus:ring-1 focus:ring-error rounded"
                    aria-label={`Remove topic ${t}`}
                  >
                    close
                  </button>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Controls (4 Columns) */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-[24px] p-6 md:p-8 custom-shadow border border-surface-variant/30 space-y-6">
            <h3 className="font-headline-md text-headline-md flex items-center gap-2 font-bold text-[20px]">
              <span className="material-symbols-outlined text-tertiary">tune</span>
              <span>Session Rules</span>
            </h3>

            {/* Difficulty Level */}
            <div className="space-y-2">
              <label className="font-label-sm text-on-surface-variant px-1">Seniority & Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {['Junior', 'Mid/Senior', 'Staff'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`py-2.5 rounded-xl font-label-sm text-xs font-bold border transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                      difficulty === level
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface text-on-surface-variant border-surface-variant/50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Type */}
            <div className="space-y-2">
              <label className="font-label-sm text-on-surface-variant px-1">Interview Format</label>
              <select 
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full bg-surface border border-surface-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option>Technical Deep-Dive</option>
                <option>Behavioral & Culture Fit</option>
                <option>System Design Architecture</option>
                <option>Project Intel Q&A</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-2 border-t border-surface-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-sm">Voice AI Audio</span>
                <input 
                  type="checkbox" 
                  checked={voiceAudio} 
                  onChange={(e) => setVoiceAudio(e.target.checked)}
                  className="w-5 h-5 rounded text-primary focus:ring-primary/20 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-label-md text-sm">Real-time Transcripts</span>
                <input 
                  type="checkbox" 
                  checked={realtimeTranscripts} 
                  onChange={(e) => setRealtimeTranscripts(e.target.checked)}
                  className="w-5 h-5 rounded text-primary focus:ring-primary/20 cursor-pointer"
                />
              </div>
            </div>

            {/* Start Button */}
            <button 
              onClick={handleStartInterview}
              className="w-full py-4 bg-primary hover:opacity-95 text-on-primary font-headline-md text-headline-md rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-6 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span>Begin Practice Session</span>
              <span className="material-symbols-outlined">play_arrow</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
