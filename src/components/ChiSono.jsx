import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const CHECKS = [
  'Referente unico per tutto il progetto, nessun intermediario',
  'Consegne puntuali e processo trasparente in ogni fase',
  'Corsi compatibili con tutti i principali LMS (SCORM & xAPI)',
]

const STATS = [
  { num: '5+', label: 'Anni exp.' },
  { num: '50+', label: 'Corsi' },
  { num: '30gg', label: 'Supporto' },
]

export default function ChiSono() {
  const [hovered, setHovered] = useState(false)
  const [sectionRef, visible] = useScrollReveal({ threshold: 0.1 })

  return (
    <section ref={sectionRef} style={{ background: '#ffffff', padding: 'clamp(64px, 8vw, 80px) 20px' }}>
      <style>{`
        .cs2-grid {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .cs2-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .cs2-left { align-items: center; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="cs2-grid">

          {/* ── Left: visual card ── */}
          <div
            className={`reveal ${visible ? 'visible' : ''}`}
            style={{
              background: 'radial-gradient(circle at 50% 0%, #60A5FA 0%, #E5A1F5 40%, #F4F8F9 70%, #F4F8F9 100%)',
              borderRadius: 20,
              padding: '44px 32px 36px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.10)',
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 110, height: 110, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6, #E5A1F5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 48, fontWeight: 800, color: '#fff',
              marginBottom: 18,
              boxShadow: '0 8px 28px rgba(59,130,246,0.35)',
            }}>
              D
            </div>

            {/* Name */}
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
              Davide Latini
            </div>

            {/* Role badge */}
            <div style={{
              marginTop: 10, marginBottom: 28,
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 20, padding: '5px 16px',
              fontSize: '0.78rem', fontWeight: 600, color: '#475569',
              border: '1px solid rgba(0,0,0,0.06)',
            }}>
              Freelance eLearning & AI
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {STATS.map(({ num, label }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.82)',
                  borderRadius: 12, padding: '12px 16px', textAlign: 'center',
                  border: '1px solid rgba(0,0,0,0.06)',
                  minWidth: 72,
                }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{num}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 2, fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: bio ── */}
          <div className={`reveal ${visible ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-block',
              fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
              background: 'linear-gradient(90deg, #F5C344, #F28482, #B567C2)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 16,
            }}>
              Chi sono
            </div>

            {/* Heading */}
            <h2 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 500, lineHeight: 1.2,
              color: '#0f172a', letterSpacing: '-0.02em',
              marginBottom: 20,
            }}>
              Un professionista dedicato al tuo progetto
            </h2>

            {/* Bio */}
            <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.75, marginBottom: 16 }}>
              Mi chiamo Davide e mi occupo di formazione digitale a 360°. Lavoro con aziende di ogni dimensione per trasformare i loro contenuti formativi in esperienze digitali efficaci — corsi eLearning con avatar AI, piattaforme LMS Moodle, webinar live e siti web dedicati alla formazione.
            </p>
            <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.75, marginBottom: 28 }}>
              Non sono un'agenzia: ogni progetto lo seguo personalmente, dall'analisi iniziale alla consegna finale. Questo significa meno burocrazia, comunicazione diretta e risultati concreti — nei tempi stabiliti.
            </p>

            {/* Checkmarks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {CHECKS.map(text => (
                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                    background: '#D1FAE5', border: '1px solid #6EE7B7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                  <span style={{ color: '#475569', fontSize: 15, lineHeight: 1.6 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: 12,
                padding: '14px 32px',
                fontSize: 15, fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 200ms, box-shadow 200ms',
                boxShadow: hovered ? '0 14px 30px rgba(0,0,0,0.25)' : '0 4px 14px rgba(0,0,0,0.12)',
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              Scopri come posso aiutarti →
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
