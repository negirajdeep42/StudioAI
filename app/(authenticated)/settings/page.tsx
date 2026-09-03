'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useStore } from '@/lib/store-context';
import { useTheme } from '@/lib/theme-context';
import { 
  User as UserIcon, 
  GraduationCap, 
  Clock, 
  Link2, 
  Moon,   
  Key,  
} from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);


export default function SettingsPage() {
  const { user, updateUserPreferences, logoutUser } = useAuth();
  
  // Settings Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'preferences' | 'integrations' | 'appearance' | 'account'>('profile');

  // Input states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [university, setUniversity] = useState(user?.university || 'Stanford University');
  const [degree, setDegree] = useState(user?.degree || 'B.Tech');
  const [year, setYear] = useState(user?.year || '3rd Year');
  const [semester, setSemester] = useState(user?.semester || '5th Semester');

  const [studyHours, setStudyHours] = useState(user?.studyHours || 3);
  const [preferredTime, setPreferredTime] = useState(user?.preferredTime || 'Evening');
  const [learningPreference, setLearningPreference] = useState(user?.learningPreference || 'Mixed');

  // Integrations state
  const [githubConnected, setGithubConnected] = useState(user?.githubConnected || false);
  const [leetcodeConnected, setLeetcodeConnected] = useState(user?.leetcodeConnected || false);
  const [calendarConnected] = useState(user?.calendarConnected || false);

  // Password reset state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState('');

  // Appearance is owned by the theme provider so the choice persists and is
  // applied before first paint on the next load.
  const { mode: themeMode, setMode: setThemeMode, resolvedTheme } = useTheme();

  // Danger-zone action for wiping locally-stored study data.
  const { resetAllData } = useStore();

  const handleResetData = () => {
    if (confirm('Reset all study data back to its starting state? This cannot be undone.')) {
      resetAllData();
      setSaveStatus('Study data reset.');
      setTimeout(() => setSaveStatus(''), 2500);
    }
  };

  // Action status indicators
  const [saveStatus, setSaveStatus] = useState('');

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    
    const success = await updateUserPreferences({
      name,
      email,
      university,
      degree,
      year,
      semester,
      studyHours,
      preferredTime,
      learningPreference,
      githubConnected,
      leetcodeConnected,
      calendarConnected
    });

    if (success) {
      setSaveStatus('Changes saved successfully!');
      setTimeout(() => setSaveStatus(''), 2500);
    } else {
      setSaveStatus('Failed to save changes.');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordFeedback('New password must be at least 8 characters.');
      return;
    }
    setPasswordFeedback('Password successfully updated!');
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordFeedback(''), 2500);
  };

  const handleDeleteAccount = () => {
    if (confirm('CAUTION: This action is permanent. Deleting your account will remove all study history, DSA files, and flashcards.')) {
      logoutUser();
    }
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <UserIcon className="h-4.5 w-4.5" /> },
    { id: 'academic', label: 'Academic Profile', icon: <GraduationCap className="h-4.5 w-4.5" /> },
    { id: 'preferences', label: 'Study Preferences', icon: <Clock className="h-4.5 w-4.5" /> },
    { id: 'integrations', label: 'Integrations', icon: <Link2 className="h-4.5 w-4.5" /> },
    { id: 'appearance', label: 'Appearance', icon: <Moon className="h-4.5 w-4.5" /> },
    { id: 'account', label: 'Account Security', icon: <Key className="h-4.5 w-4.5" /> }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">Settings</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Configure profile details, academic levels, and third-party dashboard links</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Category Links */}
        <div className="md:col-span-4 bg-white dark:bg-card border border-gray-150 rounded-3xl p-4 flex flex-col gap-1 shadow-sm shrink-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full text-left p-3.5 rounded-2xl transition-all font-semibold flex items-center gap-3 cursor-pointer ${
                activeTab === t.id 
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-brand-purple' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-muted hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <span className={activeTab === t.id ? 'text-brand-purple' : 'text-gray-400 dark:text-gray-500'}>{t.icon}</span>
              <span className="text-xs">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Right Side: Tab detail form */}
        <div className="md:col-span-8 bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[400px]">
          
          <form onSubmit={handleSaveChanges} className="space-y-6 flex-grow">
            
            {/* Tab 1: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-50">Profile Details</h3>
                
                {/* Photo Simulation */}
                <div className="flex items-center gap-4 py-2">
                  <div className="w-16 h-16 rounded-full bg-brand-gradient border border-purple-200/50 flex items-center justify-center font-black text-white text-lg uppercase">
                    {name.slice(0, 2)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-100">Avatar Image</p>
                    <button type="button" className="text-[10px] text-brand-purple hover:underline font-bold bg-purple-50 dark:bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-100 dark:border-purple-500/20 cursor-pointer">
                      Change Photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Academic */}
            {activeTab === 'academic' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-50">Academic Term</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">University / College</label>
                    <input
                      type="text"
                      required
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Degree</label>
                      <input
                        type="text"
                        required
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Year</label>
                      <input
                        type="text"
                        required
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Semester</label>
                      <input
                        type="text"
                        required
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Preferences */}
            {activeTab === 'preferences' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-50">Study Preferences</h3>
                
                <div className="space-y-4.5">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      <span>Daily study goal limits</span>
                      <span className="text-brand-purple text-xs font-bold">{studyHours} hours</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={studyHours}
                      onChange={(e) => setStudyHours(parseInt(e.target.value))}
                      className="w-full accent-brand-purple h-2 bg-gray-100 dark:bg-[#232235] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Preferred Study Window</label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
                      >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Learning Preference</label>
                      <select
                        value={learningPreference}
                        onChange={(e) => setLearningPreference(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
                      >
                        <option value="Visual learning">Visual learning</option>
                        <option value="Reading notes">Reading notes</option>
                        <option value="Practice questions">Practice questions</option>
                        <option value="Flashcards">Flashcards</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Integrations */}
            {activeTab === 'integrations' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-50">Developer & Calendar Links</h3>
                
                <div className="space-y-3">
                  {/* GitHub */}
                  <div className="border border-gray-100 dark:border-border p-4 rounded-2xl flex items-center justify-between shadow-sm bg-white dark:bg-card">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 dark:bg-[#232235] p-2.5 rounded-xl text-gray-800 dark:text-gray-100 shrink-0">
                        <GithubIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-850">GitHub Activity syncing</p>
                        <p className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5">Fetches project repositories to feed heatmap activity</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGithubConnected(!githubConnected)}
                      className={`px-3 py-1.5 border rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                        githubConnected 
                          ? 'border-red-200 bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-100' 
                          : 'border-brand-purple text-brand-purple bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100'
                      }`}
                    >
                      {githubConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>

                  {/* LeetCode */}
                  <div className="border border-gray-100 dark:border-border p-4 rounded-2xl flex items-center justify-between shadow-sm bg-white dark:bg-card">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-50 dark:bg-amber-500/10 p-2.5 rounded-xl text-amber-500 shrink-0">
                        <Link2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-850">LeetCode Progress API</p>
                        <p className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5">Loads solved counts metrics (Easy, Medium, Hard)</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLeetcodeConnected(!leetcodeConnected)}
                      className={`px-3 py-1.5 border rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                        leetcodeConnected 
                          ? 'border-red-200 bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-100' 
                          : 'border-brand-purple text-brand-purple bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100'
                      }`}
                    >
                      {leetcodeConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Appearance */}
            {activeTab === 'appearance' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-50">Theme Configurations</h3>
                
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-650 uppercase tracking-wider block">Choose Theme</label>
                  <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Colour theme">
                    {([
                      { id: 'light', label: 'Light Mode', swatch: 'bg-[#fcfbfe]' },
                      { id: 'dark', label: 'Dark Mode', swatch: 'bg-[#0f0e17]' },
                      { id: 'system', label: 'System Default', swatch: 'bg-gradient-to-br from-[#fcfbfe] to-[#0f0e17]' }
                    ] as const).map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        role="radio"
                        aria-checked={themeMode === theme.id}
                        onClick={() => setThemeMode(theme.id)}
                        className={`p-4 border rounded-2xl text-left text-xs font-bold cursor-pointer transition-all ${
                          themeMode === theme.id
                            ? 'border-brand-purple bg-purple-50 dark:bg-purple-500/10 text-brand-purple shadow-sm'
                            : 'border-gray-200 dark:border-border bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <span className={`block h-8 w-full rounded-lg border border-gray-200 dark:border-border mb-2.5 ${theme.swatch}`} />
                        {theme.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
                    Currently showing the <span className="text-brand-purple">{resolvedTheme}</span> theme.
                    {themeMode === 'system' && ' Following your operating system setting.'}
                  </p>
                </div>

                {/* Local data controls */}
                <div className="space-y-3 pt-5 border-t border-gray-100 dark:border-border">
                  <h4 className="text-xs font-bold text-gray-650 uppercase tracking-wider">Study Data</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-200 dark:border-border p-4.5 rounded-2xl">
                    <div>
                      <p className="text-xs font-bold text-gray-850">Reset study data</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5">
                        Restores subjects, tasks, notes and goals to their starting state. Your account is untouched.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetData}
                      className="border border-gray-250 hover:bg-gray-50 dark:hover:bg-muted text-gray-700 dark:text-gray-200 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shrink-0"
                    >
                      Reset Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 6: Account Security */}
            {activeTab === 'account' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Password reset form */}
                <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-border">
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-50">Change Password</h3>
                  {passwordFeedback && (
                    <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 text-brand-purple text-xs p-3 rounded-xl">
                      {passwordFeedback}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-650 uppercase tracking-wider">Current Password</label>
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-650 uppercase tracking-wider">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handlePasswordChange}
                    className="bg-brand-gradient text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-md cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>

                {/* Dangerous section */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider">Danger Zone</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-red-100 bg-red-50/20 p-4.5 rounded-2xl">
                    <div>
                      <p className="text-xs font-bold text-gray-850">Permanently Delete Account</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5">Delete all study records. This operation is irreversible.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:shadow-md cursor-pointer shrink-0"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Save feedback block */}
            {saveStatus && (
              <div className="text-xs font-bold text-brand-purple py-1 animate-pulse">
                {saveStatus}
              </div>
            )}

            {/* Form actions */}
            {activeTab !== 'account' && (
              <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-border mt-6 shrink-0">
                <button
                  type="submit"
                  className="bg-brand-gradient text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            )}

          </form>

        </div>

      </div>
    </div>
  );
}
