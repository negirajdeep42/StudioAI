'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Code, 
  Flame, 
  Trophy, 
  GitBranch, 
  Link2, 
  CheckCircle2,  
  Check
} from 'lucide-react';
import { mockCodingStats } from '@/lib/mock-data';
import { useStore } from '@/lib/store-context';
import { clamp } from '@/lib/utils';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function CodingTrackerPage() {
  const [stats, setStats] = useState(mockCodingStats);
  const [githubConnected, setGithubConnected] = useState(false);
  const [leetcodeConnected, setLeetcodeConnected] = useState(false);

  // Today's coding goal is persisted and resets itself each calendar day.
  const { codingGoal, incrementSolved, setCodingTarget } = useStore();
  const goalMet = codingGoal.solved >= codingGoal.target;

  // Generate a mock grid of 14 weeks (98 days) for the contribution heatmap
  // Value ranges: 0 (no activity), 1-2 (low), 3-4 (medium), 5+ (high)
  const heatmapData = [
    0, 2, 4, 1, 0, 5, 3, 2, 0, 1, 3, 0, 4, 2, 1, 6, 0, 2, 3, 1, 0,
    4, 5, 2, 0, 1, 0, 3, 4, 2, 6, 0, 1, 2, 4, 0, 3, 5, 1, 0, 2, 3,
    0, 1, 4, 2, 0, 5, 6, 1, 0, 3, 2, 4, 0, 1, 3, 0, 2, 5, 4, 1, 0,
    2, 3, 0, 1, 4, 2, 5, 3, 0, 6, 2, 1, 0, 4, 3, 2, 5, 0, 1, 0, 3,
    4, 2, 1, 5, 0, 2, 3, 1, 0, 4, 6, 2, 3, 0
  ];

  const getHeatmapColor = (val: number) => {
    if (val === 0) return 'bg-gray-100 dark:bg-[#232235]';
    if (val <= 2) return 'bg-emerald-200 text-emerald-800';
    if (val <= 4) return 'bg-emerald-400 text-white';
    return 'bg-emerald-600 text-white';
  };

  const handleConnectGithub = () => {
    setGithubConnected(true);
    // update mock stats
    setStats(prev => ({
      ...prev,
      streak: prev.streak + 2,
      solvedCount: {
        ...prev.solvedCount,
        total: prev.solvedCount.total + 15,
        easy: prev.solvedCount.easy + 10,
        medium: prev.solvedCount.medium + 5
      }
    }));
  };

  const handleConnectLeetcode = () => {
    setLeetcodeConnected(true);
    setStats(prev => ({
      ...prev,
      solvedCount: {
        ...prev.solvedCount,
        total: prev.solvedCount.total + 42,
        easy: prev.solvedCount.easy + 20,
        medium: prev.solvedCount.medium + 18,
        hard: prev.solvedCount.hard + 4
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">Coding Tracker</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitor programming streaking and algorithmic problem-solving diagnostics</p>
        </div>
        
        {/* Integrations panel */}
        <div className="flex items-center gap-2">
          {!githubConnected ? (
            <button
              onClick={handleConnectGithub}
              className="bg-white dark:bg-card border border-gray-250 hover:bg-gray-50 dark:hover:bg-muted text-gray-700 dark:text-gray-200 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <GithubIcon className="h-4 w-4" /> Connect GitHub
            </button>
          ) : (
            <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Check className="h-4 w-4" /> GitHub Connected
            </span>
          )}

          {!leetcodeConnected ? (
            <button
              onClick={handleConnectLeetcode}
              className="bg-white dark:bg-card border border-gray-250 hover:bg-gray-50 dark:hover:bg-muted text-gray-700 dark:text-gray-200 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Link2 className="h-4 w-4" /> Connect LeetCode
            </button>
          ) : (
            <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Check className="h-4 w-4" /> LeetCode Connected
            </span>
          )}
        </div>
      </div>

      {/* Stats row cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-card border border-gray-150 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="bg-purple-50 dark:bg-purple-500/10 p-3 rounded-2xl text-brand-purple shrink-0">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Total Solved</p>
            <h3 className="text-xl font-black text-gray-800 dark:text-gray-100">{stats.solvedCount.total} Qs</h3>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">LeetCode & platforms</p>
          </div>
        </div>

        <div className="bg-white dark:bg-card border border-gray-150 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="bg-red-50 dark:bg-red-500/10 p-3 rounded-2xl text-red-500 shrink-0">
            <Flame className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Coding Streak</p>
            <h3 className="text-xl font-black text-gray-800 dark:text-gray-100">{stats.streak} Days</h3>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">Longest: {stats.longestStreak} days</p>
          </div>
        </div>

        <div className="bg-white dark:bg-card border border-gray-150 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 shrink-0">
            <Code className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Easy / Medium</p>
            <h3 className="text-xl font-black text-gray-800 dark:text-gray-100">
              <span className="text-emerald-600">{stats.solvedCount.easy}</span>
              <span className="text-gray-300 mx-1">/</span>
              <span className="text-yellow-600">{stats.solvedCount.medium}</span>
            </h3>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">Completed questions</p>
          </div>
        </div>

        <div className="bg-white dark:bg-card border border-gray-150 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="bg-pink-50 p-3 rounded-2xl text-pink-500 shrink-0">
            <GitBranch className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Hard Solved</p>
            <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 text-pink-600">{stats.solvedCount.hard} Qs</h3>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">Advanced algorithms</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Heatmap and submissions */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Heatmap graph container */}
          <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Activity Heatmap</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Mock representation of daily code pushes and submissions</p>
            </div>

            {/* Matrix box */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-1 min-w-[500px]">
                {/* 14 weeks column loops */}
                {Array.from({ length: 14 }).map((_, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, dIdx) => {
                      const idx = wIdx * 7 + dIdx;
                      const val = heatmapData[idx] || 0;
                      return (
                        <div
                          key={dIdx}
                          className={`w-3.5 h-3.5 rounded-sm hover:ring-2 hover:ring-brand-purple/50 transition-all ${getHeatmapColor(val)}`}
                          title={`${val} submissions on index ${idx}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider pt-2 border-t border-gray-50">
              <span>Less</span>
              <div className="flex gap-1 items-center">
                <div className="w-3 h-3 bg-gray-100 dark:bg-[#232235] rounded-sm" />
                <div className="w-3 h-3 bg-emerald-200 rounded-sm" />
                <div className="w-3 h-3 bg-emerald-400 rounded-sm" />
                <div className="w-3 h-3 bg-emerald-600 rounded-sm" />
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Recent submissions list */}
          <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Recent Submissions</h3>
            <div className="divide-y divide-gray-100">
              {stats.recentSubmissions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0 pr-4">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">{sub.title}</p>
                    <div className="flex items-center gap-2 text-[9px] text-gray-400 dark:text-gray-500 font-semibold mt-1">
                      <span className={`px-1.5 py-0.5 rounded border ${
                        sub.difficulty === 'Hard' ? 'border-red-100 text-red-500' :
                        sub.difficulty === 'Medium' ? 'border-yellow-200 text-yellow-600' :
                        'border-emerald-100 text-emerald-600'
                      }`}>{sub.difficulty}</span>
                      <span>{sub.language}</span>
                    </div>
                  </div>
                  
                  <div className="shrink-0 text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sub.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 dark:bg-red-500/10 text-red-500'
                    }`}>
                      {sub.status}
                    </span>
                    <span className="text-[9px] text-gray-400 dark:text-gray-500 block mt-1 font-semibold">{sub.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Weak topics, recommendations, goal */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Daily Goal card */}
          <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-brand-gradient p-2 rounded-xl text-white">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Today&apos;s Coding Goal</h3>
            </div>

            <div
              className={`border p-4 rounded-2xl space-y-3 transition-all ${
                goalMet
                  ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-500/10'
                  : 'border-purple-100 dark:border-purple-500/20 bg-purple-50/10 dark:bg-purple-500/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  goalMet ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-purple-300'
                }`}>
                  {goalMet && <Check className="h-3 w-3" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100">
                    Solve {codingGoal.target} problem{codingGoal.target === 1 ? '' : 's'} today
                  </p>
                  <p className="text-[9px] text-gray-450 mt-0.5">
                    {goalMet ? 'Goal met - streak stays alive 🔥' : 'Keeps your streak alive'}
                  </p>
                </div>
              </div>

              {/* Progress toward the goal */}
              <div
                className="w-full bg-gray-150 h-2 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={codingGoal.solved}
                aria-valuemin={0}
                aria-valuemax={codingGoal.target}
                aria-label="Problems solved today"
              >
                <div
                  className={`h-full rounded-full transition-all ${goalMet ? 'bg-emerald-500' : 'bg-brand-gradient'}`}
                  style={{ width: `${Math.min(100, (codingGoal.solved / Math.max(1, codingGoal.target)) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-gray-800 dark:text-gray-100">
                  {codingGoal.solved} / {codingGoal.target} solved
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => incrementSolved(-1)}
                    disabled={codingGoal.solved === 0}
                    aria-label="Remove one solved problem"
                    className="w-7 h-7 rounded-lg border border-gray-200 dark:border-border text-gray-600 dark:text-gray-300 font-bold cursor-pointer hover:bg-gray-50 dark:hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => incrementSolved(1)}
                    aria-label="Log one solved problem"
                    className="w-7 h-7 rounded-lg bg-brand-gradient text-white font-bold cursor-pointer shadow-sm hover:shadow-md"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Adjust the daily target */}
            <label className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Daily target
              <input
                type="number"
                min={1}
                max={20}
                value={codingGoal.target}
                onChange={(e) => setCodingTarget(clamp(Number(e.target.value) || 1, 1, 20))}
                className="w-16 border border-gray-200 dark:border-border rounded-lg px-2 py-1 text-xs font-bold text-gray-800 dark:text-gray-100 bg-transparent text-center"
              />
            </label>
          </div>

          {/* AI Recommendation */}
          <div className="bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 border border-purple-100 dark:border-purple-500/20 rounded-3xl p-6 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-brand-purple shrink-0" />
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-50">AI Coding Recommendation</h4>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white dark:bg-card border border-purple-100/50 p-3.5 rounded-2xl text-xs leading-relaxed text-gray-700 dark:text-gray-200 font-medium">
                &ldquo;Dynamic Programming is currently your weakest topic. Try focusing on overlapping subproblems first.&rdquo;
              </div>
              <ul className="text-[10px] text-gray-500 dark:text-gray-400 font-bold space-y-1.5 pl-1.5">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0" />
                  Solve 5 Easy DP problems
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0" />
                  Solve 5 Medium DP problems
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0" />
                  Review Memoization patterns
                </li>
              </ul>
            </div>
          </div>

          {/* Weak vs Strong list bars */}
          <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-50">Topic Performance</h4>
            
            {/* Weak topics bars */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Weak Topics</p>
              {stats.weakTopics.map((topic, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-gray-650">
                    <span>{topic}</span>
                    <span>{(35 + idx * 8)}% confidence</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-[#232235] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-400 h-full" style={{ width: `${(35 + idx * 8)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Strong topics bars */}
            <div className="space-y-3 pt-2">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Strong Topics</p>
              {stats.strongTopics.map((topic, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-gray-650">
                    <span>{topic}</span>
                    <span>{(82 + idx * 5)}% confidence</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-[#232235] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${(82 + idx * 5)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
