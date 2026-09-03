'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Check, 
  Plus, 
  X, 
  Clock, 
  Sun, 
  Sunset, 
  Moon, 
  Compass, 
  GraduationCap 
} from 'lucide-react';

export default function OnboardingPage() {
  const { updateOnboarding, user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form States
  const [name, setName] = useState(user?.name || '');
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [customDegree, setCustomDegree] = useState('');
  
  const [year, setYear] = useState('3rd Year');
  const [semester, setSemester] = useState('5th Semester');

  // Subjects States
  const defaultSubjects = [
    'Data Structures and Algorithms',
    'Database Management Systems',
    'Operating Systems',
    'Computer Networks',
    'Java Programming',
    'Artificial Intelligence'
  ];
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Data Structures and Algorithms', 'Operating Systems']);
  const [customSubjectInput, setCustomSubjectInput] = useState('');

  // Goals States
  const defaultGoals = [
    { id: 'cgpa', text: 'Improve CGPA' },
    { id: 'exam', text: 'Exam Preparation' },
    { id: 'placement', text: 'Placement Preparation' },
    { id: 'dsa', text: 'Learn DSA' },
    { id: 'dev', text: 'Development & Projects' },
    { id: 'interview', text: 'Interview Preparation' }
  ];
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Preferences States
  const [studyHours, setStudyHours] = useState(3);
  const [preferredTime, setPreferredTime] = useState('Evening');
  const [learningPreference, setLearningPreference] = useState('Mixed');

  // Form Validation checks
  const canGoNext = () => {
    if (step === 1) {
      return name.trim() !== '' && university.trim() !== '';
    }
    if (step === 3) {
      return selectedSubjects.length > 0;
    }
    if (step === 4) {
      return selectedGoals.length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (canGoNext()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubjectToggle = (subj: string) => {
    if (selectedSubjects.includes(subj)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subj));
    } else {
      setSelectedSubjects([...selectedSubjects, subj]);
    }
  };

  const handleAddCustomSubject = () => {
    if (customSubjectInput.trim() && !selectedSubjects.includes(customSubjectInput.trim())) {
      setSelectedSubjects([...selectedSubjects, customSubjectInput.trim()]);
      setCustomSubjectInput('');
    }
  };

  const handleGoalToggle = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    const finalDegree = degree === 'Other' ? customDegree : degree;
    const dataToSave = {
      name,
      university,
      degree: finalDegree,
      year,
      semester,
      goals: selectedGoals,
      studyHours,
      preferredTime,
      learningPreference
    };
    
    try {
      await updateOnboarding(dataToSave);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Onboarding Header */}
      <header className="w-full bg-white dark:bg-card border-b border-gray-100 dark:border-border py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <div className="bg-brand-gradient p-1.5 rounded-lg text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-extrabold text-md tracking-tight text-gray-900 dark:text-gray-50">
            AI StudyOS
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold px-2 border-l border-gray-200 dark:border-border ml-2">
            Academic Setup
          </span>
        </div>
      </header>

      {/* Main Form Area */}
      <main id="main-content" tabIndex={-1} className="flex-grow flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-xl bg-white dark:bg-card border border-gray-100 dark:border-border rounded-3xl shadow-xl shadow-purple-500/5 p-8 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
          {/* Decorative Corner Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />

          {/* Progress Indicator */}
          <div className="w-full space-y-2 mb-8">
            <div className="flex justify-between items-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              <span>Step {step} of 5</span>
              <span>{Math.round((step / 5) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-brand-gradient h-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Contents */}
          <div className="flex-grow space-y-6">
            
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-brand-purple" />
                    Tell us about yourself
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Let&apos;s personalize your workspace with your name and college details.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-sm focus:border-brand-purple"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">University or College</label>
                    <input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. Stanford University"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-sm focus:border-brand-purple"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Degree / Course</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['B.Tech', 'BCA', 'MCA', 'B.Sc', 'Other'].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDegree(d)}
                          className={`py-2 px-3 border rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                            degree === d 
                              ? 'border-brand-purple bg-purple-50 dark:bg-purple-500/10 text-brand-purple shadow-sm' 
                              : 'border-gray-200 dark:border-border bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {degree === 'Other' && (
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Specify Degree</label>
                      <input
                        type="text"
                        value={customDegree}
                        onChange={(e) => setCustomDegree(e.target.value)}
                        placeholder="e.g. B.A. Economics"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-sm focus:border-brand-purple"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Academic Info */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                    <Compass className="h-6 w-6 text-brand-purple" />
                    Academic Term details
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Which year and semester are you currently in?
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Current Year</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((y) => (
                        <button
                          key={y}
                          onClick={() => setYear(y)}
                          className={`py-2.5 px-1 border rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                            year === y 
                              ? 'border-brand-purple bg-purple-50 dark:bg-purple-500/10 text-brand-purple shadow-sm' 
                              : 'border-gray-200 dark:border-border bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-sm focus:border-brand-purple"
                    >
                      {Array.from({ length: 8 }).map((_, i) => {
                        const semText = `${i + 1}${['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th'][i]} Semester`;
                        return (
                          <option key={i} value={semText}>
                            {semText}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Subjects Selection */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-brand-purple" />
                    Select Your Subjects
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Add the courses you are studying this semester. You can select recommended ones or add custom.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Grid of default subjects */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {defaultSubjects.map((subj) => {
                      const isSelected = selectedSubjects.includes(subj);
                      return (
                        <button
                          key={subj}
                          onClick={() => handleSubjectToggle(subj)}
                          className={`p-3 border rounded-xl text-left text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                            isSelected 
                              ? 'border-brand-purple bg-purple-50 dark:bg-purple-500/10 text-brand-purple' 
                              : 'border-gray-150 bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          <span className="truncate">{subj}</span>
                          {isSelected && <Check className="h-4 w-4 shrink-0 text-brand-purple" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add custom subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Add Custom Subject</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customSubjectInput}
                        onChange={(e) => setCustomSubjectInput(e.target.value)}
                        placeholder="e.g. Computer Graphics"
                        className="flex-grow px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-sm focus:border-brand-purple"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSubject();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSubject}
                        className="bg-brand-gradient text-white p-2.5 rounded-xl hover:shadow-md cursor-pointer flex items-center justify-center"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Selected badges list */}
                  {selectedSubjects.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Active Subject list ({selectedSubjects.length})</p>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                        {selectedSubjects.map((s) => (
                          <div 
                            key={s} 
                            className="bg-purple-100 text-brand-purple text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium border border-purple-200 dark:border-purple-500/30"
                          >
                            <span>{s}</span>
                            <button 
                              type="button" 
                              onClick={() => handleSubjectToggle(s)}
                              className="text-purple-600 hover:text-purple-900 cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Study Goals */}
            {step === 4 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-brand-purple" />
                    What are your goals?
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    What would you like to focus on with AI StudyOS? Select all that apply.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {defaultGoals.map((g) => {
                    const isSelected = selectedGoals.includes(g.text);
                    return (
                      <button
                        key={g.id}
                        onClick={() => handleGoalToggle(g.text)}
                        className={`p-4 border rounded-2xl text-left text-sm font-semibold transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected 
                            ? 'border-brand-purple bg-purple-50 dark:bg-purple-500/10 text-brand-purple shadow-sm' 
                            : 'border-gray-150 bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{g.text}</span>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected 
                              ? 'border-brand-purple bg-brand-purple text-white' 
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-card'
                          }`}>
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: Study Preferences */}
            {step === 5 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-brand-purple" />
                    Study Preferences
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Configure your daily schedule and let AI adjust study recommendations.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Slider: Daily hours */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      <span>Daily Available Study Hours</span>
                      <span className="text-brand-purple text-sm font-bold">{studyHours} Hours</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={studyHours}
                      onChange={(e) => setStudyHours(parseInt(e.target.value))}
                      className="w-full accent-brand-purple h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Options: Preferred study time */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Preferred Study Time</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { name: 'Morning', icon: <Sun className="h-4 w-4" /> },
                        { name: 'Afternoon', icon: <Compass className="h-4 w-4" /> },
                        { name: 'Evening', icon: <Sunset className="h-4 w-4" /> },
                        { name: 'Night', icon: <Moon className="h-4 w-4" /> }
                      ].map((t) => (
                        <button
                          key={t.name}
                          onClick={() => setPreferredTime(t.name)}
                          className={`p-2 border rounded-xl text-xs font-semibold cursor-pointer flex flex-col items-center gap-1 transition-all ${
                            preferredTime === t.name 
                              ? 'border-brand-purple bg-purple-50 dark:bg-purple-500/10 text-brand-purple shadow-sm' 
                              : 'border-gray-200 dark:border-border bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {t.icon}
                          <span>{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selection: Learning preference */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Learning Preference</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['Visual learning', 'Reading notes', 'Practice questions', 'Flashcards', 'Mixed'].map((p) => (
                        <button
                          key={p}
                          onClick={() => setLearningPreference(p)}
                          className={`p-2.5 border rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                            learningPreference === p 
                              ? 'border-brand-purple bg-purple-50 dark:bg-purple-500/10 text-brand-purple shadow-sm' 
                              : 'border-gray-200 dark:border-border bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-100 dark:border-border mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="px-5 py-2.5 border border-gray-200 dark:border-border text-gray-600 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-muted transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext()}
                className="px-6 py-2.5 bg-brand-gradient text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="px-8 py-3 bg-brand-gradient text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? 'Creating studyOS...' : 'Create My StudyOS'}
                <Sparkles className="h-4 w-4" />
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
