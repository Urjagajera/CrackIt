export interface UserStats {
  interviewsCompleted: number;
  averageScore: number;
  resumeScore: number;
  atsCompatibility: number;
  practiceHours: number;
  streak: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  targetCompany: string;
  targetRole: string;
  stats: UserStats;
}

export interface ResumeItem {
  id: number;
  name: string;
  date: string;
  matchScore: number;
  size: string;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  avatar: string;
  description: string;
}

export interface TranscriptFeedback {
  type: 'good' | 'warning' | 'info';
  text: string;
}

export interface TranscriptItem {
  id?: string | number;
  role: 'interviewer' | 'user' | 'ai';
  text: string;
  time: string;
  feedback?: TranscriptFeedback | null;
}

export interface CategoryScores {
  technical: number;
  communication: number;
  behavioral: number;
}

export interface Interview {
  id: string;
  title: string;
  company: string;
  date: string;
  score: number;
  duration: string;
  personaName: string;
  status: string;
  overallFeedback: string;
  categories: CategoryScores;
  transcript: TranscriptItem[];
}

export interface ProjectIntelItem {
  id: number;
  name: string;
  description: string;
  status: string;
  score: number;
  highlights: string[];
  weaknesses: string[];
  questions: string[];
}

export interface RecommendedTopic {
  id: string;
  title: string;
  category: string;
  badge: string;
  reason: string;
  difficulty: string;
  estimatedMinutes: number;
}

export interface WeakTopic {
  id: string;
  title: string;
  category: string;
  reason: string;
  score: number;
  status: string;
}
