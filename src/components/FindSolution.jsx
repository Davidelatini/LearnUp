import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FILTERS = ['Tutti', 'Contenuti', 'Piattaforma', 'Live', 'Sito web']

const CARDS = [
  {
    id: 1, category: 'Piattaforma',
    emoji: '🖥️',
    problem: 'Non ho una piattaforma LMS',
    problemDesc: 'I tuoi corsi non hanno una casa digitale dove essere erogati e tracciati.',
    solution: 'Installiamo e configuriamo Moodle o Docebo per te — chiavi in mano, pronto in 48 ore.',
    href: '/servizi/gestione-lms',
  },
  {
    id: 2, category: 'Contenuti',
    emoji: '🎬',
    problem: 'Ho i contenuti ma non so digitalizzarli',
    problemDesc: 'Hai materiali formativi cartacei o presentazioni che nessuno guarda mai.',
    solution: 'Li trasformiamo in corsi video interattivi con avatar AI, quiz e pacchetto SCORM.',
    href: '/servizi/corsi-elearning',
  },
  {
    id: 3, category: 'Live',
    emoji: '👥',
    problem: 'Devo formare team distribuiti in tutta Italia',
    problemDesc: 'I tuoi dipendenti sono in sedi diverse e organizzare aule fisiche è impossibile.',
    solution: 'Webinar e lezioni online gestiti da noi — setup tecnico, coordinamento e registrazioni incluse.',
    href: '/servizi/webinar',
  },
  {
    id: 4, category: 'Piattaforma',
    emoji: '⚙️',
    problem: 'Ho Moodle ma nessuno sa gestirlo',
    problemDesc: 'La piattaforma c\'è ma è abbandonata, mal configurata o sempre rotta.',
    solution: 'Prendiamo in mano la tua piattaforma esistente e la gestiamo al 100% — aggiornamenti, utenti, corsi.',
    href: '/servizi/gestione-lms',
  },
  {
    id: 5, category: 'Contenuti',
    emoji: '📋',
    problem: 'Devo formare velocemente su normative obbligatorie',
    problemDesc: 'Scadenze sulla sicurezza, GDPR, antincendio — e non hai tempo per organizzare corsi in aula.',
    solution: 'Corsi compliance pronti in 5–10 giorni, con attestato automatico e tracciamento su LMS.',
    href: '/servizi/corsi-elearning',
  },
  {
    id: 6, category: 'Sito web',
    emoji: '🌐',
    problem: 'Non ho un sito formativo professionale',
    problemDesc: 'Vendi corsi o eroghi formazione ma non hai una presenza online credibile.',
    solution: 'Progettiamo e sviluppiamo il tuo sito formativo, integrato con LMS e ottimizzato per convertire.',
    href: '/servizi/siti-formativi',
  },
]

export default function FindSolution() {
  const [activeFilter, setActiveFilter] = useState('Tutti')
  const navigate = useNavigate()

  const visible = CARDS.filter(
    c => activeFilter === 'Tutti' || c.category === activeFilter
  )

  return (
    <section style={{ background: '#FFFFFF', padding: 'clamp(64px,8vw,80px) clamp(20px,5.5vw,80px)' }}>
      <style>{`
        .fs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .fs-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .fs-grid { grid-template-columns: 1fr; }
        }
        .fs-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            color: '#0EA5E9', fontSize: 13, fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16,
          }}>
            <span style={{ width: 32, height: 1.5, background: '#0EA5E9', display: 'inline-block' }} />
            La tua soluzione
            <span style={{ width: 32, height: 1.5, background: '#0EA5E9', display: 'inline-block' }} />
          </div>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 3.25rem)',
            fontWeight: 800, lineHeight: 1.15, color: '#1e3a5f', marginBottom: 16,
          }}>
            Quale sfida stai affrontando?
          </h2>
          <p style={{ color: '#64748b', fontSize: 18, maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
            Non esiste un pacchetto unico per tutti. Ogni azienda ha esigenze diverse — le affronto una per una, personalmente.
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="fs-filters" style={{ marginBottom: 40 }}>
          {FILTERS.map(f => (
            <FilterChip
              key={f}
              label={f}
              active={activeFilter === f}
              onClick={() => setActiveFilter(f)}
            />
          ))}
        </div>

        {/* ── Cards ── */}
        <div className="fs-grid" style={{ marginBottom: 40 }}>
          {CARDS.map(card => (
            <SolutionCard
              key={card.id}
              card={card}
              visible={visible.some(v => v.id === card.id)}
              onLinkClick={() => navigate(card.href)}
            />
          ))}
        </div>

        {/* ── Bottom banner ── */}
        <BottomBanner />

      </div>
    </section>
  )
}

/* ── Filter chip ── */
function FilterChip({ label, active, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '9px 22px',
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 200ms',
        border: active
          ? '1.5px solid #2563EB'
          : hovered
            ? '1.5px solid #2563EB'
            : '1.5px solid #e2e8f0',
        background: active ? '#2563EB' : '#F8FAFC',
        color: active ? '#ffffff' : hovered ? '#2563EB' : '#64748b',
        boxShadow: active ? '0 4px 14px rgba(37,99,235,0.22)' : 'none',
      }}
    >
      {label}
    </button>
  )
}

/* ── Solution card — flex row layout ── */
function SolutionCard({ card, visible, onLinkClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#F8FAFC' : '#FFFFFF',
        border: '1px solid #e2e8f0',
        borderLeft: hovered ? '4px solid #2563EB' : '4px solid transparent',
        borderRadius: 14,
        padding: 24,
        cursor: 'default',
        transition: 'all 250ms ease',
        boxShadow: hovered
          ? '0 8px 32px rgba(37,99,235,0.10)'
          : '0 2px 10px rgba(15,23,42,0.05)',
        opacity: visible ? 1 : 0.2,
        transform: visible ? 'scale(1)' : 'scale(0.97)',
        pointerEvents: visible ? 'auto' : 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
        minHeight: 140,
      }}
    >
      {/* Left: emoji box */}
      <div style={{
        width: 60, height: 60, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 30,
        background: '#F8FAFC',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
      }}>
        {card.emoji}
      </div>

      {/* Right: text content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          color: '#1e3a5f', fontSize: 15, fontWeight: 700,
          lineHeight: 1.35, marginBottom: 6,
        }}>
          {card.problem}
        </h3>

        <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7, marginBottom: 0 }}>
          {card.problemDesc}
        </p>

        {/* Solution reveal */}
        <div style={{
          maxHeight: hovered ? 160 : 0,
          opacity: hovered ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 320ms ease, opacity 280ms ease',
        }}>
          <div style={{ height: 1, background: '#e2e8f0', margin: '14px 0 12px' }} />
          <div style={{
            color: '#0EA5E9', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7,
          }}>
            La nostra soluzione:
          </div>
          <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
            {card.solution}
          </p>
          <button
            onClick={onLinkClick}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: '#2563EB', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
            }}
          >
            Scopri come
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Bottom banner ── */
function BottomBanner() {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{
      background: '#F8FAFC',
      border: '1px solid #e2e8f0',
      borderRadius: 16,
      padding: '40px 32px',
      textAlign: 'center',
    }}>
      <h3 style={{
        color: '#1e3a5f', fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
        fontWeight: 700, marginBottom: 12, lineHeight: 1.25,
      }}>
        Non trovi la tua situazione?
      </h3>
      <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.7, marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
        Raccontami la tua esigenza — troveremo insieme la soluzione giusta.
      </p>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#2563EB',
          color: '#ffffff',
          border: 'none',
          borderRadius: 10,
          padding: '14px 32px',
          fontSize: 15, fontWeight: 700,
          cursor: 'pointer',
          transition: 'background 200ms, box-shadow 200ms, transform 200ms',
          boxShadow: hovered ? '0 8px 24px rgba(37,99,235,0.30)' : '0 4px 14px rgba(37,99,235,0.18)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        Scrivimi direttamente →
      </button>
    </div>
  )
}
