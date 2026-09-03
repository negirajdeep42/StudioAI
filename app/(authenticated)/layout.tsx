'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { 
  Sparkles, 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Calendar, 
  Brain, 
  Code, 
  Briefcase, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Bell, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logoutUser, isLoading } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Router guard validation (redirect to login if unauthenticated after loading finishes)
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans">
        <div className="space-y-4 text-center">
          <Sparkles className="h-10 w-10 text-brand-purple animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Initializing your AI StudyOS...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'My Subjects', path: '/subjects', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'AI Notes', path: '/notes', icon: <FileText className="h-5 w-5" /> },
    { name: 'Study Planner', path: '/study-plan', icon: <Calendar className="h-5 w-5" /> },
    { name: 'AI Tutor', path: '/ai-tutor', icon: <Brain className="h-5 w-5" /> },
    { name: 'Coding Tracker', path: '/coding', icon: <Code className="h-5 w-5" /> },
    { name: 'Interview Prep', path: '/interview', icon: <Briefcase className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const notifications = [
    { id: 1, title: 'Deadlock revision overdue', desc: 'Revision suggested based on spacing algorithms.', time: '2 hours ago', read: false },
    { id: 2, title: 'Database quiz complete', desc: 'You scored 78% in normalisation quiz.', time: 'Yesterday', read: true },
    { id: 3, title: 'New coding recommendation', desc: 'AI recommends practicing Graph Traversals.', time: '2 days ago', read: true }
  ];

  return (
    <div className="min-h-screen flex bg-background font-sans overflow-x-hidden">
      
      {/* 1. Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col justify-between border-r border-gray-200 dark:border-border bg-[#111827] text-gray-300 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } shrink-0 sticky top-0 h-screen z-40`}
      >
        <div className="flex flex-col gap-6 pt-6 flex-grow">
          {/* Sidebar Brand Logo Header */}
          <div className={`flex items-center px-4 justify-between ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="bg-brand-gradient p-1.5 rounded-xl text-white shadow-md">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-extrabold text-lg text-white tracking-tight">
                  AI Study<span className="text-brand-purple">OS</span>
                </span>
              )}
            </Link>
            
            {/* Collapse toggle */}
            {!sidebarCollapsed && (
              <button 
                onClick={() => setSidebarCollapsed(true)}
                className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg cursor-pointer"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
            )}
          </div>

          {sidebarCollapsed && (
            <div className="flex justify-center -mt-2 mb-2">
              <button 
                onClick={() => setSidebarCollapsed(false)}
                className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg cursor-pointer"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-grow px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-brand-gradient text-white shadow-md shadow-purple-900/35 scale-[1.02]' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  title={item.name}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Block at bottom */}
        <div className="p-4 border-t border-gray-800 space-y-3">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 bg-gray-900/50 p-2.5 rounded-xl border border-gray-800">
              <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center font-bold text-white uppercase border border-purple-300/30">
                {user.name.slice(0, 2)}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
              <button 
                onClick={logoutUser}
                className="text-gray-400 hover:text-red-400 p-1 hover:bg-gray-800 rounded-lg cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={logoutUser}
              className="w-full flex items-center justify-center p-3 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl cursor-pointer"
              title="Log Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Header bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-card border-b border-gray-150 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          {/* Mobile Hamburg Toggle & Search */}
          <div className="flex items-center gap-4 flex-grow max-w-lg">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Search Bar */}
            <div className="relative w-full hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search notes, schedules, DSA topics..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs transition-all focus:bg-white"
              />
            </div>
          </div>

          {/* Quick actions bar */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Quick Add Button */}
            <div className="relative">
              <button 
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className="bg-brand-gradient text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Add</span>
              </button>
              
              {showQuickAdd && (
                <div className="absolute right-0 mt-2.5 w-48 bg-white dark:bg-card border border-gray-100 dark:border-border rounded-xl shadow-xl p-1.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <Link 
                    href="/subjects" 
                    onClick={() => setShowQuickAdd(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-purple-50 hover:text-brand-purple rounded-lg transition-colors font-medium"
                  >
                    <BookOpen className="h-4 w-4 text-purple-500" /> Add Subject
                  </Link>
                  <Link 
                    href="/notes" 
                    onClick={() => setShowQuickAdd(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-purple-50 hover:text-brand-purple rounded-lg transition-colors font-medium"
                  >
                    <FileText className="h-4 w-4 text-blue-500" /> Generate Note
                  </Link>
                  <Link 
                    href="/study-plan" 
                    onClick={() => setShowQuickAdd(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-purple-50 hover:text-brand-purple rounded-lg transition-colors font-medium"
                  >
                    <Calendar className="h-4 w-4 text-indigo-500" /> Create Study Plan
                  </Link>
                </div>
              )}
            </div>

            {/* Light/dark toggle - reachable from every page, not just Settings */}
            <button
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-purple hover:bg-gray-50 dark:hover:bg-muted rounded-xl transition-all cursor-pointer"
            >
              {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
                aria-expanded={showNotifications}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-purple hover:bg-gray-50 dark:hover:bg-muted rounded-xl relative transition-all cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-card" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-card border border-gray-100 dark:border-border rounded-xl shadow-xl p-3 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-border mb-2">
                    <span className="font-extrabold text-xs text-gray-900 dark:text-gray-50">Notifications</span>
                    <button className="text-[10px] text-brand-purple hover:underline font-bold">Mark all as read</button>
                  </div>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-2 rounded-lg transition-all ${n.read ? 'hover:bg-gray-50 dark:hover:bg-muted' : 'bg-purple-50/50 border-l-2 border-brand-purple'}`}>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-100">{n.title}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-normal">{n.desc}</p>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar Circle */}
            <Link 
              href="/settings" 
              className="w-8.5 h-8.5 rounded-full bg-brand-gradient border border-purple-200/50 flex items-center justify-center font-bold text-white text-xs uppercase"
              title="View settings"
            >
              {user.name.slice(0, 2)}
            </Link>
          </div>
        </header>

        {/* Dynamic page contents render here */}
        <main id="main-content" tabIndex={-1} className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>

      {/* 3. Mobile Navigation Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop blur clickoff */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
          />

          {/* Nav Drawer body */}
          <aside className="relative flex-grow max-w-xs w-full bg-[#111827] text-gray-300 p-6 flex flex-col justify-between animate-in slide-in-from-left duration-250 z-10 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-brand-gradient p-1.5 rounded-xl text-white">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-extrabold text-lg text-white tracking-tight">
                    AI StudyOS
                  </span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? 'bg-brand-gradient text-white shadow-md' 
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Logout Mobile block */}
            <div className="pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutUser();
                }}
                className="w-full flex items-center gap-3 px-3 py-3 text-gray-400 hover:bg-gray-800 hover:text-red-400 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

    </div>
  );
}
