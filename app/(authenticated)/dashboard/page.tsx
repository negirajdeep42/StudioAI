'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useStore } from '@/lib/store-context';
import { formatMinutes } from '@/lib/utils';
import { AiError, streamTutor } from '@/lib/ai-client';
import {
  mockDeadlines,
  mockRecommendations
} from '@/lib/mock-data';
import { 
  Sparkles,  
  Flame, 
  Clock,  
  ChevronRight, 
  CheckCircle2,  
  Send,
  CheckSquare,
  Square,
  Brain
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Tasks, subjects and study time live in the persistent store, so ticking a
  // task off survives a reload instead of resetting to the mock data.
  const {
    tasks,
    subjects,
    toggleTask,
    logStudyMinutes,
    streak,
    todayStudyMinutes,
    isHydrated,
  } = useStore();

  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Completing a task banks its minutes; unchecking it takes them back, which
  // is what actually drives the streak and today's total.
  const handleToggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) logStudyMinutes(task.completed ? -task.durationMinutes : task.durationMinutes);
    toggleTask(id);
  };

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const question = aiInput;
    setAiLoading(true);
    setAiResponse('');

    try {
      // Streams straight into the panel, so the answer appears as it is written.
      await streamTutor(
        {
          messages: [{ role: 'user', content: question }],
          subject: subjects.map((s) => s.name).join(', '),
          mode: 'Explain'
        },
        (chunk) => setAiResponse((prev) => (prev ?? '') + chunk)
      );
    } catch (error) {
      setAiResponse(
        `⚠️ ${error instanceof AiError ? error.message : 'Something went wrong. Please try again.'}`
      );
    } finally {
      setAiLoading(false);
    }
  };

  const selectSuggestion = (text: string) => {
    setAiInput(text);
  };

  const activeTasksCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="space-y-6">
      {/* 1. Welcoming Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-card border border-gray-150 p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2 text-brand-purple text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>AI StudyOS Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-50 leading-tight">
            {getGreeting()}, {user?.name || 'Student'}!
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Quick Streak Bar */}
        <div className="flex gap-4 shrink-0 z-10">
          <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-2xl p-4 flex items-center gap-3">
            <div className="bg-brand-gradient p-2.5 rounded-xl text-white shadow-md shadow-purple-200">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Study Streak</p>
              <p className="text-md font-extrabold text-gray-800 dark:text-gray-100">
                {isHydrated ? streak : 0} {streak === 1 ? 'Day' : 'Days'} 🔥
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="bg-blue-500 p-2.5 rounded-xl text-white shadow-md shadow-blue-200">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Today&apos;s Study</p>
              <p className="text-md font-extrabold text-gray-800 dark:text-gray-100">
                {isHydrated ? formatMinutes(todayStudyMinutes) : '0m'} ⏳
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Grid: Focus, Progress, Recommendations */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Today's Focus checklist */}
          <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Today&apos;s Focus</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">You have {activeTasksCount} tasks remaining for today</p>
              </div>
              <Link 
                href="/study-plan" 
                className="bg-brand-gradient text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Start Studying
              </Link>
            </div>

            {tasks.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <CheckCircle2 className="h-8 w-8 text-brand-purple" />
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">Nothing left for today</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Generate a study plan to line up your next session.
                </p>
              </div>
            )}

            <div className="divide-y divide-gray-100 dark:divide-border">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-start justify-between py-3.5 first:pt-0 last:pb-0 transition-all ${
                    task.completed ? 'opacity-55' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 flex-grow min-w-0 pr-4">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={task.completed}
                      aria-label={`Mark "${task.title}" as ${task.completed ? 'not done' : 'done'}`}
                      onClick={() => handleToggleTask(task.id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-brand-purple cursor-pointer mt-0.5 shrink-0"
                    >
                      {task.completed ? (
                        <CheckSquare className="h-5 w-5 text-brand-purple" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-300" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold text-gray-800 dark:text-gray-100 ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                        <span className="bg-gray-100 dark:bg-[#232235] px-2 py-0.5 rounded-full">{task.subjectName}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {task.durationMinutes} min
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-bold ${
                          task.priority === 'High' ? 'bg-red-50 dark:bg-red-500/10 text-red-600' :
                          task.priority === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700' :
                          'bg-blue-50 dark:bg-blue-500/10 text-blue-600'
                        }`}>
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Progress Grid */}
          <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Subject Progress</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Overview of active courses this term</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.slice(0, 4).map((sub) => (
                <div key={sub.id} className="border border-gray-100 dark:border-border hover:border-purple-100 p-4.5 rounded-2xl space-y-4 hover:shadow-md transition-all bg-white dark:bg-card relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{sub.code}</span>
                      <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100 line-clamp-1 group-hover:text-brand-purple transition-colors">{sub.name}</h4>
                    </div>
                    <div 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: sub.color }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
                      <span>Course Progress</span>
                      <span>{sub.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-brand-gradient h-full rounded-full transition-all"
                        style={{ width: `${sub.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 font-semibold pt-1 border-t border-gray-50">
                    <span>{sub.notesCount} notes • {sub.quizzesCount} quizzes</span>
                    <Link 
                      href={`/subjects/${sub.id}`} 
                      className="text-brand-purple hover:underline flex items-center gap-0.5 font-bold"
                    >
                      Study <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendation panel */}
          <div className="bg-gradient-to-r from-purple-500/5 to-indigo-500/5 border border-purple-100 dark:border-purple-500/20 rounded-3xl p-6 relative overflow-hidden space-y-4 shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-2 rounded-xl text-brand-purple shadow-sm">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-50">Recommended for You</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">AI study suggestions tailored to your gaps</p>
              </div>
            </div>

            <div className="bg-white dark:bg-card border border-purple-100/50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="bg-purple-50 dark:bg-purple-500/10 text-brand-purple text-[9px] font-bold px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-500/20">
                  {mockRecommendations[0].subjectName}
                </span>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-normal">
                  {mockRecommendations[0].message}
                </p>
              </div>
              <Link
                href={`/subjects/${mockRecommendations[0].subjectId}`}
                className="bg-brand-gradient text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:shadow-md transition-all shrink-0 cursor-pointer text-center w-full sm:w-auto"
              >
                Start Revision
              </Link>
            </div>
          </div>

        </div>

        {/* Right Grid: Upcoming deadlines & Quick AI Assistant */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Upcoming Schedule/Deadlines */}
          <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Upcoming Deadlines</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Exams, tasks, and project submissions</p>
            </div>

            <div className="space-y-3">
              {mockDeadlines.map((dl) => (
                <div key={dl.id} className="border border-gray-50 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-muted transition-all flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight truncate">{dl.title}</p>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold mt-1">{dl.subjectName}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      dl.countdownDays <= 3 ? 'bg-red-50 dark:bg-red-500/10 text-red-600' :
                      dl.countdownDays <= 5 ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700' :
                      'bg-purple-50 dark:bg-purple-500/10 text-brand-purple'
                    }`}>
                      {dl.countdownDays} days left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Assistant component */}
          <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-brand-gradient p-2 rounded-xl text-white">
                <Brain className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Quick AI Assistant</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Ask the tutor anything instantly</p>
              </div>
            </div>

            {aiResponse ? (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="bg-purple-50/50 border border-purple-100 dark:border-purple-500/20 rounded-xl p-3 text-xs leading-relaxed text-gray-700 dark:text-gray-200 whitespace-pre-line max-h-48 overflow-y-auto font-medium">
                  {aiResponse}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setAiResponse(null);
                      setAiInput('');
                    }}
                    className="flex-grow border border-gray-250 text-gray-600 dark:text-gray-300 text-xs font-bold py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-muted transition-colors cursor-pointer"
                  >
                    Ask another question
                  </button>
                  <Link 
                    href="/ai-tutor"
                    className="bg-brand-gradient text-white text-xs font-bold px-4 py-2 rounded-xl hover:shadow-md transition-all text-center flex items-center justify-center cursor-pointer"
                  >
                    Open Tutor
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAiSearch} className="space-y-4">
                <div className="relative">
                  <textarea
                    rows={3}
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="What do you want to learn today?"
                    className="w-full p-3.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white resize-none"
                    disabled={aiLoading}
                  />
                  <button 
                    type="submit"
                    disabled={aiLoading || !aiInput.trim()}
                    className="absolute right-2.5 bottom-3 text-brand-purple hover:text-purple-800 disabled:opacity-30 transition-opacity cursor-pointer p-1 rounded-lg hover:bg-purple-50"
                  >
                    {aiLoading ? (
                      <div className="h-4.5 w-4.5 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>

                {/* AI Prompt Suggestions */}
                <div className="space-y-1.5">
                  <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Quick Suggestions</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      'Explain normalisation form 3NF',
                      'Quiz me on Thread sync',
                      'Explain BFS vs DFS traversal',
                      'Help me outline DP patterns'
                    ].map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => selectSuggestion(sug)}
                        className="p-2 bg-gray-50 dark:bg-muted border border-gray-150 rounded-xl text-left text-[10px] text-gray-600 dark:text-gray-300 font-medium hover:bg-purple-50 hover:text-brand-purple hover:border-purple-100 transition-all truncate cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
