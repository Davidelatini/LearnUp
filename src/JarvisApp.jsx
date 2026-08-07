import './dashboard.css';
import JarvisInterface from './components/JarvisInterface';
import AlmaInterface from './components/AlmaInterface';
import VyctorInterface from './components/VyctorInterface';
import AlfredInterface from './components/AlfredInterface';
import CapitalInterface from './components/CapitalInterface';

const VIEW_META = {
  chat: { label: 'MIND', color: '#c8deff' },
  alma: { label: 'ALMA', color: '#39ff14' },
  alfred: { label: 'ALFRED', color: '#5fb7ff' },
  capital: { label: 'CAPITAL', color: '#f0b429' },
  vyctor: { label: 'VYCTOR', color: '#ff5c69' },
};

function AgentView({ view }) {
  if (view === 'alma') return <AlmaInterface />;
  if (view === 'vyctor') return <VyctorInterface />;
  if (view === 'alfred') return <AlfredInterface />;
  if (view === 'capital') return <CapitalInterface />;
  return <JarvisInterface />;
}

export default function JarvisApp({ initialView = 'chat', onHome }) {
  const activeView = VIEW_META[initialView] ? initialView : 'chat';
  const activeMeta = VIEW_META[activeView];

  return (
    <main
      className="agent-app-shell"
      style={{ '--agent-shell-accent': activeMeta.color }}
      data-agent-view={activeView}
    >
      {onHome && (
        <button
          type="button"
          className="agent-back-to-mind"
          onClick={onHome}
          aria-label="Torna al centro operativo MIND"
          title="Torna al centro operativo MIND"
        >
          <span aria-hidden="true">←</span>
          <span>CORE</span>
        </button>
      )}

      <section className="agent-view" aria-label={`Interfaccia ${activeMeta.label}`}>
        <AgentView view={activeView} />
      </section>
    </main>
  );
}
