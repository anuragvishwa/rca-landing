import { useEffect, useRef } from 'react';

export function GlobalParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    // Responsive particle count
    const getParticleCount = () => {
      if (typeof window === 'undefined') return 60;
      return window.innerWidth < 768 ? 40 : 80;
    };

    // Resize handler
    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Reinitialize particles on resize
      initParticles(window.innerWidth, window.innerHeight);
    };

    // Initialize particles
    const initParticles = (width, height) => {
      const count = getParticleCount();
      particles = Array(count).fill(null).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 1.5 + Math.random() * 2.5,
        isAccent: Math.random() > 0.8, // 20% green accent particles
      }));
    };

    // Animation loop
    function animate() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      // Draw connections first (behind particles)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const opacity = 0.2 * (1 - dist / 180);
            // Use green for accent connections, purple for others
            if (particles[i].isAccent || particles[j].isAccent) {
              ctx.strokeStyle = `rgba(34, 197, 94, ${opacity * 0.5})`;
            } else {
              ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.4})`;
            }
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Keep within bounds
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isAccent) {
          // Green accent particles
          ctx.fillStyle = 'rgba(34, 197, 94, 0.5)';
        } else {
          // Purple base particles
          ctx.fillStyle = 'rgba(139, 92, 246, 0.35)';
        }
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
