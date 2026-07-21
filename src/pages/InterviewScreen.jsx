import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InterviewScreen() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(892); // 14:52 in seconds
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(3); // Question 4 (0-indexed)
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [statusText, setStatusText] = useState("The AI Interviewer is speaking...");
  const [transcript, setTranscript] = useState([
    { sender: "CrackIt", text: "Welcome back. Let's dive deeper into your leadership experiences. We're on Question 4 now." },
    { sender: "CrackIt", text: "Could you describe a time you handled a conflict in your team? I'm interested in the resolution steps." }
  ]);
  const [userInput, setUserInput] = useState('');

  const questionsList = [
    "Tell me about yourself and your background.",
    "Why are you interested in joining our company?",
    "Describe a challenging technical problem you solved recently.",
    "Could you describe a time you handled a conflict in your team?",
    "How do you prioritize tasks when working on multiple projects with tight deadlines?",
    "Explain hexagonal architecture and why you would use it.",
    "What is your approach to handling database failure in production?",
    "Tell me about a time you had to deliver negative feedback to a peer.",
    "How do you stay up-to-date with emerging software technologies?",
    "Do you have any questions for me?"
  ];

  // Timer countdown logic
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          handleEndInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndInterview = () => {
    alert("Interview complete! Analysis reports are being generated.");
    navigate('/reports');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < questionsList.length - 1) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setStatusText("The AI Interviewer is speaking...");
      
      // Update transcript
      setTranscript(prev => [
        ...prev,
        { sender: "System", text: `Advancing to Question ${nextIdx + 1}.` },
        { sender: "CrackIt", text: questionsList[nextIdx] }
      ]);
    } else {
      handleEndInterview();
    }
  };

  const handleSimulateAnswer = () => {
    const answer = userInput.trim() || "In my last project, we had a disagreement regarding caching strategies. I scheduled a call, outlined the data loading stats, and we decided on Redis as a team, resolving the conflict through metrics.";
    
    setTranscript(prev => [
      ...prev,
      { sender: "You", text: answer }
    ]);
    setUserInput('');
    setStatusText("AI Mentor is analyzing response...");
    
    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-primary-fixed">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 mx-auto w-[95%] max-w-container-max mt-4 bg-surface/80 backdrop-blur-md rounded-full shadow-[0_10px_30px_rgba(65,81,187,0.08)] border border-surface-variant/30">
        <div className="flex items-center gap-4">
          <span onClick={() => navigate('/dashboard')} className="font-headline-md text-headline-md font-extrabold text-primary cursor-pointer">CrackIt</span>
          <div className="h-6 w-px bg-outline-variant hidden md:block"></div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full">
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span className="font-label-md text-label-md text-xs font-bold uppercase tracking-wider">Practice Round</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Time Remaining</span>
            <span className="font-headline-md text-headline-md text-primary font-bold text-lg" id="timer">
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="h-10 w-px bg-outline-variant"></div>
          <div className="flex flex-col items-start">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Progress</span>
            <span className="font-body-md text-body-md font-bold text-on-surface text-sm">
              Question {currentQuestionIdx + 1} of {questionsList.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-margin-desktop py-8 relative overflow-hidden text-left">
        {/* Background Ambient Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
        
        <div className="w-full max-w-4xl flex flex-col gap-8">
          {/* Question Card */}
          <section className="relative">
            <div className="bg-surface-container-lowest rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_rgba(65,81,187,0.06)] text-center relative z-10 overflow-hidden border border-surface-variant/30">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-secondary-container to-primary/20"></div>
              
              <span className="inline-block px-4 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-xs font-semibold mb-6">
                {statusText}
              </span>
              
              <h1 className="font-headline-lg text-[22px] md:text-[28px] font-bold text-on-surface leading-tight max-w-2xl mx-auto min-h-[80px] flex items-center justify-center">
                "{questionsList[currentQuestionIdx]}"
              </h1>
              
              {/* Waveform Visualizer */}
              <div className="mt-8 flex items-center justify-center gap-1.5 h-12">
                <div className={`waveform-bar w-1.5 bg-primary rounded-full h-3 ${!isPaused && !isMuted ? 'animate-[wave_1.2s_ease-in-out_infinite]' : ''}`} style={{ animationDelay: '0.1s' }}></div>
                <div className={`waveform-bar w-1.5 bg-secondary rounded-full h-5 ${!isPaused && !isMuted ? 'animate-[wave_1.2s_ease-in-out_infinite]' : ''}`} style={{ animationDelay: '0.2s' }}></div>
                <div className={`waveform-bar w-1.5 bg-primary rounded-full h-2 ${!isPaused && !isMuted ? 'animate-[wave_1.2s_ease-in-out_infinite]' : ''}`} style={{ animationDelay: '0.3s' }}></div>
                <div className={`waveform-bar w-1.5 bg-secondary rounded-full h-6 ${!isPaused && !isMuted ? 'animate-[wave_1.2s_ease-in-out_infinite]' : ''}`} style={{ animationDelay: '0.4s' }}></div>
                <div className={`waveform-bar w-1.5 bg-primary rounded-full h-4 ${!isPaused && !isMuted ? 'animate-[wave_1.2s_ease-in-out_infinite]' : ''}`} style={{ animationDelay: '0.5s' }}></div>
                <div className={`waveform-bar w-1.5 bg-secondary rounded-full h-5 ${!isPaused && !isMuted ? 'animate-[wave_1.2s_ease-in-out_infinite]' : ''}`} style={{ animationDelay: '0.6s' }}></div>
              </div>
            </div>
            
            {/* Floating Mic Button */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20">
              <button 
                onClick={handleSimulateAnswer}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 active:scale-95 ${
                  isMuted ? 'bg-error' : 'bg-primary pulse-soft'
                }`}
                title="Click to submit answer"
              >
                <span className="material-symbols-outlined">{isMuted ? 'mic_off' : 'mic'}</span>
              </button>
            </div>
          </section>

          {/* User input simulation */}
          <section className="bg-surface-container rounded-2xl p-4 flex gap-3 items-center">
            <input 
              type="text" 
              placeholder="Type your response to simulate speech answer..." 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSimulateAnswer()}
              className="flex-1 bg-white border border-outline-variant rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button 
              onClick={handleSimulateAnswer}
              className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:opacity-90 transition-opacity"
            >
              Simulate Speak
            </button>
          </section>

          {/* Live Transcript Card */}
          <section className="glass-card rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest text-xs font-semibold">Live Transcript</h3>
              </div>
              <button 
                onClick={() => alert("Simulation: Downloading conversation transcripts log.")}
                className="text-primary font-label-sm text-xs font-bold hover:underline"
              >
                Download Log
              </button>
            </div>
            
            <div className="h-32 overflow-y-auto custom-scrollbar space-y-3 pr-4">
              {transcript.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-sm">
                  <span className={`font-bold shrink-0 w-16 text-xs uppercase ${
                    item.sender === 'CrackIt' ? 'text-primary' : item.sender === 'You' ? 'text-secondary' : 'text-outline-variant'
                  }`}>
                    {item.sender}:
                  </span>
                  <p className="text-on-surface-variant">{item.text}</p>
                </div>
              ))}
              <div className="flex gap-3 opacity-50 italic text-sm">
                <span className="font-bold shrink-0 w-16 text-xs uppercase text-outline-variant">System:</span>
                <p className="text-outline-variant">
                  {isPaused ? "Interview paused." : "Waiting for response (speak or click 'Simulate Speak')..."}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Action Pill */}
      <footer className="pb-10 pt-4 px-6 md:px-margin-desktop text-center">
        <div className="max-w-fit mx-auto flex flex-wrap justify-center items-center gap-3 bg-surface-container-high/50 p-2 rounded-full backdrop-blur-sm border border-surface-variant/20 shadow-lg">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors group"
          >
            <span className={`material-symbols-outlined transition-colors ${isMuted ? 'text-error' : 'text-on-surface-variant group-hover:text-primary'}`}>
              {isMuted ? 'mic_off' : 'mic'}
            </span>
            <span className={`font-label-md text-sm transition-colors ${isMuted ? 'text-error font-semibold' : 'text-on-surface-variant group-hover:text-primary'}`}>
              {isMuted ? 'Muted' : 'Mute'}
            </span>
          </button>
          
          <button 
            onClick={() => {
              alert("Replaying last interviewer question audio.");
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors group"
          >
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">replay</span>
            <span className="font-label-md text-sm text-on-surface-variant group-hover:text-primary transition-colors">Replay</span>
          </button>
          
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors group"
          >
            <span className={`material-symbols-outlined transition-colors ${isPaused ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
            <span className={`font-label-md text-sm transition-colors ${isPaused ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:text-primary'}`}>
              {isPaused ? 'Resume' : 'Pause'}
            </span>
          </button>
          
          <div className="hidden sm:block w-px h-8 bg-outline-variant mx-1"></div>
          
          <button 
            onClick={handleEndInterview}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-secondary text-on-secondary shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">stop_circle</span>
            <span className="font-label-md text-sm font-semibold">End Interview</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
