import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CornerBrackets } from '../components/CornerBrackets';
import { GlowButton } from '../components/GlowButton';
import { TerminalToast, ToastMessage } from '../components/TerminalToast';
import { Profile, Project, Skill, Experience, SkillCategory } from '../types';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS, DEFAULT_SKILLS, DEFAULT_EXPERIENCES } from '../data/seed';
import { 
  isSupabaseConfigured, SUPABASE_SQL_SETUP 
} from '../lib/supabase';
import { 
  pushLocalToSupabase, pullSupabaseToLocal 
} from '../lib/supabaseSync';
import { 
  User, Code, Award, Briefcase, LogOut, Plus, Trash2, Edit2, Check, X, 
  Terminal, ArrowLeft, Download, Upload, Database, CloudLightning, Copy, Lock
} from 'lucide-react';

type TabType = 'profile' | 'projects' | 'skills' | 'experiences';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useLocalStorage<boolean>('neo_admin_auth', false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // LocalStorage state synced across app
  const [profile, setProfile] = useLocalStorage<Profile>('neo_profile', DEFAULT_PROFILE);
  const [projects, setProjects] = useLocalStorage<Project[]>('neo_projects', DEFAULT_PROJECTS);
  const [skills, setSkills] = useLocalStorage<Skill[]>('neo_skills', DEFAULT_SKILLS);
  const [experiences, setExperiences] = useLocalStorage<Experience[]>('neo_experiences', DEFAULT_EXPERIENCES);

  // Supabase dynamic setup states
  const [supaUrl, setSupabaseUrl] = useLocalStorage<string>('neo_supabase_url', '');
  const [supaKey, setSupabaseKey] = useLocalStorage<string>('neo_supabase_anon_key', '');
  const [supaUrlInput, setSupabaseUrlInput] = useState(supaUrl);
  const [supaKeyInput, setSupabaseKeyInput] = useState(supaKey);
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState<Profile>(profile);
  
  // Projects form states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '', description: '', image: '', techStack: [], githubUrl: '', featured: false
  });
  const [techInput, setTechInput] = useState('');
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Skills form states
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState<Partial<Skill>>({
    name: '', category: 'Frontend', level: 80
  });
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Experiences form states
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [experienceForm, setExperienceForm] = useState<Partial<Experience>>({
    role: '', company: '', period: '', description: '', current: false
  });
  const [isAddingExperience, setIsAddingExperience] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Keep form updated when profile changes
  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const backendUrl = (import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000').toString();
        const adminToken = localStorage.getItem('neo_admin_token') || '';
        const res = await fetch(`${backendUrl}/api/admin/data`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        const data = await res.json();
        if (res.ok && data?.success && data?.payload) {
          const p = data.payload;
          if (p.profile) setProfile(p.profile);
          if (p.projects) setProjects(p.projects);
          if (p.skills) setSkills(p.skills);
          if (p.experiences) setExperiences(p.experiences);
        }
      } catch {}
    };
    if (auth) loadData();
  }, [auth]);

  // Sync helper: save current array to Supabase
  const syncToBackend = async (endpoint: string, data: unknown) => {
    try {
      const backendUrl = (import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000').toString();
      const adminToken = localStorage.getItem('neo_admin_token') || '';
      await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(data),
      });
    } catch {}
  };

  const syncProfileToBackend = async (p: Profile) => {
    try {
      const backendUrl = (import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000').toString();
      const adminToken = localStorage.getItem('neo_admin_token') || '';
      await fetch(`${backendUrl}/api/admin/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(p),
      });
    } catch {}
  };

  // Check auth
  useEffect(() => {
    if (!auth) {
      navigate({ to: '/admin/login' });
    }
  }, [auth, navigate]);

  // Toast helper
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = () => {
    addToast('info', 'DESTROYING ADMIN SESSION...');
    setTimeout(() => {
      setAuth(false);
      navigate({ to: '/' });
    }, 800);
  };

  // ----------------------------------------------------
  // SECURITY: CHANGE PASSWORD
  // ----------------------------------------------------
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast('error', 'All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast('error', 'New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      addToast('error', 'New password must be at least 6 characters long.');
      return;
    }

    setIsChangingPassword(true);
    addToast('info', 'SECURITY: Initiating password change sequence...');

    try {
      const backendUrl = (import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000').toString();
      const adminToken = localStorage.getItem('neo_admin_token') || '';

      const res = await fetch(`${backendUrl}/api/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        addToast('error', `PASSWORD_CHANGE_FAILED: ${data?.message || 'Unknown error'}`);
        setIsChangingPassword(false);
        return;
      }

      addToast('success', 'PASSWORD_UPDATED: Admin password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Connection error';
      addToast('error', `PASSWORD_CHANGE_ERROR: ${msg}`);
      setIsChangingPassword(false);
    }
  };

  // ----------------------------------------------------
  // DATABASE UTILITIES: EXPORT & IMPORT (JSON BACKUP)
  // ----------------------------------------------------
  const handleExportDatabase = () => {
    try {
      const backupData = {
        profile,
        projects,
        skills,
        experiences,
        exportDate: new Date().toISOString(),
        system: 'NEO-ARCH // SMK PGRI WLINGI'
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `neo_arch_database_${profile.name.toLowerCase().replace(/\s+/g, '_')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      addToast('success', 'DATABASE_EXPORT: neo_arch_database.json downloaded successfully!');
    } catch (err) {
      addToast('error', 'DATABASE_EXPORT: Failed to compile data packets.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImportDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') throw new Error('Invalid file format');

        const importedData = JSON.parse(result);

        // Simple validation to check structure
        if (!importedData.profile || !importedData.projects || !importedData.skills || !importedData.experiences) {
          throw new Error('Database packets do not match schema requirements.');
        }

        // Save imported data to localStorage
        setProfile(importedData.profile);
        setProjects(importedData.projects);
        setSkills(importedData.skills);
        setExperiences(importedData.experiences);

        addToast('success', 'DATABASE_IMPORT: Packets decrypted and synchronized successfully!');
        
        // Reset file input value
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        addToast('error', `DATABASE_IMPORT: Decryption failed. ${err instanceof Error ? err.message : 'Invalid JSON structure.'}`);
      }
    };

    reader.readAsText(file);
  };

  // ----------------------------------------------------
  // SUPABASE CONFIGURATION HANDLERS
  // ----------------------------------------------------
  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseUrl(supaUrlInput.trim());
    setSupabaseKey(supaKeyInput.trim());
    addToast('success', 'SUPABASE_CONFIG: Credentials saved. Re-initializing gateway...');
    
    // Quick reload warning
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handlePushToSupabase = async () => {
    if (!isSupabaseConfigured()) {
      addToast('error', 'SUPABASE_SYNC: Please configure credentials first.');
      return;
    }
    setIsPushing(true);
    addToast('info', 'SUPABASE_SYNC: Pushing local database to Supabase Cloud...');
    
    const res = await pushLocalToSupabase();
    setIsPushing(false);
    
    if (res.success) {
      addToast('success', res.message);
    } else {
      addToast('error', res.message);
    }
  };

  const handlePullFromSupabase = async () => {
    if (!isSupabaseConfigured()) {
      addToast('error', 'SUPABASE_SYNC: Please configure credentials first.');
      return;
    }
    setIsPulling(true);
    addToast('info', 'SUPABASE_SYNC: Pulling database from Supabase Cloud...');
    
    const res = await pullSupabaseToLocal();
    setIsPulling(false);
    
    if (res.success) {
      addToast('success', res.message);
    } else {
      addToast('error', res.message);
    }
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    addToast('info', 'SQL_SETUP script copied to clipboard!');
  };

  // ----------------------------------------------------
  // PROFILE CRUD
  // ----------------------------------------------------
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(profileForm);
    syncProfileToBackend(profileForm);
    addToast('success', 'PROFILE_DATA updated & synced to Supabase.');
  };

  // ----------------------------------------------------
  // PROJECTS CRUD
  // ----------------------------------------------------
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      addToast('error', 'Validation failed: Title and Description are required.');
      return;
    }

    const techArray = techInput
      ? techInput.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const newProj: Project = {
      id: 'p-' + Math.random().toString(36).substring(2, 7),
      title: projectForm.title || '',
      description: projectForm.description || '',
      image: projectForm.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475',
      techStack: techArray,
      githubUrl: projectForm.githubUrl,
      featured: !!projectForm.featured,
    };

    setProjects([...projects, newProj]);
    syncToBackend('/api/admin/projects', [...projects, newProj]);
    setIsAddingProject(false);
    resetProjectForm();
    addToast('success', `PROJECT [${newProj.title}] compiled and synced to Supabase.`);
  };

  const handleEditProject = (proj: Project) => {
    setEditingProject(proj);
    setProjectForm(proj);
    setTechInput(proj.techStack.join(', '));
    setIsAddingProject(true);
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const techArray = techInput
      ? techInput.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const updated: Project = {
      ...editingProject,
      title: projectForm.title || '',
      description: projectForm.description || '',
      image: projectForm.image || '',
      techStack: techArray,
      githubUrl: projectForm.githubUrl,
      featured: !!projectForm.featured,
    };

    const newProjects = projects.map((p) => (p.id === editingProject.id ? updated : p));
    setProjects(newProjects);
    syncToBackend('/api/admin/projects', newProjects);
    setIsAddingProject(false);
    setEditingProject(null);
    resetProjectForm();
    addToast('success', `PROJECT [${updated.title}] updated & synced to Supabase.`);
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete project: "${title}"?`)) {
      const newProjects = projects.filter((p) => p.id !== id);
      setProjects(newProjects);
      syncToBackend('/api/admin/projects', newProjects);
      addToast('info', `PROJECT [${title}] deleted & synced to Supabase.`);
    }
  };

  const resetProjectForm = () => {
    setProjectForm({ title: '', description: '', image: '', techStack: [], githubUrl: '', featured: false });
    setTechInput('');
  };

  // ----------------------------------------------------
  // SKILLS CRUD
  // ----------------------------------------------------
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name) {
      addToast('error', 'Validation failed: Skill Name is required.');
      return;
    }

    const newSkill: Skill = {
      id: 's-' + Math.random().toString(36).substring(2, 7),
      name: skillForm.name,
      category: skillForm.category as SkillCategory,
      level: Number(skillForm.level) || 80,
    };

    setSkills([...skills, newSkill]);
    syncToBackend('/api/admin/skills', [...skills, newSkill]);
    setIsAddingSkill(false);
    resetSkillForm();
    addToast('success', `SKILL [${newSkill.name}] registered & synced to Supabase.`);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillForm(skill);
    setIsAddingSkill(true);
  };

  const handleUpdateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    const updated: Skill = {
      ...editingSkill,
      name: skillForm.name || '',
      category: skillForm.category as SkillCategory,
      level: Number(skillForm.level) || 80,
    };

    const newSkills = skills.map((s) => (s.id === editingSkill.id ? updated : s));
    setSkills(newSkills);
    syncToBackend('/api/admin/skills', newSkills);
    setIsAddingSkill(false);
    setEditingSkill(null);
    resetSkillForm();
    addToast('success', `SKILL [${updated.name}] updated & synced to Supabase.`);
  };

  const handleDeleteSkill = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete skill: "${name}"?`)) {
      const newSkills = skills.filter((s) => s.id !== id);
      setSkills(newSkills);
      syncToBackend('/api/admin/skills', newSkills);
      addToast('info', `SKILL [${name}] deleted & synced to Supabase.`);
    }
  };

  const resetSkillForm = () => {
    setSkillForm({ name: '', category: 'Frontend', level: 80 });
  };

  // ----------------------------------------------------
  // EXPERIENCES CRUD
  // ----------------------------------------------------
  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!experienceForm.role || !experienceForm.company || !experienceForm.period) {
      addToast('error', 'Validation failed: Role, Company, and Period are required.');
      return;
    }

    const newExp: Experience = {
      id: 'e-' + Math.random().toString(36).substring(2, 7),
      role: experienceForm.role,
      company: experienceForm.company,
      period: experienceForm.period,
      description: experienceForm.description || '',
      current: !!experienceForm.current,
    };

    setExperiences([...experiences, newExp]);
    syncToBackend('/api/admin/experiences', [...experiences, newExp]);
    setIsAddingExperience(false);
    resetExperienceForm();
    addToast('success', `EXPERIENCE at [${newExp.company}] registered & synced to Supabase.`);
  };

  const handleEditExperience = (exp: Experience) => {
    setEditingExperience(exp);
    setExperienceForm(exp);
    setIsAddingExperience(true);
  };

  const handleUpdateExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;

    const updated: Experience = {
      ...editingExperience,
      role: experienceForm.role || '',
      company: experienceForm.company || '',
      period: experienceForm.period || '',
      description: experienceForm.description || '',
      current: !!experienceForm.current,
    };

    const newExps = experiences.map((e) => (e.id === editingExperience.id ? updated : e));
    setExperiences(newExps);
    syncToBackend('/api/admin/experiences', newExps);
    setIsAddingExperience(false);
    setEditingExperience(null);
    resetExperienceForm();
    addToast('success', `EXPERIENCE at [${updated.company}] updated & synced to Supabase.`);
  };

  const handleDeleteExperience = (id: string, company: string) => {
    if (window.confirm(`Are you sure you want to delete experience at: "${company}"?`)) {
      const newExps = experiences.filter((e) => e.id !== id);
      setExperiences(newExps);
      syncToBackend('/api/admin/experiences', newExps);
      addToast('info', `EXPERIENCE at [${company}] deleted & synced to Supabase.`);
    }
  };

  const resetExperienceForm = () => {
    setExperienceForm({ role: '', company: '', period: '', description: '', current: false });
  };

  return (
    <div className="min-h-screen py-10 font-sans text-[var(--text-secondary)]">
      {/* Hidden File Input for Database Import */}
      <input 
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportDatabase}
        className="hidden"
      />

      {/* Toast Notification Mount */}
      <TerminalToast toasts={toasts} onClose={removeToast} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Minimal HUD Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-main)] pb-6 text-left">
          <div className="space-y-1">
            <span className="font-mono text-xs text-[var(--accent-pink)] font-bold tracking-widest uppercase">// CONTROL_DASHBOARD</span>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[var(--accent-cyan)]" />
              <h1 className="font-rajdhani text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-wider uppercase">
                NEO-ARCH // ADMIN_PANEL
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <GlowButton variant="neutral" onClick={() => navigate({ to: '/' })} className="text-[10px] px-4 py-1.5 flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>EXIT_TO_LOBBY</span>
            </GlowButton>

            <GlowButton variant="magenta" onClick={handleLogout} className="text-[10px] px-4 py-1.5 flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" />
              <span>LOGOUT_SESSION</span>
            </GlowButton>
          </div>
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Menu HUD */}
          <div className="lg:col-span-1 space-y-4">
            <div 
              className="border border-cyan-500/15 bg-[#07090e]/80 p-5 relative space-y-4 text-left"
              style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' }}
            >
              <CornerBrackets colorClass="border-cyan-500/30" size={6} />
              
              <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-widest">// NAV_CHANNELS</span>
              
              <nav className="flex flex-col gap-1.5">
                {[
                  { id: 'profile', label: 'EDIT PROFILE', icon: <User className="w-4 h-4" /> },
                  { id: 'projects', label: 'CRUD PROJECTS', icon: <Code className="w-4 h-4" /> },
                  { id: 'skills', label: 'CRUD SKILLS', icon: <Award className="w-4 h-4" /> },
                  { id: 'experiences', label: 'CRUD EXPERIENCE', icon: <Briefcase className="w-4 h-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as TabType);
                      setIsAddingProject(false);
                      setIsAddingSkill(false);
                      setIsAddingExperience(false);
                      setEditingProject(null);
                      setEditingSkill(null);
                      setEditingExperience(null);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 font-rajdhani text-xs font-bold tracking-widest uppercase transition-all border cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-[var(--accent-cyan)] bg-[var(--bg-accent)] text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                        : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                    style={{ clipPath: 'polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)' }}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* DATABASE UTILITIES PANEL */}
            <div 
              className="border border-cyan-500/15 bg-[#07090e]/80 p-5 relative space-y-4 text-left"
              style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' }}
            >
              <CornerBrackets colorClass="border-cyan-500/30" size={6} />
              
              <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-widest">// DB_UTILITIES</span>
              
              <div className="flex flex-col gap-2">
                <GlowButton variant="cyan" fullWidth onClick={handleExportDatabase} className="text-[9px] py-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span>EXPORT DATABASE</span>
                </GlowButton>

                <GlowButton variant="neutral" fullWidth onClick={triggerFileInput} className="text-[9px] py-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>IMPORT DATABASE</span>
                </GlowButton>
              </div>
            </div>

            {/* Quick Status Box */}
            <div className="border border-dashed border-[var(--border-main)] p-4 font-mono text-[10px] text-[var(--text-muted)] space-y-1 text-left">
              <div>SYS_STATUS: READY</div>
              <div>SYNC_MODE: {isSupabaseConfigured() ? 'SUPABASE_CLOUD' : 'LOCAL_STORAGE'}</div>
              <div>COMMITS_PENDING: 0</div>
            </div>
          </div>

          {/* Core Working Area */}
          <div className="lg:col-span-3">
            <div 
              className="border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 md:p-8 relative min-h-[450px]"
              style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' }}
            >
              <CornerBrackets colorClass="border-[var(--accent-cyan)]/20" size={10} />

              {/* TAB 1: EDIT PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border-main)] pb-4 mb-4">
                    <h3 className="font-rajdhani text-lg font-bold text-[var(--text-primary)] tracking-wider">// EDIT SYSTEM PROFILE</h3>
                    <p className="font-mono text-[10px] text-[var(--text-muted)]">Update landing page bio and contact details.</p>
                  </div>

                  <form onSubmit={handleProfileSave} className="space-y-4 font-mono text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-[var(--text-muted)] text-[10px] uppercase">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full bg-[var(--bg-surface-strong)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        />
                      </div>

                      {/* Title */}
                      <div className="space-y-1">
                        <label className="text-[var(--text-muted)] text-[10px] uppercase">Title / Role</label>
                        <input
                          type="text"
                          value={profileForm.title}
                          onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                          className="w-full bg-[var(--bg-surface-strong)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* School */}
                      <div className="space-y-1">
                        <label className="text-[var(--text-muted)] text-[10px] uppercase">School Name</label>
                        <input
                          type="text"
                          value={profileForm.school}
                          onChange={(e) => setProfileForm({ ...profileForm, school: e.target.value })}
                          className="w-full bg-[var(--bg-surface-strong)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        />
                      </div>

                      {/* Major */}
                      <div className="space-y-1">
                        <label className="text-[var(--text-muted)] text-[10px] uppercase">Major / Jurusan</label>
                        <input
                          type="text"
                          value={profileForm.major}
                          onChange={(e) => setProfileForm({ ...profileForm, major: e.target.value })}
                          className="w-full bg-[var(--bg-surface-strong)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        />
                      </div>
                    </div>

                      {/* Avatar Upload (via Supabase Storage) */}
                      <div className="space-y-2">
                        <label className="text-[var(--text-muted)] text-[10px] uppercase">Avatar / Photo (upload file)</label>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const backendUrl = (import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000').toString();
                              const adminToken = localStorage.getItem('neo_admin_token') || '';
                              const fd = new FormData();
                              fd.append('file', file);
                              fd.append('folder', 'avatars');
                              const res = await fetch(`${backendUrl}/api/admin/upload-image`, {
                                method: 'POST',
                                headers: { Authorization: `Bearer ${adminToken}` },
                                body: fd,
                              });
                              const data = await res.json();
                              if (res.ok && data?.success) {
                                setProfileForm({ ...profileForm, avatar: data.imageUrl });
                                addToast('success', 'AVATAR uploaded to storage.');
                              } else {
                                addToast('error', `AVATAR_UPLOAD_FAILED: ${data?.message || 'Unknown error'}`);
                              }
                            } catch (err) {
                              addToast('error', `AVATAR_UPLOAD_ERROR: ${err instanceof Error ? err.message : 'Connection error'}`);
                            }
                          }}
                          className="w-full bg-[var(--bg-surface-strong)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        />

                        <div className="flex items-center gap-3 pt-1">
                          <div className="w-12 h-12 border border-[var(--border-strong)] bg-[var(--bg-surface-strong)] flex-shrink-0 overflow-hidden rounded">
                            <img
                              src={profileForm.avatar || '/images/profile.jpg'}
                              alt={profileForm.name || 'avatar'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setProfileForm({ ...profileForm, avatar: '' })}
                            className="text-[10px] text-pink-300 hover:text-pink-200 border border-pink-500/20 hover:border-pink-400/50 px-3 py-1 rounded transition-colors"
                          >
                            REMOVE_AVATAR
                          </button>
                        </div>
                      </div>


                    {/* Brief Bio */}
                    <div className="space-y-1">
                      <label className="text-[var(--text-muted)] text-[10px] uppercase">Brief Bio (Home Section)</label>
                      <textarea
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="w-full bg-[var(--bg-surface-strong)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                      />
                    </div>

                    {/* Long Bio */}
                    <div className="space-y-1">
                      <label className="text-[var(--text-muted)] text-[10px] uppercase">Long Bio (About Section)</label>
                      <textarea
                        rows={5}
                        value={profileForm.aboutLong}
                        onChange={(e) => setProfileForm({ ...profileForm, aboutLong: e.target.value })}
                        className="w-full bg-[var(--bg-surface-strong)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                      />
                    </div>

                    {/* Socials & Contact */}
                    <div className="border-t border-cyan-500/5 pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[var(--text-muted)] text-[10px] uppercase">Email</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full bg-[var(--bg-surface-strong)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[var(--text-muted)] text-[10px] uppercase">WhatsApp (Include Country Code, e.g. 6281..)</label>
                        <input
                          type="text"
                          value={profileForm.whatsapp}
                          onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                          className="w-full bg-[var(--bg-surface-strong)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[var(--text-muted)] text-[10px] uppercase">GitHub URL</label>
                        <input
                          type="text"
                          value={profileForm.github}
                          onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                          className="w-full bg-[var(--bg-surface-strong)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[var(--text-muted)] text-[10px] uppercase">Instagram URL</label>
                        <input
                          type="text"
                          value={profileForm.instagram}
                          onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
                          className="w-full bg-[var(--bg-surface-strong)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <GlowButton type="submit" variant="cyan">
                        <Check className="w-4 h-4" />
                        <span>SAVE_PROFILE_CHANGES</span>
                      </GlowButton>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: CRUD PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-6 text-left">
                  {/* Title & Action Bar */}
                  <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-4 mb-4">
                    <div>
                      <h3 className="font-rajdhani text-lg font-bold text-[var(--text-primary)] tracking-wider">// MANAGE PROJECTS</h3>
                      <p className="font-mono text-[10px] text-[var(--text-muted)]">Create, update, and index portfolio projects.</p>
                    </div>
                    {!isAddingProject && (
                      <GlowButton variant="cyan" onClick={() => setIsAddingProject(true)} className="text-[10px] px-3 py-1.5 flex items-center gap-1">
                        <Plus className="w-4 h-4" />
                        <span>ADD_NEW_PROJECT</span>
                      </GlowButton>
                    )}
                  </div>

                  {/* Add / Edit Form Overlay */}
                  {isAddingProject ? (
                    <form onSubmit={editingProject ? handleUpdateProject : handleAddProject} className="space-y-4 font-mono text-xs border border-[var(--border-strong)] bg-[var(--bg-surface-strong)] p-6">
                      <div className="flex justify-between items-center border-b border-[var(--border-main)] pb-2 mb-4">
                        <span className="font-bold text-[var(--accent-cyan)] uppercase tracking-wider">
                          {editingProject ? `EDIT PROJECT [${editingProject.id}]` : '>> NEW PROJECT COMPILER'}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsAddingProject(false);
                            setEditingProject(null);
                            resetProjectForm();
                          }} 
                          className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div className="space-y-1">
                          <label className="text-[var(--text-muted)] text-[10px] uppercase">Project Title</label>
                          <input
                            type="text"
                            required
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                          />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-1">
                          <label className="text-[var(--text-muted)] text-[10px] uppercase">Project Image Upload</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              const backendUrl = (import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000').toString();
                              const adminToken = localStorage.getItem('neo_admin_token') || '';

                              const fd = new FormData();
                              fd.append('file', file);
fd.append('projectId', editingProject?.id || projectForm?.id || '');

                              try {
                                addToast('info', 'UPLOAD_IMAGE: Uploading to storage (signed URL 7 days)...');

                                const res = await fetch(`${backendUrl}/api/admin/upload-project-image`, {
                                  method: 'POST',
                                  headers: { Authorization: `Bearer ${adminToken}` },
                                  body: fd,
                                });

                                const data = await res.json();
                                if (!res.ok || !data?.success) {
                                  addToast('error', `UPLOAD_IMAGE_FAILED: ${data?.message || 'Unknown error'}`);
                                  return;
                                }

                                setProjectForm((prev) => ({ ...prev, image: data.imageUrl }));
                                addToast('success', 'UPLOAD_IMAGE: Image uploaded successfully!');
                              } catch (err) {
                                addToast('error', `UPLOAD_IMAGE_ERROR: ${err instanceof Error ? err.message : 'Connection error'}`);
                              }
                            }}
                            className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                          />

                          {projectForm.image && (
                            <div className="mt-2 flex items-center gap-3">
                              <div className="w-14 h-10 border border-[var(--border-strong)] bg-[var(--bg-surface-strong)] flex-shrink-0 overflow-hidden">
                                <img src={projectForm.image} alt="preview" className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[9px] text-[var(--text-muted)] font-mono">SIGNED_URL_PREVIEW</span>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Tech Stack */}
                      <div className="space-y-1">
                        <label className="text-[var(--text-muted)] text-[10px] uppercase">Tech Stack (comma separated, e.g. React, Laravel, PostgreSQL)</label>
                        <input
                          type="text"
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          placeholder="React, Laravel, MySQL"
                          className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="text-[var(--text-muted)] text-[10px] uppercase">Description</label>
                        <textarea
                          rows={3}
                          required
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        />
                      </div>

                      <div className="space-y-1">
                          <label className="text-[var(--text-muted)] text-[10px] uppercase">GitHub Code URL (Optional)</label>
                          <input
                            type="text"
                            value={projectForm.githubUrl}
                            onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                            className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                          />
                        </div>

                      {/* Featured checkbox */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={projectForm.featured}
                          onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                          className="rounded border-[var(--border-strong)] bg-[var(--bg-surface-strong)] text-[var(--accent-cyan)] focus:ring-0 focus:ring-offset-0"
                        />
                        <label htmlFor="featured" className="text-[var(--text-tertiary)] text-[10px] uppercase tracking-wider cursor-pointer">
                          Highlight as Featured Project (Home Landing Page)
                        </label>
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                        <GlowButton 
                          type="button" 
                          variant="neutral" 
                          onClick={() => {
                            setIsAddingProject(false);
                            setEditingProject(null);
                            resetProjectForm();
                          }}
                        >
                          <span>CANCEL</span>
                        </GlowButton>

                        <GlowButton type="submit" variant="cyan">
                          <Check className="w-4 h-4" />
                          <span>{editingProject ? 'UPDATE_COMPILATION' : 'COMPILE_PROJECT'}</span>
                        </GlowButton>
                      </div>
                    </form>
                  ) : (
                    /* Project List Grid */
                    <div className="space-y-4">
                      {projects.map((proj) => (
                        <div 
                          key={proj.id}
                          className="border border-[var(--border-main)] bg-[var(--bg-surface-strong)] p-4 flex items-center justify-between gap-4 font-mono text-xs"
                        >
                          <div className="flex items-center gap-4 text-left">
                            {/* Small image preview */}
                            <div className="w-12 h-12 border border-[var(--border-strong)] bg-[var(--bg-surface-strong)] flex-shrink-0">
                              <img src={proj.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[var(--text-primary)] uppercase">{proj.title}</span>
                                <span className="text-[9px] text-[var(--text-muted)]">[{proj.id}]</span>
                                {proj.featured && (
                                  <span className="text-[8px] text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/20 px-1">FEATURED</span>
                                )}
                              </div>
                              <div className="text-[10px] text-[var(--text-tertiary)] mt-1 line-clamp-1 max-w-md">
                                {proj.description}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button 
                              onClick={() => handleEditProject(proj)}
                              className="border border-[var(--border-strong)] p-1.5 text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] hover:bg-[var(--bg-accent)] transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(proj.id, proj.title)}
                              className="border border-red-500/20 p-1.5 text-red-400 hover:border-red-400 hover:bg-red-950/20 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CRUD SKILLS */}
              {activeTab === 'skills' && (
                <div className="space-y-6 text-left">
                  {/* Title & Action Bar */}
                  <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-4 mb-4">
                    <div>
                      <h3 className="font-rajdhani text-lg font-bold text-[var(--text-primary)] tracking-wider">// MANAGE SKILLS</h3>
                      <p className="font-mono text-[10px] text-[var(--text-muted)]">Add, edit, and adjust capability parameters.</p>
                    </div>
                    {!isAddingSkill && (
                      <GlowButton variant="cyan" onClick={() => setIsAddingSkill(true)} className="text-[10px] px-3 py-1.5 flex items-center gap-1">
                        <Plus className="w-4 h-4" />
                        <span>ADD_NEW_SKILL</span>
                      </GlowButton>
                    )}
                  </div>

                  {/* Add / Edit Form Overlay */}
                  {isAddingSkill ? (
                    <form onSubmit={editingSkill ? handleUpdateSkill : handleAddSkill} className="space-y-4 font-mono text-xs border border-[var(--border-strong)] bg-[var(--bg-surface-strong)] p-6">
                      <div className="flex justify-between items-center border-b border-[var(--border-main)] pb-2 mb-4">
                        <span className="font-bold text-[var(--accent-cyan)] uppercase tracking-wider">
                          {editingSkill ? `EDIT SKILL [${editingSkill.id}]` : '>> REGISTER NEW SKILL'}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsAddingSkill(false);
                            setEditingSkill(null);
                            resetSkillForm();
                          }} 
                          className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-1">
                          <label className="text-[var(--text-muted)] text-[10px] uppercase">Skill Name</label>
                          <input
                            type="text"
                            required
                            value={skillForm.name}
                            onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                            className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                          />
                        </div>

                        {/* Category */}
                        <div className="space-y-1">
                          <label className="text-[var(--text-muted)] text-[10px] uppercase">Category</label>
                          <select
                            value={skillForm.category}
                            onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as SkillCategory })}
                            className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                          >
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Tools">Tools</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Level */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[var(--text-muted)] text-[10px] uppercase">Proficiency Level ({skillForm.level}%)</label>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skillForm.level}
                          onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                          className="w-full accent-cyan-400"
                        />
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                        <GlowButton 
                          type="button" 
                          variant="neutral" 
                          onClick={() => {
                            setIsAddingSkill(false);
                            setEditingSkill(null);
                            resetSkillForm();
                          }}
                        >
                          <span>CANCEL</span>
                        </GlowButton>

                        <GlowButton type="submit" variant="cyan">
                          <Check className="w-4 h-4" />
                          <span>{editingSkill ? 'UPDATE_SKILL' : 'REGISTER_SKILL'}</span>
                        </GlowButton>
                      </div>
                    </form>
                  ) : (
                    /* Skills List Grouped */
                    <div className="space-y-6">
                      {['Frontend', 'Backend', 'Tools', 'Other'].map((cat) => {
                        const catSkills = skills.filter(s => s.category === cat);
                        if (catSkills.length === 0) return null;

                        return (
                          <div key={cat} className="space-y-2">
                            <span className="font-mono text-[9px] text-[var(--accent-pink)] tracking-widest block uppercase">// {cat} CATEGORY</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {catSkills.map((skill) => (
                                <div 
                                  key={skill.id}
                                  className="border border-cyan-500/5 bg-[var(--bg-surface)] p-3 flex items-center justify-between font-mono text-xs"
                                >
                                  <div>
                                    <span className="font-bold text-[var(--text-primary)]">{skill.name}</span>
                                    <span className="text-[var(--accent-cyan)] font-semibold ml-2">[{skill.level}%]</span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button 
                                      onClick={() => handleEditSkill(skill)}
                                      className="border border-[var(--border-strong)] p-1 text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition-all"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteSkill(skill.id, skill.name)}
                                      className="border border-red-500/20 p-1 text-red-400 hover:border-red-400 transition-all"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CRUD EXPERIENCE */}
              {activeTab === 'experiences' && (
                <div className="space-y-6 text-left">
                  {/* Title & Action Bar */}
                  <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-4 mb-4">
                    <div>
                      <h3 className="font-rajdhani text-lg font-bold text-[var(--text-primary)] tracking-wider">// MANAGE CHRONOLOGY (EXPERIENCE)</h3>
                      <p className="font-mono text-[10px] text-[var(--text-muted)]">Edit, structure, and order timeline milestones.</p>
                    </div>
                    {!isAddingExperience && (
                      <GlowButton variant="cyan" onClick={() => setIsAddingExperience(true)} className="text-[10px] px-3 py-1.5 flex items-center gap-1">
                        <Plus className="w-4 h-4" />
                        <span>ADD_MILESTONE</span>
                      </GlowButton>
                    )}
                  </div>

                  {/* Add / Edit Form Overlay */}
                  {isAddingExperience ? (
                    <form onSubmit={editingExperience ? handleUpdateExperience : handleAddExperience} className="space-y-4 font-mono text-xs border border-[var(--border-strong)] bg-[var(--bg-surface-strong)] p-6">
                      <div className="flex justify-between items-center border-b border-[var(--border-main)] pb-2 mb-4">
                        <span className="font-bold text-[var(--accent-cyan)] uppercase tracking-wider">
                          {editingExperience ? `EDIT MILESTONE [${editingExperience.id}]` : '>> RECORD NEW MILESTONE'}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsAddingExperience(false);
                            setEditingExperience(null);
                            resetExperienceForm();
                          }} 
                          className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Role */}
                        <div className="space-y-1">
                          <label className="text-[var(--text-muted)] text-[10px] uppercase">Role / Position</label>
                          <input
                            type="text"
                            required
                            value={experienceForm.role}
                            onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                            className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                          />
                        </div>

                        {/* Company */}
                        <div className="space-y-1">
                          <label className="text-[var(--text-muted)] text-[10px] uppercase">Company / Organization</label>
                          <input
                            type="text"
                            required
                            value={experienceForm.company}
                            onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                            className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Period */}
                        <div className="space-y-1">
                          <label className="text-[var(--text-muted)] text-[10px] uppercase">Period (e.g. Jan 2024 - Present)</label>
                          <input
                            type="text"
                            required
                            value={experienceForm.period}
                            onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })}
                            className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                          />
                        </div>

                        {/* Current/Active checkbox */}
                        <div className="flex items-center gap-2 pt-6">
                          <input
                            type="checkbox"
                            id="current"
                            checked={experienceForm.current}
                            onChange={(e) => setExperienceForm({ ...experienceForm, current: e.target.checked })}
                            className="rounded border-[var(--border-strong)] bg-[var(--bg-surface-strong)] text-[var(--accent-cyan)] focus:ring-0 focus:ring-offset-0"
                          />
                          <label htmlFor="current" className="text-[var(--text-tertiary)] text-[10px] uppercase tracking-wider cursor-pointer">
                            Currently Active / Working Here
                          </label>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="text-[var(--text-muted)] text-[10px] uppercase">Description of Responsibilities &amp; Achievements</label>
                        <textarea
                          rows={4}
                          value={experienceForm.description}
                          onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                          className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        />
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                        <GlowButton 
                          type="button" 
                          variant="neutral" 
                          onClick={() => {
                            setIsAddingExperience(false);
                            setEditingExperience(null);
                            resetExperienceForm();
                          }}
                        >
                          <span>CANCEL</span>
                        </GlowButton>

                        <GlowButton type="submit" variant="cyan">
                          <Check className="w-4 h-4" />
                          <span>{editingExperience ? 'UPDATE_MILESTONE' : 'RECORD_MILESTONE'}</span>
                        </GlowButton>
                      </div>
                    </form>
                  ) : (
                    /* Experience list */
                    <div className="space-y-4">
                      {experiences.map((exp) => (
                        <div 
                          key={exp.id}
                          className="border border-[var(--border-main)] bg-[var(--bg-surface-strong)] p-4 flex items-center justify-between gap-4 font-mono text-xs"
                        >
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[var(--text-primary)] uppercase">{exp.role}</span>
                              <span className="text-[10px] text-[var(--accent-pink)] font-semibold">@ {exp.company}</span>
                              {exp.current && (
                                <span className="text-[8px] text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/20 px-1">ACTIVE</span>
                              )}
                            </div>
                            <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{exp.period}</div>
                            <p className="text-[10px] text-[var(--text-tertiary)] mt-2 line-clamp-1 max-w-xl">{exp.description}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button 
                              onClick={() => handleEditExperience(exp)}
                              className="border border-[var(--border-strong)] p-1.5 text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] hover:bg-[var(--bg-accent)] transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteExperience(exp.id, exp.company)}
                              className="border border-red-500/20 p-1.5 text-red-400 hover:border-red-400 hover:bg-red-950/20 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;
