import type { 
  LearningPath, 
  Skill, 
  Recommendation, 
  Achievement 
} from "@/types/learning";

const API_URL = import.meta.env.VITE_API_URL;

export const getLearningPaths = async (): Promise<LearningPath[]> => {
  const response = await fetch(`${API_URL}/api/learning-paths`);
  if (!response.ok) {
    throw new Error('Failed to fetch learning paths');
  }
  return response.json();
};

export const getSkills = async (): Promise<Skill[]> => {
  const response = await fetch(`${API_URL}/api/skills`);
  if (!response.ok) {
    throw new Error('Failed to fetch skills');
  }
  return response.json();
};

export const getRecommendations = async (): Promise<Recommendation[]> => {
  const response = await fetch(`${API_URL}/api/learning-recommendations`);
  if (!response.ok) {
    throw new Error('Failed to fetch recommendations');
  }
  return response.json();
};

export const getAchievements = async (): Promise<Achievement[]> => {
  const response = await fetch(`${API_URL}/api/learning-achievements`);
  if (!response.ok) {
    throw new Error('Failed to fetch achievements');
  }
  return response.json();
};
