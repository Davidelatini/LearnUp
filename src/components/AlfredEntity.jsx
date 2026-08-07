import '../alfred-entity.css';

const CARDINAL = [0, 90, 180, 270];
const DIAGONAL = [45, 135, 225, 315];
const ALL12 = Array.from({ length: 12 }, (_, i) => i * 30);

function rad(deg) {
  return deg * (Math.PI / 180);
}

export default function AlfredEntity({ state = 'idle' }) {
  const speaking = state === 'speaking';

  return (
    <div className={`ae-root${speaking ? ' ae-speaking' : ''}`}>

      {/* Background halos */}
      <div className="ae-halo ae-halo-outer" />
      <div className="ae-halo ae-halo-inner" />

      <svg
        viewBox="-120 -120 240 240"
        xmlns="http://www.w3.org/2000/svg"
        className="ae-svg"
        aria-hidden="true"
      >
        {/* ── Outer ring group — rotates CW ── */}
        <g className="ae-g-outer">

          {/* Dashed outer ring */}
          <circle
            r="104"
            fill="none"
            stroke="#5fb7ff"
            strokeWidth="0.75"
            strokeDasharray="4 6"
            className="ae-ring-outer-line"
          />

          {/* 12 tick marks — major at cardinal, minor at diagonal */}
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
                stroke="#5fb7ff"
                strokeWidth={isMajor ? 1.2 : 0.7}
                className={isMajor ? 'ae-tick ae-tick-major' : 'ae-tick'}
              />
            );
          })}
        </g>

        {/* ── Mid ring group — rotates CCW ── */}
        <g className="ae-g-mid">

          {/* Dashed mid ring */}
          <circle
            r="72"
            fill="none"
            stroke="#5fb7ff"
            strokeWidth="0.85"
            strokeDasharray="2 9"
            className="ae-ring-mid-line"
          />

          {/* 4 orbital accent dots */}
          {CARDINAL.map((deg) => {
            const a = rad(deg);
            return (
              <circle
                key={deg}
                cx={Math.cos(a) * 72}
                cy={Math.sin(a) * 72}
                r="3"
                className="ae-orb"
              />
            );
          })}

          {/* 4 small corner notches */}
          {DIAGONAL.map((deg) => {
            const a = rad(deg);
            return (
              <circle
                key={deg}
                cx={Math.cos(a) * 72}
                cy={Math.sin(a) * 72}
                r="1.4"
                fill="#5fb7ff"
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
              stroke="#5fb7ff"
              strokeWidth="0.9"
              className="ae-arm"
            />
          );
        })}

        {/* ── Inner glowing ring ── */}
        <circle
          r="38"
          fill="none"
          stroke="#5fb7ff"
          strokeWidth="1.4"
          className="ae-stroke ae-ring-inner"
        />

        {/* ── Spinning diamond group ── */}
        <g className="ae-g-diamond">
          <polygon
            points="0,-24 16,0 0,24 -16,0"
            fill="none"
            stroke="#5fb7ff"
            strokeWidth="1.1"
            className="ae-diamond"
          />
        </g>

        {/* ── Core ring ── */}
        <circle
          r="10"
          fill="none"
          stroke="#5fb7ff"
          strokeWidth="1.6"
          className="ae-stroke ae-ring-core"
        />

        {/* ── Core dot ── */}
        <circle r="4" className="ae-core-dot" />

      </svg>

      {/* Label */}
      <div className="ae-label">ALFRED</div>
    </div>
  );
}
