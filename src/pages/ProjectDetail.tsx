import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { CornerBrackets } from '../components/CornerBrackets';
import { Github, ArrowLeft } from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { projectId } = useParams({ from: '/projects/$projectId' });
  const { projects } = usePortfolioData();
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="space-y-6 py-12 text-center">
        <p className="font-mono text-xs text-[var(--text-muted)]">PROJECT_NOT_FOUND: {projectId}</p>
        <Link to="/projects" className="text-[var(--accent-cyan)] font-mono text-xs hover:underline">
          &lt;_ BACK TO PROJECTS
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 md:py-12 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-left space-y-1 border-b border-[var(--border-main)] pb-6"
      >
        <Link to="/projects" className="inline-flex items-center gap-2 font-mono text-[10px] text-[var(--accent-cyan)] hover:underline mb-4">
          <ArrowLeft className="w-3 h-3" />
          <span>BACK_TO_PROJECTS</span>
        </Link>
        <span className="font-mono text-xs text-[var(--accent-pink)] font-bold tracking-widest uppercase">// PROJECT_DETAIL</span>
        <h1 className="font-rajdhani text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-wide uppercase">
          &gt;_ {project.title}
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <div
            className="relative border border-[var(--border-main)] bg-[var(--bg-surface)] overflow-hidden group"
            style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' }}
          >
            <CornerBrackets colorClass="border-[var(--accent-cyan)]/20" size={8} />
            <div className="h-64 md:h-80 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface-strong)]/90 via-transparent to-transparent z-10" />
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
            </div>
            <div className="absolute bottom-3 left-4 z-20 font-mono text-[9px] text-[var(--accent-pink)] bg-[var(--bg-surface-strong)]/80 px-1.5 py-0.5 border border-[var(--accent-pink)]/20">
              [{project.id.toUpperCase()}]
            </div>
            {project.featured && (
              <div className="absolute top-3 right-4 z-20 font-mono text-[8px] text-[var(--accent-cyan)] bg-[var(--bg-accent)]/80 px-1.5 py-0.5 border border-[var(--accent-cyan)]/20">
                // FEATURED
              </div>
            )}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Tech Stack */}
          <div className="space-y-3">
            <h3 className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">// TECH_STACK</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[10px] text-[var(--accent-cyan)] bg-[var(--bg-accent)] px-2 py-1 border border-[var(--border-main)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">// DESCRIPTION</h3>
            <p className="font-body text-sm text-[var(--text-secondary)] leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Links */}
          {project.githubUrl && (
            <div className="space-y-3">
              <h3 className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">// SOURCE_CODE</h3>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors border border-[var(--border-main)] bg-[var(--bg-surface)] px-4 py-2"
              >
                <Github className="w-4 h-4" />
                <span>VIEW ON GITHUB</span>
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
