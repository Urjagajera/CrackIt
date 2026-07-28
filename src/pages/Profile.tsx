import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUserProfile } from '../utils/mockData';
import { useToast } from '../context/ToastContext';
import { trimInput, isNonEmptyString } from '../lib/sanitize';
import SkillBadgeList from '../components/SkillBadgeList';

export default function Profile() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(mockUserProfile);
  const [skills, setSkills] = useState<string[]>(['Python', 'System Design', 'Kubernetes', 'React.js', 'Algorithms', 'Go Lang']);
  const [newSkill, setNewSkill] = useState<string>('');
  const [isAddingSkill, setIsAddingSkill] = useState<boolean>(false);

  // Form states
  const [fullName, setFullName] = useState<string>(profile.name);
  const [email, setEmail] = useState<string>(profile.email);
  const [bio, setBio] = useState<string>('Aspiring Software Engineer passionate about distributed systems and cloud architecture.');
  const [college, setCollege] = useState<string>('Stanford University');
  const [cgpa, setCgpa] = useState<string>('3.92 / 4.0');
  const [degree, setDegree] = useState<string>('B.S. in Computer Science');
  const [gradYear, setGradYear] = useState<string>('2026');
  const [targetLang, setTargetLang] = useState<string>('English (Global Standard)');
  const [targetCompany, setTargetCompany] = useState<string>('Meta (Facebook)');
  const [mockIntensity, setMockIntensity] = useState<string>('Standard');

  const handleSave = () => {
    const cleanName = trimInput(fullName);
    const cleanEmail = trimInput(email);
    
    if (!isNonEmptyString(cleanName) || !isNonEmptyString(cleanEmail)) {
      showToast('Name and email cannot be blank.', 'error');
      return;
    }

    setProfile(prev => ({
      ...prev,
      name: cleanName,
      email: cleanEmail,
      targetCompany: targetCompany.includes('Meta') ? 'Meta' : targetCompany
    }));
    
    showToast('Profile configuration saved successfully!', 'success');
  };

  const handleAddSkill = (e: FormEvent) => {
    e.preventDefault();
    const cleanSkill = trimInput(newSkill);
    if (isNonEmptyString(cleanSkill) && !skills.includes(cleanSkill)) {
      setSkills(prev => [...prev, cleanSkill]);
      setNewSkill('');
      setIsAddingSkill(false);
      showToast(`Skill "${cleanSkill}" added.`, 'info');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
    showToast(`Skill "${skillToRemove}" removed.`, 'info');
  };

  return (
    <div className="px-margin-mobile md:px-margin-desktop pb-margin-mobile md:pb-margin-desktop min-h-screen text-left relative">
      {/* Top Header Section */}
      <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Your Profile</h2>
          <p className="text-body-md text-on-surface-variant">Fine-tune your mentor's knowledge of your background.</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full font-label-md text-primary hover:bg-primary/5 transition-colors border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 sm:flex-initial px-8 py-2.5 rounded-full font-label-md bg-secondary text-on-secondary shadow-[0_4px_12px_rgba(159,65,34,0.2)] hover:scale-[0.98] active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-secondary"
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
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60'; }}
                    src={profile.avatar}
                  />
                </div>
                <button 
                  onClick={() => showToast("Avatar Upload: Simulation of photo upload dialog.", "info")}
                  className="absolute bottom-0 right-0 p-2.5 bg-primary text-on-primary rounded-full shadow-md hover:scale-110 transition-transform flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Upload photo"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-label-sm text-on-surface-variant px-1" htmlFor="fullName">Full Name</label>
                    <input 
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-surface border border-surface-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-label-sm text-on-surface-variant px-1" htmlFor="email">Email Address</label>
                    <input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface border border-surface-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="font-label-sm text-on-surface-variant px-1" htmlFor="bio">Professional Bio</label>
                  <textarea 
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full bg-surface border border-surface-variant/40 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Academic Background Card */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.06)] border border-surface-variant/20">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6 font-bold text-lg">Academic Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="font-label-sm text-on-surface-variant px-1">University / College</label>
                <input 
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-surface border border-surface-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-on-surface-variant px-1">Degree Program</label>
                <input 
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full bg-surface border border-surface-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-on-surface-variant px-1">GPA / Score</label>
                <input 
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full bg-surface border border-surface-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-on-surface-variant px-1">Graduation Year</label>
                <input 
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  className="w-full bg-surface border border-surface-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </section>

          {/* Core Technical Competencies */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.06)] border border-surface-variant/20">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-lg">Technical Competencies</h3>
                <p className="text-xs text-on-surface-variant">Click to add/remove skills used for mock customization</p>
              </div>
              
              {!isAddingSkill ? (
                <button 
                  onClick={() => setIsAddingSkill(true)}
                  className="px-4 py-2 bg-primary/10 text-primary font-label-sm rounded-full hover:bg-primary/20 transition-colors text-xs font-semibold flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Add Skill</span>
                </button>
              ) : (
                <form onSubmit={handleAddSkill} className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    placeholder="Skill name..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="bg-surface border border-surface-variant rounded-xl px-3 py-1.5 text-xs outline-none focus:border-primary"
                    autoFocus
                  />
                  <button type="submit" className="text-primary font-bold text-xs">Add</button>
                  <button type="button" onClick={() => setIsAddingSkill(false)} className="text-on-surface-variant text-xs">Cancel</button>
                </form>
              )}
            </div>
            
            <SkillBadgeList skills={skills} onRemoveSkill={handleRemoveSkill} />
          </section>
        </div>

        {/* Bento Column Right: Mentor Customization (4 Columns) */}
        <div className="lg:col-span-4 space-y-gutter">
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-[24px] shadow-[0_10px_30px_rgba(65,81,187,0.06)] border border-surface-variant/20">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6 font-bold text-lg">Target Customization</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="font-label-sm text-on-surface-variant px-1">Target Company</label>
                <select 
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full bg-surface border border-surface-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option>Meta (Facebook)</option>
                  <option>Google</option>
                  <option>Amazon</option>
                  <option>Microsoft</option>
                  <option>Apple</option>
                  <option>Netflix</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label-sm text-on-surface-variant px-1">Primary Interview Language</label>
                <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full bg-surface border border-surface-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option>English (Global Standard)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label-sm text-on-surface-variant px-1">Mock Intensity</label>
                <div className="flex gap-2">
                  {['Standard', 'High', 'Elite'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setMockIntensity(level)}
                      className={`flex-1 py-2 rounded-lg text-label-sm font-bold border transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
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
        </div>
      </div>
    </div>
  );
}
