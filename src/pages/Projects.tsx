import React, { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { CornerBrackets } from '../components/CornerBrackets';
import { Search, Github } from 'lucide-react';

export const Projects: React.FC = () => {
  const { projects } = usePortfolioData();
  const [filter, setFilter] = useState<'ALL' | 'FEATURED' | 'LARAVEL' | 'REACT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filter by type
      if (filter === 'FEATURED' && !project.featured) return false;
      if (filter === 'LARAVEL' && !project.techStack.some(t => t.toLowerCase().includes('laravel'))) return false;
      if (filter === 'REACT' && !project.techStack.some(t => t.toLowerCase().includes('react'))) return false;

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesDesc = project.description.toLowerCase().includes(query);
        const matchesTech = project.techStack.some((tech) => tech.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesTech;
      }

      return true;
    });
  }, [projects, filter, searchQuery]);

  return (
    <div className="space-y-12 py-6 md:py-12 overflow-hidden">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-left space-y-1 border-b border-[var(--border-main)] pb-6"
      >
        <span className="font-mono text-xs text-[var(--accent-pink)] font-bold tracking-widest uppercase">// PROJECT_PORTFOLIO</span>
        <h1 className="font-rajdhani text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-wide uppercase">&gt;_ INDEXED PROJECTS</h1>
      </motion.div>

      {/* Controls: Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'FEATURED', 'REACT', 'LARAVEL'] as const).map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 font-mono text-[10px] tracking-widest border transition-all select-none cursor-pointer ${
                filter === type
                  ? 'border-[var(--accent-cyan)] bg-[var(--bg-accent-strong)]/40 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                  : 'border-[var(--border-muted)] bg-[var(--bg-surface)] text-[var(--text-tertiary)] hover:border-slate-600 hover:text-[var(--text-primary)]'
              }`}
              style={{
                clipPath: 'polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)',
              }}
            >
              [{type}]
            </motion.button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="SEARCH_PROJECTS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-surface-strong)] border border-[var(--border-main)] px-4 py-2 pl-9 font-mono text-xs text-[var(--text-primary)] placeholder-slate-500 focus:outline-none focus:border-[var(--accent-cyan)]/50 transition-colors"
            style={{
              clipPath: 'polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)',
            }}
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--text-muted)]" />
        </div>
      </div>

      {/* Projects Grid with Framer Motion AnimatePresence and layout animations */}
      <AnimatePresence mode="popLayout">
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border border-dashed border-[var(--border-main)] p-12 text-center font-mono text-xs text-[var(--text-muted)]"
          >
            [!] NO PROJECTS MATCHING THE CRITERIA FOUND.
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, i) => (
              <Link
                key={project.id}
                to="/projects/$projectId"
                params={{ projectId: project.id }}
                layout
                className="relative border border-[var(--border-main)] bg-[var(--bg-surface)] overflow-hidden group hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all flex flex-col h-full"
                style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' }}
              >
                <CornerBrackets colorClass="border-[var(--border-strong)] group-hover:border-[var(--accent-cyan)]/50" size={8} />

                {/* Project Image Panel */}
                <div className="h-48 overflow-hidden relative border-b border-[var(--border-main)] bg-[var(--bg-surface-strong)] flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface-strong)]/90 via-transparent to-transparent z-10" />
                  
                  {/* Scanline hover effect */}
                  <div className="absolute inset-0 bg-[var(--bg-accent)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" 
                    style={{
                      backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(34, 211, 238, 0.15) 50%)',
                      backgroundSize: '100% 4px',
                    }}
                  />

                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />

                  {/* ID Badge */}
                  <div className="absolute bottom-3 left-4 z-20 font-mono text-[9px] text-[var(--accent-pink)] bg-[var(--bg-input)] px-1.5 py-0.5 border border-pink-500/20">
                    [{project.id.toUpperCase()}]
                  </div>

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-3 right-4 z-20 font-mono text-[8px] text-[var(--accent-cyan)] bg-[var(--bg-accent)] px-1.5 py-0.5 border border-[var(--border-strong)]">
                      // FEATURED
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-rajdhani text-lg font-bold text-[var(--text-primary)] tracking-wide uppercase group-hover:text-[var(--accent-cyan)] transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="font-body text-xs text-[var(--text-tertiary)] leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[9px] text-[var(--accent-cyan)] bg-[var(--bg-accent)] px-1.5 py-0.5 border border-[var(--border-main)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-4 pt-1 border-t border-[var(--border-main)] font-mono text-[10px]">
                      <span className="text-[var(--accent-cyan)] flex items-center gap-1">
                        <span>VIEW_DETAILS</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
