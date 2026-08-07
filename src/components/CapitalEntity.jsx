import '../capital-entity.css';

const CARDINAL = [0, 90, 180, 270];
const DIAGONAL = [45, 135, 225, 315];
const ALL12 = Array.from({ length: 12 }, (_, i) => i * 30);

function rad(deg) {
  return deg * (Math.PI / 180);
}

export default function CapitalEntity({ state = 'idle' }) {
  const speaking = state === 'speaking';

  return (
    <div className={`ce-root${speaking ? ' ce-speaking' : ''}`}>

      {/* Background halos */}
      <div className="ce-halo ce-halo-outer" />
      <div className="ce-halo ce-halo-inner" />

      <svg
        viewBox="-120 -120 240 240"
        xmlns="http://www.w3.org/2000/svg"
        className="ce-svg"
        aria-hidden="true"
      >
        {/* ── Outer ring group — rotates CW ── */}
        <g className="ce-g-outer">
          <circle
            r="104"
            fill="none"
            stroke="#f0b429"
            strokeWidth="0.75"
            strokeDasharray="4 6"
            className="ce-ring-outer-line"
          />
          {ALL12.map((deg) => {
            const a = rad(deg);
            const isMajor = deg % 90 === 0;
            return (
              <line
                key={deg}
                x1={Math.cos(a) * 97}
                y1={Math.sin(a) * 97}
                x2={Math.cos(a) * (isMajor ? 88 : 93)}
                y2={Math.sin(a) * (isMajor ? 88 : 93)}
                stroke="#f0b429"
                strokeWidth={isMajor ? 1.2 : 0.7}
                className={isMajor ? 'ce-tick ce-tick-major' : 'ce-tick'}
              />
            );
          })}
        </g>

        {/* ── Mid ring group — rotates CCW ── */}
        <g className="ce-g-mid">
          <circle
            r="72"
            fill="none"
            stroke="#f0b429"
            strokeWidth="0.85"
            strokeDasharray="2 9"
            className="ce-ring-mid-line"
          />
          {CARDINAL.map((deg) => {
            const a = rad(deg);
            return (
              <circle
                key={deg}
                cx={Math.cos(a) * 72}
                cy={Math.sin(a) * 72}
                r="3"
                className="ce-orb"
              />
            );
          })}
          {DIAGONAL.map((deg) => {
            const a = rad(deg);
            return (
              <circle
                key={deg}
                cx={Math.cos(a) * 72}
                cy={Math.sin(a) * 72}
                r="1.4"
                fill="#f0b429"
                opacity="0.35"
              />
            );
          })}
        </g>

        {/* ── Static cardinal arm lines ── */}
        {CARDINAL.map((deg) => {
          const a = rad(deg);
          return (
            <line
              key={deg}
              x1={Math.cos(a) * 40}
              y1={Math.sin(a) * 40}
              x2={Math.cos(a) * 66}
              y2={Math.sin(a) * 66}
              stroke="#f0b429"
              strokeWidth="0.9"
              className="ce-arm"
            />
          );
        })}

        {/* ── Inner glowing ring ── */}
        <circle
          r="38"
          fill="none"
          stroke="#f0b429"
          strokeWidth="1.4"
          className="ce-stroke ce-ring-inner"
        />

        {/* ── Spinning diamond group ── */}
        <g className="ce-g-diamond">
          <polygon
            points="0,-24 16,0 0,24 -16,0"
            fill="none"
            stroke="#f0b429"
            strokeWidth="1.1"
            className="ce-diamond"
          />
        </g>

        {/* ── Core ring ── */}
        <circle
          r="10"
          fill="none"
          stroke="#f0b429"
          strokeWidth="1.6"
          className="ce-stroke ce-ring-core"
        />

        {/* ── Core dot ── */}
        <circle r="4" className="ce-core-dot" />

      </svg>

      {/* Label */}
      <div className="ce-label">CAPITAL</div>
    </div>
  );
}
