import React from 'react';

export const ScanlineOverlay: React.FC = () => {
  return (
    <>
      {/* Repeating static scanlines */}
      <div 
        className="fixed inset-0 -z-30 pointer-events-none opacity-[0.015] select-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
      
      {/* Moving scanline */}
      <div className="fixed inset-0 -z-30 pointer-events-none select-none overflow-hidden">
        <div className="w-full h-[4px] bg-[var(--bg-accent)] shadow-[0_0_10px_rgba(34,211,238,0.3)] animate-[scanline_8s_linear_infinite]" />
      </div>
    </>
  );
};
