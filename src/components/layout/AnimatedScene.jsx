import React, { useEffect, useRef } from 'react';

// ─── Fireplace ────────────────────────────────────────────────────────────────
function FireplaceScene({ style }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Embers / particles
    const particles = Array.from({ length: 120 }, () => createEmber(canvas));

    function createEmber(c, reset = false) {
      const x = reset ? c.width / 2 + (Math.random() - 0.5) * c.width * 0.35 : c.width / 2 + (Math.random() - 0.5) * c.width * 0.35;
      return {
        x, y: reset ? c.height * 0.72 : c.height * (0.4 + Math.random() * 0.6),
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(0.8 + Math.random() * 2.5),
        life: Math.random(),
        maxLife: 0.6 + Math.random() * 0.4,
        size: 1.5 + Math.random() * 4,
        hue: 15 + Math.random() * 30,
      };
    }

    function drawFrame() {
      const W = canvas.width, H = canvas.height;

      // Dark room bg
      ctx.fillStyle = '#0d0700';
      ctx.fillRect(0, 0, W, H);

      // Floor glow
      const floorGrad = ctx.createRadialGradient(W / 2, H * 0.78, 10, W / 2, H * 0.78, W * 0.55);
      floorGrad.addColorStop(0, 'rgba(200,80,10,0.55)');
      floorGrad.addColorStop(0.5, 'rgba(120,30,5,0.18)');
      floorGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, 0, W, H);

      // Fireplace surround
      const brickH = H * 0.35, brickW = W * 0.55;
      const bx = (W - brickW) / 2, by = H * 0.6;
      ctx.fillStyle = '#1a0a04';
      ctx.beginPath();
      ctx.roundRect(bx - 20, by - 10, brickW + 40, brickH, 12);
      ctx.fill();
      // Arch opening
      ctx.fillStyle = '#060302';
      ctx.beginPath();
      ctx.roundRect(bx, by, brickW, brickH * 0.88, [40, 40, 4, 4]);
      ctx.fill();

      // Log silhouettes
      const logY = by + brickH * 0.82;
      ctx.fillStyle = '#1c0d06';
      for (let i = 0; i < 3; i++) {
        const lx = bx + brickW * (0.2 + i * 0.27);
        ctx.save();
        ctx.translate(lx, logY);
        ctx.rotate((i - 1) * 0.18);
        ctx.beginPath();
        ctx.ellipse(0, 0, 38, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Flame layers (back → front)
      const now = Date.now() / 1000;
      const flameLayers = [
        { w: brickW * 0.55, h: brickH * 0.75, alpha: 0.45, hue: 20 },
        { w: brickW * 0.4,  h: brickH * 0.65, alpha: 0.6,  hue: 30 },
        { w: brickW * 0.28, h: brickH * 0.55, alpha: 0.8,  hue: 45 },
        { w: brickW * 0.18, h: brickH * 0.42, alpha: 1,    hue: 55 },
      ];

      flameLayers.forEach(({ w, h, alpha, hue }) => {
        const flicker = Math.sin(now * (4 + hue * 0.05) + hue) * 0.06;
        const fx = W / 2;
        const fy = by + brickH * 0.2;
        const grad = ctx.createRadialGradient(fx, fy + h * 0.6, 4, fx, fy + h * 0.4, h);
        grad.addColorStop(0, `hsla(${hue + 10},100%,90%,${alpha})`);
        grad.addColorStop(0.15, `hsla(${hue},100%,65%,${alpha})`);
        grad.addColorStop(0.5, `hsla(${hue - 10},100%,45%,${alpha * 0.7})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.save();
        ctx.translate(fx, fy);
        ctx.scale(1 + flicker, 1);
        ctx.beginPath();
        ctx.ellipse(0, h * 0.3, w / 2, h * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Ember particles
      particles.forEach((p, i) => {
        p.x += p.vx + Math.sin(now * 2 + i) * 0.3;
        p.y += p.vy;
        p.life -= 0.008;
        if (p.life <= 0) {
          particles[i] = createEmber(canvas, true);
          return;
        }
        const t = p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = Math.min(t * 2, 1) * 0.9;
        ctx.fillStyle = `hsl(${p.hue},100%,${60 + t * 30}%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * t, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(drawFrame);
    }

    drawFrame();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} />;
}

// ─── Rain ──────────────────────────────────────────────────────────────────────
function RainScene({ style }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const drops = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 8 + Math.random() * 12,
      length: 15 + Math.random() * 25,
      alpha: 0.2 + Math.random() * 0.5,
    }));

    const splashes = [];

    function drawFrame() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Dark stormy sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#0d1117');
      skyGrad.addColorStop(0.5, '#111827');
      skyGrad.addColorStop(1, '#1c2a3a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Window pane reflection glow
      const glowGrad = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.3, W * 0.6);
      glowGrad.addColorStop(0, 'rgba(100,150,255,0.06)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, W, H);

      // Rain drops
      ctx.strokeStyle = 'rgba(180,210,255,0.5)';
      ctx.lineWidth = 1;
      drops.forEach(d => {
        d.y += d.speed;
        d.x -= 1.5; // slight angle
        if (d.y > H) {
          d.y = -d.length;
          d.x = Math.random() * W;
          // spawn splash
          splashes.push({ x: d.x + 40, y: H - 2, r: 0, maxR: 6 + Math.random() * 8, alpha: 0.6 });
        }
        ctx.globalAlpha = d.alpha;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 4, d.y + d.length);
        ctx.stroke();
      });

      // Splashes
      ctx.globalAlpha = 1;
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.r += 0.5;
        s.alpha -= 0.04;
        if (s.alpha <= 0) { splashes.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = 'rgba(180,210,255,0.8)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.r, s.r * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Window droplets (runlets on glass)
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(drawFrame);
    }

    drawFrame();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} />;
}

// ─── Ocean ─────────────────────────────────────────────────────────────────────
function OceanScene({ style }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const foamParticles = Array.from({ length: 60 }, (_, i) => ({
      x: Math.random() * 2000,
      y: 0,
      size: 2 + Math.random() * 4,
      alpha: Math.random(),
      speed: 0.3 + Math.random() * 0.5,
    }));

    function drawFrame() {
      const W = canvas.width, H = canvas.height;
      const now = Date.now() / 1000;
      ctx.clearRect(0, 0, W, H);

      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.55);
      skyGrad.addColorStop(0, '#0c1445');
      skyGrad.addColorStop(0.4, '#1a2a6c');
      skyGrad.addColorStop(1, '#2e4a8a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H * 0.55);

      // Moon
      const moonX = W * 0.75, moonY = H * 0.18;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 5, moonX, moonY, 80);
      moonGlow.addColorStop(0, 'rgba(255,255,220,0.5)');
      moonGlow.addColorStop(0.3, 'rgba(200,220,255,0.15)');
      moonGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = moonGlow;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fffff0';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 28, 0, Math.PI * 2);
      ctx.fill();

      // Stars
      ctx.fillStyle = 'white';
      for (let i = 0; i < 80; i++) {
        const sx = ((i * 137 + 50) % W);
        const sy = ((i * 97 + 20) % (H * 0.48));
        const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(now * 1.5 + i));
        ctx.globalAlpha = twinkle * 0.9;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.8 + (i % 3) * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Ocean layers (4 wave sets)
      const horizon = H * 0.55;
      const oceanGrad = ctx.createLinearGradient(0, horizon, 0, H);
      oceanGrad.addColorStop(0, '#1a3a6e');
      oceanGrad.addColorStop(0.4, '#0d2550');
      oceanGrad.addColorStop(1, '#060f2a');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, horizon, W, H - horizon);

      // Moon reflection
      const refGrad = ctx.createLinearGradient(W * 0.5, horizon, W * 0.5, H);
      refGrad.addColorStop(0, 'rgba(255,255,220,0.25)');
      refGrad.addColorStop(0.5, 'rgba(255,255,220,0.08)');
      refGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = refGrad;
      ctx.fillRect(W * 0.4, horizon, W * 0.2, H - horizon);

      // Wave layers
      [0.58, 0.68, 0.78, 0.88, 0.95].forEach((yFrac, wi) => {
        const waveY = H * yFrac;
        const amp = 6 + wi * 5;
        const freq = 0.008 - wi * 0.001;
        const speed = (0.4 + wi * 0.2) * (wi % 2 === 0 ? 1 : -0.7);
        const alpha = 0.12 + wi * 0.07;

        ctx.beginPath();
        ctx.moveTo(0, waveY);
        for (let x = 0; x <= W; x += 4) {
          const y = waveY + Math.sin(x * freq + now * speed) * amp + Math.sin(x * freq * 1.7 + now * speed * 0.6) * amp * 0.4;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        ctx.fillStyle = `rgba(100,160,255,${alpha})`;
        ctx.fill();

        // Foam line
        ctx.beginPath();
        ctx.moveTo(0, waveY);
        for (let x = 0; x <= W; x += 4) {
          const y = waveY + Math.sin(x * freq + now * speed) * amp + Math.sin(x * freq * 1.7 + now * speed * 0.6) * amp * 0.4;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(200,230,255,${alpha * 1.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animRef.current = requestAnimationFrame(drawFrame);
    }

    drawFrame();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} />;
}

// ─── Forest ────────────────────────────────────────────────────────────────────
function ForestScene({ style }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    // Pre-build tree data
    const trees = Array.from({ length: 18 }, (_, i) => ({
      x: (i / 17) * 1.2 - 0.1,
      layer: i % 3,
      height: 0.35 + Math.random() * 0.3,
      width: 0.03 + Math.random() * 0.04,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.3 + Math.random() * 0.4,
    })).sort((a, b) => a.layer - b.layer);

    // Fireflies
    const fireflies = Array.from({ length: 35 }, () => ({
      x: Math.random(),
      y: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.0002 + Math.random() * 0.0003,
      radius: 0.05 + Math.random() * 0.1,
    }));

    function drawTree(x, y, w, h, sway) {
      const W = canvas.width, H = canvas.height;
      const px = x * W, py = y * H, pw = w * W, ph = h * H;

      // Trunk
      ctx.fillStyle = '#1a0f06';
      ctx.fillRect(px - pw * 0.08, py, pw * 0.16, ph * 0.25);

      // Canopy layers
      [0, 0.15, 0.3].forEach((offset, li) => {
        const cx = px + Math.sin(sway) * pw * 0.3;
        const cy = py - ph * offset;
        const cw = pw * (1.1 - li * 0.15);
        const ch = ph * (0.5 + li * 0.1);
        const grad = ctx.createRadialGradient(cx, cy + ch * 0.3, 0, cx, cy + ch * 0.3, cw);
        const luma = 20 + li * 8;
        grad.addColorStop(0, `hsl(130,${40 + li * 5}%,${luma}%)`);
        grad.addColorStop(1, `hsl(120,35%,${luma - 8}%)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.bezierCurveTo(cx - cw * 0.5, cy + ch * 0.4, cx - cw * 0.7, cy + ch, cx, cy + ch);
        ctx.bezierCurveTo(cx + cw * 0.7, cy + ch, cx + cw * 0.5, cy + ch * 0.4, cx, cy);
        ctx.fill();
      });
    }

    function drawFrame() {
      const W = canvas.width, H = canvas.height;
      const now = Date.now() / 1000;
      ctx.clearRect(0, 0, W, H);

      // Sky gradient - dawn/dusk atmosphere
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.65);
      skyGrad.addColorStop(0, '#0a0f1a');
      skyGrad.addColorStop(0.3, '#0d1f2d');
      skyGrad.addColorStop(0.7, '#1a3020');
      skyGrad.addColorStop(1, '#0e1a0e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Moonbeam shafts
      for (let i = 0; i < 4; i++) {
        const bx = W * (0.3 + i * 0.12);
        const beam = ctx.createLinearGradient(bx, 0, bx + 40, H * 0.8);
        beam.addColorStop(0, 'rgba(180,220,160,0.03)');
        beam.addColorStop(1, 'transparent');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(bx, 0);
        ctx.lineTo(bx + 60, H * 0.8);
        ctx.lineTo(bx + 20, H * 0.8);
        ctx.lineTo(bx - 40, 0);
        ctx.fill();
      }

      // Ground fog
      for (let i = 0; i < 3; i++) {
        const fogY = H * (0.75 + i * 0.08);
        const fogGrad = ctx.createLinearGradient(0, fogY - 40, 0, fogY + 40);
        fogGrad.addColorStop(0, 'transparent');
        fogGrad.addColorStop(0.5, `rgba(180,230,180,${0.04 + i * 0.02})`);
        fogGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = fogGrad;
        const shift = Math.sin(now * 0.2 + i) * W * 0.05;
        ctx.fillRect(shift, fogY - 40, W, 80);
      }

      // Draw trees by layer
      [0, 1, 2].forEach(layer => {
        trees.filter(t => t.layer === layer).forEach(t => {
          const sway = Math.sin(now * t.swaySpeed + t.sway) * 0.05;
          const yBase = 0.5 + layer * 0.12;
          const darkness = layer === 0 ? 0.7 : layer === 1 ? 0.85 : 1;
          ctx.globalAlpha = darkness;
          drawTree(t.x, yBase, t.width, t.height, sway);
        });
      });
      ctx.globalAlpha = 1;

      // Ground
      const groundGrad = ctx.createLinearGradient(0, H * 0.85, 0, H);
      groundGrad.addColorStop(0, '#0d1a0d');
      groundGrad.addColorStop(1, '#060d06');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, H * 0.85, W, H * 0.15);

      // Stream (center)
      const streamGrad = ctx.createLinearGradient(W * 0.4, 0, W * 0.6, 0);
      streamGrad.addColorStop(0, 'transparent');
      streamGrad.addColorStop(0.3, 'rgba(100,180,200,0.15)');
      streamGrad.addColorStop(0.7, 'rgba(100,180,200,0.15)');
      streamGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = streamGrad;
      ctx.fillRect(W * 0.4, H * 0.86, W * 0.2, H * 0.14);

      // Ripple on stream
      for (let i = 0; i < 5; i++) {
        const ry = H * (0.88 + i * 0.025);
        const rphase = now * 1.5 + i;
        ctx.strokeStyle = `rgba(150,220,230,${0.15 + Math.sin(rphase) * 0.05})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(W * 0.5 + Math.sin(rphase * 0.5) * 20, ry, 25 + i * 8, 4, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Fireflies
      fireflies.forEach((ff, i) => {
        const t = now * ff.speed * 1000;
        const fx = (ff.x + Math.cos(t * 0.7 + ff.phase) * ff.radius) * W;
        const fy = (ff.y + Math.sin(t + ff.phase) * ff.radius * 0.5) * H;
        const glow = 0.4 + 0.6 * Math.abs(Math.sin(now * 2 + ff.phase));

        const ffGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 12);
        ffGrad.addColorStop(0, `rgba(200,255,150,${glow * 0.9})`);
        ffGrad.addColorStop(0.4, `rgba(150,255,100,${glow * 0.4})`);
        ffGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = ffGrad;
        ctx.beginPath();
        ctx.arc(fx, fy, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(220,255,180,${glow})`;
        ctx.beginPath();
        ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(drawFrame);
    }

    drawFrame();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} />;
}

// ─── Snow ──────────────────────────────────────────────────────────────────────
function SnowScene({ style }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const flakes = Array.from({ length: 180 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1 + Math.random() * 3,
      speed: 0.0004 + Math.random() * 0.0008,
      drift: (Math.random() - 0.5) * 0.0003,
      alpha: 0.4 + Math.random() * 0.6,
      wobble: Math.random() * Math.PI * 2,
    }));

    function drawFrame() {
      const W = canvas.width, H = canvas.height;
      const now = Date.now() / 1000;
      ctx.clearRect(0, 0, W, H);

      // Wintry sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#0a0c14');
      skyGrad.addColorStop(0.5, '#111827');
      skyGrad.addColorStop(1, '#1c2030');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Distant glow (city through snow)
      const glowGrad = ctx.createRadialGradient(W * 0.5, H * 0.7, 0, W * 0.5, H * 0.7, W * 0.7);
      glowGrad.addColorStop(0, 'rgba(255,200,100,0.06)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, W, H);

      // Snowflakes
      flakes.forEach(f => {
        f.y += f.speed;
        f.x += f.drift + Math.sin(now * 0.5 + f.wobble) * 0.0002;
        if (f.y > 1) { f.y = -0.02; f.x = Math.random(); }
        if (f.x > 1) f.x = 0;
        if (f.x < 0) f.x = 1;

        ctx.globalAlpha = f.alpha;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(f.x * W, f.y * H, f.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Snow ground
      const groundGrad = ctx.createLinearGradient(0, H * 0.88, 0, H);
      groundGrad.addColorStop(0, 'rgba(220,235,255,0.4)');
      groundGrad.addColorStop(0.3, 'rgba(200,220,255,0.7)');
      groundGrad.addColorStop(1, 'rgba(180,210,255,0.9)');
      ctx.fillStyle = groundGrad;
      ctx.beginPath();
      ctx.moveTo(0, H * 0.9);
      for (let x = 0; x <= W; x += 30) {
        ctx.lineTo(x, H * 0.88 + Math.sin(x * 0.02) * 8);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();

      animRef.current = requestAnimationFrame(drawFrame);
    }

    drawFrame();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} />;
}

// ─── Exports ───────────────────────────────────────────────────────────────────
export const ANIMATED_SCENES = {
  'cozy-fireplace': FireplaceScene,
  'rainy-window': RainScene,
  'calm-ocean': OceanScene,
  'forest-stream': ForestScene,
  'snowfall': SnowScene,
};

export function AnimatedScene({ sceneId, style }) {
  const Scene = ANIMATED_SCENES[sceneId];
  if (!Scene) return null;
  return <Scene style={style} />;
}
