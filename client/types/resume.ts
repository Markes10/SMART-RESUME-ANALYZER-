export interface Resume {
  id: number;
  user_id: number;
  resume_text?: string;
  skills: string[];
  created_at?: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  required_skills: string[];
  department?: string;
  created_at?: string;
}

export interface JobMatch {
  job: Job;
  match_score: number;
  skill_overlap_score: number;
  matching_skills: string[];
  missing_skills: string[];
}

export interface SkillMatch {
  skill: string;
  required: boolean;
  match: boolean;
  score: number;
  category: string;
}

export interface AnalysisResult {
  overallScore: number;
  skillMatches: SkillMatch[];
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  experience: {
    required: string;
    candidate: string;
    match: boolean;
  };
  education: {
    required: string;
    candidate: string;
    match: boolean;
  };
}