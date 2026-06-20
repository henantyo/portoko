import React from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Skill, SkillCategory } from '../types';
import { DEFAULT_SKILLS } from '../data/seed';
import { CornerBrackets } from '../components/CornerBrackets';
import { Cpu, Database, Wrench, Layers } from 'lucide-react';

export const Skills: React.FC = () => {
  const [skills] = useLocalStorage<Skill[]>('neo_skills', DEFAULT_SKILLS);

  // Group skills by category
  const categories: { name: SkillCategory; label: string; icon: React.ReactNode; desc: string }[] = [
    { 
      name: 'Frontend', 
      label: 'FRONTEND ARCHITECTURE', 
      icon: <Cpu className="w-5 h-5 text-[var(--accent-cyan)]" />, 
      desc: 'UI/UX layout rendering and client-side logic execution.' 
    },
    { 
      name: 'Backend', 
      label: 'BACKEND SERVICES & DATABASE', 
      icon: <Database className="w-5 h-5 text-[var(--accent-pink)]" />, 
      desc: 'Server logic, REST APIs, database queries and microservices.' 
    },
    { 
      name: 'Tools', 
      label: 'DEV TOOLS & INFRASTRUCTURE', 
      icon: <Wrench className="w-5 h-5 text-violet-400" />, 
      desc: 'Version control systems, editors, bundlers and deployment pipelines.' 
    },
    { 
      name: 'Other', 
      label: 'OTHER COMPETENCIES', 
      icon: <Layers className="w-5 h-5 text-[var(--text-tertiary)]" />, 
      desc: 'Miscellaneous professional skills and supporting technical capabilities.' 
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { y: 60, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 80, damping: 15 } 
    }
  };

  return (
    <div className="space-y-16 py-6 md:py-12 overflow-hidden">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-left space-y-1 border-b border-[var(--border-main)] pb-6"
      >
        <span className="font-mono text-xs text-[var(--accent-pink)] font-bold tracking-widest uppercase">// TECH_CAPABILITIES</span>
        <h1 className="font-rajdhani text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-wide uppercase">&gt;_ SKILLS INDEX</h1>
      </motion.div>

      {/* Grid of Categories */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {categories.map((cat, catIndex) => {
          const catSkills = skills.filter((s) => s.category === cat.name);
          
          if (catSkills.length === 0) return null;

          return (
            <motion.div
              key={cat.name}
              variants={cardVariants}
              whileHover={{ 
                borderColor: 'rgba(34, 211, 238, 0.25)', 
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.05)' 
              }}
              className="border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 relative text-left transition-all duration-300"
              style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' }}
            >
              <CornerBrackets colorClass="border-[var(--border-strong)]" size={8} />

              {/* Category Header */}
              <div className="flex items-start justify-between border-b border-[var(--border-main)] pb-4 mb-6">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-widest">// {cat.label}</span>
                  <h3 className="font-rajdhani text-lg font-bold text-[var(--text-primary)] uppercase tracking-wider">{cat.name} MODULES</h3>
                </div>
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="border border-[var(--border-strong)] bg-[var(--bg-accent)] p-2 text-[var(--accent-cyan)]"
                >
                  {cat.icon}
                </motion.div>
              </div>

              {/* Skills List */}
              <div className="space-y-5">
                {catSkills.map((skill) => (
                  <div key={skill.id} className="space-y-1.5">
                    {/* Skill Info */}
                    <div className="flex justify-between items-center font-mono text-xs">
                      <span className="text-[var(--text-secondary)] font-semibold tracking-wide uppercase">{skill.name}</span>
                      <span className="text-[var(--accent-cyan)] font-bold">[{skill.level}%]</span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-1.5 bg-[var(--bg-surface-strong)]/60 border border-[var(--border-main)] overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 shadow-[0_0_8px_rgba(34,211,238,0.5)] relative"
                      >
                        {/* Interactive glow tip */}
                        <div className="absolute top-0 right-0 w-1 h-full bg-white shadow-[0_0_8px_#ffffff]" />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category Footer Stats */}
              <div className="mt-6 pt-4 border-t border-[var(--border-main)] flex justify-between font-mono text-[9px] text-[var(--text-muted)]">
                <span>MODULE_STATUS: OK</span>
                <span>SYS_LOAD: 100%</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Cybernetic Tech stack background block */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border border-dashed border-[var(--border-main)] bg-[var(--bg-surface)] p-8 relative flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' }}
      >
        <CornerBrackets colorClass="border-[var(--border-strong)]" size={8} />
        
        <div className="text-left space-y-1 max-w-xl">
          <span className="font-mono text-xs text-[var(--accent-pink)] font-bold tracking-widest uppercase">// DIAGNOSTICS</span>
          <h4 className="font-rajdhani text-lg font-bold text-[var(--text-primary)] tracking-wider uppercase">CONTINUOUS LEARNING PIPELINE</h4>
          <p className="font-body text-xs text-[var(--text-tertiary)] leading-relaxed">
            Sejalan dengan perkembangan industri teknologi yang sangat dinamis, saya berkomitmen untuk selalu memperbarui stack keahlian saya. Saat ini saya juga sedang mengeksplorasi teknologi baru seperti Next.js, Docker, dan dasar-dasar Cloud Computing secara mandiri.
          </p>
        </div>

        <div className="font-mono text-[10px] text-[var(--accent-cyan)]/80 border border-[var(--border-strong)] bg-[var(--bg-accent)] px-4 py-3 flex-shrink-0 space-y-1 min-w-[200px] text-left">
          <div>&gt;_ UPCOMING_MODULES:</div>
          <div className="text-[var(--text-muted)] ml-3">- Next.js 15 AppRouter</div>
          <div className="text-[var(--text-muted)] ml-3">- Prisma ORM / PostgreSQL</div>
          <div className="text-[var(--text-muted)] ml-3">- CI/CD GitHub Actions</div>
        </div>
      </motion.div>
    </div>
  );
};
