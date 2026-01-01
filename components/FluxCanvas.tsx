import React, { useEffect, useRef } from 'react';
import { Theme, Particle, RenderMode, Shockwave, Star, CelestialBody } from '../types';

interface FluxCanvasProps {
  theme: Theme;
  renderMode: RenderMode;
}

const FluxCanvas: React.FC<FluxCanvasProps> = ({ theme, renderMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  
  // Simulation State Refs
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const celestialsRef = useRef<CelestialBody[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  
  // Convert hex to rgb for canvas manipulation
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let tick = 0;

    // Initialization
    const initSimulation = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      // 1. Init Foreground Particles
      const particleCount = Math.min((width * height) / 9000, 180);
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2 + 1,
          life: Math.random() * 100
        });
      }

      // 2. Init Background Stars (Parallax Layer)
      starsRef.current = [];
      const starCount = 150;
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 0.8 + 0.1, // Depth: 0.1 (far) to 0.9 (near)
          size: Math.random() * 1.5,
          brightness: Math.random()
        });
      }

      // 3. Init Celestial Bodies based on Theme
      celestialsRef.current = [];
      const centerX = width / 2;
      const centerY = height / 2;

      if (theme.name === 'DEEP_SPACE') {
        // Spawn Black Hole
        celestialsRef.current.push({
          type: 'BLACK_HOLE',
          x: centerX,
          y: centerY,
          radius: 60,
          color: '#000000',
          orbitSpeed: 0,
          angle: 0,
          orbitRadius: 0
        });
      } else if (theme.name === 'CRIMSON_TIDE') {
         // Massive Red Sun
         celestialsRef.current.push({
            type: 'SUN',
            x: centerX,
            y: centerY,
            radius: 120,
            color: '#ef4444',
            orbitSpeed: 0.002,
            angle: 0,
            orbitRadius: 20
         });
      } else {
        // Procedural Planet
        celestialsRef.current.push({
          type: 'PLANET',
          x: centerX,
          y: centerY,
          radius: 80,
          color: theme.primary,
          orbitSpeed: 0.005,
          angle: 0,
          orbitRadius: 100
        });
        // Moon
        celestialsRef.current.push({
            type: 'PLANET',
            x: centerX,
            y: centerY,
            radius: 20,
            color: theme.secondary,
            orbitSpeed: 0.02,
            angle: Math.PI,
            orbitRadius: 220
        });
      }
    };

    const drawCelestial = (c: CelestialBody, parallaxX: number, parallaxY: number) => {
        // Update Orbital Position
        if (c.orbitRadius > 0) {
            c.angle += c.orbitSpeed;
            c.x = (width / 2) + Math.cos(c.angle) * c.orbitRadius;
            c.y = (height / 2) + Math.sin(c.angle) * c.orbitRadius;
        }

        const x = c.x + parallaxX * 0.05; // Celestials move very slightly
        const y = c.y + parallaxY * 0.05;

        if (c.type === 'BLACK_HOLE') {
            // Accretion Disk
            const gradient = ctx.createRadialGradient(x, y, c.radius * 0.8, x, y, c.radius * 3);
            const rgb = hexToRgb(theme.secondary);
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(0.3, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
            gradient.addColorStop(0.6, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, c.radius * 3, 0, Math.PI * 2);
            ctx.fill();

            // Event Horizon
            ctx.fillStyle = '#000';
            ctx.shadowBlur = 20;
            ctx.shadowColor = theme.secondary;
            ctx.beginPath();
            ctx.arc(x, y, c.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Lensing effect (draw a white ring)
            ctx.strokeStyle = 'rgba(255,255,255,0.8)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, c.radius * 1.2, 0, Math.PI * 2);
            ctx.stroke();

        } else if (c.type === 'PLANET' || c.type === 'SUN') {
             // 3D Sphere Shading
             const gradient = ctx.createRadialGradient(x - c.radius/3, y - c.radius/3, c.radius * 0.1, x, y, c.radius);
             const rgb = hexToRgb(c.color);
             
             gradient.addColorStop(0, '#fff'); // Highlight
             gradient.addColorStop(0.3, c.color); // Base
             gradient.addColorStop(1, '#000'); // Shadow

             ctx.fillStyle = gradient;
             
             // Atmosphere glow
             ctx.shadowBlur = c.type === 'SUN' ? 80 : 30;
             ctx.shadowColor = c.color;
             
             ctx.beginPath();
             ctx.arc(x, y, c.radius, 0, Math.PI * 2);
             ctx.fill();
             ctx.shadowBlur = 0;
        }
    };

    const render = () => {
      tick++;
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, width, height);

      const rgbPrimary = hexToRgb(theme.primary);
      const rgbSecondary = hexToRgb(theme.secondary);

      // Parallax Calculation
      const mx = mouseRef.current.active ? mouseRef.current.x : width / 2;
      const my = mouseRef.current.active ? mouseRef.current.y : height / 2;
      const parallaxX = (width / 2 - mx);
      const parallaxY = (height / 2 - my);

      // --- 1. Draw Background Stars (Parallax) ---
      starsRef.current.forEach(star => {
          // Stars move based on their 'z' depth. Closer stars (higher z) move more.
          // Inverted movement for background depth effect
          const px = star.x + (parallaxX * star.z * 0.1); 
          const py = star.y + (parallaxY * star.z * 0.1);

          // Wrap around screen
          let drawX = (px % width);
          if (drawX < 0) drawX += width;
          let drawY = (py % height);
          if (drawY < 0) drawY += height;

          // Twinkle
          const flicker = Math.sin(tick * 0.05 + star.x) * 0.3 + 0.7;

          ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * flicker})`;
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
          ctx.fill();
      });

      // --- 2. Draw Celestial Bodies ---
      celestialsRef.current.forEach(c => drawCelestial(c, parallaxX, parallaxY));

      // --- 3. Draw Shockwaves ---
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += 10;
        const opacity = 1 - (sw.radius / sw.maxRadius);
        if (opacity <= 0) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // --- 4. Update & Draw Particles (Foreground) ---
      // These act as a HUD/Scanner layer, so they move opposite to background to create "glass" effect
      const hudParallaxX = parallaxX * -0.02;
      const hudParallaxY = parallaxY * -0.02;

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Black Hole Gravity Override
        const blackHole = celestialsRef.current.find(c => c.type === 'BLACK_HOLE');
        if (blackHole) {
             const bx = (width/2) + Math.cos(blackHole.angle)*blackHole.orbitRadius + (parallaxX * 0.05);
             const by = (height/2) + Math.sin(blackHole.angle)*blackHole.orbitRadius + (parallaxY * 0.05);
             const dx = bx - p.x;
             const dy = by - p.y;
             const dist = Math.sqrt(dx*dx + dy*dy);
             
             // Event Horizon kill zone
             if (dist < blackHole.radius) {
                 // Respawn particle elsewhere
                 p.x = Math.random() * width;
                 p.y = Math.random() < 0.5 ? 0 : height;
             } else if (dist < 400) {
                 // Strong pull
                 const force = 50 / dist;
                 p.vx += dx/dist * force;
                 p.vy += dy/dist * force;
             }
        }

        // Mouse Interaction
        if (mouseRef.current.active) {
            const dx = mx - p.x;
            const dy = my - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                const force = (200 - dist) / 200;
                // Repulse slightly
                p.vx -= (dx/dist) * force * 0.5;
                p.vy -= (dy/dist) * force * 0.5;
            }
        }
        
        // Shockwave Interaction
        shockwavesRef.current.forEach(sw => {
            const dx = p.x - sw.x;
            const dy = p.y - sw.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (Math.abs(dist - sw.radius) < 30) {
                const angle = Math.atan2(dy, dx);
                p.vx += Math.cos(angle) * 2;
                p.vy += Math.sin(angle) * 2;
            }
        });

        p.vx *= 0.98;
        p.vy *= 0.98;
      });

      // Draw Network/Mesh
      if (renderMode !== RenderMode.PARTICLES) {
        ctx.save();
        ctx.translate(hudParallaxX, hudParallaxY); // Apply slight HUD movement
        
        for (let i = 0; i < particlesRef.current.length; i++) {
          const p1 = particlesRef.current[i];
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const p2 = particlesRef.current[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < 20000) {
              const opacity = 1 - Math.sqrt(distSq) / 141;
              
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${rgbSecondary.r}, ${rgbSecondary.g}, ${rgbSecondary.b}, ${opacity * 0.4})`;
              ctx.lineWidth = 1;
              ctx.stroke();

              if (renderMode === RenderMode.MESH) {
                 for (let k = j + 1; k < particlesRef.current.length; k++) {
                     const p3 = particlesRef.current[k];
                     const dx2 = p2.x - p3.x;
                     const dy2 = p2.y - p3.y;
                     if (dx2*dx2 + dy2*dy2 < 20000) {
                         const dx3 = p1.x - p3.x;
                         const dy3 = p1.y - p3.y;
                         if (dx3*dx3 + dy3*dy3 < 20000) {
                             ctx.beginPath();
                             ctx.moveTo(p1.x, p1.y);
                             ctx.lineTo(p2.x, p2.y);
                             ctx.lineTo(p3.x, p3.y);
                             ctx.closePath();
                             ctx.fillStyle = `rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, ${opacity * 0.08})`;
                             ctx.fill();
                         }
                     }
                 }
              }
            }
          }
        }
        ctx.restore();
      }

      // Draw Particles (Dots)
      ctx.save();
      ctx.translate(hudParallaxX, hudParallaxY);
      particlesRef.current.forEach((p) => {
         ctx.beginPath();
         ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
         ctx.fillStyle = `rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, 1)`;
         ctx.fill();
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    // Events
    const handleResize = () => initSimulation();
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const handleMouseLeave = () => { mouseRef.current.active = false; };
    const handleMouseDown = (e: MouseEvent) => {
        shockwavesRef.current.push({
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            radius: 1,
            maxRadius: 500,
            strength: 50
        });
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousedown', handleMouseDown);

    initSimulation();
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, renderMode]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />;
};

export default FluxCanvas;