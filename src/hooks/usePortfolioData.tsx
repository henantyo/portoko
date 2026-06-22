import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
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
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
}

function readLocalFallback(): PortfolioData {
  try {
    return {
      profile: JSON.parse(localStorage.getItem('neo_profile') || 'null') || DEFAULT_PROFILE,
      projects: JSON.parse(localStorage.getItem('neo_projects') || 'null') || DEFAULT_PROJECTS,
      skills: JSON.parse(localStorage.getItem('neo_skills') || 'null') || DEFAULT_SKILLS,
      experiences: JSON.parse(localStorage.getItem('neo_experiences') || 'null') || DEFAULT_EXPERIENCES,
    };
  } catch {
    return { profile: DEFAULT_PROFILE, projects: DEFAULT_PROJECTS, skills: DEFAULT_SKILLS, experiences: DEFAULT_EXPERIENCES };
  }
}

function getInitial(): PortfolioData {
  return readCache() || readLocalFallback();
}

interface PortfolioContextType extends PortfolioData {}

const PortfolioContext = createContext<PortfolioContextType>({
  ...getInitial(),
});

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(getInitial);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/public/data`);
        const json = await res.json();
        if (res.ok && json?.success && json?.payload) {
          const p = json.payload;
          if (p.projects?.length || p.profile) {
            const fresh: PortfolioData = {
              profile: p.profile || readLocalFallback().profile,
              projects: p.projects?.length ? p.projects : readLocalFallback().projects,
              skills: p.skills?.length ? p.skills : readLocalFallback().skills,
              experiences: p.experiences?.length ? p.experiences : readLocalFallback().experiences,
            };
            writeCache(fresh);
            setData(fresh);
          }
        }
      } catch {}
    };
    fetchData();
  }, []);

  return (
    <PortfolioContext.Provider value={data}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioData() {
  return useContext(PortfolioContext);
}
