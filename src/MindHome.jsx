import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import './mind-home.css';

const AGENTS = [
  { id: 'alma', name: 'ALMA', role: 'BENESSERE', color: '#54f5a3', symbol: 'circle', x: 21, y: 28 },
  { id: 'alfred', name: 'ALFRED', role: 'OBIETTIVI', color: '#69bfff', symbol: 'diamond', x: 78, y: 24 },
  { id: 'capital', name: 'CAPITAL', role: 'FINANZA', color: '#f1bd57', symbol: 'hexagon', x: 82, y: 73 },
  { id: 'vyctor', name: 'VYCTOR', role: 'STRATEGIA', color: '#ff667d', symbol: 'triangle', x: 18, y: 76 },
];

const CORE = { id: 'chat', name: 'MIND', role: 'ORCHESTRATORE', color: '#66ddff' };

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return <time className="mind-clock">{time.toLocaleTimeString('it-IT')}</time>;
}

function ParticleField({ reducedMotion }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    let frameId;
    let width = 0;
    let height = 0;
    let pointerX = 0;
    let pointerY = 0;
    let particles = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 700 ? 32 : 68;
      particles = Array.from({ length: count }, (_, index) => ({
        x: (index * 149.7) % width,
        y: (index * 83.3) % height,
        radius: index % 7 === 0 ? 1.25 : 0.7,
        speed: 0.03 + (index % 5) * 0.012,
        depth: 0.25 + (index % 6) * 0.12,
      }));
    };

    const onPointerMove = (event) => {
      pointerX = event.clientX / width - 0.5;
      pointerY = event.clientY / height - 0.5;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        if (!reducedMotion) {
          particle.y -= particle.speed;
          if (particle.y < -4) particle.y = height + 4;
        }
        const offsetX = reducedMotion ? 0 : pointerX * 18 * particle.depth;
        const offsetY = reducedMotion ? 0 : pointerY * 10 * particle.depth;
        context.beginPath();
        context.arc(particle.x + offsetX, particle.y + offsetY, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(122, 220, 255, ${0.12 + particle.depth * 0.2})`;
        context.fill();
      });
      if (!reducedMotion) frameId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="mind-particle-field" aria-hidden="true" />;
}

function NodeSymbol({ type }) {
  return (
    <svg className="mind-node-symbol" viewBox="0 0 64 64" aria-hidden="true">
      {type === 'circle' && <circle cx="32" cy="32" r="13" />}
      {type === 'diamond' && <path d="M32 15 49 32 32 49 15 32Z" />}
      {type === 'hexagon' && <path d="m32 13 17 10v18L32 51 15 41V23Z" />}
      {type === 'triangle' && <path d="m32 14 19 35H13Z" />}
    </svg>
  );
}

function AgentNode({ agent, index, activeId, selectedId, onHover, onSelect, reducedMotion }) {
  const isActive = activeId === agent.id;
  const isSelected = selectedId === agent.id;
  const isDimmed = Boolean(activeId && !isActive) || Boolean(selectedId && !isSelected);

  return (
    <Motion.button
      className={`mind-agent-node${isActive ? ' is-active' : ''}${isSelected ? ' is-selected' : ''}${isDimmed ? ' is-dimmed' : ''}`}
      data-agent={agent.id}
      style={{ '--agent-color': agent.color, '--node-x': `${agent.x}%`, '--node-y': `${agent.y}%`, '--delay': `${index * 0.13}s` }}
      initial={{ opacity: 0, scale: 0.55, x: '-50%', y: '-50%' }}
      animate={{ opacity: isDimmed ? 0.24 : 1, scale: isSelected ? 1.18 : 1, x: '-50%', y: '-50%' }}
      transition={{ delay: reducedMotion ? 0 : 0.7 + index * 0.13, duration: reducedMotion ? 0.15 : 0.55, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => onHover(agent.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(agent.id)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(agent.id)}
      aria-label={`Apri ${agent.name}, ${agent.role.toLowerCase()}`}
    >
      <span className="mind-node-orbit mind-node-orbit-outer" />
      <span className="mind-node-orbit mind-node-orbit-inner" />
      <span className="mind-node-body">
        <NodeSymbol type={agent.symbol} />
        <span className="mind-node-light" />
      </span>
      <span className="mind-node-copy">
        <strong>{agent.name}</strong>
        <span>{agent.role}</span>
      </span>
    </Motion.button>
  );
}

function EnergyNetwork({ activeId, selectedId }) {
  return (
    <svg className="mind-energy-network" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="mind-line-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g className="mind-orbital-guides">
        <ellipse cx="500" cy="350" rx="318" ry="245" />
        <ellipse cx="500" cy="350" rx="410" ry="298" />
        <circle cx="500" cy="350" r="174" />
      </g>
      {AGENTS.map((agent) => {
        const x = agent.x * 10;
        const y = agent.y * 7;
        const active = activeId === agent.id || selectedId === agent.id;
        return (
          <g key={agent.id} className={`mind-energy-path${active ? ' is-active' : ''}`} style={{ '--agent-color': agent.color }}>
            <path id={`energy-${agent.id}`} d={`M 500 350 Q ${(500 + x) / 2 + (y - 350) * 0.08} ${(350 + y) / 2 - (x - 500) * 0.08} ${x} ${y}`} />
            <circle r="3.2"><animateMotion dur="2.8s" begin={`${AGENTS.indexOf(agent) * -0.65}s`} repeatCount="indefinite"><mpath href={`#energy-${agent.id}`} /></animateMotion></circle>
          </g>
        );
      })}
    </svg>
  );
}

function MindCore({ activeId, selectedId, onHover, onSelect, reducedMotion }) {
  const isActive = activeId === CORE.id;
  const isSelected = selectedId === CORE.id;
  const isDimmed = Boolean((activeId && !isActive) || (selectedId && !isSelected));

  return (
    <Motion.button
      className={`mind-core${isActive ? ' is-active' : ''}${isSelected ? ' is-selected' : ''}${isDimmed ? ' is-dimmed' : ''}`}
      initial={{ opacity: 0, scale: 0.35, x: '-50%', y: '-50%' }}
      animate={{ opacity: isDimmed ? 0.35 : 1, scale: isSelected ? 1.1 : 1, x: '-50%', y: '-50%' }}
      transition={{ delay: reducedMotion ? 0 : 0.25, duration: reducedMotion ? 0.15 : 0.85, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => onHover(CORE.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(CORE.id)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(CORE.id)}
      aria-label="Apri MIND, orchestratore centrale"
    >
      <span className="mind-core-wave mind-core-wave-one" />
      <span className="mind-core-wave mind-core-wave-two" />
      <span className="mind-core-ring mind-core-ring-a" />
      <span className="mind-core-ring mind-core-ring-b" />
      <span className="mind-core-ring mind-core-ring-c" />
      <span className="mind-core-ticks" />
      <span className="mind-core-disc">
        <span className="mind-core-scan" />
        <strong>MIND</strong>
        <span>CENTRO OPERATIVO</span>
      </span>
      <span className="mind-core-role">ORCHESTRATORE</span>
    </Motion.button>
  );
}

export default function MindHome({ onNavigate }) {
  const reducedMotion = useReducedMotion();
  const navigateTimer = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => () => window.clearTimeout(navigateTimer.current), []);

  const selectAgent = (id) => {
    if (selectedId) return;
    setActiveId(id);
    setSelectedId(id);
    navigateTimer.current = window.setTimeout(() => onNavigate(id), reducedMotion ? 120 : 560);
  };

  return (
    <Motion.div className={`mind-home${selectedId ? ' is-transitioning' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0.1 : 0.6 }}>
      <ParticleField reducedMotion={reducedMotion} />
      <div className="mind-space-glow" aria-hidden="true" />
      <div className="mind-tech-grid" aria-hidden="true" />
      <div className="mind-scanlines" aria-hidden="true" />

      <header className="mind-system-bar">
        <div className="mind-brand"><span className="mind-brand-mark">⌁</span><strong>ILMIND</strong></div>
        <div className="mind-system-state"><span />CENTRO OPERATIVO ONLINE</div>
        <Clock />
      </header>

      <main className="mind-stage" aria-label="Selezione agenti MIND">
        <Motion.div className="mind-stage-frame" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reducedMotion ? 0 : 0.2, duration: reducedMotion ? 0.15 : 1 }}>
          <EnergyNetwork activeId={activeId} selectedId={selectedId} />
          <MindCore activeId={activeId} selectedId={selectedId} onHover={setActiveId} onSelect={selectAgent} reducedMotion={reducedMotion} />
          {AGENTS.map((agent, index) => (
            <AgentNode key={agent.id} agent={agent} index={index} activeId={activeId} selectedId={selectedId} onHover={setActiveId} onSelect={selectAgent} reducedMotion={reducedMotion} />
          ))}
          <span className="mind-coordinate mind-coordinate-nw">SYS // 00.41</span>
          <span className="mind-coordinate mind-coordinate-se">NET // 04 ONLINE</span>
        </Motion.div>
      </main>

      <AnimatePresence>
        {!selectedId && (
          <Motion.p className={`mind-instruction${activeId ? ' is-muted' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: reducedMotion ? 0 : 1.4 }}>
            <span /> SELEZIONA UN AGENTE PER ACCEDERE AL SISTEMA <span />
          </Motion.p>
        )}
      </AnimatePresence>
      <div className="mind-vignette" aria-hidden="true" />
      <div className="mind-selection-flash" aria-hidden="true" />
    </Motion.div>
  );
}
