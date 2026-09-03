export interface User {
  id: string;
  name: string;
  email: string;
  university?: string;
  degree?: string;
  year?: string;
  semester?: string;
  studyHours?: number;
  preferredTime?: string;
  learningPreference?: string;
  goals?: string[];
  streak: number;
  weeklyStudyMinutes: number;
  todayStudyMinutes: number;
  avatarUrl?: string;
  githubConnected?: boolean;
  leetcodeConnected?: boolean;
  calendarConnected?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string; // for custom visual markers (purple, blue, indigo, etc.)
  progress: number;
  notesCount: number;
  quizzesCount: number;
  flashcardsCount: number;
  lastStudied: string;
  topics: TopicProgress[];
}

export interface TopicProgress {
  name: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Task {
  id: string;
  title: string;
  subjectName: string;
  subjectId: string;
  durationMinutes: number;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  dueDate?: string;
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  subjectName: string;
  type: 'Exam' | 'Assignment' | 'Project' | 'Interview';
  dueDate: string; // ISO date string
  countdownDays: number;
}

export interface AIRecommendation {
  id: string;
  message: string;
  subjectId: string;
  subjectName: string;
  durationMinutes: number;
  topicName: string;
}

export interface GeneratedNote {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  createdAt: string;
  content: string;
  summary: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  importantQuestions: string[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface StudyPlan {
  id: string;
  goal: string;
  targetDate: string;
  dailyHours: number;
  difficulty: string;
  weeklyTasks: {
    [dayName: string]: StudyPlanTask[];
  };
}

export interface StudyPlanTask {
  id: string;
  topic: string;
  subjectName: string;
  durationMinutes: number;
  type: 'Read Notes' | 'Practice' | 'Quiz' | 'Revision';
  /** Only set for today's schedule, which is laid out against the clock. */
  timeSlot?: string;
  completed: boolean;
}

export interface CodingStats {
  solvedCount: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
  streak: number;
  longestStreak: number;
  weakTopics: string[];
  strongTopics: string[];
  weeklyActivity: number[]; // Array of 7 numbers representing problems solved per day
  recentSubmissions: {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    language: string;
    status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded';
    timestamp: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface InterviewQna {
  id: string;
  question: string;
  answer: string;
  category: 'Technical' | 'Behavioral' | 'HR';
  role: string;
}
