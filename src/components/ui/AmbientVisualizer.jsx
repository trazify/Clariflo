import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';

const THEME_PALETTES = {
  'aurora-mesh': ['#8b5cf6', '#ec4899', '#3b82f6', '#a78bfa'],
  'ocean-drift': ['#3b82f6', '#06b6d4', '#6366f1', '#60a5fa'],
  'sunset-bloom': ['#7c3aed', '#f43f5e', '#f97316', '#fb7185'],
  'deep-space': ['#312e81', '#4f46e5', '#a78bfa', '#818cf8'],
  'mint-dream': ['#10b981', '#0d9488', '#06b6d4', '#34d399'],
  'rose-quartz': ['#db2777', '#be185d', '#d946ef', '#f472b6']
};

const DEFAULT_PALETTE = ['#ffffff', '#e5e5e5', '#a3a3a3', '#f5f5f5'];

export const AmbientVisualizer = () => {
  const canvasRef = useRef(null);
  const activeTheme = useAppStore((state) => state.activeTheme);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let particles = [];
    const particleCount = 75;

    // Handle Resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Get current color palette based on active theme
    const getPalette = () => {
      return THEME_PALETTES[activeTheme] || DEFAULT_PALETTE;
    };

    // Initialize Particles
    const initParticles = () => {
      const palette = getPalette();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const baseRadius = Math.random() * 2 + 1;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          baseRadius,
          radius: baseRadius,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: Math.random() * 0.5 + 0.15,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.01 + 0.005,
          driftOffset: Math.random() * 100
        });
      }
    };

    // Track Mouse
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      particles.forEach((p) => {
        // Dynamic Breathing/Pulsing Radius
        p.phase += p.pulseSpeed;
        p.radius = p.baseRadius + Math.sin(p.phase) * 0.8;

        // Wave-drift movement addition
        const angle = Math.sin(p.phase * 0.5) * 0.1;
        
        // Update positions
        p.x += p.vx + Math.cos(angle) * 0.05;
        p.y += p.vy + Math.sin(angle) * 0.05;

        // Mouse Repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const repelRadius = 140;

        if (dist < repelRadius) {
          const force = (repelRadius - dist) / repelRadius;
          // Softly push away
          p.x += (dx / (dist || 1)) * force * 1.5;
          p.y += (dy / (dist || 1)) * force * 1.5;
        }

        // Screen boundary wrap-around
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw soft ambient outer glow ring
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Initial setup
    resizeCanvas();
    draw();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (canvas) {
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [activeTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
