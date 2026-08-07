import { useState, useEffect, useRef } from 'react';
import './landing.css';

/* ── Mock data ───────────────────────────────────────────── */

const AGENTS = [
  { id: 'mind',    name: 'MIND',    role: 'Orchestratore',  color: '#4ddfff', icon: '◈', status: 'online',  nodeX: 170, nodeY: 40  },
  { id: 'alma',    name: 'ALMA',    role: 'Benessere',      color: '#a855f7', icon: '◉', status: 'online',  nodeX: 294, nodeY: 130 },
  { id: 'alfred',  name: 'ALFRED',  role: 'Coach & Lavoro', color: '#3b82f6', icon: '◆', status: 'online',  nodeX: 246, nodeY: 275 },
  { id: 'capital', name: 'CAPITAL', role: 'Finanza',        color: '#f0b94a', icon: '◇', status: 'standby', nodeX: 94,  nodeY: 275 },
  { id: 'vyctor',  name: 'VYCTOR',  role: 'Creatività',     color: '#35ff9a', icon: '◎', status: 'standby', nodeX: 46,  nodeY: 130 },
];

const RECENT = [
  { time: '09:42', agent: 'ALFRED',  color: '#3b82f6', text: 'Obiettivo "Learn Up" aggiornato' },
  { time: '09:31', agent: 'ALMA',    color: '#a855f7', text: 'Sessione respiro completata' },
  { time: '09:15', agent: 'CAPITAL', color: '#f0b94a', text: 'Saldo aggiornato · €12.450' },
  { time: '08:50', agent: 'VYCTOR',  color: '#35ff9a', text: 'Nuova missione attivata' },
];

const CARDS = [
  { id: 'focus',   label: 'Focus del Giorno', value: 'Valutazione offerta di lavoro', accent: '#4ddfff', icon: '⊙', stat: 75 },
  { id: 'goals',   label: 'Obiettivi Attivi',  value: '4 aperti · 2 completati',       accent: '#3b82f6', icon: '◆', stat: 60 },
  { id: 'balance', label: 'Saldo Attuale',      value: '€ 12.450',                      accent: '#f0b94a', icon: '◇', stat: 82 },
  { id: 'mood',    label: 'Umore',              value: 'Concentrato · 7/10',             accent: '#a855f7', icon: '◉', stat: 70 },
  { id: 'system',  label: 'Stato Sistema',      value: 'Tutti i sistemi online',         accent: '#35ff9a', icon: '◈', stat: 99 },
];

const CMD_PHRASES = [
  'Chiedi ad AURA…',
  'Analizza i miei obiettivi…',
  'Qual è il mio focus oggi?',
  'Mostra progressi settimanali…',
  'Come sto mentalmente?',
];

const NET_STATS  = [['Latenza', '12 ms', '#35ff9a'], ['Uptime', '99.9%', '#4ddfff'], ['Token/gg', '4.2 K', '#f0b94a']];
const PAN_STATS  = [['5', 'Agenti', '#4ddfff'], ['4', 'Task', '#3b82f6'], ['3', 'Note', '#f0b94a'], ['7', 'Sessioni', '#35ff9a']];
const PULSE_DUR  = [1.8, 2.3, 1.6, 2.1, 2.0];

/* ── Hooks ───────────────────────────────────────────────── */

function useTypingPlaceholder(phrases, speed = 72, pause = 2200) {
  const [display, setDisplay] = useState('');
  const state = useRef({ idx: 0, char: 0, del: false });

  useEffect(() => {
    let timer;
    function tick() {
      const { idx, char, del } = state.current;
      const phrase = phrases[idx];
      if (!del && char < phrase.length) {
        state.current.char++;
        setDisplay(phrase.slice(0, state.current.char));
        timer = setTimeout(tick, speed);
      } else if (!del && char === phrase.length) {
        timer = setTimeout(() => { state.current.del = true; tick(); }, pause);
      } else if (del && char > 0) {
        state.current.char--;
        setDisplay(phrase.slice(0, state.current.char));
        timer = setTimeout(tick, speed / 2);
      } else {
        state.current.del = false;
        state.current.idx = (idx + 1) % phrases.length;
        timer = setTimeout(tick, 350);
      }
    }
    timer = setTimeout(tick, 900);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return display;
}

function useCountUp(target, ms = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let v = 0;
    const step = target / (ms / 16);
    const id = setInterval(() => {
      v += step;
      if (v >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(v));
    }, 16);
    return () => clearInterval(id);
  }, [target, ms]);
  return val;
}

/* ── Background canvas (stars, particles, nebula) ───────── */

function BackgroundCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let animId, W, H, stars, particles, t = 0;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildStars();
      buildParticles();
    }

    function buildStars() {
      stars = Array.from({ length: 240 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.1 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.55 + 0.18,
      }));
    }

    function buildParticles() {
      particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.11,
        vy: (Math.random() - 0.5) * 0.11,
        r: Math.random() * 1.3 + 0.3,
        a: Math.random() * 0.22 + 0.04,
        rgb: Math.random() > 0.6 ? '77,223,255' : '59,130,246',
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      t += 0.007;

      // Nebula
      [[W * 0.18, H * 0.28, 230, '168,85,247', 0.022],
       [W * 0.82, H * 0.72, 190, '77,223,255', 0.018],
       [W * 0.55, H * 0.15, 150, '59,130,246', 0.014]].forEach(([cx, cy, r, rgb, a]) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(${rgb},${a})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });

      // Stars with twinkle
      for (const s of stars) {
        const alpha = 0.12 + 0.58 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(205,238,255,${alpha})`;
        ctx.fill();
      }

      // Slow particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.rgb},${p.a})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} className="aura-bg-canvas" aria-hidden="true" />;
}

/* ── Mini stat bar ───────────────────────────────────────── */

function MiniBar({ label, value, color }) {
  return (
    <div className="aura-minibar">
      <span className="aura-minibar-lbl">{label}</span>
      <div className="aura-minibar-track">
        <div className="aura-minibar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="aura-minibar-val">{value}%</span>
    </div>
  );
}

/* ── Live clock ──────────────────────────────────────────── */

function AuraClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="aura-clock">
      {time.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

/* ── Orbit + core reactor ────────────────────────────────── */

function OrbitArea({ onBegin }) {
  return (
    <div className="aura-orbit">

      {/* SVG layer: rings + data lines + pulses */}
      <svg className="aura-orbit-svg" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle className="aura-ring-outer" cx="170" cy="170" r="130"
          fill="none" stroke="rgba(77,223,255,0.11)" strokeWidth="1" strokeDasharray="6 12" />
        <circle cx="170" cy="170" r="76"
          fill="none" stroke="rgba(77,223,255,0.06)" strokeWidth="1" strokeDasharray="3 9" />

        {AGENTS.map((a, i) => (
          <g key={a.id}>
            <line id={`al${i}`} x1="170" y1="170" x2={a.nodeX} y2={a.nodeY}
              stroke="rgba(77,223,255,0.09)" strokeWidth="1" />
            {/* Forward data pulse */}
            <circle r="2" fill={a.color} opacity="0.8">
              <animateMotion dur={`${PULSE_DUR[i]}s`} repeatCount="indefinite" begin={`${i * 0.45}s`}>
                <mpath href={`#al${i}`} />
              </animateMotion>
            </circle>
            {/* Return data pulse (fainter) */}
            <circle r="1.3" fill={a.color} opacity="0.28">
              <animateMotion dur={`${PULSE_DUR[i] * 1.5}s`} repeatCount="indefinite"
                begin={`${i * 0.45 + 0.85}s`} keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                <mpath href={`#al${i}`} />
              </animateMotion>
            </circle>
          </g>
        ))}
      </svg>

      {/* Concentric wave rings (expand from core center) */}
      <div className="aura-wave" style={{ animationDelay: '0s' }} />
      <div className="aura-wave" style={{ animationDelay: '2s' }} />
      <div className="aura-wave" style={{ animationDelay: '4s' }} />

      {/* Core reactor */}
      <div className="aura-core" onClick={onBegin} role="button" tabIndex={0} title="Entra in AURA">
        <div className="aura-core-body">
          <div className="aura-core-inner-ring" />
          <span className="aura-core-name">AURA</span>
          <span className="aura-core-sub">CORE</span>
        </div>
      </div>

      {/* Agent nodes */}
      {AGENTS.map((a, i) => (
        <div
          key={a.id}
          className="aura-orbit-node"
          style={{ left: a.nodeX, top: a.nodeY }}
        >
          <div
            className="aura-node-ring"
            style={{
              borderColor: a.color + '55',
              animationDelay: `${i * 0.6}s`,
            }}
          >
            <span className="aura-node-icon" style={{ color: a.color }}>{a.icon}</span>
          </div>
          <span className="aura-node-label" style={{ color: a.color + '99' }}>{a.name}</span>
          <span
            className="aura-node-sdot"
            style={{
              background: a.status === 'online' ? '#35ff9a' : '#7f9dad',
              boxShadow: a.status === 'online' ? '0 0 6px #35ff9a' : 'none',
              animationName: a.status === 'online' ? 'dot-pulse' : 'none',
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ── Panoramica stat with count-up ───────────────────────── */

function PanStat({ n, label, color }) {
  const val = useCountUp(Number(n), 1000);
  return (
    <div className="aura-pan-cell">
      <span className="aura-pan-num" style={{ color }}>{val}</span>
      <span className="aura-pan-lbl">{label}</span>
    </div>
  );
}

/* ── Bottom card with animated bar ──────────────────────── */

function AuraCard({ card }) {
  const bar = useCountUp(card.stat, 1500);
  return (
    <div className="aura-card" style={{ borderColor: card.accent + '30' }}>
      <div className="aura-card-top">
        <span className="aura-card-icon" style={{ color: card.accent }}>{card.icon}</span>
        <span className="aura-card-label">{card.label}</span>
      </div>
      <div className="aura-card-value" style={{ color: card.accent + 'cc' }}>{card.value}</div>
      <div className="aura-card-bar-track">
        <div
          className="aura-card-bar-fill"
          style={{
            width: `${bar}%`,
            background: `linear-gradient(90deg, ${card.accent}44, ${card.accent}bb)`,
            boxShadow: `0 0 6px ${card.accent}44`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */

export default function LandingPage({ onBegin }) {
  const [cmd, setCmd]                 = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [cmdFocused, setCmdFocused]   = useState(false);
  const typingText = useTypingPlaceholder(CMD_PHRASES);

  return (
    <div className="aura-root">
      <BackgroundCanvas />
      <div className="aura-grid-bg" aria-hidden="true" />

      {/* ── Topbar ──────────────────────────────────────── */}
      <header className="aura-topbar">
        <div className="aura-logo">
          <span className="aura-logo-mark">◈</span>
          <span className="aura-logo-text">AURA <em>OS</em></span>
          <span className="aura-logo-ver">v2.4.1</span>
        </div>

        <div className="aura-topbar-mid">
          <span className="aura-status-dot" />
          <span className="aura-topbar-status">Sistema operativo · 5 agenti attivi · Nessun allarme</span>
        </div>

        <div className="aura-topbar-right">
          <MiniBar label="CPU" value={34} color="#4ddfff" />
          <MiniBar label="RAM" value={62} color="#a855f7" />
          <AuraClock />
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="aura-body">

        {/* Left sidebar */}
        <aside className="aura-sidebar">
          <div className="aura-sec-label">AGENTI</div>
          {AGENTS.map((a) => (
            <div
              key={a.id}
              className={`aura-sag-row${selectedAgent === a.id ? ' selected' : ''}`}
              onClick={() => setSelectedAgent(a.id === selectedAgent ? null : a.id)}
            >
              <div className="aura-sag-sel-bar" style={{ background: a.color, boxShadow: `0 0 8px ${a.color}` }} />
              <span className="aura-sag-icon" style={{ color: a.color }}>{a.icon}</span>
              <div className="aura-sag-info">
                <span className="aura-sag-name">{a.name}</span>
                <span className="aura-sag-role">{a.role}</span>
              </div>
              <span
                className="aura-sag-dot"
                style={{
                  background: a.status === 'online' ? '#35ff9a' : '#7f9dad',
                  boxShadow: a.status === 'online' ? '0 0 5px #35ff9a' : 'none',
                  animationName: a.status === 'online' ? 'dot-pulse' : 'none',
                }}
              />
            </div>
          ))}

          <div className="aura-sidebar-sep" />
          <div className="aura-sec-label">RETE</div>
          {NET_STATS.map(([k, v, c]) => (
            <div key={k} className="aura-net-row">
              <span className="aura-net-key">{k}</span>
              <span className="aura-net-val" style={{ color: c }}>{v}</span>
            </div>
          ))}
        </aside>

        {/* Center */}
        <main className="aura-center">
          <div className="aura-center-head">
            <h1 className="aura-center-title">AURA CORE</h1>
            <p className="aura-center-sub">Personal AI Operating System · Tutti i sistemi online</p>
          </div>
          <OrbitArea onBegin={onBegin} />
        </main>

        {/* Right panel */}
        <aside className="aura-right">
          <div className="aura-sec-label">PANORAMICA</div>
          <div className="aura-pan-grid">
            {PAN_STATS.map(([n, l, c]) => <PanStat key={l} n={n} label={l} color={c} />)}
          </div>

          <div className="aura-right-sep" />
          <div className="aura-sec-label">ATTIVITÀ RECENTI</div>
          {RECENT.map((r, i) => (
            <div key={i} className="aura-act-row" style={{ animationDelay: `${i * 0.14}s` }}>
              <span className="aura-act-time">{r.time}</span>
              <span className="aura-act-agent" style={{ color: r.color }}>{r.agent}</span>
              <span className="aura-act-text">{r.text}</span>
            </div>
          ))}

          <div className="aura-right-sep" />
          <div className="aura-sec-label">AURA DICE</div>
          <p className="aura-ai-msg">
            "Hai 4 obiettivi aperti e una sessione di benessere in sospeso. Inizia da ciò che pesa di più."
          </p>
        </aside>
      </div>

      {/* ── Bottom cards ────────────────────────────────── */}
      <div className="aura-cards">
        {CARDS.map((c) => <AuraCard key={c.id} card={c} />)}
      </div>

      {/* ── Command bar ─────────────────────────────────── */}
      <div className={`aura-cmdbar${cmdFocused ? ' focused' : ''}`}>
        <span className="aura-cmd-prefix">⌘</span>
        <div className="aura-cmd-field">
          <input
            className="aura-cmd-input"
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onBegin?.()}
            onFocus={() => setCmdFocused(true)}
            onBlur={() => setCmdFocused(false)}
            aria-label="Comando AURA"
          />
          {!cmd && !cmdFocused && (
            <span className="aura-cmd-placeholder" aria-hidden="true">
              {typingText}<span className="aura-cmd-cursor">|</span>
            </span>
          )}
        </div>
        <button className="aura-begin-btn" onClick={() => onBegin?.()}>
          BEGIN JOURNEY <span className="aura-btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
}
