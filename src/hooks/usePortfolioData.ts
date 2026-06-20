import { useState, useEffect } from 'react';
import { Profile, Project, Skill, Experience } from '../types';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS, DEFAULT_SKILLS, DEFAULT_EXPERIENCES } from '../data/seed';

const BACKEND_BASE_URL = (import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000').toString();
const CACHE_KEY = 'portoko_portfolio_cache';

interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
}

function readCache(): PortfolioData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function writeCache(data: PortfolioData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
}

function getInitial(): PortfolioData {
  return readCache() || {
    profile: DEFAULT_PROFILE,
    projects: DEFAULT_PROJECTS,
    skills: DEFAULT_SKILLS,
    experiences: DEFAULT_EXPERIENCES,
  };
}

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(getInitial);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/public/data`);
        const json = await res.json();
        if (res.ok && json?.success && json?.payload) {
          const p = json.payload;
          const fresh: PortfolioData = {
            profile: p.profile || DEFAULT_PROFILE,
            projects: p.projects?.length ? p.projects : DEFAULT_PROJECTS,
            skills: p.skills?.length ? p.skills : DEFAULT_SKILLS,
            experiences: p.experiences?.length ? p.experiences : DEFAULT_EXPERIENCES,
          };
          writeCache(fresh);
          setData(fresh);
        }
      } catch {}
    };
    fetchData();
  }, []);

  return data;
}
