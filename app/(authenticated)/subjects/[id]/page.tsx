'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { TopicProgress } from '@/types';
import { 
  ArrowLeft,  
  BookOpen, 
  FileText, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  Play, 
  BookMarked,
  Brain,
  Send,
  Check,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function SubjectDetailsPage() {
  const params = useParams();
  const subjectId = params.id as string;

  const { subjects, setTopicStatus } = useStore();
  const subject = subjects.find(s => s.id === subjectId) ?? subjects[0];

  // Clicking a topic's status badge cycles it. Subject progress is derived from
  // these statuses in the store, so the ring and the % update with it.
  const TOPIC_CYCLE: TopicProgress['status'][] = ['Not Started', 'In Progress', 'Completed'];
  const cycleTopicStatus = (topic: TopicProgress) => {
    const next = TOPIC_CYCLE[(TOPIC_CYCLE.indexOf(topic.status) + 1) % TOPIC_CYCLE.length];
    setTopicStatus(subject.id, topic.name, next);
  };

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'materials' | 'flashcards' | 'quizzes' | 'progress'>('overview');

  // Flashcards state
  const [currentFlashcardIdx, setCurrentFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const mockFlashcards = [
    { q: 'What is a process in OS?', a: 'An active program in execution containing program code, stack, heap, and registers.' },
    { q: 'What is a deadlock?', a: 'A situation where a set of processes are blocked because each process holds a resource and waits for another resource held by some other process.' },
    { q: 'What are the four necessary conditions for deadlock?', a: 'Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.' },
    { q: 'What is thrashing in OS?', a: 'A state where the system spends more time page faulting and swapping pages in/out of memory than executing actual instructions.' }
  ];

  // Interactive Quiz state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const mockQuiz = [
    {
      q: 'Which deadlock prevention condition is violated by allocating all resources at startup?',
      options: ['Mutual Exclusion', 'Hold and Wait', 'No Preemption', 'Circular Wait'],
      correct: 1,
      explanation: 'Allocating all resources at startup ensures that a process will never have to hold resources and wait for others, eliminating the "Hold and Wait" condition.'
    },
    {
      q: 'What is translation lookaside buffer (TLB)?',
      options: ['A secondary memory buffer', 'A high-speed cache for page table translations', 'A kernel scheduling table', 'An instruction pipeline register'],
      correct: 1,
      explanation: 'TLB is a fast hardware memory cache that stores recent translations of virtual to physical addresses, reducing average memory access times.'
    }
  ];

  // AI chat state
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatLogs, setAiChatLogs] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: `Hi! I'm your AI study assistant for ${subject.name}. What topic or doubt can I clear for you today?` }
  ]);
  const [aiChatLoading, setAiChatLoading] = useState(false);

  const handleAiChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim() || aiChatLoading) return;

    const userMsg = aiChatInput;
    setAiChatLogs(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiChatInput('');
    setAiChatLoading(true);

    setTimeout(() => {
      let aiText = '';
      if (userMsg.toLowerCase().includes('deadlock')) {
        aiText = `Deadlock occurs when four conditions hold simultaneously:
1. **Mutual Exclusion**: Resources cannot be shared.
2. **Hold and Wait**: Process holds a resource and requests more.
3. **No Preemption**: Resources cannot be forcibly taken.
4. **Circular Wait**: A dependency cycle exists.

To handle deadlocks, we can use *prevention* (deny a condition), *avoidance* (e.g. Banker's Algorithm), or *detection and recovery*.`;
      } else {
        aiText = `Got it! Let's explore that topic in ${subject.name}. Could you specify if you'd like a summary, a mock interview question, or a quick multiple-choice quiz on this concept?`;
      }
      setAiChatLogs(prev => [...prev, { sender: 'ai', text: aiText }]);
      setAiChatLoading(false);
    }, 1500);
  };

  const handleQuizAnswer = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedOptionIdx(idx);
  };

  const submitQuizQuestion = () => {
    if (selectedOptionIdx === null) return;
    
    const isCorrect = selectedOptionIdx === mockQuiz[currentQuestionIdx].correct;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    setQuizSubmitted(true);
  };

  const nextQuizQuestion = () => {
    setSelectedOptionIdx(null);
    setQuizSubmitted(false);
    setCurrentQuestionIdx(prev => prev + 1);
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="space-y-6">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/subjects" 
            className="p-2 border border-gray-200 dark:border-border hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 bg-white dark:bg-card rounded-xl transition-all"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{subject.code}</span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subject.color }} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50 mt-0.5">{subject.name}</h1>
          </div>
        </div>

        {/* Ask AI quick button */}
        <button 
          onClick={() => {
            setActiveTab('overview');
            setTimeout(() => {
              const el = document.getElementById('ask-ai-subject-box');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="bg-brand-gradient text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Brain className="h-4 w-4" /> Ask AI About Subject
        </button>
      </div>

      {/* Tabs list bar */}
      <div className="flex border-b border-gray-150 overflow-x-auto gap-6 text-sm font-bold text-gray-400 dark:text-gray-500 shrink-0 pb-1.5">
        {([
          { id: 'overview', label: 'Overview', icon: <Layers className="h-4 w-4" /> },
          { id: 'notes', label: 'AI Notes', icon: <FileText className="h-4 w-4" /> },
          { id: 'materials', label: 'Materials', icon: <BookOpen className="h-4 w-4" /> },
          { id: 'flashcards', label: 'Flashcards', icon: <BookMarked className="h-4 w-4" /> },
          { id: 'quizzes', label: 'Quizzes', icon: <HelpCircle className="h-4 w-4" /> },
          { id: 'progress', label: 'Progress Details', icon: <CheckCircle2 className="h-4 w-4" /> }
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-2.5 border-b-2 cursor-pointer transition-all shrink-0 ${
              activeTab === tab.id 
                ? 'border-brand-purple text-brand-purple font-extrabold scale-[1.02]' 
                : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-650'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Panel Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Topic checklist details */}
              <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Topic Progress Breakdown</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Syllabus requirements and completion status</p>
                </div>

                <div className="divide-y divide-gray-100">
                  {subject.topics.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                          t.status === 'Completed' ? 'border-emerald-500 bg-emerald-50 text-emerald-500' :
                          t.status === 'In Progress' ? 'border-purple-300 bg-purple-50 dark:bg-purple-500/10 text-brand-purple' :
                          'border-gray-200 dark:border-border bg-white dark:bg-card text-gray-300'
                        }`}>
                          {t.status === 'Completed' ? <Check className="h-3.5 w-3.5" /> : <Play className="h-2.5 w-2.5" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-100">{t.name}</p>
                          <span className={`inline-block text-[9px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                            t.difficulty === 'Hard' ? 'bg-red-50 dark:bg-red-500/10 text-red-600' :
                            t.difficulty === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700' :
                            'bg-blue-50 dark:bg-blue-500/10 text-blue-600'
                          }`}>
                            {t.difficulty} Topic
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => cycleTopicStatus(t)}
                        title="Click to change status"
                        aria-label={`${t.name}: ${t.status}. Click to change status.`}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all hover:ring-2 hover:ring-brand-purple/30 ${
                          t.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' :
                          t.status === 'In Progress' ? 'bg-purple-50 dark:bg-purple-500/10 text-brand-purple' :
                          'bg-gray-100 dark:bg-[#232235] text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {t.status}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent uploaded files */}
              <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Recent Study Materials</h3>
                  <button 
                    onClick={() => setActiveTab('materials')} 
                    className="text-xs font-bold text-brand-purple hover:underline"
                  >
                    View all materials
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-gray-100 dark:border-border p-3 rounded-2xl flex items-center gap-3">
                    <div className="bg-red-50 dark:bg-red-500/10 p-2.5 rounded-xl text-red-500 shadow-sm shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">Lec-3_Processes.pdf</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5">PDF Document • 2.4 MB</p>
                    </div>
                  </div>
                  <div className="border border-gray-100 dark:border-border p-3 rounded-2xl flex items-center gap-3">
                    <div className="bg-purple-50 dark:bg-purple-500/10 p-2.5 rounded-xl text-brand-purple shadow-sm shrink-0">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">Syllabus_Outline.docx</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5">DOCX Document • 45 KB</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: AI Notes */}
          {activeTab === 'notes' && (
            <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-border">
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">AI Generated Study Notes</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Quick summaries and questions made by AI from uploads</p>
                </div>
                <Link 
                  href="/notes" 
                  className="bg-brand-gradient text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  Generate New Note
                </Link>
              </div>

              <div className="space-y-4">
                <div className="border border-purple-100 dark:border-purple-500/20 bg-purple-50/20 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                  <span className="bg-purple-100 text-brand-purple text-[9px] font-bold px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-500/30">
                    Latest Summary
                  </span>
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">Summarized Guide: Process Synchronization & Mutexes</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    A Mutex (mutual exclusion object) is a synchronization primitive used to protect shared data structures from simultaneous access. It acts as a lock. A binary semaphore can be used similarly but supports signaling between threads, whereas locks have ownership states...
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button className="text-[11px] font-bold text-brand-purple hover:underline cursor-pointer">Read Full Guide</button>
                    <button className="text-[11px] font-bold text-gray-400 dark:text-gray-500 hover:text-gray-650 cursor-pointer">Export Markdown</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Materials Uploads */}
          {activeTab === 'materials' && (
            <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Syllabus & Lecture Notes</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Reference sheets and lecture presentations uploads</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Lecture-2_CPU-Scheduling.pdf', size: '4.8 MB', type: 'PDF' },
                  { name: 'Lec-4_Semaphores_Monitor.pdf', size: '1.9 MB', type: 'PDF' },
                  { name: 'Midterm_Prep_Outline.docx', size: '120 KB', type: 'DOCX' },
                  { name: 'Disk_Scheduling_Slides.pptx', size: '8.2 MB', type: 'PPTX' }
                ].map((doc, idx) => (
                  <div key={idx} className="border border-gray-100 dark:border-border hover:border-purple-100 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl text-white shrink-0 ${
                        doc.type === 'PDF' ? 'bg-red-500' :
                        doc.type === 'DOCX' ? 'bg-blue-500' :
                        'bg-amber-500'
                      }`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate group-hover:text-brand-purple transition-colors">{doc.name}</p>
                        <p className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5">{doc.type} Document • {doc.size}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Flashcards */}
          {activeTab === 'flashcards' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Active Recall Flashcards</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Click to flip the card and check the definition</p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-bold">
                    Card {currentFlashcardIdx + 1} of {mockFlashcards.length}
                  </span>
                </div>

                {/* Flip Card Container */}
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full min-h-[220px] bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 border border-purple-100 dark:border-purple-500/20 hover:border-purple-200 cursor-pointer rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all select-none shadow-sm relative"
                >
                  <div className="absolute top-3.5 right-4 flex items-center gap-1.5 text-[9px] font-bold text-purple-600 uppercase tracking-widest bg-purple-100/50 px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-500/20">
                    <Layers className="h-3 w-3 animate-pulse" />
                    <span>Click to flip</span>
                  </div>

                  {isFlipped ? (
                    <div className="space-y-2 animate-in flip-in-y duration-300">
                      <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Answer</p>
                      <p className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100 leading-relaxed max-w-md">
                        {mockFlashcards[currentFlashcardIdx].a}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 animate-in flip-in-y duration-300">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Question</p>
                      <p className="text-base sm:text-lg font-black text-gray-900 dark:text-gray-50 leading-relaxed max-w-md">
                        {mockFlashcards[currentFlashcardIdx].q}
                      </p>
                    </div>
                  )}
                </div>

                {/* Flashcards controls */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    disabled={currentFlashcardIdx === 0}
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentFlashcardIdx(prev => prev - 1);
                    }}
                    className="px-4 py-2 border border-gray-200 dark:border-border text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-muted disabled:opacity-40 cursor-pointer"
                  >
                    Previous Card
                  </button>
                  <button
                    disabled={currentFlashcardIdx === mockFlashcards.length - 1}
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentFlashcardIdx(prev => prev + 1);
                    }}
                    className="px-5 py-2 bg-brand-gradient text-white text-xs font-bold rounded-xl hover:shadow-md disabled:opacity-40 cursor-pointer"
                  >
                    Next Card
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Quizzes */}
          {activeTab === 'quizzes' && (
            <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-border">
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Subject Practice Quiz</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Test your concepts and see explanations immediately</p>
                </div>
              </div>

              {currentQuestionIdx < mockQuiz.length ? (
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-400 dark:text-gray-500">
                    <span>Question {currentQuestionIdx + 1} of {mockQuiz.length}</span>
                    <span>Current Score: {quizScore}/{currentQuestionIdx}</span>
                  </div>

                  {/* Question Title */}
                  <h4 className="font-extrabold text-sm sm:text-base text-gray-800 dark:text-gray-100 leading-normal">
                    {mockQuiz[currentQuestionIdx].q}
                  </h4>

                  {/* Options List */}
                  <div className="space-y-2">
                    {mockQuiz[currentQuestionIdx].options.map((opt, oIdx) => {
                      let btnStyle = 'border-gray-200 dark:border-border bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted text-gray-700 dark:text-gray-200';
                      
                      if (selectedOptionIdx === oIdx) {
                        btnStyle = 'border-brand-purple bg-purple-50 dark:bg-purple-500/10 text-brand-purple font-semibold';
                      }

                      if (quizSubmitted) {
                        if (oIdx === mockQuiz[currentQuestionIdx].correct) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-600 font-bold';
                        } else if (selectedOptionIdx === oIdx) {
                          btnStyle = 'border-red-400 bg-red-50/50 text-red-600';
                        } else {
                          btnStyle = 'border-gray-100 dark:border-border bg-white dark:bg-card text-gray-400 dark:text-gray-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleQuizAnswer(oIdx)}
                          className={`w-full p-3.5 border rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && oIdx === mockQuiz[currentQuestionIdx].correct && (
                            <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanatory text */}
                  {quizSubmitted && (
                    <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 p-4 rounded-2xl space-y-1.5 animate-in fade-in duration-200">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">AI Explanation</p>
                      <p className="text-xs text-gray-750 leading-relaxed font-medium">
                        {mockQuiz[currentQuestionIdx].explanation}
                      </p>
                    </div>
                  )}

                  {/* Submission and continuation controls */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                    {!quizSubmitted ? (
                      <button
                        onClick={submitQuizQuestion}
                        disabled={selectedOptionIdx === null}
                        className="px-5 py-2 bg-brand-gradient text-white text-xs font-bold rounded-xl hover:shadow-md disabled:opacity-40 cursor-pointer"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={nextQuizQuestion}
                        className="px-5 py-2 bg-brand-gradient text-white text-xs font-bold rounded-xl hover:shadow-md cursor-pointer flex items-center gap-1"
                      >
                        {currentQuestionIdx === mockQuiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-5 animate-in zoom-in-95 duration-200">
                  <div className="inline-flex bg-purple-50 dark:bg-purple-500/10 text-brand-purple p-4 rounded-full border border-purple-100 dark:border-purple-500/20">
                    <CheckCircle2 className="h-10 w-10 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-gray-800 dark:text-gray-100 text-lg">Quiz Completed!</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">You scored <strong>{quizScore} out of {mockQuiz.length}</strong> questions correctly.</p>
                  </div>
                  <button
                    onClick={resetQuiz}
                    className="px-5 py-2 bg-brand-gradient text-white text-xs font-bold rounded-xl hover:shadow-md cursor-pointer"
                  >
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 6: Progress Detail */}
          {activeTab === 'progress' && (
            <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Progress Detail Breakdown</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Advanced stats mapping your learning behavior</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-purple-50/50 border border-purple-100 dark:border-purple-500/20 p-5 rounded-2xl">
                  <p className="text-2xl font-black text-brand-purple">
                    {subject.topics.filter(t => t.status === 'Completed').length}
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Completed Topics</p>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl">
                  <p className="text-2xl font-black text-blue-600">
                    {subject.topics.filter(t => t.status === 'In Progress').length}
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">In Progress</p>
                </div>
                <div className="bg-red-50/50 border border-red-100 p-5 rounded-2xl">
                  <p className="text-2xl font-black text-red-500">
                    {subject.topics.filter(t => t.status === 'Not Started').length}
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Not Started</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Ask AI Contextual panel */}
          <div id="ask-ai-subject-box" className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-brand-gradient p-2 rounded-xl text-white">
                <Brain className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Ask AI Subject Tutor</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Questions are context-aware of syllabus</p>
              </div>
            </div>

            {/* Chat message window */}
            <div className="border border-gray-100 dark:border-border rounded-2xl p-3 bg-gray-50 dark:bg-muted space-y-3 max-h-64 overflow-y-auto">
              {aiChatLogs.map((log, i) => (
                <div key={i} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    log.sender === 'user' 
                      ? 'bg-brand-gradient text-white shadow-sm rounded-tr-none' 
                      : 'bg-white dark:bg-card border border-gray-200 dark:border-border text-gray-700 dark:text-gray-200 rounded-tl-none font-medium'
                  }`}>
                    {log.text}
                  </div>
                </div>
              ))}
              {aiChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-card border border-gray-200 dark:border-border p-2.5 rounded-2xl rounded-tl-none text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-brand-purple border-t-transparent rounded-full animate-spin shrink-0" />
                    AI is writing...
                  </div>
                </div>
              )}
            </div>

            {/* Input field */}
            <form onSubmit={handleAiChatSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder={`Ask about ${subject.name}...`}
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                disabled={aiChatLoading}
                className="flex-grow px-3 py-2 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
              />
              <button
                type="submit"
                disabled={aiChatLoading || !aiChatInput.trim()}
                className="bg-brand-gradient text-white p-2 rounded-xl hover:shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Quick study metrics card */}
          <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-100">Syllabus Coverage</h4>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-purple-100 dark:border-purple-500/20 flex items-center justify-center font-black text-brand-purple text-base">
                {subject.progress}%
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-850">Outstanding Progress</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-normal font-semibold">
                  Complete {subject.topics.filter(t => t.status !== 'Completed').length} more topics to cover the curriculum before exams.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
