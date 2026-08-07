import '../alma-entity.css';

// Sine-wave path helpers — 1 full period from x=20 to x=280
const wave    = (y, a) =>
  `M 20,${y} C 65,${y - a} 110,${y - a} 150,${y} C 200,${y + a} 245,${y + a} 280,${y}`;
const waveAlt = (y, a) =>
  `M 20,${y} C 65,${y + a} 110,${y + a} 150,${y} C 200,${y - a} 245,${y - a} 280,${y}`;

// 3 wave bands: slightly different y-centers, amplitudes, durations and phase
// offsets so they never look perfectly synchronized
const WAVES = [
  { y: 128, a: 18, dur: '6s',   begin: '0s',  sw: '1.2', op: '0.35' },
  { y: 150, a: 22, dur: '7s',   begin: '-2s', sw: '1.6', op: '0.55' },
  { y: 172, a: 18, dur: '5.5s', begin: '-1s', sw: '1.2', op: '0.35' },
];

export default function AlmaEntity({ state = 'idle', breathingPhase = '' }) {
  const speaking  = state === 'speaking';
  const breathing = state === 'breathing';

  const rootClass = [
    'ame-root',
    speaking  && 'ame-speaking',
    breathing && 'ame-breathing',
    breathing && breathingPhase && `ame-phase-${breathingPhase}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      <div className="ame-halo ame-halo-outer" />
      <div className="ame-halo ame-halo-inner" />

      <svg className="ame-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ame-core-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="ame-core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ccffcc" />
            <stop offset="50%"  stopColor="#39ff14" />
            <stop offset="100%" stopColor="#1a7a00" />
          </radialGradient>
        </defs>

        {/* Undulating wave paths — morph between two phase states via SMIL */}
        <g className="ame-waves">
          {WAVES.map((wv, i) => (
            <path key={i} fill="none" stroke="#39ff14" strokeWidth={wv.sw} opacity={wv.op}>
              <animate
                attributeName="d"
                values={`${wave(wv.y, wv.a)};${waveAlt(wv.y, wv.a)};${wave(wv.y, wv.a)}`}
                dur={wv.dur}
                begin={wv.begin}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
                keyTimes="0;0.5;1"
              />
            </path>
          ))}
        </g>

        {/* Central nucleus — idle: slow breathe; breathing mode: follows phase */}
        <circle
          cx="150" cy="150" r="18"
          fill="url(#ame-core-grad)"
          filter="url(#ame-core-glow)"
          className="ame-nucleus"
        />
      </svg>

      <span className="ame-label">ALMA</span>
    </div>
  );
}
