import { Subject, Task, UpcomingDeadline, AIRecommendation, CodingStats, InterviewQna } from '@/types';

export const mockSubjects: Subject[] = [
  {
    id: 'os',
    name: 'Operating Systems',
    code: 'CS-301',
    color: '#8b5cf6', // purple
    progress: 78,
    notesCount: 14,
    quizzesCount: 5,
    flashcardsCount: 28,
    lastStudied: 'Yesterday',
    topics: [
      { name: 'Process Synchronization', status: 'Completed', difficulty: 'Hard' },
      { name: 'Deadlocks', status: 'In Progress', difficulty: 'Medium' },
      { name: 'Memory Management', status: 'Completed', difficulty: 'Medium' },
      { name: 'Virtual Memory', status: 'In Progress', difficulty: 'Hard' },
      { name: 'File Systems', status: 'Not Started', difficulty: 'Easy' }
    ]
  },
  {
    id: 'dbms',
    name: 'Database Management Systems',
    code: 'CS-302',
    color: '#3b82f6', // blue
    progress: 62,
    notesCount: 9,
    quizzesCount: 3,
    flashcardsCount: 18,
    lastStudied: '3 days ago',
    topics: [
      { name: 'Entity-Relationship Model', status: 'Completed', difficulty: 'Easy' },
      { name: 'Relational Algebra', status: 'Completed', difficulty: 'Medium' },
      { name: 'SQL Queries & Joins', status: 'In Progress', difficulty: 'Medium' },
      { name: 'Normalization (1NF, 2NF, 3NF, BCNF)', status: 'In Progress', difficulty: 'Hard' },
      { name: 'Transaction Management', status: 'Not Started', difficulty: 'Hard' }
    ]
  },
  {
    id: 'dsa',
    name: 'Data Structures and Algorithms',
    code: 'CS-303',
    color: '#ec4899', // pink
    progress: 54,
    notesCount: 22,
    quizzesCount: 8,
    flashcardsCount: 45,
    lastStudied: 'Today',
    topics: [
      { name: 'Arrays & Hashing', status: 'Completed', difficulty: 'Easy' },
      { name: 'Linked Lists', status: 'Completed', difficulty: 'Easy' },
      { name: 'Trees & BSTs', status: 'In Progress', difficulty: 'Medium' },
      { name: 'Graphs & BFS/DFS', status: 'In Progress', difficulty: 'Hard' },
      { name: 'Dynamic Programming', status: 'Not Started', difficulty: 'Hard' }
    ]
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    code: 'CS-304',
    color: '#10b981', // green
    progress: 45,
    notesCount: 8,
    quizzesCount: 2,
    flashcardsCount: 12,
    lastStudied: 'Last week',
    topics: [
      { name: 'OSI & TCP/IP Models', status: 'Completed', difficulty: 'Easy' },
      { name: 'IP Addressing & Subnetting', status: 'In Progress', difficulty: 'Hard' },
      { name: 'Routing Algorithms', status: 'Not Started', difficulty: 'Medium' },
      { name: 'Transport Layer protocols (TCP/UDP)', status: 'Not Started', difficulty: 'Medium' }
    ]
  },
  {
    id: 'java',
    name: 'Java Programming',
    code: 'CS-305',
    color: '#f59e0b', // amber
    progress: 88,
    notesCount: 16,
    quizzesCount: 6,
    flashcardsCount: 30,
    lastStudied: 'Today',
    topics: [
      { name: 'OOP Concepts', status: 'Completed', difficulty: 'Easy' },
      { name: 'Exception Handling', status: 'Completed', difficulty: 'Easy' },
      { name: 'Java Collections Framework', status: 'Completed', difficulty: 'Medium' },
      { name: 'Multithreading & Concurrency', status: 'In Progress', difficulty: 'Hard' },
      { name: 'Stream API', status: 'In Progress', difficulty: 'Medium' }
    ]
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    code: 'CS-306',
    color: '#06b6d4', // cyan
    progress: 35,
    notesCount: 5,
    quizzesCount: 1,
    flashcardsCount: 10,
    lastStudied: '4 days ago',
    topics: [
      { name: 'Search Algorithms (A*, DFS, BFS)', status: 'Completed', difficulty: 'Medium' },
      { name: 'Knowledge Representation', status: 'In Progress', difficulty: 'Medium' },
      { name: 'Machine Learning Basics', status: 'Not Started', difficulty: 'Hard' },
      { name: 'Neural Networks', status: 'Not Started', difficulty: 'Hard' }
    ]
  }
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Complete Graph DFS/BFS practice questions',
    subjectName: 'Data Structures and Algorithms',
    subjectId: 'dsa',
    durationMinutes: 45,
    priority: 'High',
    completed: false
  },
  {
    id: 't2',
    title: 'Revise Operating Systems Deadlock Conditions',
    subjectName: 'Operating Systems',
    subjectId: 'os',
    durationMinutes: 30,
    priority: 'Medium',
    completed: false
  },
  {
    id: 't3',
    title: 'Take DBMS normalisation practice quiz',
    subjectName: 'Database Management Systems',
    subjectId: 'dbms',
    durationMinutes: 20,
    priority: 'Low',
    completed: true
  },
  {
    id: 't4',
    title: 'Implement Java Multi-producer consumer queue',
    subjectName: 'Java Programming',
    subjectId: 'java',
    durationMinutes: 60,
    priority: 'High',
    completed: false
  }
];

export const mockDeadlines: UpcomingDeadline[] = [
  {
    id: 'd1',
    title: 'Mid-Sem Operating Systems Exam',
    subjectName: 'Operating Systems',
    type: 'Exam',
    dueDate: '2026-07-25T10:00:00Z',
    countdownDays: 5
  },
  {
    id: 'd2',
    title: 'DBMS SQL Assignment Submission',
    subjectName: 'Database Management Systems',
    type: 'Assignment',
    dueDate: '2026-07-23T23:59:59Z',
    countdownDays: 3
  },
  {
    id: 'd3',
    title: 'Java Group Project Milestone 2',
    subjectName: 'Java Programming',
    type: 'Project',
    dueDate: '2026-07-29T18:00:00Z',
    countdownDays: 9
  },
  {
    id: 'd4',
    title: 'Mock Placement Coding Interview',
    subjectName: 'Data Structures and Algorithms',
    type: 'Interview',
    dueDate: '2026-07-24T14:30:00Z',
    countdownDays: 4
  }
];

export const mockRecommendations: AIRecommendation[] = [
  {
    id: 'r1',
    message: "You haven't revised Deadlocks in 7 days. Spend 30 minutes reviewing it today.",
    subjectId: 'os',
    subjectName: 'Operating Systems',
    durationMinutes: 30,
    topicName: 'Deadlocks'
  },
  {
    id: 'r2',
    message: 'Your quiz score in DBMS Normalization is 55%. Try regenerating flashcards to review BCNF.',
    subjectId: 'dbms',
    subjectName: 'Database Management Systems',
    durationMinutes: 15,
    topicName: 'Normalization'
  },
  {
    id: 'r3',
    message: 'Next week is your DSA exam. AI recommends focusing on Dynamic Programming basics today.',
    subjectId: 'dsa',
    subjectName: 'Data Structures and Algorithms',
    durationMinutes: 50,
    topicName: 'Dynamic Programming'
  }
];

export const mockCodingStats: CodingStats = {
  solvedCount: {
    easy: 124,
    medium: 86,
    hard: 18,
    total: 228
  },
  streak: 12,
  longestStreak: 45,
  weakTopics: ['Graphs', 'Dynamic Programming', 'Trees', 'Recursion'],
  strongTopics: ['Arrays', 'Strings', 'Hash Tables', 'Stack'],
  weeklyActivity: [4, 2, 5, 0, 3, 6, 1], // Sun - Sat
  recentSubmissions: [
    {
      id: 'sub1',
      title: 'Binary Tree Level Order Traversal',
      difficulty: 'Medium',
      language: 'Java',
      status: 'Accepted',
      timestamp: '2 hours ago'
    },
    {
      id: 'sub2',
      title: 'Edit Distance',
      difficulty: 'Hard',
      language: 'Java',
      status: 'Wrong Answer',
      timestamp: 'Yesterday'
    },
    {
      id: 'sub3',
      title: 'Merge Sorted Array',
      difficulty: 'Easy',
      language: 'TypeScript',
      status: 'Accepted',
      timestamp: '2 days ago'
    },
    {
      id: 'sub4',
      title: 'Course Schedule II',
      difficulty: 'Medium',
      language: 'Java',
      status: 'Accepted',
      timestamp: '3 days ago'
    }
  ]
};

export const mockInterviewQuestions: InterviewQna[] = [
  {
    id: 'iq1',
    question: 'Explain the difference between a process and a thread.',
    answer: 'A process is an independent execution unit with its own address space, memory, and resources allocated by the OS. A thread is the smallest unit of execution within a process. Multiple threads of the same process share the same memory space, heap, and static variables, which makes communication between threads very cheap, but raises safety concerns (concurrency issues).',
    category: 'Technical',
    role: 'Software Engineer'
  },
  {
    id: 'iq2',
    question: 'What is normalization in databases, and why do we need it?',
    answer: 'Normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity. It involves organizing tables to avoid anomalies (insertion, update, and deletion anomalies) by ensuring that data dependencies are logical. Common forms are 1NF, 2NF, 3NF, and BCNF.',
    category: 'Technical',
    role: 'Java Backend Developer'
  },
  {
    id: 'iq3',
    question: 'How do you resolve conflicts in a team project?',
    answer: 'I handle conflicts by listening to everyone\'s perspectives with an open mind, focusing on facts rather than emotions. I encourage team members to explain the reasoning behind their suggestions. Then we evaluate options based on project requirements and timelines. If necessary, we write a quick prototype to compare options or seek a neutral second opinion.',
    category: 'Behavioral',
    role: 'Software Engineer'
  },
  {
    id: 'iq4',
    question: 'Tell me about a time you had to learn a new technology quickly.',
    answer: 'In my last semester project, we decided to use Next.js for a student dashboard. I had experience with standard React, but App Router, Server Components, and Next-specific routing were completely new. I set aside 3 days to read the official docs, built a tiny boilerplate app, and learned by implementing. This hands-on strategy allowed me to implement our core routing system within a week.',
    category: 'Behavioral',
    role: 'Full Stack Developer'
  },
  {
    id: 'iq5',
    question: 'Why do you want to join our company?',
    answer: 'I want to work here because your company values innovation and engineering excellence. I am particularly impressed by your scale and how you integrate AI tools to improve user experience. Having used study planners myself, I understand the direct value of intelligent assistive systems, and I want to help develop these solutions for millions of users.',
    category: 'HR',
    role: 'Software Engineer'
  }
];
