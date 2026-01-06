
export interface CompetencyScore {
  score: number;
  feedback: string;
}

export interface EssayCorrection {
  totalScore: number;
  competencies: {
    C1: CompetencyScore;
    C2: CompetencyScore;
    C3: CompetencyScore;
    C4: CompetencyScore;
    C5: CompetencyScore;
  };
  repertoryAnalysis: {
    quality: string;
    connectionFeedback: string;
    suggestions: string[];
  };
  generalFeedback: string;
  suggestions: string[];
}

export interface SimulationQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AIProbableTheme {
  title: string;
  description: string;
  reasons: string;
  sources: { title: string; uri: string }[];
}

export enum AppTab {
  ONBOARDING = 'onboarding',
  GUIDE = 'guide',
  HOME = 'home',
  CORRECTION = 'correction',
  GUIDE_CONTENT = 'guide_content',
  SIMULATION = 'simulation',
  THEMES = 'themes',
  SUBMISSION = 'submission',
  REDACTION_JOURNEY = 'redaction_journey',
  CHAT = 'chat',
  WEAKNESS_MAP = 'weakness_map'
}

export interface SavedCorrection {
  id: string;
  date: string;
  title: string;
  score: number;
  correction: EssayCorrection;
}

export interface SubjectStat {
  correct: number;
  total: number;
}

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  completedSimulations: number;
  correctedEssays: number;
  subjectStats: Record<string, SubjectStat>;
  triScoreEstimate: number;
  examDate?: string;
}
