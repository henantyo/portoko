import React, { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { CornerBrackets } from './CornerBrackets';
import { useTheme } from '../lib/ThemeContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme, toggleTheme, isAnimating } = useTheme();

  const navLinks = [
    { name: 'HOME', to: '/' },
    { name: 'ABOUT', to: '/about' },
    { name: 'SKILLS', to: '/skills' },
    { name: 'PROJECTS', to: '/projects' },
    { name: 'EXPERIENCE', to: '/experience' },
    { name: 'CONTACT', to: '/contact' },
  ];

  const isAdminRoute = currentPath.startsWith('/admin');

  if (isAdminRoute) {
    return null;
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: 'spring' as const, stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[var(--border-main)] bg-[var(--bg-overlay)] backdrop-blur-lg"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/admin"
            className="group flex items-center gap-2 font-mono text-sm tracking-widest font-bold text-[var(--text-primary)]"
            aria-label="Admin Portal"
            title="Admin Portal"
          >
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="relative flex h-10 w-10 items-center justify-center"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-cyan)]/30 opacity-70" />
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="portoko_logo_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ff88" />
                    <stop offset="100%" stopColor="#00ccff" />
                  </linearGradient>
                  <filter id="portoko_glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <path d="M 50 15 L 80 30 L 80 70 L 50 85 L 20 70 L 20 30 Z" fill="none" stroke="url(#portoko_logo_grad)" strokeWidth="2.5" filter="url(#portoko_glow)"/>
                <circle cx="50" cy="50" r="20" fill="none" stroke="url(#portoko_logo_grad)" strokeWidth="1.5" filter="url(#portoko_glow)"/>
                <circle cx="50" cy="50" r="3" fill="url(#portoko_logo_grad)" filter="url(#portoko_glow)"/>
              </svg>
            </motion.span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-1.5 font-rajdhani text-xs font-bold tracking-widest text-[var(--text-secondary)] transition-all hover:text-[var(--accent-cyan)]"
                activeProps={{
                  className: 'text-[var(--accent-cyan)] bg-[var(--bg-accent)]',
                }}
              >
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    {isActive && (
                      <>
                        <CornerBrackets colorClass="border-[var(--accent-cyan-dim)]" size={4} />
                        <motion.span
                          layoutId="activeNavIndicator"
                          className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent"
                          transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
                        />
                      </>
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </motion.div>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              disabled={isAnimating}
              className="border border-[var(--border-strong)] bg-[var(--bg-accent)] p-1.5 text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition-all disabled:opacity-50"
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden border border-[var(--border-strong)] bg-[var(--bg-accent)] p-1.5 text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition-all"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-t border-[var(--border-main)] bg-[var(--bg-overlay-strong)] backdrop-blur-lg overflow-hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 font-rajdhani text-sm font-bold tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:bg-[var(--bg-accent)] transition-all"
                  activeProps={{
                    className: 'text-[var(--accent-cyan)] bg-[var(--bg-accent-strong)] border-l border-[var(--accent-cyan)]',
                  }}
                >
                  {'>_ ' + link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
