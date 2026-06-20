import React from 'react';
import { Github, Instagram, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--border-main)] bg-[var(--bg-overlay)]/55 backdrop-blur-md py-8 mt-20 font-mono text-xs text-[var(--text-secondary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="text-center md:text-left space-y-1">
            <p className="font-bold text-[var(--text-tertiary)] tracking-widest uppercase">
               PERSONAL PORTFOLIO
            </p>
            <p className="text-[10px] opacity-60">
              Dibuat khusus untuk program PKL &amp; portofolio SMK PGRI Wlingi
            </p>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center gap-1 opacity-50 text-[10px]">
            <div className="flex gap-4">
              <span>LOC: BLITAR, INDONESIA</span>
              <span>•</span>
              <span>LAT: -8.0844</span>
              <span>•</span>
              <span>LON: 112.3184</span>
            </div>
            <div className="flex gap-4">
              <span>STATUS: ONLINE</span>
              <span>•</span>
              <span>DB_CONN: LOCAL_STORAGE</span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-[var(--accent-cyan)] transition-colors flex items-center gap-0.5" aria-label="GitHub" title="GitHub">
                <Github className="w-3.5 h-3.5" />
              </a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                className="hover:text-[var(--accent-cyan)] transition-colors flex items-center gap-0.5" aria-label="WhatsApp" title="WhatsApp">
                <Phone className="w-3 h-3" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-[var(--accent-cyan)] transition-colors flex items-center gap-0.5" aria-label="Instagram" title="Instagram">
                <Instagram className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[10px] opacity-60">
              © {currentYear} AHMAD FARHAN. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
