import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUserProfile } from '../utils/mockData';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(mockUserProfile);
  const [skills, setSkills] = useState(['Python', 'System Design', 'Kubernetes', 'React.js', 'Algorithms', 'Go Lang']);
  const [newSkill, setNewSkill] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState('Aspiring Software Engineer passionate about distributed systems and cloud architecture.');
  const [college, setCollege] = useState('Stanford University');
  const [cgpa, setCgpa] = useState('3.92 / 4.0');
  const [degree, setDegree] = useState('B.S. in Computer Science');
  const [gradYear, setGradYear] = useState('2024');
  const [targetLang, setTargetLang] = useState('English (Global Standard)');
  const [targetCompany, setTargetCompany] = useState('Meta (Facebook)');
  const [mockIntensity, setMockIntensity] = useState('Standard');

  const handleSave = () => {
    // Update local profile representation
    setProfile(prev => ({
      ...prev,
      name: fullName,
      email: email,
      targetCompany: targetCompany.includes('Meta') ? 'Meta' : targetCompany
    }));
    
    // Show toast
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      setIsAddingSkill(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop min-h-screen text-left relative">
      {/* Top Header Section */}
      <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Your Profile</h2>
          <p className="text-body-md text-on-surface-variant">Fine-tune your mentor's knowledge of your background.</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full font-label-md text-primary hover:bg-primary/5 transition-colors border border-primary/20"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 sm:flex-initial px-8 py-2.5 rounded-full font-label-md bg-secondary text-on-secondary shadow-[0_4px_12px_rgba(159,65,34,0.2)] hover:scale-[0.98] active:scale-95 transition-transform"
          >
            Save Changes
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Bento Column Left: Personal & Academic (8 Columns) */}
        <div className="lg:col-span-8 space-y-gutter">
          
          {/* Personal Details Card */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.06)] border border-surface-variant/20">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
              <div className="relative group self-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-container-high ring-4 ring-white shadow-lg">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Alex headshot" 
                    src={profile.avatar}
                  />
                </div>
                <button 
                  onClick={() => alert("Avatar Upload: Simulation of photo upload dialog.")}
                  className="absolute bottom-0 right-0 p-2.5 bg-primary text-on-primary rounded-full shadow-md hover:scale-110 transition-transform flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                <div className="space-y-1">
                  <label className="font-label-sm text-on-surface-variant px-1">Full Name</label>
                  <input 
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-label-sm text-on-surface-variant px-1">Email Address</label>
                  <input 
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-label-sm text-on-surface-variant px-1">Short Bio</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" 
                    rows="2"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Academic Details */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.06)] border border-surface-variant/20">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <span className="material-symbols-outlined">school</span>
              <h3 className="font-headline-md text-[20px] font-bold">Academic Details</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-label-sm text-on-surface-variant px-1">College/University</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                  type="text" 
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-on-surface-variant px-1">CGPA / Grade</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                  type="text" 
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="font-label-sm text-on-surface-variant px-1">Degree</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                  type="text" 
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-on-surface-variant px-1">Graduation Year</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                  type="text" 
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Professional Skills */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.06)] border border-surface-variant/20">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined">terminal</span>
                <h3 className="font-headline-md text-[20px] font-bold">Professional Details</h3>
              </div>
              
              {!isAddingSkill ? (
                <button 
                  onClick={() => setIsAddingSkill(true)}
                  className="text-label-md text-primary flex items-center gap-1 hover:underline font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span> Add Skill
                </button>
              ) : (
                <form onSubmit={handleAddSkill} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="New Skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface outline-none text-sm"
                    autoFocus
                  />
                  <button type="submit" className="text-primary font-bold text-sm">Add</button>
                  <button type="button" onClick={() => setIsAddingSkill(false)} className="text-on-surface-variant text-sm">Cancel</button>
                </form>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span 
                  key={skill} 
                  className="px-4 py-2 bg-primary/10 text-primary font-label-md rounded-full border border-primary/20 flex items-center gap-2"
                >
                  {skill} 
                  <span 
                    onClick={() => handleRemoveSkill(skill)}
                    className="material-symbols-outlined text-[16px] cursor-pointer hover:text-error"
                  >
                    close
                  </span>
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Bento Column Right: Progress & Preferences (4 Columns) */}
        <div className="lg:col-span-4 space-y-gutter">
          
          {/* Profile Completion Ring */}
          <section className="bg-primary text-on-primary p-6 md:p-8 rounded-[24px] shadow-[0_15px_35px_rgba(65,81,187,0.15)] flex flex-col items-center text-center">
            <h3 className="font-label-md uppercase tracking-widest opacity-80 mb-6">Profile Completion</h3>
            
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full">
                <circle className="text-white/20" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                <circle 
                  className="text-white progress-ring-circle" 
                  cx="96" 
                  cy="96" 
                  fill="transparent" 
                  r="88" 
                  stroke="currentColor" 
                  strokeDasharray="552.9" 
                  strokeDashoffset={552.9 * (1 - 0.85)} 
                  strokeLinecap="round" 
                  strokeWidth="12"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-xl text-[40px] text-white">85%</span>
                <span className="text-label-sm opacity-80 text-white">Almost there!</span>
              </div>
            </div>
            
            <p className="text-body-md opacity-90 leading-relaxed mb-4 text-white">Add a professional experience to hit 100% and unlock elite mock interviews.</p>
            <button 
              onClick={() => alert("Simulating professional experience modal activation.")}
              className="w-full py-3 bg-white text-primary font-label-md rounded-full hover:opacity-90 active:scale-95 transition-all"
            >
              Complete Now
            </button>
          </section>

          {/* Interview Preferences */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.06)] border border-surface-variant/20">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <span className="material-symbols-outlined">target</span>
              <h3 className="font-headline-md text-[20px] font-bold">Interview Goals</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="font-label-sm text-on-surface-variant px-1">Target Language</label>
                <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                >
                  <option>English (Global Standard)</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                  <option>Mandarin</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="font-label-sm text-on-surface-variant px-1">Target Company</label>
                <select 
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                >
                  <option>Google</option>
                  <option>Meta (Facebook)</option>
                  <option>Amazon</option>
                  <option>Netflix</option>
                  <option>Stripe</option>
                  <option>Other Tier 1 Startup</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="font-label-sm text-on-surface-variant px-1">Mock Intensity</label>
                <div className="flex gap-2">
                  {['Standard', 'High', 'Elite'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setMockIntensity(level)}
                      className={`flex-1 py-2 rounded-lg text-label-sm font-bold border transition-all ${
                        mockIntensity === level
                          ? 'bg-primary/10 text-primary border-primary/30'
                          : 'bg-surface text-on-surface-variant border-outline-variant'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Activity Snapshot */}
          <section className="bg-secondary-container/10 p-6 rounded-[24px] border border-secondary-container/20">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-label-md text-on-secondary-container font-semibold">Recent Activity</h4>
              <span className="material-symbols-outlined text-secondary text-[20px]">trending_up</span>
            </div>
            
            <div className="flex justify-between items-end h-16 px-2">
              <div className="w-3 h-8 bg-secondary/20 rounded-t-sm"></div>
              <div className="w-3 h-12 bg-secondary/40 rounded-t-sm"></div>
              <div className="w-3 h-6 bg-secondary/20 rounded-t-sm"></div>
              <div className="w-3 h-14 bg-secondary/80 rounded-t-sm animate-pulse"></div>
              <div className="w-3 h-10 bg-secondary/40 rounded-t-sm"></div>
              <div className="w-3 h-16 bg-secondary rounded-t-sm"></div>
              <div className="w-3 h-12 bg-secondary/60 rounded-t-sm"></div>
            </div>
            
            <p className="mt-4 text-label-sm text-on-secondary-container opacity-80">You've completed 12 mocks this week. Top 5% of users.</p>
          </section>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-surface-container-highest border border-primary/20 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 transition-all z-50 animate-[bounce_0.5s_ease-out]">
          <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
          <div>
            <p className="font-label-md text-on-surface font-semibold">Settings Saved</p>
            <p className="text-label-sm text-on-surface-variant">Your mentor profile is up to date.</p>
          </div>
          <button className="ml-4 text-on-surface-variant hover:text-on-surface" onClick={() => setShowToast(false)}>
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
