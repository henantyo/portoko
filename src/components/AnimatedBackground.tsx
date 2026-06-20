import React, { useEffect, useMemo, useRef } from 'react';

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  // Keep config stable across renders
  const CFG = useMemo(
    () => ({
      bgCenter: '#2a0b4a',
      bgEdge: '#070413',

      // Neon palette: violet/cyan/magenta
      cyanCore: '#22d3ee',
      cyanGlow: '#22d3ee',
      cyanLine: '#22d3ee',

      redCore: '#ec4899',
      redGlow: '#ec4899',
      redLine: '#ec4899',
      nodeMinR: 2,
      nodeMaxR: 5,
      redNodeMinR: 1.5,
      redNodeMaxR: 3,
      redRatio: 0.12,
      glowMult: 4,
      driftMin: 0.08,
      driftMax: 0.25,
      linkDist: 180,
      lineAlphaMin: 0.15,
      lineAlphaMax: 0.40,
      redLineChance: 0.03,
      nodesPerArea: 12000,
      minNodes: 30,
      maxNodes: 120,
    }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;

    type Node = {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      isRed: boolean;
      phase: number;
    };

    const nodes: Node[] = [];


    const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

    const nodeCount = () => {
      const n = Math.round((W * H) / CFG.nodesPerArea);
      return Math.max(CFG.minNodes, Math.min(CFG.maxNodes, n));
    };

    const createNode = (): Node => {
      const isRed = Math.random() < CFG.redRatio;
      const rMin = isRed ? CFG.redNodeMinR : CFG.nodeMinR;
      const rMax = isRed ? CFG.redNodeMaxR : CFG.nodeMaxR;
      return {
        x: rand(0, W),
        y: rand(0, H),
        r: rand(rMin, rMax),
        vx: rand(-CFG.driftMax, CFG.driftMax),
        vy: rand(-CFG.driftMax, CFG.driftMax),
        isRed,
        phase: rand(0, Math.PI * 2),
      };
    };

    const resize = () => {
      const prevW = W || window.innerWidth;
      const prevH = H || window.innerHeight;

      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;

      const sx = W / prevW;
      const sy = H / prevH;
      nodes.forEach((n) => {
        n.x *= sx;
        n.y *= sy;
      });

      const target = nodeCount();
      while (nodes.length < target) nodes.push(createNode());
      while (nodes.length > target) nodes.pop();
    };

    const drawBg = () => {
      const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.75);
      g.addColorStop(0, CFG.bgCenter);
      g.addColorStop(0.55, CFG.bgEdge);
      g.addColorStop(1, '#03020a');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // Vignette for readability
      const v = ctx.createRadialGradient(
        W / 2,
        H / 2,
        W * 0.12,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.9
      );
      v.addColorStop(0, 'rgba(0,0,0,0)');
      v.addColorStop(0.8, 'rgba(0,0,0,0.25)');
      v.addColorStop(1, 'rgba(0,0,0,0.62)');
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);
    };

    const drawLines = () => {
      const ld2 = CFG.linkDist * CFG.linkDist;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > ld2) continue;

          const dist = Math.sqrt(d2);
          const ratio = 1 - dist / CFG.linkDist;
          const baseA = CFG.lineAlphaMin + ratio * (CFG.lineAlphaMax - CFG.lineAlphaMin);

          const bothRed = nodes[i].isRed && nodes[j].isRed;
          const eitherRed = nodes[i].isRed || nodes[j].isRed;
          const isRedAccent = bothRed || (eitherRed && Math.random() < CFG.redLineChance);

          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = isRedAccent ? CFG.redLine : CFG.cyanLine;
          ctx.globalAlpha = isRedAccent ? baseA * 0.7 : baseA;
          ctx.lineWidth = isRedAccent ? 0.8 : 1;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    };

    const drawNodes = (t: number) => {
      for (const n of nodes) {
        const pulse = 1 + 0.18 * Math.sin(t * 0.001 + n.phase);
        const r = n.r * pulse;
        const glowR = r * CFG.glowMult;

        const core = n.isRed ? CFG.redCore : CFG.cyanCore;
        const glow = n.isRed ? CFG.redGlow : CFG.cyanGlow;

        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        grad.addColorStop(0, `${glow}55`);
        grad.addColorStop(0.4, `${glow}22`);
        grad.addColorStop(1, `${glow}00`);

        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.shadowColor = glow;
        ctx.shadowBlur = glowR * 0.6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const updateNodes = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0) {
          n.x = 0;
          n.vx = Math.abs(n.vx);
        }
        if (n.x > W) {
          n.x = W;
          n.vx = -Math.abs(n.vx);
        }
        if (n.y < 0) {
          n.y = 0;
          n.vy = Math.abs(n.vy);
        }
        if (n.y > H) {
          n.y = H;
          n.vy = -Math.abs(n.vy);
        }
      }
    };

    const frame = (t: number) => {
      drawBg();
      updateNodes();
      drawLines();
      drawNodes(t);
      requestAnimationFrame(frame);
    };

    window.addEventListener('resize', resize);
    resize();
    const rafId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, [CFG]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-50 pointer-events-none select-none"
    />
  );
};

