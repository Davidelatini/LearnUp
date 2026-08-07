import '../entity-sphere.css';

const CARDINAL = [0, 90, 180, 270];
const DIAGONAL = [45, 135, 225, 315];
const ALL12 = Array.from({ length: 12 }, (_, index) => index * 30);

function rad(deg) {
  return deg * (Math.PI / 180);
}

export default function EntitySphere({
  label = 'ALMA',
  accent = '#39ff14',
  state = 'idle',
  tempo = 'soft',
  breathingPhase = '',
}) {
  const classes = [
    'es-root',
    state === 'speaking' ? 'es-speaking' : '',
    state === 'breathing' ? 'es-breathing' : '',
    breathingPhase ? `es-phase-${breathingPhase}` : '',
    tempo === 'soft' ? 'es-soft' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={{ '--es-accent': accent }}>
      <div className="es-halo es-halo-outer" />
      <div className="es-halo es-halo-inner" />

      <svg
        viewBox="-120 -120 240 240"
        xmlns="http://www.w3.org/2000/svg"
        className="es-svg"
        aria-hidden="true"
      >
        <g className="es-g-outer">
          <circle r="104" fill="none" stroke={accent} strokeWidth="0.75" strokeDasharray="4 6" className="es-ring-outer-line" />
          {ALL12.map((deg) => {
            const angle = rad(deg);
            const isMajor = deg % 90 === 0;
            return (
              <line
                key={deg}
                x1={Math.cos(angle) * 97}
                y1={Math.sin(angle) * 97}
                x2={Math.cos(angle) * (isMajor ? 88 : 93)}
                y2={Math.sin(angle) * (isMajor ? 88 : 93)}
                stroke={accent}
                strokeWidth={isMajor ? 1.2 : 0.7}
                className={isMajor ? 'es-tick es-tick-major' : 'es-tick'}
              />
            );
          })}
        </g>

        <g className="es-g-mid">
          <circle r="72" fill="none" stroke={accent} strokeWidth="0.85" strokeDasharray="2 9" className="es-ring-mid-line" />
          {CARDINAL.map((deg) => {
            const angle = rad(deg);
            return <circle key={deg} cx={Math.cos(angle) * 72} cy={Math.sin(angle) * 72} r="3" className="es-orb" />;
          })}
          {DIAGONAL.map((deg) => {
            const angle = rad(deg);
            return <circle key={deg} cx={Math.cos(angle) * 72} cy={Math.sin(angle) * 72} r="1.4" fill={accent} opacity="0.35" />;
          })}
        </g>

        {CARDINAL.map((deg) => {
          const angle = rad(deg);
          return (
            <line
              key={deg}
              x1={Math.cos(angle) * 40}
              y1={Math.sin(angle) * 40}
              x2={Math.cos(angle) * 66}
              y2={Math.sin(angle) * 66}
              stroke={accent}
              strokeWidth="0.9"
              className="es-arm"
            />
          );
        })}

        <g className="es-breath-core">
          <circle r="42" className="es-core-fill" />
          <circle r="38" fill="none" stroke={accent} strokeWidth="1.4" className="es-stroke es-ring-inner" />
          <g className="es-g-diamond">
            <polygon points="0,-24 16,0 0,24 -16,0" fill="none" stroke={accent} strokeWidth="1.1" className="es-diamond" />
          </g>
          <circle r="10" fill="none" stroke={accent} strokeWidth="1.6" className="es-stroke es-ring-core" />
          <circle r="4" className="es-core-dot" />
        </g>
      </svg>

      <div className="es-label">{label}</div>
    </div>
  );
}
