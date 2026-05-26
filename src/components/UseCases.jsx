import { useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

/* ── Decorative top visuals ── */

function VisualCorsi() {
  return (
    <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 28, left: 24, right: 24,
        background: '#fff', borderRadius: 12, padding: '14px 16px',
        fontSize: '0.8rem', color: '#475569', lineHeight: 1.6,
        boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
      }}>
        Crea un corso su{' '}
        <span style={{
          background: 'linear-gradient(90deg, #FFB347, #B567C2)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontWeight: 700,
        }}>
          sicurezza sul lavoro
        </span>
        {' '}con avatar AI e quiz finali
      </div>
      <div style={{
        position: 'absolute', top: 148, left: 36,
        background: '#fff', border: '1px solid #e2e8f0',
        borderRadius: 20, padding: '5px 14px',
        fontSize: '0.75rem', fontWeight: 600, color: '#1e293b',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ color: '#a855f7' }}>✦</span> SCORM ready
      </div>
      <svg
        style={{ position: 'absolute', top: 172, left: 130, width: 20, height: 20, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
        viewBox="0 0 24 24" fill="#0f172a"
      >
        <path d="M4 2L20 11L11 13L9 22L4 2Z" stroke="white" strokeWidth="1" />
      </svg>
    </div>
  )
}

function VisualLMS() {
  return (
    <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 24, left: 24, right: 24,
        background: '#fff', borderRadius: 12, padding: '14px 16px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Dashboard LMS
        </div>
        {[
          { label: 'Utenti attivi', pct: 78, color: '#B567C2' },
          { label: 'Corsi completati', pct: 65, color: '#F28482' },
          { label: 'Ore di formazione', pct: 91, color: '#60A5FA' },
        ].map(({ label, pct, color }) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', marginBottom: 4 }}>
              <span>{label}</span>
              <span style={{ fontWeight: 600, color: '#334155' }}>{pct}%</span>
            </div>
            <div style={{ height: 5, background: '#f1f5f9', borderRadius: 10 }}>
              <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 10 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VisualWebinar() {
  const attendees = [
    { initials: 'DL', bg: '#60A5FA' },
    { initials: 'SM', bg: '#E5A1F5' },
    { initials: 'MR', bg: '#fbbf24' },
    { initials: 'AR', bg: '#F28482' },
  ]
  return (
    <div style={{ position: 'relative', height: 240, overflow: 'hidden', padding: '28px 24px 0' }}>
      <div style={{
        position: 'absolute', top: 28, right: 28, zIndex: 10,
        background: '#ef4444', borderRadius: 20, padding: '3px 10px',
        fontSize: '0.65rem', fontWeight: 700, color: '#fff',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <span style={{ width: 5, height: 5, background: '#fff', borderRadius: '50%', display: 'inline-block' }} />
        LIVE
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {attendees.map(({ initials, bg }) => (
          <div key={initials} style={{
            background: bg, borderRadius: 10, height: 68,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 700, color: '#fff',
            }}>
              {initials}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VisualSiti() {
  return (
    <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 24, left: 24, right: 24,
        background: '#fff', borderRadius: 10, overflow: 'hidden',
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
      }}>
        <div style={{
          background: '#f8fafc', padding: '7px 10px',
          display: 'flex', alignItems: 'center', gap: 6,
          borderBottom: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {['#f87171', '#fbbf24', '#34d399'].map(c => (
              <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <div style={{
            flex: 1, background: '#e2e8f0', borderRadius: 4, height: 14,
            display: 'flex', alignItems: 'center', paddingLeft: 6,
            fontSize: '0.6rem', color: '#94a3b8',
          }}>
            learnupstudio.it
          </div>
        </div>
        <div style={{ padding: '10px 14px', fontFamily: 'monospace, monospace' }}>
          {[
            { code: '<Hero />', color: '#60A5FA', indent: 0 },
            { code: '<Corsi />', color: '#F5C344', indent: 1 },
            { code: '<CTA />', color: '#B567C2', indent: 1 },
            { code: '</>', color: '#94a3b8', indent: 0 },
          ].map(({ code, color, indent }) => (
            <div key={code} style={{ fontSize: '0.7rem', color, paddingLeft: indent * 14, lineHeight: 1.85, fontWeight: 600 }}>
              {code}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Data ── */
const SERVICES = [
  {
    id: 1, badge: '🎬 Corsi eLearning', href: '/servizi/corsi-elearning',
    title: 'Corsi eLearning con AI',
    description: 'Creo corsi video interattivi con avatar AI, script professionale e pacchetto SCORM pronto per qualsiasi LMS.',
    tags: ['SCORM', 'Avatar AI', 'xAPI'],
    gradient: 'radial-gradient(circle at 50% 0%, #FFB347 0%, #F9ED96 40%, #F4F8F9 70%, #F4F8F9 100%)',
    Visual: VisualCorsi,
  },
  {
    id: 2, badge: '⚙️ Gestione LMS', href: '/servizi/gestione-lms',
    title: 'Gestione Piattaforme LMS',
    description: 'Installo, configuro e gestisco Moodle e altre piattaforme LMS. Tu pensi alla formazione, io alla tecnologia.',
    tags: ['Moodle', 'Docebo', 'Plugin'],
    gradient: 'radial-gradient(circle at 50% 0%, #B567C2 0%, #F28482 40%, #F4F8F9 70%, #F4F8F9 100%)',
    Visual: VisualLMS,
  },
  {
    id: 3, badge: '🎙️ Webinar Live', href: '/servizi/webinar',
    title: 'Webinar e Lezioni Online',
    description: 'Organizzo e gestisco le tue sessioni formative in diretta. Setup tecnico, coordinamento e registrazioni incluse.',
    tags: ['Zoom', 'Teams', 'Meet'],
    gradient: 'radial-gradient(circle at 50% 0%, #60A5FA 0%, #E5A1F5 40%, #F4F8F9 70%, #F4F8F9 100%)',
    Visual: VisualWebinar,
  },
  {
    id: 4, badge: '💻 Siti Formativi', href: '/servizi/siti-formativi',
    title: 'Sviluppo Siti Formativi',
    description: 'Progetto e sviluppo siti web ottimizzati per chi vende o eroga formazione. Moderni, veloci e integrabili con qualsiasi LMS.',
    tags: ['React', 'Tailwind', 'LMS'],
    gradient: 'radial-gradient(circle at 50% 0%, #F9ED96 0%, #60A5FA 40%, #F4F8F9 70%, #F4F8F9 100%)',
    Visual: VisualSiti,
  },
]

/* ── Main section ── */
export default function UseCases() {
  const navigate = useNavigate()
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.15 })
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.08 })

  return (
    <section style={{ background: '#ffffff', padding: 'clamp(64px, 8vw, 80px) 20px' }}>
      <style>{`
        .uc2-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .uc2-card {
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          text-align: left;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.10);
          height: 100%;
        }
        .uc2-card-wrap {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .uc2-card-wrap.visible {
          opacity: 1;
          transform: none;
        }
        .uc2-card-wrap.visible .uc2-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .uc2-card-wrap.visible .uc2-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
        }
        .uc2-link {
          display: inline-flex; align-items: center; gap: 5px;
          color: #2563EB; font-size: 13px; font-weight: 500;
          background: none; border: none; padding: 0; cursor: pointer;
          transition: transform 0.18s ease; text-decoration: none;
        }
        .uc2-link:hover { text-decoration: underline; transform: translateX(4px); }
        @media (max-width: 640px) {
          .uc2-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ maxWidth: 1300, margin: '0 auto' }}>

        {/* Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: 48 }}>
          <div
            className={`reveal ${headerVisible ? 'visible' : ''}`}
            style={{
              display: 'inline-block',
              fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
              background: 'linear-gradient(90deg, #F5C344, #F28482, #B567C2)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 16,
            }}
          >
            I miei servizi
          </div>
          <h2
            className={`reveal ${headerVisible ? 'visible' : ''}`}
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 500,
              color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.2,
              transitionDelay: '100ms',
            }}
          >
            Tutto ciò che serve alla tua formazione aziendale
          </h2>
          <p
            className={`reveal ${headerVisible ? 'visible' : ''}`}
            style={{
              fontSize: '1.125rem', color: '#64748b', lineHeight: 1.5, maxWidth: 520, margin: '0 auto',
              transitionDelay: '200ms',
            }}
          >
            Mi occupo di ogni aspetto della formazione digitale —<br />
            dalla produzione dei contenuti alla gestione della piattaforma.
          </p>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="uc2-grid">
          {SERVICES.map((s, i) => (
            <div
              key={s.id}
              className={`uc2-card-wrap ${gridVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div
                className="uc2-card"
                onClick={() => navigate(s.href)}
                style={{ background: s.gradient }}
              >
                {/* Visual top */}
                <s.Visual />

                {/* Content bottom */}
                <div style={{ padding: '16px 28px 28px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', marginBottom: 4 }}>
                    {s.badge}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1e293b', marginBottom: 6, lineHeight: 1.3 }}>
                    {s.title}
                  </h3>
                  <p style={{
                    fontSize: '0.82rem', color: '#64748b', lineHeight: 1.55, marginBottom: 12,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {s.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {s.tags.map(tag => (
                      <span key={tag} style={{
                        background: 'rgba(255,255,255,0.8)', color: '#475569',
                        border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 500,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    className="uc2-link"
                    onClick={e => { e.stopPropagation(); navigate(s.href) }}
                  >
                    Scopri di più
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
