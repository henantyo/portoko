import { isSupabaseConfigured } from './supabase';
import { Profile, Project, Skill, Experience } from '../types';

// Backend base URL for API calls
const BACKEND_BASE_URL = (import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000').toString();

export async function pushLocalToSupabase(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, message: 'Supabase is not configured.' };
  }

  try {
    const adminToken = localStorage.getItem('neo_admin_token') || '';

    const res = await fetch(`${BACKEND_BASE_URL}/api/supabase/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        profile: JSON.parse(localStorage.getItem('neo_profile') || 'null'),
        projects: JSON.parse(localStorage.getItem('neo_projects') || 'null'),
        skills: JSON.parse(localStorage.getItem('neo_skills') || 'null'),
        experiences: JSON.parse(localStorage.getItem('neo_experiences') || 'null'),
      }),
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      return { success: false, message: data?.message || 'SUPABASE_SYNC: push failed.' };
    }

    return { success: true, message: data.message || 'All local data successfully pushed to Supabase Cloud!' };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Unknown migration error.' };
  }
}

export async function pullSupabaseToLocal(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, message: 'Supabase is not configured.' };
  }

  try {
    const adminToken = localStorage.getItem('neo_admin_token') || '';

    const res = await fetch(`${BACKEND_BASE_URL}/api/supabase/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      return { success: false, message: data?.message || 'SUPABASE_SYNC: pull failed.' };
    }

    const payload = data?.payload;

    if (payload?.profile) localStorage.setItem('neo_profile', JSON.stringify(payload.profile));
    localStorage.setItem('neo_projects', JSON.stringify(payload?.projects || []));
    localStorage.setItem('neo_skills', JSON.stringify(payload?.skills || []));
    localStorage.setItem('neo_experiences', JSON.stringify(payload?.experiences || []));

    window.dispatchEvent(new Event('local-storage-neo_profile'));
    window.dispatchEvent(new Event('local-storage-neo_projects'));
    window.dispatchEvent(new Event('local-storage-neo_skills'));
    window.dispatchEvent(new Event('local-storage-neo_experiences'));

    return {
      success: true,
      message: data.message || 'Database successfully synchronized from Supabase Cloud!',
    };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Unknown sync error.' };
  }
}

// Keperluan autosync per item: UI tidak berubah, sehingga saat ini tidak mendelegasikan ke backend.
// PUSH/PULL tetap memakai tombol di AdminDashboard.
export async function syncItemToSupabase(_key: string, _data: any) {
  return;
}

