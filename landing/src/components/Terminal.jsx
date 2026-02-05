import { useEffect, useRef } from 'react';
import { TerminalParticles } from './TerminalParticles';

// Canvas-based graph visualization with animated particles and trails
function GraphVisualization() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    // Particle class for traveling along paths with trails
    const particles = [];
    const pulseRings = [];

    // Define bezier curve paths (from corners to center)
    const paths = [
      { start: { x: 0.12, y: 0.15 }, cp1: { x: 0.28, y: 0.15 }, cp2: { x: 0.35, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      { start: { x: 0.12, y: 0.85 }, cp1: { x: 0.28, y: 0.85 }, cp2: { x: 0.35, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      { start: { x: 0.88, y: 0.15 }, cp1: { x: 0.72, y: 0.15 }, cp2: { x: 0.65, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      { start: { x: 0.88, y: 0.85 }, cp1: { x: 0.72, y: 0.85 }, cp2: { x: 0.65, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
    ];

    // Create particle
    const createParticle = (pathIndex, delay) => ({
      pathIndex,
      progress: 0,
      speed: 0.006 + Math.random() * 0.003,
      size: 3 + Math.random() * 2,
      delay,
      active: false,
      trail: [],
      reachedCenter: false,
    });

    // Initialize particles - multiple per path with staggered delays
    paths.forEach((_, pathIndex) => {
      particles.push(createParticle(pathIndex, pathIndex * 0.6));
      particles.push(createParticle(pathIndex, pathIndex * 0.6 + 1.8));
      particles.push(createParticle(pathIndex, pathIndex * 0.6 + 3.6));
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    // Get point on bezier curve at t (0-1)
    const getBezierPoint = (path, t, width, height) => {
      const x = Math.pow(1-t, 3) * path.start.x * width +
                3 * Math.pow(1-t, 2) * t * path.cp1.x * width +
                3 * (1-t) * Math.pow(t, 2) * path.cp2.x * width +
                Math.pow(t, 3) * path.end.x * width;
      const y = Math.pow(1-t, 3) * path.start.y * height +
                3 * Math.pow(1-t, 2) * t * path.cp1.y * height +
                3 * (1-t) * Math.pow(t, 2) * path.cp2.y * height +
                Math.pow(t, 3) * path.end.y * height;
      return { x, y };
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      // Draw curved paths with gradient
      paths.forEach((path) => {
        // Draw main path
        ctx.beginPath();
        ctx.moveTo(path.start.x * width, path.start.y * height);
        ctx.bezierCurveTo(
          path.cp1.x * width, path.cp1.y * height,
          path.cp2.x * width, path.cp2.y * height,
          path.end.x * width, path.end.y * height
        );
        ctx.strokeStyle = 'rgba(61, 52, 85, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw glowing path overlay
        ctx.beginPath();
        ctx.moveTo(path.start.x * width, path.start.y * height);
        ctx.bezierCurveTo(
          path.cp1.x * width, path.cp1.y * height,
          path.cp2.x * width, path.cp2.y * height,
          path.end.x * width, path.end.y * height
        );
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.1)';
        ctx.lineWidth = 6;
        ctx.stroke();
      });

      // Update and draw particles
      particles.forEach((particle) => {
        // Handle delay
        if (particle.delay > 0) {
          particle.delay -= 0.016;
          return;
        }
        particle.active = true;

        // Update progress
        particle.progress += particle.speed;

        // Reset when reaching center
        if (particle.progress > 1) {
          particle.progress = 0;
          particle.trail = [];
          particle.reachedCenter = false;
        }

        const path = paths[particle.pathIndex];
        const point = getBezierPoint(path, particle.progress, width, height);

        // Add to trail
        particle.trail.push({ x: point.x, y: point.y, alpha: 1, size: particle.size });
        if (particle.trail.length > 15) particle.trail.shift();

        // Draw trail with fading effect
        particle.trail.forEach((t, i) => {
          const alpha = (i / particle.trail.length) * 0.7;
          const size = t.size * (0.3 + (i / particle.trail.length) * 0.7);

          ctx.beginPath();
          ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
          ctx.fill();
        });

        // Draw main particle with glow
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(point.x, point.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Trigger center pulse when particle reaches center
        if (particle.progress > 0.92 && !particle.reachedCenter) {
          particle.reachedCenter = true;
          pulseRings.push({ radius: 25, alpha: 0.5, maxRadius: 70 });
        }
      });

      // Draw center node effects
      const centerX = width * 0.5;
      const centerY = height * 0.5;

      // Draw expanding pulse rings
      pulseRings.forEach((ring) => {
        ring.radius += 2;
        ring.alpha -= 0.012;

        if (ring.alpha > 0) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34, 197, 94, ${ring.alpha})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Remove faded rings
      for (let i = pulseRings.length - 1; i >= 0; i--) {
        if (pulseRings[i].alpha <= 0) pulseRings.splice(i, 1);
      }

      // Draw center glow (pulsing)
      const glowIntensity = 0.25 + Math.sin(time * 2) * 0.1;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 65);
      gradient.addColorStop(0, `rgba(34, 197, 94, ${glowIntensity})`);
      gradient.addColorStop(0.5, `rgba(34, 197, 94, ${glowIntensity * 0.4})`);
      gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 65, 0, Math.PI * 2);
      ctx.fill();

      // Draw rotating dashed ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.4);
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.35)';
      ctx.setLineDash([10, 15]);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Draw orbiting dots
      for (let i = 0; i < 3; i++) {
        const angle = time * 1.0 + (i * Math.PI * 2 / 3);
        const orbitX = centerX + Math.cos(angle) * 48;
        const orbitY = centerY + Math.sin(angle) * 48;
        const dotAlpha = 0.9 - i * 0.25;

        // Glow behind dot
        ctx.beginPath();
        ctx.arc(orbitX, orbitY, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${dotAlpha * 0.3})`;
        ctx.fill();

        // Main dot
        ctx.beginPath();
        ctx.arc(orbitX, orbitY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${dotAlpha})`;
        ctx.fill();
      }

      // Draw node glows at corners when particles are departing
      const nodePositions = [
        { x: 0.12, y: 0.15 },
        { x: 0.12, y: 0.85 },
        { x: 0.88, y: 0.15 },
        { x: 0.88, y: 0.85 },
      ];

      nodePositions.forEach((pos, i) => {
        const nodeX = pos.x * width;
        const nodeY = pos.y * height;

        // Check if any particle just started from this node
        const isActive = particles.some(p =>
          p.pathIndex === i && p.active && p.progress < 0.12 && p.progress > 0
        );

        if (isActive) {
          const pulseSize = 35 + Math.sin(time * 10) * 8;
          const nodeGradient = ctx.createRadialGradient(nodeX, nodeY, 0, nodeX, nodeY, pulseSize);
          nodeGradient.addColorStop(0, 'rgba(34, 197, 94, 0.5)');
          nodeGradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.2)');
          nodeGradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
          ctx.fillStyle = nodeGradient;
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, pulseSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

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
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    />
  );
}

// Service icons for the graph
const GitHubIcon = () => (
  <svg className="w-6 h-6 text-muted" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const SlackIcon = () => (
  <svg className="w-6 h-6 text-muted" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.522 2.521 2.527 2.527 0 0 1-2.522-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.522 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.522 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.522-2.522v-2.522h2.522zM15.165 17.688a2.527 2.527 0 0 1-2.522-2.522 2.527 2.527 0 0 1 2.522-2.522h6.312A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.522h-6.313z"/>
  </svg>
);

const KubernetesIcon = () => (
  <svg className="w-6 h-6 text-secondary" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 0 1-2.075-2.597l2.578-.437.004.005a.44.44 0 0 1 .484.606zm-.833-2.129a.44.44 0 0 0 .173-.756l.002-.011L7.585 9.7a5.143 5.143 0 0 0-.73 3.255l2.514-.725.002-.009zm1.145-1.98a.44.44 0 0 0 .699-.337l-.01-.008.355-2.64a5.172 5.172 0 0 0-2.94 1.409l1.89 1.574.006.002zm1.63.47a.44.44 0 0 0 .712.299l.009.003 1.89-1.574a5.172 5.172 0 0 0-2.94-1.409l.355 2.64-.026.041zm1.18 1.51a.44.44 0 0 0 .173.756l.002.009 2.514.725a5.143 5.143 0 0 0-.73-3.255l-1.961 1.754.002.011zm-.196 1.872a.44.44 0 0 0 .485-.606l.004-.005 2.578.437a5.171 5.171 0 0 1-2.075 2.597l-.999-2.413.007-.01zm-2.126.648a.44.44 0 0 0-.611 0l-.006.006-1.777 1.98a5.172 5.172 0 0 0 4.17 0l-1.777-1.98-.001-.006zm9.407-5.581l-.897-.897.897-.897a.44.44 0 0 0-.622-.622l-.897.897-.897-.897a.44.44 0 0 0-.622.622l.897.897-.897.897a.44.44 0 0 0 .622.622l.897-.897.897.897a.44.44 0 0 0 .622-.622zm-1.053 2.146a6.887 6.887 0 0 1-1.247 2.512l1.025 1.708a.44.44 0 0 1-.753.452l-1.025-1.708a6.887 6.887 0 0 1-2.706 1.031v2.002a.44.44 0 0 1-.88 0v-2.002a6.887 6.887 0 0 1-2.706-1.031l-1.025 1.708a.44.44 0 0 1-.753-.452l1.025-1.708a6.887 6.887 0 0 1-1.247-2.512l-1.937.329a.44.44 0 0 1-.148-.867l1.937-.329a6.92 6.92 0 0 1 .285-2.743l-1.785-.596a.44.44 0 0 1 .28-.835l1.785.596a6.887 6.887 0 0 1 1.702-2.266l-1.158-1.544a.44.44 0 0 1 .704-.528l1.158 1.544a6.887 6.887 0 0 1 2.622-.835V2.94a.44.44 0 0 1 .88 0v1.808c.94.109 1.834.403 2.622.835l1.158-1.544a.44.44 0 0 1 .704.528l-1.158 1.544a6.887 6.887 0 0 1 1.702 2.266l1.785-.596a.44.44 0 0 1 .28.835l-1.785.596c.196.868.276 1.77.285 2.743l1.937.329a.44.44 0 0 1-.148.867l-1.937-.329z"/>
  </svg>
);

const PrometheusIcon = () => (
  <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.628-5.373-12-12-12zm0 22.46c-1.885 0-3.414-1.26-3.414-2.814h6.828c0 1.553-1.528 2.813-3.414 2.813zm5.64-3.745H6.36v-1.86h11.28v1.86zm-.04-2.788H6.397c-.052-.063-.106-.124-.156-.187-1.26-1.584-1.533-2.66-1.717-3.564-.227-1.107-.263-1.968-.263-1.968s.507 1.03 1.368 1.897c.347.35.744.717 1.19 1.058 0 0-.28-2.31.553-4.12.918-1.996 2.274-2.696 2.6-4.217.028-.13.047-.25.06-.36.164.05.324.134.476.242.53.382.88 1.034 1.076 1.563.35.945.356 2.084.356 2.084s.295-.57.445-1.453c.054-.32.095-.667.095-1.022 0-.015.283 1.456.596 2.273.32.835.697 1.636 1.103 2.303.17.28.345.54.52.773 0 0 .004-.015.011-.044.053-.207.169-.742.132-1.327-.057-.887-.286-1.63-.286-1.63s.763.97 1.137 2.31c.18.644.285 1.404.233 2.236-.04.65-.176 1.356-.51 2.063-.059.126-.11.24-.183.4z"/>
  </svg>
);

// Icon SVG strings for DOM insertion
const icons = {
  info: `<svg class="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
  alert: `<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
  check: `<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
  search: `<svg class="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>`,
  code: `<svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>`
};

// Terminal commands with timestamps and highlighting
const commands = [
  { icon: icons.info, text: 'Listening for webhooks...', color: 'text-muted', time: '09:42:01' },
  { icon: icons.alert, text: 'Sentry Alert: PaymentService Failure (500)', color: 'text-red-400', time: '09:42:03', highlight: true },
  { icon: icons.search, text: 'Analyzing Knowledge Graph Topology...', color: 'text-muted', time: '09:42:03' },
  { icon: icons.search, text: 'Trace: Sentry → Pod → Deployment → GitHub', color: 'text-muted', time: '09:42:04' },
  { icon: icons.code, text: 'Correlation Found: Commit #a1b2c3', color: 'text-blue-400', time: '09:42:05' },
  { icon: icons.code, text: 'Diff: DB_TIMEOUT changed 30s → 3s', color: 'text-amber-400', time: '09:42:05', highlight: true },
  { icon: icons.check, text: 'Root Cause: Timeout Misconfiguration', color: 'text-green-400', time: '09:42:06' },
  { icon: icons.check, text: 'Action: Revert PR #402 Initiated', color: 'text-green-400', time: '09:42:07' },
  { icon: icons.info, text: 'Slack Notification Sent ✓', color: 'text-muted', time: '09:42:08' },
];

export function Terminal() {
  const terminalRef = useRef(null);

  useEffect(() => {
    const termOutput = terminalRef.current;
    if (!termOutput) return;

    const typingSpeed = 26;
    const linePause = 650;
    const resetPause = 1200;

    let cmdIndex = 0;
    let charIndex = 0;
    let isTyping = false;
    let animationId = null;

    function smoothScrollToBottom() {
      termOutput.scrollTo({ top: termOutput.scrollHeight, behavior: 'smooth' });
    }

    function vanishAndReset() {
      const lines = Array.from(termOutput.children);
      if (!lines.length) {
        cmdIndex = 0;
        typeCommand();
        return;
      }

      lines.forEach((line, i) => {
        line.style.animation = `vanishOut 0.7s ease forwards`;
        line.style.animationDelay = `${i * 60}ms`;
      });

      const totalMs = 700 + lines.length * 60 + 150;
      animationId = setTimeout(() => {
        termOutput.innerHTML = '';
        cmdIndex = 0;
        typeCommand();
      }, totalMs);
    }

    function typeCommand() {
      if (cmdIndex >= commands.length) {
        animationId = setTimeout(vanishAndReset, resetPause);
        return;
      }

      const cmd = commands[cmdIndex];
      let currentLine = termOutput.lastElementChild;

      if (!currentLine || !isTyping) {
        currentLine = document.createElement('div');
        currentLine.className = `terminal-line flex items-center gap-3 mb-3 ${cmd.color} ${cmd.highlight ? 'bg-white/5 -mx-2 px-2 py-1 rounded' : ''}`;

        // Timestamp
        const timeSpan = document.createElement('span');
        timeSpan.className = 'text-muted text-xs font-mono flex-shrink-0';
        timeSpan.textContent = cmd.time;
        currentLine.appendChild(timeSpan);

        const iconSpan = document.createElement('span');
        iconSpan.className = 'flex-shrink-0';
        iconSpan.innerHTML = cmd.icon;
        currentLine.appendChild(iconSpan);

        const textSpan = document.createElement('span');
        textSpan.className = 'whitespace-pre-wrap';
        currentLine.appendChild(textSpan);

        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'cursor';
        currentLine.appendChild(cursorSpan);

        termOutput.appendChild(currentLine);

        requestAnimationFrame(() => {
          currentLine.classList.add('show');
        });

        isTyping = true;
        charIndex = 0;
        smoothScrollToBottom();
      }

      const textNode = currentLine.children[2];
      const cursorNode = currentLine.children[3];

      if (charIndex < cmd.text.length) {
        textNode.textContent += cmd.text.charAt(charIndex);
        charIndex++;
        animationId = setTimeout(typeCommand, typingSpeed);
      } else {
        isTyping = false;
        cmdIndex++;
        if (cursorNode) cursorNode.remove();
        smoothScrollToBottom();
        animationId = setTimeout(typeCommand, linePause);
      }
    }

    animationId = setTimeout(typeCommand, 900);

    return () => {
      if (animationId) clearTimeout(animationId);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[1000px] h-[520px] md:h-[580px] bg-canvas rounded-xl border border-border overflow-hidden shadow-lg">
      {/* Particle background */}
      <TerminalParticles />

      {/* Terminal header */}
      <div className="bg-surface px-4 py-3 flex items-center gap-2 border-b border-border">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="ml-auto font-mono text-xs text-muted flex items-center">
          <span className="w-2 h-2 bg-secondary rounded-full animate-blink mr-2" />
          lumni — live topology
        </div>
      </div>

      <div className="relative flex flex-col" style={{ height: 'calc(100% - 52px)' }}>
        {/* Graph visualization area */}
        <div className="relative h-[55%] shrink-0">
          {/* Canvas-based animated graph */}
          <GraphVisualization />

          {/* Service icons */}
          <div className="service-icon service-icon-pulse absolute top-[10%] left-[7%] w-12 h-12 bg-surface border border-border rounded-lg flex items-center justify-center animate-float z-10">
            <GitHubIcon />
          </div>

          <div className="service-icon service-icon-pulse-delayed absolute bottom-[12%] left-[7%] w-12 h-12 bg-surface border border-border rounded-lg flex items-center justify-center animate-float-delayed z-10">
            <KubernetesIcon />
          </div>

          <div className="service-icon service-icon-pulse absolute top-[10%] right-[7%] w-12 h-12 bg-surface border border-border rounded-lg flex items-center justify-center animate-float z-10" style={{ animationDelay: '1s' }}>
            <SlackIcon />
          </div>

          <div className="service-icon service-icon-pulse-delayed absolute bottom-[12%] right-[7%] w-12 h-12 bg-surface border border-border rounded-lg flex items-center justify-center animate-float-delayed z-10">
            <PrometheusIcon />
          </div>

          {/* Central Lumniverse node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-20 h-20 bg-surface rounded-full border-2 border-secondary/60 flex items-center justify-center">
              <svg className="w-10 h-10 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Terminal output area */}
        <div className="relative flex-1 min-h-0 border-t border-border">
          <div
            ref={terminalRef}
            className="p-4 h-full font-mono text-sm overflow-y-auto terminal-scroll"
          />
        </div>
      </div>
    </div>
  );
}
