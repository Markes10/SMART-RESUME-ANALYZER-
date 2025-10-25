export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  manager: string;
  reviewPeriod: string;
  lastReviewDate: string;
  nextReviewDate: string;
}

export interface PerformanceMetric {
  category: string;
  score: number;
  target: number;
  improvement: number;
  feedback: string;
}

export interface FeedbackTemplate {
  id: string;
  name: string;
  description: string;
  tone: "Professional" | "Encouraging" | "Direct" | "Developmental";
  sections: string[];
}
