'use client';

import React, { useState } from 'react';
import {  
  Send,  
  Plus, 
  MessageSquare,  
  Info
} from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { AiError, streamTutor } from '@/lib/ai-client';

interface ChatSession {
  id: string;
  title: string;
  subjectName: string;
  date: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function AiTutorPage() {
  const { subjects } = useStore();

  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 's1', title: 'Normalisation Normal Forms (1NF-3NF)', subjectName: 'DBMS', date: 'Today' },
    { id: 's2', title: 'Critical Section Solutions (Mutex/Sem)', subjectName: 'Operating Systems', date: 'Yesterday' },
    { id: 's3', title: 'Binary Tree Level Order Traversal', subjectName: 'DSA', date: '3 days ago' }
  ]);
  const [activeSessionId, setActiveSessionId] = useState('s1');

  // Input states
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState<'Explain' | 'Teach Me' | 'Quiz Me' | 'Give Me a Hint' | 'Step-by-Step'>('Explain');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');

  // Chat message state
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', sender: 'ai', text: `Hi! I am your AI Study Tutor. I'm ready to explain complex ideas, run interactive quizzes, or review code. 

Currently, I'm configured in **${activeMode}** mode for **${subjects.find(s => s.id === selectedSubjectId)?.name || 'your subjects'}**. How can I help you today?`, timestamp: '12:45 PM' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const modes = ['Explain', 'Teach Me', 'Quiz Me', 'Give Me a Hint', 'Step-by-Step'] as const;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || chatLoading) return;

    const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: now()
    };

    // Claude needs the whole thread each turn - the API is stateless.
    const history = [...messages, userMessage].map((m) => ({
      role: (m.sender === 'ai' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: m.text
    }));

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setChatLoading(true);

    // Empty assistant bubble that fills in as tokens arrive.
    const replyId = `ai-${Date.now()}`;
    setMessages(prev => [...prev, { id: replyId, sender: 'ai', text: '', timestamp: now() }]);

    try {
      await streamTutor(
        {
          messages: history,
          subject: subjects.find(s => s.id === selectedSubjectId)?.name,
          difficulty: selectedDifficulty,
          mode: activeMode
        },
        (chunk) => {
          setMessages(prev =>
            prev.map(m => (m.id === replyId ? { ...m, text: m.text + chunk } : m))
          );
        }
      );
    } catch (error) {
      const message = error instanceof AiError ? error.message : 'Something went wrong. Please try again.';
      setMessages(prev => prev.map(m => (m.id === replyId ? { ...m, text: `⚠️ ${message}` } : m)));
    } finally {
      setChatLoading(false);
    }
  };


  const startNewConversation = () => {
    const newSession: ChatSession = {
      id: `s-${Date.now()}`,
      title: `New Doubt: ${subjects.find(s => s.id === selectedSubjectId)?.name}`,
      subjectName: subjects.find(s => s.id === selectedSubjectId)?.code || 'GEN',
      date: 'Today'
    };

    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setMessages([
      { 
        id: `m-new`, 
        sender: 'ai', 
        text: `New conversation started about **${subjects.find(s => s.id === selectedSubjectId)?.name}**. Ask me any conceptual question!`, 
        timestamp: 'Just now' 
      }
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8.5rem)] items-stretch">
      
      {/* Left Column: Previous conversations sidebar */}
      <div className="hidden lg:flex lg:col-span-3 bg-white dark:bg-card border border-gray-150 rounded-3xl p-4 flex-col justify-between shadow-sm">
        <div className="space-y-4 flex-grow flex flex-col min-h-0">
          <button
            onClick={startNewConversation}
            className="w-full bg-brand-gradient text-white py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" /> New Conversation
          </button>

          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 shrink-0">Recent Conversations</p>
          
          <div className="space-y-1.5 overflow-y-auto flex-grow pr-1">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSessionId(s.id);
                  // Mock change of logs
                  setMessages([
                    { id: 'm-restored', sender: 'ai', text: `Restored conversation regarding "${s.title}". How can we proceed?`, timestamp: 'Restored' }
                  ]);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all border flex items-start gap-2.5 cursor-pointer ${
                  activeSessionId === s.id 
                    ? 'border-brand-purple bg-purple-50/50 text-brand-purple' 
                    : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-muted'
                }`}
              >
                <MessageSquare className="h-4.5 w-4.5 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate leading-tight">{s.title}</p>
                  <div className="flex gap-2 items-center mt-1 text-[9px] text-gray-400 dark:text-gray-500 font-semibold">
                    <span className="bg-gray-100 dark:bg-[#232235] px-1 py-0.5 rounded text-gray-500 dark:text-gray-400">{s.subjectName}</span>
                    <span>{s.date}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-border pt-3 mt-3 shrink-0 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 font-semibold">
          <Info className="h-4 w-4 shrink-0 text-brand-purple" />
          <span>Tutor answers are based on academic syllabus logs.</span>
        </div>
      </div>

      {/* Right Column: Chat interface */}
      <div className="col-span-1 lg:col-span-9 bg-white dark:bg-card border border-gray-150 rounded-3xl shadow-sm flex flex-col justify-between overflow-hidden">
        
        {/* Chat Control Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 shrink-0">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3.5">
            {/* Subject Dropdown */}
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setMessages(prev => [...prev, { id: `sys-${Date.now()}`, sender: 'ai', text: `Switched topic context to **${subjects.find(s => s.id === e.target.value)?.name}**.`, timestamp: 'System' }]);
              }}
              className="px-3 py-1.5 bg-white dark:bg-card border border-gray-250 rounded-xl text-[10px] font-bold focus:border-brand-purple"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            {/* Difficulty select */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-card border border-gray-250 rounded-xl text-[10px] font-bold focus:border-brand-purple"
            >
              <option value="Easy">Explain Simpler (Easy)</option>
              <option value="Medium">Standard Depth (Medium)</option>
              <option value="Hard">Rigorous Proofs (Hard)</option>
            </select>
          </div>

          {/* Quick Chat Modes Selector */}
          <div className="flex overflow-x-auto gap-1 pb-1 sm:pb-0">
            {modes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setActiveMode(m);
                  setMessages(prev => [...prev, { id: `m-mode-${Date.now()}`, sender: 'ai', text: `Tutor switched to **${m}** mode.`, timestamp: 'System' }]);
                }}
                className={`px-3 py-1.5 border rounded-xl text-[9px] font-extrabold cursor-pointer transition-all shrink-0 ${
                  activeMode === m 
                    ? 'border-brand-purple bg-purple-50 dark:bg-purple-500/10 text-brand-purple' 
                    : 'border-gray-200 dark:border-border bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted text-gray-500 dark:text-gray-400'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Chat message flow */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4 min-h-0 bg-gray-50/20">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-150`}
            >
              <div className="max-w-[85%] sm:max-w-lg space-y-1">
                <div className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user' 
                    ? 'bg-brand-gradient text-white shadow-md shadow-purple-900/10 rounded-tr-none' 
                    : 'bg-white dark:bg-card border border-gray-150 text-gray-800 dark:text-gray-100 rounded-tl-none shadow-sm font-medium'
                }`}>
                  {msg.text}
                </div>
                <span className={`text-[9px] text-gray-400 dark:text-gray-500 font-semibold block px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-card border border-gray-150 p-4 rounded-3xl rounded-tl-none text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 shadow-sm font-semibold">
                <div className="h-4 w-4 border-2 border-brand-purple border-t-transparent rounded-full animate-spin shrink-0" />
                Tutor is writing explanation...
              </div>
            </div>
          )}
        </div>

        {/* Input Text Form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-border flex gap-3 bg-white dark:bg-card shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything about your studies... (e.g. explain process state lifecycle)"
            disabled={chatLoading}
            className="flex-grow px-4 py-3 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs focus:bg-white focus:border-brand-purple transition-all"
          />
          <button
            type="submit"
            disabled={chatLoading || !inputText.trim()}
            className="bg-brand-gradient text-white px-5 rounded-xl hover:shadow-lg transition-all flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

      </div>
    </div>
  );
}
