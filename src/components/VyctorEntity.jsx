import '../vyctor-entity.css';

// 5 satellite nodes arranged in a pentagon (radius 90 from center 150,150)
const NODES = [
  { x: 150, y: 60  },  // top
  { x: 236, y: 122 },  // top-right
  { x: 203, y: 223 },  // bottom-right
  { x: 97,  y: 223 },  // bottom-left
  { x: 64,  y: 122 },  // top-left
];

// Slightly varied durations per line for an organic, non-mechanical feel
const IDLE_DURS = [1.8, 2.1, 1.6, 2.3, 1.9];
const FAST_DURS = [0.85, 1.0, 0.75, 1.1, 0.9];  // speaking: ~half speed
const DELAYS    = ['0s', '0.45s', '0.9s', '0.25s', '1.2s'];
// Alternating direction gives a bidirectional "data exchange" feel
const REVERSE   = [false, true, false, true, false];

export default function VyctorEntity({ state = 'idle' }) {
  const speaking = state === 'speaking';
  const durs = speaking ? FAST_DURS : IDLE_DURS;

  return (
    <div className={`ve-root${speaking ? ' ve-speaking' : ''}`}>
      <div className="ve-halo ve-halo-outer" />
      <div className="ve-halo ve-halo-inner" />

      {/* key={state} forces SVG remount on state change, cleanly restarting
          all animateMotion elements with the new duration values */}
      <svg
        key={state}
        className="ve-svg"
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="ve-core-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ve-node-glow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="ve-core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffcccc" />
            <stop offset="55%"  stopColor="#ff5c69" />
            <stop offset="100%" stopColor="#cc0022" />
          </radialGradient>
        </defs>

        {/* Connector lines from center to each satellite node */}
        {NODES.map((node, i) => (
          <line
            key={`l${i}`}
            x1="150" y1="150"
            x2={node.x} y2={node.y}
            stroke="#ff5c69"
            strokeWidth="0.7"
            opacity="0.30"
          />
        ))}

        {/* Traveling impulse dots — alternate direction per line */}
        {NODES.map((node, i) => (
          <circle key={`imp${i}`} r="2.5" fill="#ffaaaa" opacity="0.88">
            <animateMotion
              dur={`${durs[i]}s`}
              repeatCount="indefinite"
              begin={DELAYS[i]}
              path={
                REVERSE[i]
                  ? `M ${node.x} ${node.y} L 150 150`
                  : `M 150 150 L ${node.x} ${node.y}`
              }
            />
          </circle>
        ))}

        {/* Satellite nodes */}
        {NODES.map((node, i) => (
          <circle
            key={`n${i}`}
            cx={node.x} cy={node.y} r="5"
            fill="none"
            stroke="#ff5c69"
            strokeWidth="1.2"
            opacity="0.62"
            filter="url(#ve-node-glow)"
          />
        ))}

        {/* Expanding pulse ring — fades out as it grows */}
        <circle
          cx="150" cy="150" r="22"
          fill="none"
          stroke="#ff5c69"
          strokeWidth="0.6"
          className="ve-pulse-ring"
        />

        {/* Central core node */}
        <circle
          cx="150" cy="150" r="18"
          fill="url(#ve-core-grad)"
          filter="url(#ve-core-glow)"
          className="ve-core"
        />
      </svg>

      <span className="ve-label">VYCTOR</span>
    </div>
  );
}
