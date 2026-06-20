import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface TerminalToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const TerminalToast: React.FC<TerminalToastProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <TerminalToastItem key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const TerminalToastItem: React.FC<{ toast: ToastMessage; onClose: (id: string) => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const config = {
    success: {
      tag: '[SYS_OK]',
      color: 'text-[var(--accent-cyan)] border-cyan-500/30 bg-[var(--bg-accent)]',
      icon: <CheckCircle className="w-4 h-4 text-[var(--accent-cyan)]" />,
    },
    error: {
      tag: '[SYS_ERR]',
      color: 'text-red-400 border-red-500/30 bg-red-950/80',
      icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
    },
    info: {
      tag: '[SYS_MSG]',
      color: 'text-[var(--accent-pink)] border-pink-500/30 bg-pink-950/80',
      icon: <Info className="w-4 h-4 text-[var(--accent-pink)]" />,
    },
  };

  const current = config[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`pointer-events-auto flex items-start gap-3 border p-4 backdrop-blur-md relative font-mono text-xs ${current.color}`}
      style={{
        clipPath: 'polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)',
      }}
    >
      {/* Corner Brackets */}
      <span className="absolute top-0 left-0 w-1 h-1 border-t border-l border-current opacity-40" />
      <span className="absolute top-0 right-0 w-1 h-1 border-t border-r border-current opacity-40" />
      <span className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-current opacity-40" />
      <span className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-current opacity-40" />

      <div className="flex-shrink-0 mt-0.5">{current.icon}</div>
      <div className="flex-1">
        <div className="font-bold mb-1 tracking-wider flex items-center justify-between">
          <span>{current.tag}</span>
          <span className="text-[10px] opacity-40">SYSTEM LOG</span>
        </div>
        <p className="opacity-90 leading-relaxed text-[var(--text-primary)]">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-[10px] opacity-40 hover:opacity-100 transition-opacity font-mono px-1"
      >
        [X]
      </button>
    </motion.div>
  );
};
