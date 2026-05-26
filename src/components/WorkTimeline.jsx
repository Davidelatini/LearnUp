import { useState, useEffect, useRef } from 'react'

/* ── Icons ── */
const IconMsg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const IconFilm = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2"/>
    <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <line x1="2" y1="7" x2="7" y2="7"/><line x1="17" y1="7" x2="22" y2="7"/>
    <line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/>
  </svg>
)
const IconVideo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
  </svg>
)
const IconPkg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const IconSrv = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/>
    <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
)

/* ── Data ── */
const STEPS = [
  {
    id: 1, num: '01', badge: 'Giorno 1',
    gradient: 'radial-gradient(circle at 50% 0%, #FFB347 0%, #F9ED96 40%, #F4F8F9 70%, #F4F8F9 100%)',
    iconGrad: 'linear-gradient(135deg, #F97316, #FFB347)',
    Icon: IconMsg,
    title: 'Briefing Gratuito',
    description: 'Call gratuita per capire la tua esigenza e costruire un piano.',
    tags: ['Call gratuita', 'Analisi', 'Preventivo'],
  },
  {
    id: 2, num: '02', badge: 'Giorni 2–4',
    gradient: 'radial-gradient(circle at 50% 0%, #B567C2 0%, #F28482 40%, #F4F8F9 70%, #F4F8F9 100%)',
    iconGrad: 'linear-gradient(135deg, #B567C2, #F28482)',
    Icon: IconFilm,
    title: 'Script & Storyboard',
    description: 'Strutturiamo i contenuti e progettiamo il corso prima di produrlo.',
    tags: ['Script', 'Storyboard', 'Revisione'],
  },
  {
    id: 3, num: '03', badge: 'Giorni 5–8',
    gradient: 'radial-gradient(circle at 50% 0%, #60A5FA 0%, #E5A1F5 40%, #F4F8F9 70%, #F4F8F9 100%)',
    iconGrad: 'linear-gradient(135deg, #3B82F6, #E5A1F5)',
    Icon: IconVideo,
    title: 'Produzione AI',
    description: 'Avatar AI, audio professionale, quiz interattivi e animazioni.',
    tags: ['Avatar AI', 'Audio', 'Quiz'],
  },
  {
    id: 4, num: '04', badge: 'Giorno 9',
    gradient: 'radial-gradient(circle at 50% 0%, #F9ED96 0%, #60A5FA 40%, #F4F8F9 70%, #F4F8F9 100%)',
    iconGrad: 'linear-gradient(135deg, #F5C344, #60A5FA)',
    Icon: IconPkg,
    title: 'Packaging SCORM',
    description: 'Il corso viene pacchettizzato in SCORM o xAPI e testato su più dispositivi.',
    tags: ['SCORM 1.2', 'xAPI', 'Testing'],
  },
  {
    id: 5, num: '05', badge: 'Sempre',
    gradient: 'radial-gradient(circle at 50% 0%, #6EE7B7 0%, #34D399 40%, #F4F8F9 70%, #F4F8F9 100%)',
    iconGrad: 'linear-gradient(135deg, #10B981, #34D399)',
    Icon: IconSrv,
    title: 'LMS & Supporto',
    description: 'Carico il corso sulla piattaforma e resto disponibile per aggiornamenti.',
    tags: ['Caricamento LMS', 'Analytics', 'Supporto 30gg'],
  },
]

const STATS = [
  { num: '10 giorni', label: 'Dalla call alla consegna' },
  { num: '100%', label: 'Compatibile con tutti gli LMS' },
  { num: '30 giorni', label: 'Supporto post-consegna incluso' },
]

/* ── Flow arrow between cards ── */
function FlowArrow({ visible }) {
  return (
    <div className="wt2-arrow">
      <div style={{
        flex: 1,
        position: 'relative',
        height: 2,
        background: '#e2e8f0',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        {/* Gradient fill */}
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          background: 'linear-gradient(90deg, #F28482, #B567C2)',
          borderRadius: 2,
          width: visible ? '100%' : '0%',
          transition: 'width 1s ease',
        }} />
        {/* Moving dot */}
        {visible && (
          <div style={{
            position: 'absolute',
            top: '50%', transform: 'translateY(-50%)',
            width: 8, height: 8, borderRadius: '50%',
            background: '#B567C2',
            boxShadow: '0 0 8px rgba(181,103,194,0.9), 0 0 16px rgba(181,103,194,0.5)',
            animation: 'wt-dot 1.8s linear infinite',
          }} />
        )}
      </div>
      {/* Arrowhead */}
      <div style={{
        width: 0, height: 0, flexShrink: 0,
        borderTop: '5px solid transparent',
        borderBottom: '5px solid transparent',
        borderLeft: `7px solid ${visible ? '#B567C2' : '#e2e8f0'}`,
        transition: 'border-color 1s ease',
      }} />
    </div>
  )
}

/* ── Main component ── */
export default function WorkTimeline() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} style={{ background: '#ffffff', padding: 'clamp(64px, 8vw, 80px) 20px' }}>
      <style>{`
        @keyframes wt-dot {
          from { left: -8px; }
          to   { left: calc(100% + 8px); }
        }

        .wt2-row {
          display: flex;
          flex-wrap: nowrap;
          align-items: stretch;
          margin-bottom: 40px;
        }
        .wt2-card-wrap {
          flex: 1;
          min-width: 0;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .wt2-card-wrap.visible {
          opacity: 1;
          transform: none;
        }
        .wt2-card {
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-align: left;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.10);
          cursor: default;
          height: 100%;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .wt2-card-wrap.visible .wt2-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
        }
        .wt2-arrow {
          flex: 0 0 48px;
          display: flex;
          align-items: center;
          gap: 0;
          padding: 0 4px;
          padding-bottom: 120px;
        }
        .wt2-stats {
          display: flex;
          gap: 16px;
        }
        .wt2-stat {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .wt2-stat.visible {
          opacity: 1;
          transform: none;
        }

        @media (max-width: 900px) {
          .wt2-row {
            flex-wrap: wrap;
            gap: 20px;
          }
          .wt2-card-wrap {
            flex: 0 1 calc((100% - 20px) / 2);
            min-width: 240px;
          }
          .wt2-arrow { display: none; }
          .wt2-stats { flex-direction: column; }
        }
        @media (max-width: 540px) {
          .wt2-card-wrap { flex: 0 1 100%; }
        }
      `}</style>

      <div style={{ maxWidth: 1300, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div
            className={`reveal ${visible ? 'visible' : ''}`}
            style={{
              display: 'inline-block',
              fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
              background: 'linear-gradient(90deg, #F5C344, #F28482, #B567C2)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 16,
            }}
          >
            Come lavoro
          </div>
          <h2
            className={`reveal ${visible ? 'visible' : ''}`}
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 500,
              color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.2,
              transitionDelay: '100ms',
            }}
          >
            Dal briefing allo SCORM, gestisco tutto io
          </h2>
          <p
            className={`reveal ${visible ? 'visible' : ''}`}
            style={{
              fontSize: '1.125rem', color: '#64748b', lineHeight: 1.5, maxWidth: 520, margin: '0 auto',
              transitionDelay: '200ms',
            }}
          >
            Un processo semplice e trasparente —<br />
            sai sempre a che punto siamo e cosa succede dopo.
          </p>
        </div>

        {/* Cards + arrows */}
        <div className="wt2-row">
          {STEPS.flatMap((step, i) => {
            const els = [
              <div
                key={step.id}
                className={`wt2-card-wrap ${visible ? 'visible' : ''}`}
                style={{ transitionDelay: `${300 + i * 120}ms` }}
              >
                <div className="wt2-card" style={{ background: step.gradient }}>
                  {/* Visual top */}
                  <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', bottom: -14, right: 12,
                      fontSize: '7rem', fontWeight: 900, lineHeight: 1,
                      color: 'rgba(255,255,255,0.25)',
                      userSelect: 'none', pointerEvents: 'none',
                    }}>
                      {step.num}
                    </div>
                    <div style={{
                      position: 'absolute', top: 16, left: 18,
                      background: 'rgba(255,255,255,0.88)',
                      borderRadius: 20, padding: '4px 12px',
                      fontSize: '0.68rem', fontWeight: 700, color: '#1e293b',
                    }}>
                      {step.badge}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '14px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 9, marginBottom: 10, flexShrink: 0,
                      background: step.iconGrad,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}>
                      <step.Icon />
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginBottom: 6, lineHeight: 1.3 }}>
                      {step.title}
                    </h3>
                    <p style={{
                      fontSize: '0.78rem', color: '#64748b', lineHeight: 1.6, marginBottom: 12,
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {step.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 'auto' }}>
                      {step.tags.map(tag => (
                        <span key={tag} style={{
                          background: 'rgba(255,255,255,0.8)', color: '#475569',
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderRadius: 20, padding: '2px 9px',
                          fontSize: '0.68rem', fontWeight: 500,
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>,
            ]
            if (i < STEPS.length - 1) {
              els.push(<FlowArrow key={`arrow-${i}`} visible={visible} />)
            }
            return els
          })}
        </div>

        {/* Stats */}
        <div className="wt2-stats">
          {STATS.map(({ num, label }, i) => (
            <div
              key={label}
              className={`wt2-stat ${visible ? 'visible' : ''}`}
              style={{
                flex: 1, background: '#F8FAFC', border: '1px solid #e2e8f0',
                borderRadius: 16, padding: '28px 24px', textAlign: 'center',
                transitionDelay: `${600 + i * 100}ms`,
              }}
            >
              <div style={{
                fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, marginBottom: 6,
                background: 'linear-gradient(90deg, #F5C344, #F28482, #B567C2)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {num}
              </div>
              <div style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
