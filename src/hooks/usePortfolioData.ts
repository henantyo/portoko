import { useState, useEffect } from 'react';
import { Profile, Project, Skill, Experience } from '../types';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS, DEFAULT_SKILLS, DEFAULT_EXPERIENCES } from '../data/seed';

const BACKEND_BASE_URL = (import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000').toString();

interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
}

const fallback: PortfolioData = {
  profile: DEFAULT_PROFILE,
  projects: DEFAULT_PROJECTS,
  skills: DEFAULT_SKILLS,
  experiences: DEFAULT_EXPERIENCES,
};

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/public/data`);
        const json = await res.json();
        if (res.ok && json?.success && json?.payload) {
          const p = json.payload;
          setData({
            profile: p.profile || fallback.profile,
            projects: p.projects?.length ? p.projects : fallback.projects,
            skills: p.skills?.length ? p.skills : fallback.skills,
            experiences: p.experiences?.length ? p.experiences : fallback.experiences,
          });
        }
      } catch {
        // fallback to localStorage
        try {
          const lp = localStorage.getItem('neo_profile');
          const lpj = localStorage.getItem('neo_projects');
          const lps = localStorage.getItem('neo_skills');
          const lpe = localStorage.getItem('neo_experiences');
          setData({
            profile: lp ? JSON.parse(lp) : fallback.profile,
            projects: lpj ? JSON.parse(lpj) : fallback.projects,
            skills: lps ? JSON.parse(lps) : fallback.skills,
            experiences: lpe ? JSON.parse(lpe) : fallback.experiences,
          });
        } catch {}
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { ...data, loading };
}
