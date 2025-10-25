export interface LearningPath {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  total_modules: number;
  completed_modules: number;
  progress: number;
  skills: string[];
  format: string[];
  rating: number;
  enrollment_count: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  current_level: number;
  target_level: number;
  priority: string;
  category: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  id: number;
  title: string;
  type: string;
  provider: string;
  duration: string;
  difficulty: string;
  relevance_score: number;
  description: string;
  skills: string[];
  cost: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  date_earned: string;
  user_id: number;
  learning_path_id: number;
  created_at: string;
  updated_at: string;
}
