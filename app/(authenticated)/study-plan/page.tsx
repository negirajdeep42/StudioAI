'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock,  
  RotateCw, 
  AlertTriangle, 
  Check, 
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { StudyPlanTask } from '@/types';

/** Today's schedule is stored under this key alongside the weekday entries. */
const TODAY_KEY = 'Today';

const SEED_DAILY: StudyPlanTask[] = [
  { id: 'pt1', topic: 'Process Synchronisation & Semaphores', subjectName: 'Operating Systems', durationMinutes: 45, type: 'Read Notes', timeSlot: '09:00 AM', completed: false },
  { id: 'pt2', topic: 'Thread Safety & Producer-Consumer', subjectName: 'Java Programming', durationMinutes: 60, type: 'Practice', timeSlot: '11:00 AM', completed: false },
  { id: 'pt3', topic: 'SQL Joins & Indexing Mock Quiz', subjectName: 'Database Management Systems', durationMinutes: 30, type: 'Quiz', timeSlot: '04:00 PM', completed: false }
];

const SEED_WEEKLY: Record<string, StudyPlanTask[]> = {
  'Monday': [
    { id: 'm1', topic: 'Deadlock Conditions', subjectName: 'Operating Systems', durationMinutes: 45, type: 'Read Notes', completed: false },
    { id: 'm2', topic: 'Binary Tree Traversals', subjectName: 'Data Structures and Algorithms', durationMinutes: 60, type: 'Practice', completed: false }
  ],
  'Tuesday': [
    { id: 't1', topic: 'Relational Algebra', subjectName: 'Database Management Systems', durationMinutes: 45, type: 'Read Notes', completed: false },
    { id: 't2', topic: 'OS Memory Partitioning', subjectName: 'Operating Systems', durationMinutes: 60, type: 'Revision', completed: false }
  ],
  'Wednesday': [
    { id: 'w1', topic: 'Graph DFS/BFS traversal', subjectName: 'Data Structures and Algorithms', durationMinutes: 90, type: 'Practice', completed: false }
  ],
  'Thursday': [
    { id: 'th1', topic: 'Normalisation (1NF, 2NF, 3NF)', subjectName: 'Database Management Systems', durationMinutes: 60, type: 'Quiz', completed: false }
  ],
  'Friday': [
    { id: 'f1', topic: 'Java Stream API filter/maps', subjectName: 'Java Programming', durationMinutes: 45, type: 'Practice', completed: false }
  ]
};

export default function StudyPlanPage() {
  // Plan Form State
  const [goal, setGoal] = useState('Mid-Sem Exams Prep');
  const [examDate, setExamDate] = useState('2026-07-28');
  const [dailyHours, setDailyHours] = useState(3);
  const [difficulty, setDifficulty] = useState('Medium');
  const [knowledgeLevel, setKnowledgeLevel] = useState('Intermediate');
  const [preferredTime, setPreferredTime] = useState('Evening');

  // The generated plan lives in the persistent store, so it is still here after
  // a reload instead of dropping the user back on the empty-state form.
  const { studyPlan, savePlan, togglePlanTask } = useStore();
  const planGenerated = studyPlan !== null;

  const dailyTasks = studyPlan?.weeklyTasks[TODAY_KEY] ?? [];
  const weeklySchedule = Object.fromEntries(
    Object.entries(studyPlan?.weeklyTasks ?? {}).filter(([day]) => day !== TODAY_KEY)
  );

  // Generator states
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'calendar'>('daily');

  const [showReplanWarning, setShowReplanWarning] = useState(true);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      savePlan({
        goal,
        targetDate: examDate,
        dailyHours,
        difficulty,
        weeklyTasks: { [TODAY_KEY]: SEED_DAILY, ...SEED_WEEKLY }
      });
      setShowReplanWarning(true);
      setLoading(false);
    }, 1500);
  };

  const handleReplan = () => {
    if (!studyPlan) return;
    setLoading(true);
    setTimeout(() => {
      // Push unfinished sessions later in the day, keeping completed ones put.
      savePlan({
        ...studyPlan,
        weeklyTasks: {
          ...studyPlan.weeklyTasks,
          [TODAY_KEY]: dailyTasks.map(t =>
            t.completed ? t : { ...t, timeSlot: t.timeSlot === '11:00 AM' ? '01:00 PM' : '05:30 PM' }
          )
        }
      });
      setShowReplanWarning(false);
      setLoading(false);
    }, 1000);
  };

  const toggleTask = (id: string) => togglePlanTask(TODAY_KEY, id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">AI Study Planner</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Build automated calendars structured to help you pass exams and placements</p>
      </div>

      {showReplanWarning && planGenerated && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-4 animate-in slide-in-from-top-3 duration-250">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2.5 rounded-xl text-red-600 shrink-0">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-950">You missed a scheduled study session</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5">Would you like AI to adjust your remaining schedule dynamically?</p>
            </div>
          </div>
          <button
            onClick={handleReplan}
            className="bg-brand-gradient text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:shadow-md transition-all shrink-0 cursor-pointer"
          >
            Replan My Schedule
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Plan parameters Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
            <div className="bg-brand-gradient p-2 rounded-xl text-white">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-50">Plan Parameters</h3>
          </div>

          {/* Exam Goal */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Target Exam or Goal</label>
            <input
              type="text"
              required
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Mid-Sem Exams Prep"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
            />
          </div>

          {/* Exam Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Exam Date</label>
            <input
              type="date"
              required
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
            />
          </div>

          {/* Daily hours available */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              <span>Daily Study Limit</span>
              <span className="text-brand-purple text-xs font-bold">{dailyHours} hours</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseInt(e.target.value))}
              className="w-full accent-brand-purple h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Difficulty & Confidence Level */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Difficulty Target</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
              >
                <option value="Easy">Easy Pace</option>
                <option value="Medium">Medium Pace</option>
                <option value="Hard">Intense Pace</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Current Knowledge</label>
              <select
                value={knowledgeLevel}
                onChange={(e) => setKnowledgeLevel(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Study preferred window */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Preferred Study Window</label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white"
            >
              <option value="Morning">Morning (08:00 AM - 12:00 PM)</option>
              <option value="Afternoon">Afternoon (12:00 PM - 04:00 PM)</option>
              <option value="Evening">Evening (04:00 PM - 08:00 PM)</option>
              <option value="Night">Night (08:00 PM - 12:00 AM)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gradient text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <RotateCw className="h-5 w-5 animate-spin" />
            ) : (
              <Calendar className="h-5 w-5" />
            )}
            Generate My Study Plan
          </button>
        </form>

        {/* Right Column: Displays results schedule */}
        <div className="lg:col-span-7 space-y-6">
          
          {loading && (
            <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-12 text-center shadow-sm space-y-4">
              <div className="h-6.5 w-6.5 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto text-brand-purple" />
              <div className="space-y-1">
                <p className="text-sm font-extrabold text-gray-800 dark:text-gray-100 text-center">Synthesizing study calendar...</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">AI is allocating topics across study blocks based on exam distance.</p>
              </div>
            </div>
          )}

          {!loading && !planGenerated && (
            <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-12 text-center shadow-sm space-y-4">
              <div className="bg-purple-50 dark:bg-purple-500/10 p-4 rounded-full text-brand-purple inline-block">
                <Calendar className="h-8 w-8 animate-bounce" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Plan Your Schedule</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                  Complete the target settings on the left and let our spacing algorithms design your learning timeline.
                </p>
              </div>
            </div>
          )}

          {!loading && planGenerated && (
            <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
              
              {/* Header inside result card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-border">
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">{goal} Schedule</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Target: {examDate} ({dailyHours} hrs/day)</p>
                </div>

                {/* View togglers */}
                <div className="flex bg-gray-50 dark:bg-muted p-1 rounded-xl border border-gray-200 dark:border-border self-start sm:self-auto">
                  {([
                    { id: 'daily', label: 'Daily' },
                    { id: 'weekly', label: 'Weekly' },
                    { id: 'calendar', label: 'Calendar' }
                  ] as const).map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        viewMode === mode.id 
                          ? 'bg-white dark:bg-card text-brand-purple shadow-sm font-extrabold' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Panel 1: Daily */}
              {viewMode === 'daily' && (
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Today&apos;s Timeline Blocks</p>
                  
                  <div className="space-y-3">
                    {dailyTasks.map((task) => (
                      <div key={task.id} className="border border-gray-100 dark:border-border rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden bg-white dark:bg-card">
                        <div className="flex items-start gap-3 min-w-0 pr-4">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="text-gray-400 dark:text-gray-500 hover:text-brand-purple mt-0.5 shrink-0"
                          >
                            {task.completed ? (
                              <div className="w-5 h-5 rounded bg-brand-purple text-white flex items-center justify-center">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <span className="text-[9px] font-bold text-brand-purple bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-100/60 inline-block mb-1">
                              {task.subjectName}
                            </span>
                            <h4 className={`text-xs font-bold text-gray-800 dark:text-gray-100 leading-normal truncate ${task.completed ? 'line-through opacity-55' : ''}`}>
                              {task.topic}
                            </h4>
                            <div className="flex items-center gap-2 text-[9px] text-gray-400 dark:text-gray-500 font-semibold mt-1">
                              <span className="bg-gray-50 dark:bg-muted px-1.5 py-0.5 rounded border border-gray-100 dark:border-border">{task.type}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.durationMinutes} min</span>
                            </div>
                          </div>
                        </div>

                        {task.timeSlot && (
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-black text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-[#232235] px-2 py-1 rounded-xl">
                              {task.timeSlot}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View Panel 2: Weekly */}
              {viewMode === 'weekly' && (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {Object.keys(weeklySchedule).map((day) => (
                    <div key={day} className="space-y-2 border-b border-gray-50 pb-4 last:border-b-0 last:pb-0">
                      <h4 className="text-xs font-black text-gray-900 dark:text-gray-50 uppercase tracking-widest">{day}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {weeklySchedule[day].map((task) => (
                          <button
                            key={task.id}
                            type="button"
                            role="checkbox"
                            aria-checked={task.completed}
                            aria-label={`${task.topic} on ${day}. Mark as ${task.completed ? 'not done' : 'done'}.`}
                            onClick={() => togglePlanTask(day, task.id)}
                            className={`text-left border rounded-xl p-3 space-y-1.5 cursor-pointer transition-all hover:border-brand-purple/40 ${
                              task.completed
                                ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-500/10 opacity-70'
                                : 'border-gray-100 dark:border-border bg-white dark:bg-card'
                            }`}
                          >
                            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500">{task.subjectName}</span>
                            <p className={`text-xs font-bold text-gray-800 dark:text-gray-100 line-clamp-1 ${task.completed ? 'line-through' : ''}`}>
                              {task.topic}
                            </p>
                            <div className="flex justify-between items-center text-[9px] text-gray-400 dark:text-gray-500 font-medium">
                              <span>{task.type}</span>
                              <span>{task.durationMinutes} min</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View Panel 3: Calendar */}
              {viewMode === 'calendar' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-muted p-2.5 rounded-xl border border-gray-200 dark:border-border">
                    <button type="button" className="p-1 hover:bg-white dark:hover:bg-card rounded-lg"><ChevronLeft className="h-4 w-4" /></button>
                    <span>July 2026</span>
                    <button type="button" className="p-1 hover:bg-white dark:hover:bg-card rounded-lg"><ChevronRight className="h-4 w-4" /></button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 31 }).map((_, idx) => {
                      const dayNumber = idx + 1;
                      const hasStudyTask = [20, 21, 22, 23, 24, 25, 28].includes(dayNumber);
                      const isToday = dayNumber === 20;

                      return (
                        <div 
                          key={idx} 
                          className={`aspect-square border border-gray-100 dark:border-border rounded-lg flex flex-col justify-between p-1 transition-all ${
                            isToday ? 'bg-purple-100/50 border-brand-purple' : 'bg-white dark:bg-card'
                          }`}
                        >
                          <span className={`text-[10px] font-bold self-start ${isToday ? 'text-brand-purple font-black' : 'text-gray-600 dark:text-gray-300'}`}>{dayNumber}</span>
                          {hasStudyTask && (
                            <span className="w-1.5 h-1.5 bg-brand-purple rounded-full mx-auto mb-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
