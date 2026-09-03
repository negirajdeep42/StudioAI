'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  Trash2, 
  Copy,  
  RefreshCw, 
  Save, 
  Send, 
  Brain,
  Check,
  MessageSquare,
  HelpCircle,
  FileCheck,
  Layers
} from 'lucide-react';
import { useStore } from '@/lib/store-context';

export default function NotesPage() {
  // Subjects and the saved-note library both come from the persistent store.
  const { subjects, notes, saveNote, deleteNote } = useStore();
  const [savedFeedback, setSavedFeedback] = useState('');

  // Form State
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0].id);
  const [generationType, setGenerationType] = useState('Smart Notes');
  const [rawText, setRawText] = useState('');
  
  // File Upload state
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Processing state
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [outputContent, setOutputContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Document Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatLogs, setChatLogs] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Upload a document or paste text on the left, then ask me to explain, summarize, or quiz you on it!' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile && !rawText.trim()) return;

    setLoading(true);
    setOutputContent(null);

    // Multi-stage loader simulation
    const steps = [
      'Uploading study material...',
      'Extracting document content...',
      'Running AI analysis & summaries...',
      'Formatting markdown notes...'
    ];

    let currentStep = 0;
    setLoadingStep(steps[currentStep]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setLoadingStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        
        // Generate content based on selection
        let output = '';
        const sourceName = uploadedFile ? uploadedFile.name : 'Pasted Text';
        
        if (generationType === 'Smart Notes') {
          output = `# Smart Notes: ${sourceName}

## 1. Executive Summary
This document outlines core parameters regarding the requested topic, specifically covering scheduling policies, mutual exclusion, and transactional constraints.

## 2. Core Concepts
* **Concurrency Constraints**: Ensuring atomic execution.
* **Semaphores**: Variable or abstract data type used to control access to a common resource by multiple threads.
* **Preemption Limitations**: How the kernel manages processes.

## 3. Review Questions
1. Detail the critical difference between binary semaphores and lock mutexes.
2. In what scenarios does starvation occur under priority scheduling algorithms?`;
        } else if (generationType === 'Quick Summary') {
          output = `# Quick Summary: ${sourceName}

**Overview**: The uploaded material focuses on synchronisation overhead in modern OS kernels. It details how locks protect resources but introduce bottlenecks.

**Key Takeaways**:
* CPU scheduling algorithms dictate wait times.
* Mutex ownership ensures data safety but can result in priority inversion.
* Developers must minimize lock holding periods to optimize multicore scaling.`;
        } else if (generationType === 'Flashcards') {
          output = `# Generated Flashcards

### Flashcard 1
* **Front**: What is the primary difference between a process and a thread?
* **Back**: A process has its own address space, whereas threads of the same process share memory.

### Flashcard 2
* **Front**: What does ACID stand for in DBMS?
* **Back**: Atomicity, Consistency, Isolation, Durability.`;
        } else {
          output = `# AI Generated Practice Quiz

1. **Which of the following is NOT an ACID property?**
   * A) Atomicity
   * B) Consistency
   * C) Concurrency (Correct)
   * D) Durability
   * *Explanation*: ACID stands for Atomicity, Consistency, Isolation, Durability. Concurrency is not one of them.

2. **In OS, a critical section is a program segment:**
   * A) Where shared resources are accessed (Correct)
   * B) Which executes in user mode only
   * C) Which handles system startup
   * D) Protected from virtual memory faults`;
        }

        setOutputContent(output);
        setLoading(false);
        setChatLogs([
          { sender: 'ai', text: `I have parsed "${sourceName}" and generated your ${generationType}! You can read the output or ask me specific questions about it here.` }
        ]);
      }
    }, 1200);
  };

  const handleCopy = () => {
    if (!outputContent) return;
    navigator.clipboard.writeText(outputContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToLibrary = () => {
    if (!outputContent) return;
    const subject = subjects.find((s) => s.id === selectedSubjectId);
    const sourceName = uploadedFile ? uploadedFile.name : 'Pasted Text';

    saveNote({
      title: `${generationType}: ${sourceName}`,
      subjectId: selectedSubjectId,
      subjectName: subject?.name ?? 'General',
      content: outputContent,
      // The first non-heading line doubles as the card preview.
      summary: outputContent.split('\n').find((l) => l.trim() && !l.startsWith('#'))?.slice(0, 140) ?? '',
      flashcards: [],
      quiz: [],
      importantQuestions: []
    });

    setSavedFeedback('Saved to your library.');
    setTimeout(() => setSavedFeedback(''), 2500);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userQuery = chatInput;
    setChatLogs(prev => [...prev, { sender: 'user', text: userQuery }]);
    setChatInput('');
    setChatLoading(true);

    setTimeout(() => {
      let response = `Based on your uploaded study guide, here is the answer: 

The primary issue highlighted is resource contention. When multiple processes request access to the same database row, locks are placed which queue additional processes. You can optimize this by normalizing tables or indexing foreign keys.`;
      
      if (userQuery.toLowerCase().includes('quiz')) {
        response = `Here is a quick question from your document:

**What condition occurs when process A waits for resource B held by process B, which is waiting for resource A?**
*Answer*: Circular Wait (Deadlock condition).`;
      }
      
      setChatLogs(prev => [...prev, { sender: 'ai', text: response }]);
      setChatLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">AI Note Generator</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Transform textbooks, images, and notes into structured active recall material</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Creator inputs */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 bg-white dark:bg-card border border-gray-150 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
            <div className="bg-brand-gradient p-2 rounded-xl text-white">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-50">Upload & Configure</h3>
          </div>

          {/* Subject selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Associate with Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          {/* Upload Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Upload Study Material</label>
            
            {uploadedFile ? (
              <div className="border border-purple-100 dark:border-purple-500/20 bg-purple-50/20 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-brand-gradient p-2.5 rounded-xl text-white shrink-0 shadow-sm">
                    <FileCheck className="h-5 w-5 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">{uploadedFile.name}</p>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5">{uploadedFile.size}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                  title="Remove file"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                  dragActive 
                    ? 'border-brand-purple bg-purple-50/50' 
                    : 'border-gray-250 bg-gray-50 dark:bg-muted hover:bg-gray-100/50'
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.pptx,.png,.jpg,.jpeg,.txt"
                />
                <label htmlFor="file-upload" className="w-full cursor-pointer flex flex-col items-center">
                  <UploadCloud className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-1" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Drag & drop your files here</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Supports PDF, DOCX, PPT, JPG, PNG (Max 15MB)</span>
                  <span className="text-[10px] font-bold text-brand-purple hover:underline mt-2 inline-block">or click to browse</span>
                </label>
              </div>
            )}
          </div>

          {/* Text area fallback */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              <span>Or Paste Study Text</span>
              <span className="text-gray-400 dark:text-gray-500 font-medium">{rawText.length} chars</span>
            </div>
            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste lecture logs, syllabus guidelines, or paragraphs you need summarized..."
              className="w-full p-3.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white resize-none"
            />
          </div>

          {/* Output selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">AI Output Choice</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Smart Notes', icon: <FileText className="h-3.5 w-3.5" /> },
                { name: 'Quick Summary', icon: <Sparkles className="h-3.5 w-3.5" /> },
                { name: 'Flashcards', icon: <Layers className="h-3.5 w-3.5" /> },
                { name: 'Quiz', icon: <HelpCircle className="h-3.5 w-3.5" /> }
              ].map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => setGenerationType(opt.name)}
                  className={`p-2.5 border rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-2 transition-all ${
                    generationType === opt.name 
                      ? 'border-brand-purple bg-purple-50 dark:bg-purple-500/10 text-brand-purple shadow-sm' 
                      : 'border-gray-200 dark:border-border bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted text-gray-650'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (!uploadedFile && !rawText.trim())}
            className="w-full bg-brand-gradient text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Brain className="h-5 w-5" />
            )}
            Generate with AI
          </button>
        </form>

        {/* Right Column: Generation outputs & doc chat */}
        <div className="lg:col-span-7 space-y-6">
          
          {loading && (
            <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-12 text-center shadow-sm space-y-4 animate-pulse">
              <div className="h-6.5 w-6.5 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto text-brand-purple" />
              <div className="space-y-1">
                <p className="text-sm font-extrabold text-gray-800 dark:text-gray-100">{loadingStep}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">AI is analyzing your material to synthesize markdown formatting.</p>
              </div>
            </div>
          )}

          {!loading && !outputContent && (
            <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-12 text-center shadow-sm space-y-4">
              <div className="bg-purple-50 dark:bg-purple-500/10 p-4 rounded-full text-brand-purple inline-block">
                <Brain className="h-8 w-8 animate-pulse" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">Awaiting Document</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Upload a PDF textbook or paste a raw draft on the left, then click Generate to create active recall materials.
                </p>
              </div>
            </div>
          )}

          {savedFeedback && (
            <div
              role="status"
              className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold p-3 rounded-xl flex items-center gap-2"
            >
              <Check className="h-4 w-4" /> {savedFeedback}
            </div>
          )}

          {!loading && outputContent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Generated notes viewer */}
              <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between min-h-[350px]">
                <div className="space-y-3 flex-grow">
                  <div className="flex justify-between items-center pb-2.5 border-b border-gray-100">
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-100/50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {generationType} Output
                    </span>
                    
                    {/* Notes Actions */}
                    <div className="flex gap-1.5 shrink-0">
                      <button 
                        onClick={handleCopy}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-brand-purple hover:bg-purple-50 rounded-lg cursor-pointer transition-colors"
                        title="Copy note"
                      >
                        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={handleSaveToLibrary}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-brand-purple hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg cursor-pointer transition-colors"
                        title="Save to library"
                        aria-label="Save these notes to your library"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Markdown content */}
                  <div className="prose prose-purple max-h-80 overflow-y-auto text-xs leading-relaxed text-gray-700 dark:text-gray-200 whitespace-pre-wrap font-medium">
                    {outputContent}
                  </div>
                </div>
              </div>

              {/* Chat with Document component */}
              <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[350px] space-y-4">
                <div className="space-y-3 flex-grow">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-gray-100">
                    <div className="bg-purple-100 p-1.5 rounded-lg text-brand-purple">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <span className="font-extrabold text-xs text-gray-900 dark:text-gray-50">Chat With Document</span>
                  </div>

                  {/* Chat message history */}
                  <div className="border border-gray-100 dark:border-border rounded-2xl p-2.5 bg-gray-50 dark:bg-muted space-y-2.5 max-h-56 overflow-y-auto">
                    {chatLogs.map((log, i) => (
                      <div key={i} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded-xl text-[10px] max-w-[85%] leading-relaxed ${
                          log.sender === 'user' 
                            ? 'bg-brand-gradient text-white shadow-sm' 
                            : 'bg-white dark:bg-card border border-gray-200 dark:border-border text-gray-700 dark:text-gray-200 font-medium'
                        }`}>
                          {log.text}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-card border border-gray-200 dark:border-border p-2 rounded-xl text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                          <div className="h-3.5 w-3.5 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
                          AI researching...
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Question Input */}
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask doc: explain simply..."
                    disabled={chatLoading}
                    className="flex-grow px-3 py-2 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-[11px] focus:bg-white focus:border-brand-purple"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="bg-brand-gradient text-white p-2 rounded-xl hover:shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-40"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* Saved note library - persisted, so it survives a reload */}
          {notes.length > 0 && (
            <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 dark:bg-purple-500/15 p-1.5 rounded-lg text-brand-purple">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-sm">Your Note Library</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {notes.length} saved
                </span>
              </div>

              <ul className="divide-y divide-gray-100 dark:divide-border">
                {notes.map((note) => (
                  <li key={note.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => setOutputContent(note.content)}
                      className="text-left min-w-0 flex-grow cursor-pointer group"
                    >
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate group-hover:text-brand-purple transition-colors">
                        {note.title}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{note.summary}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[9px] font-bold text-gray-400 dark:text-gray-500">
                        <span className="bg-gray-100 dark:bg-[#232235] px-2 py-0.5 rounded-full">{note.subjectName}</span>
                        <time dateTime={note.createdAt} suppressHydrationWarning>
                          {new Date(note.createdAt).toLocaleDateString()}
                        </time>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteNote(note.id)}
                      aria-label={`Delete note "${note.title}"`}
                      className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
