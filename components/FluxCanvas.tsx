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
  
  // Robust hex to rgb conversion
  const hexToRgb = (hex: string) => {
    if (!hex) return { r: 0, g: 0, b: 0 };
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth || 800;
    let height = window.innerHeight || 600;
    let tick = 0;

    // Helper to spawn comets dynamically
    const spawnComet = (x: number, y: number, vx: number, vy: number) => {
        particlesRef.current.push({
          x, y, vx, vy,
          size: Math.random() * 3 + 2,
          life: 200 + Math.random() * 100, // Frames of life
          type: 'COMET',
          trail: []
        });
    };

    // Initialization
    const initSimulation = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width;
      canvas.height = height;
      
      particlesRef.current = [];

      // 1. Init Foreground Particles (Normal)
      const particleCount = Math.min((width * height) / 11000, 130);
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2 + 1,
          life: 9999, // Infinite life for normal particles
          type: 'NORMAL',
          trail: []
        });
      }

      // NO initial comets. They are spawned dynamically.

      // 2. Init Background Stars
      starsRef.current = [];
      const starCount = 150; 
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 0.8 + 0.1, 
          size: Math.random() * 1.5,
          brightness: Math.random()
        });
      }

      // 3. Init Celestial Bodies
      celestialsRef.current = [];
      const centerX = width / 2;
      const centerY = height / 2;
      const safeTheme = theme || { name: 'DEFAULT', primary: '#fff', secondary: '#888', bg: '#000', accent: '#fff' };

      if (safeTheme.name === 'DEEP_SPACE') {
        celestialsRef.current.push({
          type: 'BLACK_HOLE',
          x: centerX,
          y: centerY,
          radius: 70,
          color: '#000000',
          orbitSpeed: 0,
          angle: 0,
          orbitRadius: 0
        });
        celestialsRef.current.push({
            type: 'PLANET',
            x: centerX,
            y: centerY,
            radius: 15,
            color: '#6366f1',
            orbitSpeed: 0.015,
            angle: 0,
            orbitRadius: 250
        });
      } else if (safeTheme.name === 'CRIMSON_TIDE') {
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
        celestialsRef.current.push({
          type: 'PLANET',
          x: centerX,
          y: centerY,
          radius: 80,
          color: safeTheme.primary,
          orbitSpeed: 0.005,
          angle: 0,
          orbitRadius: 100
        });
        celestialsRef.current.push({
            type: 'PLANET',
            x: centerX,
            y: centerY,
            radius: 20,
            color: safeTheme.secondary,
            orbitSpeed: 0.02,
            angle: Math.PI,
            orbitRadius: 220
        });
      }
    };

    const updateCelestialPosition = (c: CelestialBody) => {
        if (c.orbitRadius > 0) {
            c.angle += c.orbitSpeed;
            c.x = (width / 2) + Math.cos(c.angle) * c.orbitRadius;
            c.y = (height / 2) + Math.sin(c.angle) * c.orbitRadius;
        }
    };

    const drawCelestial = (c: CelestialBody, screenX: number, screenY: number) => {
        const radius = Math.max(1, c.radius);
        
        if (c.type === 'BLACK_HOLE') {
            try {
                const gradient = ctx.createRadialGradient(screenX, screenY, radius * 0.8, screenX, screenY, radius * 3.5);
                const rgb = hexToRgb(theme.secondary);
                gradient.addColorStop(0, '#000000');
                gradient.addColorStop(0.2, '#000000');
                gradient.addColorStop(0.35, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
                gradient.addColorStop(0.6, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
                gradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(screenX, screenY, radius * 3.5, 0, Math.PI * 2);
                ctx.fill();
            } catch (e) {
                ctx.fillStyle = '#111';
                ctx.beginPath();
                ctx.arc(screenX, screenY, radius * 3, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = '#000';
            ctx.shadowBlur = 30;
            ctx.shadowColor = theme.secondary;
            ctx.beginPath();
            ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            ctx.strokeStyle = `rgba(255,255,255,0.4)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(screenX, screenY, radius * 1.5, 0, Math.PI * 2);
            ctx.stroke();

        } else if (c.type === 'PLANET' || c.type === 'SUN') {
             try {
                 const innerR = Math.max(0, radius * 0.1);
                 const outerR = Math.max(0.1, radius);
                 const gradient = ctx.createRadialGradient(screenX - radius/3, screenY - radius/3, innerR, screenX, screenY, outerR);
                 
                 gradient.addColorStop(0, '#fff'); 
                 gradient.addColorStop(0.3, c.color || '#888'); 
                 gradient.addColorStop(1, '#000'); 

                 ctx.fillStyle = gradient;
             } catch(e) {
                 ctx.fillStyle = c.color || '#888';
             }
             
             ctx.shadowBlur = c.type === 'SUN' ? 80 : 30;
             ctx.shadowColor = c.color || '#fff';
             
             ctx.beginPath();
             ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
             ctx.fill();
             ctx.shadowBlur = 0;
        }
    };

    const render = () => {
      if (!ctx || !width || !height) return;

      tick++;
      ctx.fillStyle = theme.bg || '#000';
      ctx.fillRect(0, 0, width, height);

      const rgbPrimary = hexToRgb(theme.primary);
      const rgbSecondary = hexToRgb(theme.secondary);

      // Parallax
      const mx = mouseRef.current.active ? mouseRef.current.x : width / 2;
      const my = mouseRef.current.active ? mouseRef.current.y : height / 2;
      const parallaxX = (width / 2 - mx);
      const parallaxY = (height / 2 - my);

      // --- Spawner Logic: Ambient Comets ---
      // Randomly spawn comets from edges to keep scene alive
      if (Math.random() < 0.015) { // ~1 per second
          const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
          let sx = 0, sy = 0, svx = 0, svy = 0;
          const speed = Math.random() * 2 + 3; // Fast
          
          if (edge === 0) { // Top
              sx = Math.random() * width; sy = 0; 
              svx = (Math.random() - 0.5) * 2; svy = speed; 
          } else if (edge === 1) { // Right
              sx = width; sy = Math.random() * height; 
              svx = -speed; svy = (Math.random() - 0.5) * 2; 
          } else if (edge === 2) { // Bottom
              sx = Math.random() * width; sy = height; 
              svx = (Math.random() - 0.5) * 2; svy = -speed; 
          } else { // Left
              sx = 0; sy = Math.random() * height; 
              svx = speed; svy = (Math.random() - 0.5) * 2; 
          }
          
          spawnComet(sx, sy, svx, svy);
      }

      // --- 0. Update Physics & Identify Black Hole ---
      let bhScreen: { x: number, y: number, radius: number } | null = null;
      celestialsRef.current.forEach(c => {
          updateCelestialPosition(c);
          if (c.type === 'BLACK_HOLE') {
              bhScreen = {
                  x: c.x + parallaxX * 0.05,
                  y: c.y + parallaxY * 0.05,
                  radius: c.radius
              };
          }
      });

      // --- 1. Draw Background Stars with Lensing ---
      starsRef.current.forEach(star => {
          const px = star.x + (parallaxX * star.z * 0.1); 
          const py = star.y + (parallaxY * star.z * 0.1);

          let drawX = (px % width);
          if (drawX < 0) drawX += width;
          let drawY = (py % height);
          if (drawY < 0) drawY += height;

          if (bhScreen) {
              const dx = drawX - bhScreen.x;
              const dy = drawY - bhScreen.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const lensingRadius = bhScreen.radius * 6;

              if (dist < lensingRadius && dist > 1) {
                  const distortionStrength = (1 - dist / lensingRadius);
                  const pushFactor = distortionStrength * distortionStrength * bhScreen.radius * 0.8; 
                  drawX += (dx / dist) * pushFactor;
                  drawY += (dy / dist) * pushFactor;
              }
          }

          const flicker = Math.sin(tick * 0.05 + star.x) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, star.brightness * flicker)})`;
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
          ctx.fill();
      });

      // --- 2. Draw Celestial Bodies ---
      celestialsRef.current.forEach(c => {
          let cx = c.x + parallaxX * 0.05;
          let cy = c.y + parallaxY * 0.05;

          if (c.type !== 'BLACK_HOLE' && bhScreen) {
              const dx = cx - bhScreen.x;
              const dy = cy - bhScreen.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const lensingRadius = bhScreen.radius * 6;

              if (dist < lensingRadius && dist > 1) {
                   const distortionStrength = (1 - dist / lensingRadius);
                   const pushFactor = distortionStrength * distortionStrength * bhScreen.radius * 0.8;
                   cx += (dx / dist) * pushFactor;
                   cy += (dy / dist) * pushFactor;
              }
          }
          drawCelestial(c, cx, cy);
      });

      // --- 3. Draw Shockwaves ---
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += 5;
        const opacity = 1 - (sw.radius / sw.maxRadius);
        if (opacity <= 0) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, ${Math.max(0, opacity)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // --- 4. Foreground Particles Logic (Reverse Loop for deletion) ---
      const hudParallaxX = parallaxX * -0.02;
      const hudParallaxY = parallaxY * -0.02;

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        
        p.x += p.vx;
        p.y += p.vy;

        // Comet specific updates
        if (p.type === 'COMET') {
            p.life--;
            // Remove dead comets
            if (p.life <= 0) {
                particlesRef.current.splice(i, 1);
                continue;
            }

            p.trail.push({x: p.x, y: p.y});
            if (p.trail.length > 20) p.trail.shift();
            
            // Comets bounce off walls
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            
        } else {
            // Normal particle wall bounce
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        // Interaction with BH Physics
        if (bhScreen) {
             const dx = bhScreen.x - p.x; 
             const dy = bhScreen.y - p.y;
             const adjDx = dx + hudParallaxX;
             const adjDy = dy + hudParallaxY;
             const dist = Math.sqrt(adjDx*adjDx + adjDy*adjDy);
             
             if (dist < bhScreen.radius) {
                 // Reset normal particles, delete comets
                 if (p.type === 'COMET') {
                     particlesRef.current.splice(i, 1);
                     continue;
                 } else {
                     p.x = Math.random() * width;
                     p.y = Math.random() < 0.5 ? 0 : height;
                 }
             } else if (dist < 600) {
                 const pullFactor = p.type === 'COMET' ? 0.2 : 0.05; 
                 const force = 60 / dist; 
                 p.vx += (adjDx/dist) * force * pullFactor;
                 p.vy += (adjDy/dist) * force * pullFactor;
             }
        }

        // Improved Mouse Interaction
        if (mouseRef.current.active) {
            const dx = mx - p.x;
            const dy = my - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const interactRadius = 250;

            if (dist < interactRadius) {
                const force = (interactRadius - dist) / interactRadius;
                const angle = Math.atan2(dy, dx);
                
                if (p.type === 'COMET') {
                    // Comets get excited/turbulent around mouse
                    p.vx -= Math.cos(angle) * force * 1.5;
                    p.vy -= Math.sin(angle) * force * 1.5;
                } else {
                    // Normal particles gently float away
                    p.vx -= Math.cos(angle) * force * 0.5;
                    p.vy -= Math.sin(angle) * force * 0.5;
                }
            }
        }
        
        // Shockwaves
        shockwavesRef.current.forEach(sw => {
            const dx = p.x - sw.x;
            const dy = p.y - sw.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (Math.abs(dist - sw.radius) < 50) {
                const angle = Math.atan2(dy, dx);
                const push = p.type === 'COMET' ? 4 : 2;
                p.vx += Math.cos(angle) * push;
                p.vy += Math.sin(angle) * push;
            }
        });

        // Speed Limit
        const maxSpeed = p.type === 'COMET' ? 15 : 4;
        const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
        if (speed > maxSpeed) {
            p.vx = (p.vx / speed) * maxSpeed;
            p.vy = (p.vy / speed) * maxSpeed;
        }

        // Drag
        p.vx *= 0.99;
        p.vy *= 0.99;
      }

      // Draw Network (Only normal particles)
      if (renderMode !== RenderMode.PARTICLES) {
        ctx.save();
        ctx.translate(hudParallaxX, hudParallaxY); 
        
        for (let i = 0; i < particlesRef.current.length; i++) {
          const p1 = particlesRef.current[i];
          if (p1.type === 'COMET') continue; 

          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const p2 = particlesRef.current[j];
            if (p2.type === 'COMET') continue;

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            if (Math.abs(dx) > 150 || Math.abs(dy) > 150) continue;

            const distSq = dx * dx + dy * dy;
            if (distSq < 22500) {
              const opacity = 1 - Math.sqrt(distSq) / 150;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${rgbSecondary.r}, ${rgbSecondary.g}, ${rgbSecondary.b}, ${opacity * 0.4})`;
              ctx.lineWidth = 1;
              ctx.stroke();

              if (renderMode === RenderMode.MESH) {
                 for (let k = j + 1; k < particlesRef.current.length; k++) {
                     const p3 = particlesRef.current[k];
                     if (p3.type === 'COMET') continue;
                     
                     if (Math.abs(p2.x - p3.x) > 150 || Math.abs(p2.y - p3.y) > 150) continue;
                     const dx2 = p2.x - p3.x;
                     const dy2 = p2.y - p3.y;
                     if (dx2*dx2 + dy2*dy2 < 22500) {
                         const dx3 = p1.x - p3.x;
                         const dy3 = p1.y - p3.y;
                         if (dx3*dx3 + dy3*dy3 < 22500) {
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

      // Draw Particles & Trails
      ctx.save();
      ctx.translate(hudParallaxX, hudParallaxY);
      particlesRef.current.forEach((p) => {
         // Draw Comet Trail
         if (p.type === 'COMET' && p.trail.length > 1) {
            for (let i = 0; i < p.trail.length - 1; i++) {
                const opacity = (i / p.trail.length) * 0.8;
                ctx.beginPath();
                ctx.moveTo(p.trail[i].x, p.trail[i].y);
                ctx.lineTo(p.trail[i+1].x, p.trail[i+1].y);
                ctx.strokeStyle = `rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, ${opacity})`;
                ctx.lineWidth = p.size * (i / p.trail.length); // Tapering
                ctx.lineCap = 'round';
                ctx.stroke();
            }
         }

         ctx.beginPath();
         ctx.arc(p.x, p.y, p.type === 'COMET' ? p.size * 1.5 : p.size, 0, Math.PI * 2);
         ctx.fillStyle = p.type === 'COMET' 
            ? `rgba(255, 255, 255, 1)` // Bright white head for comets
            : `rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, 1)`;
         
         if (p.type === 'COMET') {
             ctx.shadowBlur = 10;
             ctx.shadowColor = `rgba(${rgbPrimary.r}, ${rgbPrimary.g}, ${rgbPrimary.b}, 0.8)`;
         }
         
         ctx.fill();
         ctx.shadowBlur = 0;
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => { initSimulation(); };
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const handleMouseLeave = () => { mouseRef.current.active = false; };
    const handleMouseDown = (e: MouseEvent) => {
        // Create Shockwave
        shockwavesRef.current.push({
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            radius: 1,
            maxRadius: 600,
            strength: 80
        });

        // Spawn Comet Burst
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5; // Radial burst with variance
            const speed = Math.random() * 4 + 4; // Fast
            spawnComet(
                e.clientX, 
                e.clientY, 
                Math.cos(angle) * speed, 
                Math.sin(angle) * speed
            );
        }
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" style={{ backgroundColor: theme.bg }} />;
};

export default FluxCanvas;