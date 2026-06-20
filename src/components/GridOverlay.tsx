import React, { useEffect, useRef } from 'react';

interface Laser {
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  speed: number;
  color: string;
}

export const GridOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const gridSize = 60; // Size of grid squares
    let lasers: Laser[] = [];
    const maxLasers = 15; // Maximum active lasers on screen

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = ['#22d3ee', '#ec4899', '#8b5cf6']; // Cyan, Magenta, Violet

    const spawnLaser = () => {
      if (lasers.length >= maxLasers) return;

      const isHorizontal = Math.random() > 0.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const speed = Math.random() * 3 + 2; // Speed of the laser pulse
      const length = Math.random() * 120 + 80; // Length of the glowing trail

      if (isHorizontal) {
        // Spawn along a horizontal grid line
        const gridLinesY = Math.floor(height / gridSize);
        if (gridLinesY <= 0) return;
        const lineIndex = Math.floor(Math.random() * gridLinesY);
        const y = lineIndex * gridSize;
        const direction = Math.random() > 0.5 ? 1 : -1;
        const x = direction === 1 ? -length : width + length;

        lasers.push({
          x,
          y,
          dx: speed * direction,
          dy: 0,
          length,
          speed,
          color,
        });
      } else {
        // Spawn along a vertical grid line
        const gridLinesX = Math.floor(width / gridSize);
        if (gridLinesX <= 0) return;
        const lineIndex = Math.floor(Math.random() * gridLinesX);
        const x = lineIndex * gridSize;
        const direction = Math.random() > 0.5 ? 1 : -1;
        const y = direction === 1 ? -length : height + length;

        lasers.push({
          x,
          y,
          dx: 0,
          dy: speed * direction,
          length,
          speed,
          color,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw static grid lines with subtle tech glow
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.05)';
      ctx.lineWidth = 1;

      // Vertical grid lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal grid lines
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw tiny tech intersection dots
      ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
      for (let x = 0; x < width; x += gridSize * 2) {
        for (let y = 0; y < height; y += gridSize * 2) {
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }

      // 3. Randomly spawn lasers
      if (Math.random() < 0.04) {
        spawnLaser();
      }

      // 4. Update and draw lasers with glowing heads and fading tails
      lasers = lasers.filter((laser) => {
        laser.x += laser.dx;
        laser.y += laser.dy;

        // Check if the laser has completely left the screen
        if (laser.dx > 0 && laser.x > width + laser.length) return false;
        if (laser.dx < 0 && laser.x < -laser.length) return false;
        if (laser.dy > 0 && laser.y > height + laser.length) return false;
        if (laser.dy < 0 && laser.y < -laser.length) return false;

        // Draw laser path with gradient
        ctx.beginPath();
        
        let grad;
        if (laser.dx !== 0) {
          // Horizontal laser gradient
          grad = ctx.createLinearGradient(
            laser.x - (laser.dx > 0 ? laser.length : -laser.length),
            laser.y,
            laser.x,
            laser.y
          );
        } else {
          // Vertical laser gradient
          grad = ctx.createLinearGradient(
            laser.x,
            laser.y - (laser.dy > 0 ? laser.length : -laser.length),
            laser.x,
            laser.y
          );
        }

        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.7, laser.color + '22'); // Soft tail glow
        grad.addColorStop(0.95, laser.color + 'cc'); // Stronger body glow
        grad.addColorStop(1, '#ffffff'); // Ultra bright laser head

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        
        ctx.moveTo(
          laser.x - (laser.dx !== 0 ? (laser.dx > 0 ? laser.length : -laser.length) : 0), 
          laser.y - (laser.dy !== 0 ? (laser.dy > 0 ? laser.length : -laser.length) : 0)
        );
        ctx.lineTo(laser.x, laser.y);
        ctx.stroke();

        // Draw bright glowing head point
        ctx.beginPath();
        ctx.arc(laser.x, laser.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 12;
        ctx.shadowColor = laser.color;
        ctx.fill();
        
        // Reset shadow for canvas rendering performance
        ctx.shadowBlur = 0;

        return true;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-40 pointer-events-none select-none opacity-70"
      style={{
        maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.1) 95%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.1) 95%)'
      }}
    />
  );
};
