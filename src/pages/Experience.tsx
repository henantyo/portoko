import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { CornerBrackets } from '../components/CornerBrackets';
import { Calendar, Briefcase } from 'lucide-react';

export const ExperiencePage: React.FC = () => {
  const { experiences } = usePortfolioData();

  return (
    <div className="space-y-16 py-6 md:py-12 overflow-hidden">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-left space-y-1 border-b border-[var(--border-main)] pb-6"
      >
        <span className="font-mono text-xs text-[var(--accent-pink)] font-bold tracking-widest uppercase">// CHRONOLOGICAL_DOSSIER</span>
        <h1 className="font-rajdhani text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-wide uppercase">&gt;_ EXPERIENCE TIMELINE</h1>
      </motion.div>

      {/* Vertical Circuit Timeline */}
      <div className="relative max-w-3xl mx-auto px-4">
        {/* Central Circuit Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400/40 via-pink-500/20 to-cyan-400/5 pointer-events-none">
          {/* Glowing node trace */}
          <motion.div 
            animate={{ 
              y: [0, 400, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute left-1/2 -translate-x-1/2 w-1 h-32 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" 
          />
        </div>

        {/* Timeline Items */}
        <div className="space-y-12">
          {experiences.map((exp, index) => {
            const isEven = index % 2 === 0;

            return (
              <div 
                key={exp.id} 
                className={`relative flex flex-col md:flex-row ${
                  isEven ? 'md:flex-row-reverse' : ''
                } items-stretch`}
              >
                {/* Timeline Circuit Node Dot */}
                <div className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 z-20 flex items-center justify-center">
                  <motion.div 
                    animate={exp.current ? {
                      scale: [1, 1.3, 1],
                      boxShadow: ['0 0 4px #22d3ee', '0 0 12px #22d3ee', '0 0 4px #22d3ee']
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`w-3.5 h-3.5 rounded-full border-2 ${
                      exp.current 
                        ? 'bg-cyan-400 border-[var(--accent-cyan)]' 
                        : 'bg-[var(--bg-surface-strong)] border-[var(--border-muted)]'
                      }`} 
                  />
                </div>

                {/* Left/Right spacer for layout alignment on desktop */}
                <div className="hidden md:block w-1/2" />

                {/* Timeline Card Container */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 80 : -80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ type: 'spring' as const, stiffness: 70, damping: 14 }}
                  className="w-full md:w-[calc(50%-24px)] ml-8 md:ml-0 text-left"
                >
                  <motion.div 
                    whileHover={{ 
                      scale: 1.02,
                      borderColor: 'rgba(34, 211, 238, 0.3)',
                      boxShadow: '0 0 20px rgba(34, 211, 238, 0.08)'
                    }}
                    className={`border p-6 relative bg-[var(--bg-surface)] hover:border-cyan-500/30 transition-all`}
                    style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' }}
                  >
                    <CornerBrackets colorClass="border-[var(--border-strong)]" size={6} />

                    {/* Meta Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-[var(--text-muted)] mb-3 pb-2 border-b border-[var(--border-main)]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[var(--accent-cyan)]/70" />
                        <span>{exp.period.toUpperCase()}</span>
                      </div>
                      <div>
                        {exp.current ? (
                          <span className="text-[var(--accent-cyan)] font-bold border border-[var(--accent-cyan)]/20 bg-[var(--bg-accent)] px-1.5 py-0.5">
                            // ACTIVE_NOW
                          </span>
                        ) : (
                          <span className="text-[var(--text-muted)] border border-[var(--border-muted)] bg-[var(--bg-surface)] px-1.5 py-0.5">
                            COMPLETED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Role & Company */}
                    <div className="space-y-1 mb-4">
                      <h3 className="font-rajdhani text-lg font-bold text-[var(--text-primary)] tracking-wide uppercase">
                        {exp.role}
                      </h3>
                      <div className="font-mono text-xs text-[var(--accent-pink)] font-semibold flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{exp.company}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="font-body text-xs text-[var(--text-tertiary)] leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Connecting Circuit Trace line effect */}
                    <div className={`hidden md:block absolute top-7 ${
                      isEven ? '-left-6' : '-right-6'
                    } w-6 h-[1px] bg-cyan-500/20 pointer-events-none`} />
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Footer Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border border-dashed border-[var(--border-main)] p-8 max-w-3xl mx-auto relative text-left"
        style={{ clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)' }}
      >
        <CornerBrackets colorClass="border-[var(--border-strong)]" size={6} />
        <div className="flex gap-4 items-start">
          <div className="font-mono text-xs text-[var(--accent-cyan)] bg-[var(--bg-accent)] border border-[var(--border-strong)] px-2 py-1 flex-shrink-0">
            [INFO]
          </div>
          <div className="space-y-1">
            <h4 className="font-rajdhani text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Career Pipeline Target</h4>
            <p className="font-body text-xs text-[var(--text-tertiary)] leading-relaxed">
              Tujuan jangka pendek saya setelah lulus dari SMK PGRI Wlingi adalah melanjutkan karir di bidang Web Engineering, baik sebagai Junior Web Developer di perusahaan teknologi maupun berkontribusi pada pengembangan sistem open-source secara global.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default ExperiencePage;
