'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Briefcase,   
  Play, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  X
} from 'lucide-react';
import { mockInterviewQuestions as initialQuestions } from '@/lib/mock-data';
import { AiError, postJson, streamTutor } from '@/lib/ai-client';

export default function InterviewPrepPage() {
  // Config states
  const [role, setRole] = useState('Software Engineer');
  const [experience, setExperience] = useState('Entry Level (0-2 yrs)');
  const [techStack, setTechStack] = useState('React, Java, Spring Boot');

  // Question list state
  const [questions, setQuestions] = useState(initialQuestions);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [configError, setConfigError] = useState('');

  // Mock interview state
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [interviewStep, setInterviewStep] = useState(0);
  const [interviewText, setInterviewText] = useState('');
  const [interviewLogs, setInterviewLogs] = useState<{ speaker: 'interviewer' | 'candidate'; text: string; feedback?: string }[]>([
    { speaker: 'interviewer', text: 'Welcome to your AI Mock Interview. Let\'s start: Can you explain the difference between a process and a thread?' }
  ]);
  const [interviewLoading, setInterviewLoading] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setConfigError('');

    try {
      const result = await postJson<{
        questions: { question: string; answer: string; category: 'Technical' | 'Behavioral' | 'HR' }[];
      }>('/api/interview', { role, experience, technologies: techStack, count: 8 });

      setQuestions(
        result.questions.map((q, i) => ({
          id: `q-${Date.now()}-${i}`,
          question: q.question,
          answer: q.answer,
          category: q.category,
          role
        }))
      );
      setExpandedId(null);
    } catch (error) {
      setConfigError(
        error instanceof AiError ? error.message : 'Could not generate questions. Try again.'
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleSendInterviewMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewText.trim() || interviewLoading) return;

    const candidateMsg = interviewText;
    const priorLogs = interviewLogs;
    setInterviewLogs(prev => [...prev, { speaker: 'candidate', text: candidateMsg }]);
    setInterviewText('');
    setInterviewLoading(true);
    setInterviewStep(s => s + 1);

    setInterviewLogs(prev => [...prev, { speaker: 'interviewer', text: '' }]);

    try {
      await streamTutor(
        {
          messages: [
            ...priorLogs.map((l) => ({
              role: (l.speaker === 'interviewer' ? 'assistant' : 'user') as 'user' | 'assistant',
              content: l.text
            })),
            { role: 'user' as const, content: candidateMsg }
          ],
          subject: `${role} interview${techStack ? ` (${techStack})` : ''}`,
          difficulty: experience,
          mode: 'Interview'
        },
        (chunk) => {
          setInterviewLogs(prev =>
            prev.map((l, i) => (i === prev.length - 1 ? { ...l, text: l.text + chunk } : l))
          );
        }
      );
    } catch (error) {
      const message = error instanceof AiError ? error.message : 'Something went wrong. Please try again.';
      setInterviewLogs(prev =>
        prev.map((l, i) => (i === prev.length - 1 ? { ...l, text: `⚠️ ${message}` } : l))
      );
    } finally {
      setInterviewLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">Interview Preparation</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Practice technical questions and complete realistic mock behavioral interviews</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Parameters Form */}
        <div className="lg:col-span-5 space-y-6">
          
          <form onSubmit={handleUpdateConfig} className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
              <div className="bg-brand-gradient p-2 rounded-xl text-white">
                <Briefcase className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-50">Target Role Profile</h3>
            </div>

            {/* Target Role dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Target Job Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Java Backend Developer">Java Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Data Scientist">Data Scientist</option>
              </select>
            </div>

            {/* Experience level */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
              >
                <option value="Internship">Internship Level</option>
                <option value="Entry Level (0-2 yrs)">Entry Level (0-2 yrs)</option>
                <option value="Mid Level (3-5 yrs)">Mid Level (3-5 yrs)</option>
              </select>
            </div>

            {/* Technology input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tech Stack / Core Topics</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="React, Java, PostgreSQL"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
              />
            </div>

            {configError && (
              <div
                role="alert"
                className="bg-red-50 dark:bg-red-500/10 border border-red-200 text-red-700 dark:text-red-400 text-xs font-bold p-3 rounded-xl"
              >
                {configError}
              </div>
            )}

            <button
              type="submit"
              disabled={generating}
              className="w-full bg-brand-gradient text-white py-3 rounded-xl font-bold hover:shadow-md transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 animate-spin" /> Generating questions...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" /> Generate Questions
                </>
              )}
            </button>
          </form>

          {/* Progress metric */}
          <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-100">Preparation Progress</h4>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-100 flex items-center justify-center font-black text-emerald-600 text-base">
                60%
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-850">Mock Interview Score</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-normal font-semibold">
                  You have completed 3 mock sessions. Keep practicing behavioral answers to boost your ranking index.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Questions list / Mock simulator */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Mock interview simulator trigger */}
          {!isInterviewing ? (
            <div className="bg-gradient-to-r from-purple-500/5 to-indigo-500/5 border border-purple-100 dark:border-purple-500/20 rounded-3xl p-6 shadow-sm relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-36 h-36 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-xl text-brand-purple shadow-sm">
                  <Sparkles className="h-4.5 w-4.5 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-50">Start AI Mock Interview</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Simulated interview with real-time feedback scores</p>
                </div>
              </div>
              
              <p className="text-xs text-gray-650 leading-relaxed font-medium">
                Our interviewer agent will ask technical and behavioral questions tailored to **{role}** profile, checking your explanations dynamically.
              </p>
              
              <button
                onClick={() => setIsInterviewing(true)}
                className="bg-brand-gradient text-white px-5 py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
              >
                <Play className="h-4 w-4" /> Start AI Mock Interview
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[400px] space-y-4 animate-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-border shrink-0">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 p-1.5 rounded-lg text-brand-purple shrink-0">
                    <MessageSquare className="h-4 w-4 animate-pulse" />
                  </div>
                  <span className="font-extrabold text-xs text-gray-900 dark:text-gray-50">AI Mock Interview Simulator</span>
                </div>
                <button 
                  onClick={() => {
                    setIsInterviewing(false);
                    setInterviewStep(0);
                    setInterviewLogs([{ speaker: 'interviewer', text: 'Welcome to your AI Mock Interview. Let\'s start: Can you explain the difference between a process and a thread?' }]);
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-[#232235] rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Chat screen logs */}
              <div className="flex-grow overflow-y-auto space-y-4 max-h-72 p-3 bg-gray-50/50 rounded-2xl border border-gray-100 dark:border-border">
                {interviewLogs.map((log, idx) => (
                  <div key={idx} className="space-y-3">
                    {/* Feedback block */}
                    {log.feedback && (
                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-2.5 rounded-xl text-[10px] leading-relaxed max-w-sm mx-auto font-medium">
                        <strong>AI Interviewer Feedback:</strong> {log.feedback}
                      </div>
                    )}
                    
                    {/* Msg */}
                    <div className={`flex ${log.speaker === 'candidate' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                        log.speaker === 'candidate' 
                          ? 'bg-brand-gradient text-white shadow-sm' 
                          : 'bg-white dark:bg-card border border-gray-250 text-gray-700 dark:text-gray-200 font-medium'
                      }`}>
                        {log.text}
                      </div>
                    </div>
                  </div>
                ))}
                {interviewLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-card border border-gray-200 dark:border-border p-2.5 rounded-2xl text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
                      <div className="h-3.5 w-3.5 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
                      Interviewer is thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Inputs */}
              <form onSubmit={handleSendInterviewMessage} className="flex gap-2 pt-2 border-t border-gray-50 shrink-0">
                <input
                  type="text"
                  value={interviewText}
                  onChange={(e) => setInterviewText(e.target.value)}
                  placeholder="Type your response here..."
                  disabled={interviewLoading}
                  className="flex-grow px-3 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
                />
                <button
                  type="submit"
                  disabled={interviewLoading || !interviewText.trim()}
                  className="bg-brand-gradient text-white px-4 rounded-xl hover:shadow-md cursor-pointer disabled:opacity-40"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </form>

            </div>
          )}

          {/* AI generated Q&A lists */}
          <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Recommended Interview Q&A</h3>
            
            <div className="space-y-3">
              {questions.map((q) => {
                const isExpanded = expandedId === q.id;
                return (
                  <div key={q.id} className="border border-gray-100 dark:border-border rounded-2xl overflow-hidden bg-white dark:bg-card shadow-sm transition-all hover:border-purple-100">
                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="w-full p-4 text-left flex items-start justify-between gap-3 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="bg-purple-50 dark:bg-purple-500/10 text-brand-purple text-[9px] font-bold px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-500/20">
                          {q.category} • {q.role}
                        </span>
                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight mt-1">
                          {q.question}
                        </h4>
                      </div>
                      
                      <div className="p-1 hover:bg-gray-50 dark:hover:bg-muted rounded-lg text-gray-400 dark:text-gray-500 shrink-0 mt-0.5">
                        {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium bg-purple-50/5 border-t border-gray-50 animate-in fade-in duration-200">
                        <p className="whitespace-pre-wrap">{q.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
