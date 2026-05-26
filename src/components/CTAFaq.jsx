import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const FAQ_ITEMS = [
  {
    q: 'Quanto tempo ci vuole per produrre un corso?',
    a: "I tempi variano in base alla complessità, ma un corso standard viene consegnato in 5–10 giorni lavorativi, dalla bozza allo SCORM finale pronto all'uso.",
  },
  {
    q: 'I corsi sono compatibili con qualsiasi LMS?',
    a: 'Sì. Consegno i corsi come pacchetti SCORM o xAPI compatibili con Moodle, Docebo, TalentLMS e qualsiasi altra piattaforma LMS.',
  },
  {
    q: "Gestisci anche l'installazione della piattaforma LMS?",
    a: 'Assolutamente. Mi occupo di installazione, configurazione, personalizzazione e supporto continuativo per Moodle e altri LMS.',
  },
  {
    q: 'È possibile richiedere revisioni sul corso prodotto?',
    a: 'Ogni progetto include un ciclo di revisione per garantire che il risultato corrisponda pienamente alle tue aspettative.',
  },
  {
    q: 'Come posso iniziare?',
    a: 'Contattami per una call gratuita di 20 minuti: analizziamo la tua esigenza e costruiamo insieme una soluzione su misura, senza impegno.',
  },
]

const BULLETS = [
  { icon: '🎬', text: 'Corsi eLearning con AI pronti in 5–10 giorni' },
  { icon: '🖥️', text: 'Piattaforma LMS installata e brandizzata in 48 ore' },
  { icon: '🎙️', text: 'Webinar gestiti da A a Z, zero stress tecnico' },
  { icon: '💻', text: 'Siti formativi moderni, veloci e integrati con LMS' },
]

export default function CTAFaq() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [ctaRef, ctaVisible] = useScrollReveal({ threshold: 0.08 })
  const [faqRef, faqVisible] = useScrollReveal({ threshold: 0.1 })

  return (
    <>
      {/* ── CTA estesa ── */}
      <section className="py-20 px-4 bg-white">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div
            ref={ctaRef}
            className={`reveal-scale ${ctaVisible ? 'visible' : ''}`}
          >
            <div
              className="c5-animated-gradient rounded-[28px] overflow-hidden"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
            >
              <div style={{ padding: 'clamp(48px, 6vw, 80px) clamp(32px, 6vw, 80px)' }}>

                {/* Top: headline + bullets */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: 48 }}>

                  {/* Headline */}
                  <div>
                    <h2
                      className="text-white font-normal leading-[1.1] mb-5"
                      style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', letterSpacing: '-0.03em' }}
                    >
                      Pronto a portare<br />
                      la tua formazione<br />
                      al livello successivo?
                    </h2>
                    <p className="text-white/85 text-[1rem] leading-relaxed mb-8">
                      eLearning, LMS e webinar — tutto gestito da un unico professionista. Mi occupo di ogni aspetto, tu ti concentri sui risultati.
                    </p>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <button
                        className="font-semibold text-[0.95rem] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
                        style={{ background: '#0f172a', color: '#fff', padding: '14px 32px', borderRadius: 12, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}
                      >
                        Parliamo subito →
                      </button>
                      <button
                        className="font-semibold text-[0.95rem] transition-all duration-200 hover:-translate-y-0.5"
                        style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '14px 28px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.35)', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
                      >
                        Guarda i servizi
                      </button>
                    </div>
                  </div>

                  {/* Bullets */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {BULLETS.map(({ icon, text }) => (
                      <div
                        key={text}
                        style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 14, padding: '14px 18px', backdropFilter: 'blur(8px)' }}
                      >
                        <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                        <span style={{ color: '#fff', fontSize: 14, fontWeight: 500, lineHeight: 1.4 }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom: stats strip */}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 16, overflow: 'hidden' }}
                >
                  {[
                    { value: '48h', label: 'LMS pronta in 48 ore' },
                    { value: '10gg', label: 'Corso SCORM consegnato' },
                    { value: '1', label: 'Professionista dedicato' },
                  ].map(({ value, label }) => (
                    <div key={label} style={{ textAlign: 'center', padding: '20px 16px', background: 'rgba(255,255,255,0.1)' }}>
                      <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>{value}</p>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{label}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 bg-white">
        <div ref={faqRef} style={{ maxWidth: 760, margin: '0 auto' }}>

          <div className="text-center mb-12">
            <div className={`reveal ${faqVisible ? 'visible' : ''} inline-flex items-center gap-2 text-[13px] text-blue-600 font-semibold uppercase tracking-[0.15em] mb-4`}>
              <span className="w-8 h-px bg-blue-400" />
              FAQ
              <span className="w-8 h-px bg-blue-400" />
            </div>
            <h2
              className={`reveal ${faqVisible ? 'visible' : ''} text-[28px] sm:text-[36px] font-extrabold text-slate-900 mb-3 leading-tight`}
              style={{ transitionDelay: '100ms' }}
            >
              Domande frequenti
            </h2>
            <p
              className={`reveal ${faqVisible ? 'visible' : ''} text-slate-500 text-[15px]`}
              style={{ transitionDelay: '200ms' }}
            >
              Hai altre domande?{' '}
              <a href="#" className="text-blue-600 font-semibold hover:underline">Scrivimi</a>
              , rispondo entro 24 ore.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map(({ q, a }, i) => {
              const open = activeIndex === i
              return (
                <div
                  key={q}
                  className={`reveal ${faqVisible ? 'visible' : ''} overflow-hidden rounded-2xl border-2 transition-[border-color,background-color] ${open ? 'border-blue-200 bg-blue-50/40' : 'border-slate-100 bg-white hover:border-blue-100'}`}
                  style={{ transitionDelay: `${300 + i * 80}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveIndex(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-slate-800 text-[15px]">{q}</span>
                    <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition-all ${open ? 'bg-blue-600 rotate-45' : 'bg-slate-100'}`}>
                      <svg className={`w-4 h-4 ${open ? 'text-white' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>
                  <div className="grid transition-[grid-template-rows] duration-300 ease-in-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-[15px] leading-[1.7] text-slate-600">{a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>
    </>
  )
}
