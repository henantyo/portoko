export interface Profile {
  name: string;
  title: string;
  bio: string;
  aboutLong: string;
  school: string;
  major: string;
  avatar: string;
  cvUrl: string;
  email: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  instagram: string;
}

export type SkillCategory = 'Frontend' | 'Backend' | 'Tools' | 'Other';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 0 to 100
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  githubUrl?: string;
  featured: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  current: boolean;
}
