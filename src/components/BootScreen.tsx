import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootLogs = [
    '>> INITIALIZING NEO-ARCH CORE V3.1.9...',
    '>> VERIFYING SMK PGRI WLINGI SECURE NETWORK ACCESS...',
    '>> CONNECTING TO LOCAL_STORAGE_DB...',
    '>> FETCHING PROFILE DATA: Ahmad Farhan... OK',
    '>> SYNCING SKILLS DATABASE... [12 SKILLS DETECTED]',
    '>> INDEXING RECENT PROJECTS... [4 FILES LOADED]',
    '>> SYSTEM DIAGNOSTICS: MEMORY_OK, GL_SHADERS_READY',
    '>> OVERLAY HOVER_SCANLINE INITIALIZATION... COMPLETED',
    '>> BOOT SEQUENCE SUCCESSFUL. welcome to the arena.'
  ];

  useEffect(() => {
    // Sequentially add logs
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < bootLogs.length) {
        setLogs((prev) => [...prev, bootLogs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 220);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    // Complete boot screen
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 2600);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#07090e] flex flex-col justify-between p-6 md:p-12 font-mono text-xs md:text-sm text-cyan-400 select-none">
      {/* Decorative top header */}
      <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="tracking-widest font-bold">NEO-ARCH // SYSTEM_BOOT</span>
        </div>
        <div className="text-[10px] text-cyan-400/50">
          SECURE_MODE // BLITAR_EAST_JAVA
        </div>
      </div>

      {/* Terminal Logs Container */}
      <div className="flex-1 my-8 overflow-y-auto flex flex-col justify-end gap-2 pr-2">
        <AnimatePresence>
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={`font-mono leading-relaxed ${
                index === bootLogs.length - 1 ? 'text-pink-400 font-bold' : 'text-cyan-400/80'
              }`}
            >
              {log}
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="inline-block w-2 h-4 bg-cyan-400 animate-pulse mt-1" />
      </div>

      {/* Progress Bar & Footer */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-[10px] text-cyan-400/60 uppercase tracking-widest">
          <span>Booting core modules...</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1 bg-cyan-950 border border-cyan-500/20 overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-cyan-400/30 font-mono mt-2">
          <span>SYS_MEM: 1024KB/1024KB</span>
          <span>SMK PGRI WLINGI - RPL CYBER TEAM</span>
        </div>
      </div>
    </div>
  );
};
