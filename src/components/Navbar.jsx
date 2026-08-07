const NAV_ITEMS = [
  { id: 'chat',    label: 'MIND',    icon: '◈', role: 'Core',       color: '#00d4ff' },
  { id: 'alma',    label: 'ALMA',    icon: '◉', role: 'Benessere',  color: '#c084fc' },
  { id: 'alfred',  label: 'ALFRED',  icon: '◆', role: 'Coach',      color: '#5fb7ff' },
  { id: 'capital', label: 'CAPITAL', icon: '◇', role: 'Finanza',    color: '#f0b429' },
  { id: 'vyctor',  label: 'VYCTOR',  icon: '◎', role: 'Creatività', color: '#ff4455' },
];

export default function Navbar({ view, setView }) {
  const active = NAV_ITEMS.find((i) => i.id === view) ?? NAV_ITEMS[0];

  return (
    <nav className="dash-navbar">

      {/* Logo / brand mark — cambia colore con il bot attivo */}
      <div className="dash-navbar-brand">
        <span className="dash-navbar-mark" style={{ color: active.color, filter: `drop-shadow(0 0 7px ${active.color})` }}>
          ◈
        </span>
        <span className="dash-navbar-wordmark">MIND</span>
      </div>

      {/* Agent buttons */}
      <div className="dash-navbar-items">
        {NAV_ITEMS.map((item) => {
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              className={`dash-nav-btn${isActive ? ' dash-nav-active' : ''}`}
              onClick={() => setView(item.id)}
              aria-label={item.label}
              title={item.role}
              style={{
                '--bot-color':      item.color,
                '--bot-hover-bg':  `${item.color}0d`,
                '--bot-active-bg': `${item.color}14`,
              }}
            >
              {/* Active glow indicator (right edge) */}
              {isActive && (
                <span
                  className="dash-nav-bar"
                  style={{ background: item.color, boxShadow: `0 0 10px ${item.color}, 0 0 20px ${item.color}55` }}
                />
              )}

              <span
                className="dash-nav-icon"
                style={{ color: isActive ? item.color : undefined }}
              >
                {item.icon}
              </span>

              <span className="dash-nav-label">{item.label}</span>
              <span className="dash-nav-role">{item.role}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="dash-navbar-footer">
        <span className="dash-navbar-ver">v2.4</span>
      </div>

    </nav>
  );
}
