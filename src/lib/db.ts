import { 
  DEFAULT_PROFILE, 
  DEFAULT_SKILLS, 
  DEFAULT_PROJECTS, 
  DEFAULT_EXPERIENCES 
} from '../data/seed';

export function initializeDatabase() {
  if (typeof window === 'undefined') return;

  try {
    if (!localStorage.getItem('neo_profile')) {
      localStorage.setItem('neo_profile', JSON.stringify(DEFAULT_PROFILE));
    }
    if (!localStorage.getItem('neo_skills')) {
      localStorage.setItem('neo_skills', JSON.stringify(DEFAULT_SKILLS));
    }
    if (!localStorage.getItem('neo_projects')) {
      localStorage.setItem('neo_projects', JSON.stringify(DEFAULT_PROJECTS));
    }
    if (!localStorage.getItem('neo_experiences')) {
      localStorage.setItem('neo_experiences', JSON.stringify(DEFAULT_EXPERIENCES));
    }
    if (!localStorage.getItem('neo_admin_auth')) {
      localStorage.setItem('neo_admin_auth', 'false');
    }
    // Set a default admin password if not exists
    if (!localStorage.getItem('neo_admin_password')) {
      localStorage.setItem('neo_admin_password', 'admin123'); // Simple default password
    }
  } catch (error) {
    console.error('Failed to initialize local storage database:', error);
  }
}
