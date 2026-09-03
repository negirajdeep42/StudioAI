'use client';

import React, { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import { GeneratedNote, StudyPlan, Subject, Task, TopicProgress } from '@/types';
import { mockSubjects, mockTasks } from '@/lib/mock-data';
import { createId } from '@/lib/utils';

const STORAGE_KEY = 'studyos_data';
const STORAGE_VERSION = 1;

export interface CodingGoal {
  /** Problems the user aims to solve today. */
  target: number;
  solved: number;
  /** ISO date (YYYY-MM-DD) the counter belongs to, so it resets each day. */
  date: string;
}

interface AppState {
  version: number;
  subjects: Subject[];
  tasks: Task[];
  notes: GeneratedNote[];
  studyPlan: StudyPlan | null;
  codingGoal: CodingGoal;
  /** Minutes studied, keyed by ISO date - drives the streak and weekly totals. */
  studyLog: Record<string, number>;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function seedState(): AppState {
  return {
    version: STORAGE_VERSION,
    subjects: mockSubjects,
    tasks: mockTasks,
    notes: [],
    studyPlan: null,
    codingGoal: { target: 3, solved: 0, date: today() },
    studyLog: {},
  };
}

/** Topic completion -> a 0-100 progress number. In-progress topics count half. */
export function computeProgress(topics: TopicProgress[]): number {
  if (topics.length === 0) return 0;
  const score = topics.reduce((sum, t) => {
    if (t.status === 'Completed') return sum + 1;
    if (t.status === 'In Progress') return sum + 0.5;
    return sum;
  }, 0);
  return Math.round((score / topics.length) * 100);
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    // Drop persisted data written by an older, incompatible shape.
    if (parsed.version !== STORAGE_VERSION) return seedState();
    const seed = seedState();
    const state: AppState = {
      ...seed,
      ...parsed,
      version: STORAGE_VERSION,
      subjects: parsed.subjects ?? seed.subjects,
      tasks: parsed.tasks ?? seed.tasks,
      notes: parsed.notes ?? seed.notes,
      codingGoal: parsed.codingGoal ?? seed.codingGoal,
      studyLog: parsed.studyLog ?? seed.studyLog,
    };
    // The daily coding counter is stale if it was written on a previous day.
    if (state.codingGoal.date !== today()) {
      state.codingGoal = { ...state.codingGoal, solved: 0, date: today() };
    }
    return state;
  } catch {
    return seedState();
  }
}

/* ------------------------------------------------------------------ *
 * Module-level store.
 *
 * localStorage is an external system, so the store lives outside React
 * and components read it through useSyncExternalStore. That keeps the
 * server render and the first client render identical (both see SEED),
 * then swaps in persisted data once subscribe() runs after mount - with
 * no setState-inside-an-effect and no hydration mismatch.
 * ------------------------------------------------------------------ */

interface Snapshot {
  data: AppState;
  /** False until localStorage has been read. */
  hydrated: boolean;
}

// One stable object for every server render and the initial client render.
const SERVER_SNAPSHOT: Snapshot = { data: seedState(), hydrated: false };

let current: Snapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist(data: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota exceeded or storage disabled - keep working in memory */
  }
}

function setData(updater: (data: AppState) => AppState) {
  const next = updater(current.data);
  if (next === current.data) return;
  current = { data: next, hydrated: current.hydrated };
  if (current.hydrated) persist(next);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // React calls subscribe after mount, so this is the first point at which
  // localStorage is safe to touch.
  if (!current.hydrated) {
    current = { data: load(), hydrated: true };
    // Notify after the current commit rather than during it.
    queueMicrotask(emit);
  }

  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => current;
const getServerSnapshot = () => SERVER_SNAPSHOT;

/* --------------------------- actions --------------------------- */

const actions = {
  toggleTask: (id: string) =>
    setData((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    })),

  addTask: (task: Omit<Task, 'id' | 'completed'>) =>
    setData((s) => ({
      ...s,
      tasks: [...s.tasks, { ...task, id: createId('task'), completed: false }],
    })),

  deleteTask: (id: string) => setData((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) })),

  addSubject: (subject: Omit<Subject, 'id' | 'progress'>) =>
    setData((s) => ({
      ...s,
      subjects: [
        ...s.subjects,
        { ...subject, id: createId('sub'), progress: computeProgress(subject.topics) },
      ],
    })),

  updateSubject: (id: string, patch: Partial<Omit<Subject, 'id'>>) =>
    setData((s) => ({
      ...s,
      subjects: s.subjects.map((sub) => (sub.id === id ? { ...sub, ...patch } : sub)),
    })),

  deleteSubject: (id: string) =>
    setData((s) => ({
      ...s,
      subjects: s.subjects.filter((sub) => sub.id !== id),
      tasks: s.tasks.filter((t) => t.subjectId !== id),
    })),

  setTopicStatus: (subjectId: string, topicName: string, status: TopicProgress['status']) =>
    setData((s) => ({
      ...s,
      subjects: s.subjects.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const topics = sub.topics.map((t) => (t.name === topicName ? { ...t, status } : t));
        // Progress is derived, never stored independently, so it cannot drift.
        return { ...sub, topics, progress: computeProgress(topics), lastStudied: 'Today' };
      }),
    })),

  saveNote: (note: Omit<GeneratedNote, 'id' | 'createdAt'>) => {
    const full: GeneratedNote = {
      ...note,
      id: createId('note'),
      createdAt: new Date().toISOString(),
    };
    setData((s) => ({ ...s, notes: [full, ...s.notes] }));
    return full;
  },

  deleteNote: (id: string) => setData((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) })),

  savePlan: (plan: Omit<StudyPlan, 'id'>) =>
    setData((s) => ({ ...s, studyPlan: { ...plan, id: createId('plan') } })),

  togglePlanTask: (dayName: string, taskId: string) =>
    setData((s) => {
      if (!s.studyPlan) return s;
      const day = s.studyPlan.weeklyTasks[dayName];
      if (!day) return s;
      return {
        ...s,
        studyPlan: {
          ...s.studyPlan,
          weeklyTasks: {
            ...s.studyPlan.weeklyTasks,
            [dayName]: day.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
          },
        },
      };
    }),

  setCodingTarget: (target: number) =>
    setData((s) => ({ ...s, codingGoal: { ...s.codingGoal, target, date: today() } })),

  incrementSolved: (delta: number) =>
    setData((s) => ({
      ...s,
      codingGoal: {
        ...s.codingGoal,
        date: today(),
        solved: Math.max(0, s.codingGoal.solved + delta),
      },
    })),

  /** Accepts a negative delta so undoing a completed task takes its time back. */
  logStudyMinutes: (minutes: number) =>
    setData((s) => {
      const key = today();
      const next = Math.max(0, (s.studyLog[key] ?? 0) + minutes);
      return { ...s, studyLog: { ...s.studyLog, [key]: next } };
    }),

  resetAllData: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nothing to clear */
    }
    setData(() => seedState());
  },
};

type Actions = typeof actions;

interface StoreContextType extends AppState, Actions {
  /** False until localStorage has been read; render skeletons while false. */
  isHydrated: boolean;
  todayStudyMinutes: number;
  weeklyStudyMinutes: number;
  streak: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { data, hydrated } = snapshot;

  const { todayStudyMinutes, weeklyStudyMinutes, streak } = useMemo(() => {
    const log = data.studyLog;
    const dayKey = (offset: number) => {
      const d = new Date();
      d.setDate(d.getDate() - offset);
      return d.toISOString().slice(0, 10);
    };

    let weekly = 0;
    for (let i = 0; i < 7; i++) weekly += log[dayKey(i)] ?? 0;

    // Count back from today; today not yet studied doesn't break an existing streak.
    let run = 0;
    for (let i = 0; i < 365; i++) {
      const minutes = log[dayKey(i)] ?? 0;
      if (minutes > 0) run++;
      else if (i > 0) break;
    }

    return {
      todayStudyMinutes: log[dayKey(0)] ?? 0,
      weeklyStudyMinutes: weekly,
      streak: run,
    };
  }, [data.studyLog]);

  const value = useMemo<StoreContextType>(
    () => ({
      ...data,
      ...actions,
      isHydrated: hydrated,
      todayStudyMinutes,
      weeklyStudyMinutes,
      streak,
    }),
    [data, hydrated, todayStudyMinutes, weeklyStudyMinutes, streak]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
