import React from 'react';

interface CornerBracketsProps {
  colorClass?: string;
  size?: number; // length of the bracket arms in pixels
}

export const CornerBrackets: React.FC<CornerBracketsProps> = ({ 
  colorClass = 'border-cyan-400/50', 
  size = 6 
}) => {
  const style = { width: `${size}px`, height: `${size}px` };
  
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Top Left */}
      <div 
        style={style}
        className={`absolute top-0 left-0 border-t border-l ${colorClass}`} 
      />
      {/* Top Right */}
      <div 
        style={style}
        className={`absolute top-0 right-0 border-t border-r ${colorClass}`} 
      />
      {/* Bottom Left */}
      <div 
        style={style}
        className={`absolute bottom-0 left-0 border-b border-l ${colorClass}`} 
      />
      {/* Bottom Right */}
      <div 
        style={style}
        className={`absolute bottom-0 right-0 border-b border-r ${colorClass}`} 
      />
    </div>
  );
};
