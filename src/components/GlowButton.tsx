import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlowButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'cyan' | 'magenta' | 'neutral';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  variant = 'cyan',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'relative px-6 py-2.5 font-rajdhani text-sm font-semibold tracking-widest uppercase transition-all duration-300 select-none overflow-hidden';
  const widthStyle = fullWidth ? 'w-full' : 'w-auto';
  
  const variantStyles = {
    cyan: 'bg-[var(--bg-accent)] border border-cyan-500/30 text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]',
    magenta: 'bg-pink-950/40 border border-pink-500/30 text-[var(--accent-pink)] hover:border-pink-400 hover:text-pink-300 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]',
    neutral: 'bg-[var(--bg-surface)] border border-slate-700/50 text-[var(--text-secondary)] hover:border-slate-500 hover:text-[var(--text-primary)]',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${widthStyle} ${variantStyles[variant]} ${className}`}
      style={{
        clipPath: 'polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)',
      }}
      {...props}
    >
      {/* Corner Brackets inside the button */}
      <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-60" />
      <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-current opacity-60" />
      <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-current opacity-60" />
      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current opacity-60" />

      {/* Shimmer effect on hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};
