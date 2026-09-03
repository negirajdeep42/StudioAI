'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Code, 
  Brain, 
  LayoutDashboard, 
  CheckCircle2, 
  Menu, 
  X, 
  ArrowRight,
  Users,
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-purple-500" />,
      title: 'AI-Powered Notes',
      desc: 'Upload study material and automatically generate notes, summaries, flashcards, quizzes, and important exam questions.',
    },
    {
      icon: <Calendar className="h-6 w-6 text-indigo-500" />,
      title: 'Smart Study Planner',
      desc: 'Create personalized study schedules based on exam dates, subjects, difficulty, and available study hours.',
    },
    {
      icon: <Brain className="h-6 w-6 text-blue-500" />,
      title: 'AI Study Tutor',
      desc: 'Ask questions, understand difficult concepts, get hints, and test your knowledge interactively.',
    },
    {
      icon: <Code className="h-6 w-6 text-pink-500" />,
      title: 'Coding Tracker',
      desc: 'Track DSA progress, coding streaks, weak topics, and programming activity automatically.',
    },
    {
      icon: <Users className="h-6 w-6 text-emerald-500" />,
      title: 'Interview Preparation',
      desc: 'Practice technical questions, generate interview Q&A, and prepare for specific roles with AI mock interviews.',
    },
    {
      icon: <LayoutDashboard className="h-6 w-6 text-amber-500" />,
      title: 'Unified Dashboard',
      desc: 'Manage tasks, exams, subjects, study progress, and upcoming deadlines from one single workspace.',
    }
  ];

  const steps = [
    { number: '01', title: 'Create your account', desc: 'Sign up in seconds and get immediate access to AI study tools.' },
    { number: '02', title: 'Set up academic profile', desc: 'Input your college, degree, and semester details to personalize the AI model.' },
    { number: '03', title: 'Add study materials', desc: 'Upload PDFs, textbooks, or write prompts for the subjects you want to cover.' },
    { number: '04', title: 'Let AI organize & improve', desc: 'Let AI generate custom summaries, planners, code suggestions, and mock interviews.' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-border bg-card/80 dark:bg-card/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-gradient p-2 rounded-xl text-white shadow-md shadow-purple-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-gray-50">
              AI Study<span className="text-brand-purple">OS</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-purple transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-purple transition-colors">How It Works</a>
            <a href="#ai-tools" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-purple transition-colors">AI Tools</a>
            <a href="#students" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-purple transition-colors">For Students</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-brand-purple transition-colors">
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="bg-brand-gradient text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-purple-200 hover:shadow-lg hover:shadow-purple-300 transition-all hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile hamburger menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#232235] transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-gray-700 dark:text-gray-200" /> : <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-border bg-white dark:bg-card px-4 pt-4 pb-6 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-5 duration-200">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 hover:text-brand-purple transition-all"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 hover:text-brand-purple transition-all"
            >
              How It Works
            </a>
            <a 
              href="#ai-tools" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 hover:text-brand-purple transition-all"
            >
              AI Tools
            </a>
            <a 
              href="#students" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 hover:text-brand-purple transition-all"
            >
              For Students
            </a>
            <div className="h-px bg-gray-100 dark:bg-[#232235] my-2" />
            <Link 
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center w-full py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-muted border border-gray-200 dark:border-border"
            >
              Log In
            </Link>
            <Link 
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center w-full py-2.5 rounded-xl bg-brand-gradient text-white font-semibold shadow-md shadow-purple-200"
            >
              Get Started Free
            </Link>
          </div>
        )}
      </header>

      <main id="main-content" tabIndex={-1} className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Decorative background blobs */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms]" />
          <div className="absolute top-40 right-10 w-[300px] h-[300px] bg-blue-200/40 rounded-full blur-3xl -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column Info */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 px-3.5 py-1.5 rounded-full text-brand-purple text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Generation Student Workspace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight leading-[1.1]">
                Your AI-Powered <br />
                <span className="text-brand-gradient">Operating System</span> <br />
                for Studying
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                Organize your subjects, turn study material into smart notes, build personalized study plans, track your coding journey, and prepare for exams—all with AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
                <Link 
                  href="/signup" 
                  className="bg-brand-gradient text-white text-center px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#how-it-works" 
                  className="bg-white dark:bg-card border border-gray-200 dark:border-border text-gray-700 dark:text-gray-200 text-center px-8 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-muted transition-colors flex items-center justify-center gap-2"
                >
                  See How It Works
                </a>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Customized to your degree</span>
                </div>
              </div>
            </div>

            {/* Right Column App Preview Mockup */}
            <div className="lg:col-span-5 relative w-full max-w-lg mx-auto">
              <div className="relative bg-white dark:bg-card border border-gray-150 shadow-2xl rounded-2xl overflow-hidden aspect-[4/3] p-1.5 ring-8 ring-gray-100">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 pointer-events-none" />
                {/* Simulated Desktop App Header */}
                <div className="bg-gray-50 dark:bg-muted border-b border-gray-100 dark:border-border rounded-t-xl px-4 py-3 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <div className="h-4 bg-gray-200 rounded-md w-32 ml-4 flex items-center justify-center text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                    studyos.ai/dashboard
                  </div>
                </div>
                {/* Simulated UI Content */}
                <div className="p-4 space-y-4 text-xs">
                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-purple-50 dark:bg-purple-500/10 p-2.5 rounded-xl border border-purple-100/50">
                      <p className="text-[10px] text-purple-600 font-medium">Study Streak</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-100">5 Days 🔥</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-500/10 p-2.5 rounded-xl border border-blue-100/50">
                      <p className="text-[10px] text-blue-600 font-medium">Solved DSA</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-100">228 Qs 💻</p>
                    </div>
                    <div className="bg-pink-50 p-2.5 rounded-xl border border-pink-100/50">
                      <p className="text-[10px] text-pink-600 font-medium">Exam Date</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-100">5 Days ⏳</p>
                    </div>
                  </div>

                  {/* Recommendation Card */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 dark:border-purple-500/20 rounded-xl p-3 flex items-start gap-2.5">
                    <div className="bg-white dark:bg-card p-1.5 rounded-lg text-purple-600 shadow-sm">
                      <Brain className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-[11px]">AI Study Recommendation</p>
                      <p className="text-gray-600 dark:text-gray-300 text-[10px] mt-0.5">
                        &ldquo;You haven&apos;t revised Deadlocks in 7 days. Spend 30 minutes reviewing it today.&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Subject Grid */}
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-[10px] uppercase tracking-wider">Subject Tracker</p>
                    <div className="bg-white dark:bg-card border border-gray-100 dark:border-border rounded-xl p-3 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-200">Operating Systems</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-150 h-2 rounded-full overflow-hidden">
                          <div className="bg-brand-gradient h-full w-[78%]" />
                        </div>
                        <span className="font-bold text-gray-800 dark:text-gray-100">78%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-28 bg-white dark:bg-card border-y border-gray-100 dark:border-border relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-brand-purple text-sm font-bold uppercase tracking-wider">Everything You Need</h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
                Designed to accelerate your study potential
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                AI StudyOS combines notes, calendars, flashcards, coding diagnostics, and exam prep into one supercharged student interface.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <div 
                  key={i} 
                  className="bg-white dark:bg-card border border-gray-100 dark:border-border hover:border-purple-200 p-8 rounded-2xl text-left shadow-sm hover:shadow-xl transition-all duration-350 hover:-translate-y-1 relative overflow-hidden group"
                >
                  <div className="bg-gray-50 dark:bg-muted group-hover:bg-purple-50 p-4 rounded-xl inline-block mb-6 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-gray-50 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 lg:py-28 bg-background relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-brand-purple text-sm font-bold uppercase tracking-wider">Simple Setup</h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
                How AI StudyOS Works
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Four simple steps to transform your academic routine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <div key={i} className="text-left space-y-4 relative">
                  <div className="text-5xl font-black text-purple-100 select-none">{step.number}</div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-50">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-card">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-brand-gradient rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-purple-200">
              <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative space-y-6 max-w-xl mx-auto flex flex-col items-center">
                <Sparkles className="h-10 w-10 text-purple-200 animate-bounce" />
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  Ready to Study Smarter?
                </h2>
                <p className="text-purple-100 text-base leading-relaxed">
                  Join thousands of students turning raw textbooks and PDFs into structured study maps, active-recall quizzes, and placement coding schedules.
                </p>
                <Link 
                  href="/signup" 
                  className="bg-white dark:bg-card text-brand-purple hover:bg-gray-50 dark:hover:bg-muted px-8 py-4 rounded-xl font-bold shadow-md shadow-purple-950/20 hover:shadow-lg transition-all hover:-translate-y-0.5 inline-block"
                >
                  Start Your AI StudyOS
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-brand-gradient p-1.5 rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                AI Study<span className="text-brand-purple">OS</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              Your complete AI-powered study companion, optimizing notes, schedules, flashcards, coding tracker, and exam preps.
            </p>
            <p className="text-xs">&copy; {new Date().getFullYear()} AI StudyOS. All rights reserved.</p>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Log In</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider mb-4">Features</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">AI Summary</a></li>
              <li><a href="#" className="hover:text-white transition-colors">DSA Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mock Interviews</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
