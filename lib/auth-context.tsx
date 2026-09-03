'use client';

import React, { createContext, useContext, useMemo, useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/types';

const SESSION_KEY = 'studyos_user';

/* ------------------------------------------------------------------ *
 * Session store.
 *
 * sessionStorage is an external system, so the recovered session lives
 * outside React and is read through useSyncExternalStore. Server and
 * first client render both see `null`, then subscribe() swaps in the
 * saved session after mount - no hydration mismatch, and no setState
 * inside an effect.
 * ------------------------------------------------------------------ */

interface SessionSnapshot {
  user: User | null;
  /** False until sessionStorage has been read. */
  hydrated: boolean;
}

const SERVER_SNAPSHOT: SessionSnapshot = { user: null, hydrated: false };

let current: SessionSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function readSession(): User | null {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? (JSON.parse(saved) as User) : null;
  } catch {
    return null;
  }
}

function writeSession(user: User | null) {
  try {
    if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable - session simply won't survive a reload */
  }
}

function setUser(user: User | null) {
  current = { user, hydrated: true };
  writeSession(user);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // React calls subscribe after mount, the first point at which
  // sessionStorage is safe to touch.
  if (!current.hydrated) {
    current = { user: readSession(), hydrated: true };
    queueMicrotask(emit);
  }

  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => current;
const getServerSnapshot = () => SERVER_SNAPSHOT;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  updateOnboarding: (data: Partial<User>) => Promise<boolean>;
  updateUserPreferences: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Tracks the simulated network round-trips, separate from session recovery.
  const [isPending, setIsPending] = useState(false);
  const isLoading = !hydrated || isPending;

  const router = useRouter();
  const pathname = usePathname();

  // Simple client-side route guard
  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ['/', '/login', '/signup', '/forgot-password'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      router.push('/login');
    } else if (user && isPublicPath && pathname !== '/') {
      // If logged in and trying to go to login/signup, redirect to dashboard
      router.push('/dashboard');
    }
  }, [user, pathname, isLoading, router]);

  const value = useMemo<AuthContextType>(() => {
    const loginUser = async (email: string, password: string): Promise<boolean> => {
      setIsPending(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Validate simple login for demo
      if (email && password.length >= 8) {
        setUser({
          id: 'u1',
          name: email.split('@')[0].toUpperCase(),
          email: email,
          streak: 5,
          weeklyStudyMinutes: 240,
          todayStudyMinutes: 45,
          avatarUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          githubConnected: false,
          leetcodeConnected: false,
          calendarConnected: false,
        });
        setIsPending(false);
        router.push('/dashboard');
        return true;
      }

      setIsPending(false);
      return false;
    };

    const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
      setIsPending(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (name && email && password.length >= 8) {
        setUser({
          id: 'u_new',
          name: name,
          email: email,
          streak: 1,
          weeklyStudyMinutes: 0,
          todayStudyMinutes: 0,
          githubConnected: false,
          leetcodeConnected: false,
          calendarConnected: false,
        });
        setIsPending(false);
        router.push('/onboarding');
        return true;
      }

      setIsPending(false);
      return false;
    };

    const logoutUser = async () => {
      setIsPending(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setUser(null);
      setIsPending(false);
      router.push('/login');
    };

    const updateOnboarding = async (data: Partial<User>): Promise<boolean> => {
      if (!current.user) return false;
      await new Promise((resolve) => setTimeout(resolve, 800));
      setUser({ ...current.user, ...data });
      router.push('/dashboard');
      return true;
    };

    const updateUserPreferences = async (data: Partial<User>): Promise<boolean> => {
      if (!current.user) return false;
      setUser({ ...current.user, ...data });
      return true;
    };

    return {
      user,
      isAuthenticated: !!user,
      isLoading,
      loginUser,
      registerUser,
      logoutUser,
      updateOnboarding,
      updateUserPreferences,
    };
  }, [user, isLoading, router]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
