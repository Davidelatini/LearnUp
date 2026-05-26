import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Server, Puzzle, BarChart2, PlayCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import lms1 from '../assets/LMS/1.png'
import lms2 from '../assets/LMS/2.png'
import lms3 from '../assets/LMS/3.png'

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s ${delay}ms ease, transform 0.55s ${delay}ms ease`,
      }}
    >
      {children}
    </div>
  )
}

function SectionHeader({ title, subtitle, dark = false }) {
  return (
    <div className="text-center mb-14">
      <h2 className={`text-[28px] sm:text-[36px] lg:text-[44px] font-extrabold ${dark ? 'text-white' : 'text-[#1e3a5f]'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-base sm:text-lg leading-relaxed ${dark ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

const CARDS = [
  {
    icon: Server,
    title: 'Installazione e Setup',
    description: 'Installo e configuro Moodle da zero — tema brandizzato con i colori della tua azienda, struttura corsi, ruoli utenti e permessi. Pronto in 48 ore.',
    tags: ['Moodle', 'Docebo', 'TalentLMS', 'Branding'],
  },
  {
    icon: Puzzle,
    title: 'Plugin e Integrazioni',
    description: 'Installo e configuro i plugin più utili — pagamenti, certificati, SCORM, videoconferenze, HR integrations. La piattaforma si adatta alle tue esigenze.',
    tags: ['Plugin', 'SCORM', 'Zoom', 'Certificati', 'SSO'],
  },
  {
    icon: BarChart2,
    title: 'Reportistica e Analytics',
    description: 'Monitoro i progressi degli studenti, i tassi di completamento e i risultati dei quiz. Report dettagliati per il management — sempre aggiornati.',
    tags: ['Analytics', 'Report', 'Completamento', 'KPI'],
  },
  {
    icon: PlayCircle,
    title: 'Creazione Corsi sulla Piattaforma',
    description: 'Carico e struttura i corsi SCORM sulla tua piattaforma, configuro i percorsi di apprendimento, i prerequisiti e i certificati automatici.',
    tags: ['SCORM', 'xAPI', 'Percorsi', 'Certificati'],
  },
]

const FOR_WHO = [
  {
    emoji: '🏢',
    title: 'Non hai ancora una piattaforma LMS',
    description: 'Installo e configuro tutto da zero — Moodle o altra piattaforma — brandizzata con la tua identità aziendale. Pronta in 48 ore.',
  },
  {
    emoji: '⚙️',
    title: 'Hai Moodle ma nessuno sa gestirlo',
    description: 'Prendo in mano la tua piattaforma esistente — aggiornamenti, utenti, corsi, plugin. Tu non devi fare nulla.',
  },
  {
    emoji: '📊',
    title: 'Hai bisogno di reportistica e tracciamento',
    description: 'Configuro dashboard analytics per monitorare completamenti, progressi e risultati dei quiz — con report automatici per il management.',
  },
]

const FAQS = [
  {
    q: 'Quanto tempo ci vuole per installare Moodle?',
    a: "Un'installazione base con tema brandizzato è pronta in 48 ore. Una configurazione completa con plugin, percorsi e integrazioni richiede 3–5 giorni lavorativi.",
  },
  {
    q: 'Gestisci anche piattaforme diverse da Moodle?',
    a: 'Sì — lavoro anche con Docebo, TalentLMS e altre piattaforme SCORM-compatibili. Contattami per capire quale si adatta meglio alle tue esigenze.',
  },
  {
    q: 'Posso avere la piattaforma con il mio brand?',
    a: 'Assolutamente sì. Ogni piattaforma viene personalizzata con logo, colori e dominio della tua azienda — il tuo sottodominio dedicato tipo formazione.tuaazienda.it.',
  },
  {
    q: 'Cosa succede se ho un problema tecnico?',
    a: 'Includo 30 giorni di supporto tecnico dopo ogni installazione. Per assistenza continuativa offro piani di manutenzione mensile.',
  },
]

export default function ServiceLMS() {
  const [faqOpen, setFaqOpen] = useState(null)

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">
      <Navbar />

      {/* Hero — viola/corallo come card home */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 0%, #B567C2 0%, #F28482 42%, #F4F8F9 72%, #F4F8F9 100%)' }}>

        <div className="absolute rounded-full blur-3xl pointer-events-none" style={{ width: 560, height: 560, top: '-160px', left: '50%', transform: 'translateX(-50%)', background: '#B567C2', opacity: 0.32, animation: 'heroBlob1 7s ease-in-out infinite' }} />
        <div className="absolute rounded-full blur-2xl pointer-events-none" style={{ width: 260, height: 260, top: '40px', right: '8%', background: '#F28482', opacity: 0.45, animation: 'heroBlob2 9s ease-in-out infinite' }} />
        <div className="absolute rounded-full blur-2xl pointer-events-none" style={{ width: 180, height: 180, bottom: '0px', left: '6%', background: '#B567C2', opacity: 0.22, animation: 'heroBlob2 6s ease-in-out infinite reverse' }} />

        {/* mini dashboard flottante sinistra */}
        <div className="hidden lg:block absolute pointer-events-none" style={{ top: '140px', left: 'calc(50% - 460px)', animation: 'heroFloat 5s ease-in-out infinite' }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: '14px 18px', boxShadow: '0 10px 28px rgba(0,0,0,0.10)', width: 200 }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Dashboard LMS</div>
            {[{ label: 'Utenti attivi', pct: 78, color: '#B567C2' }, { label: 'Corsi completati', pct: 65, color: '#F28482' }].map(({ label, pct, color }) => (
              <div key={label} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748b', marginBottom: 3 }}>
                  <span>{label}</span><span style={{ fontWeight: 600, color: '#334155' }}>{pct}%</span>
                </div>
                <div style={{ height: 5, background: '#f1f5f9', borderRadius: 10 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 10 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* badge destra */}
        <div className="hidden lg:block absolute pointer-events-none" style={{ top: '200px', right: 'calc(50% - 460px)', animation: 'heroFloat 6.5s ease-in-out infinite reverse' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: '7px 16px', fontSize: '0.78rem', fontWeight: 600, color: '#1e293b', boxShadow: '0 6px 16px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ color: '#B567C2' }}>✦</span> Moodle ready
          </div>
        </div>

        <style>{`
          @keyframes heroBlob1 { 0%,100%{transform:translateX(-50%) scale(1);} 50%{transform:translateX(-50%) scale(1.12) translateY(-14px);} }
          @keyframes heroBlob2 { 0%,100%{transform:scale(1);} 50%{transform:scale(1.18) translate(8px,-10px);} }
          @keyframes heroFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
        `}</style>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.75)', color: '#6b21a8', border: '1px solid rgba(181,103,194,0.4)', backdropFilter: 'blur(8px)' }}>
            🖥️ Gestione LMS
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight" style={{ color: '#1e293b' }}>
            La tua piattaforma LMS, gestita da esperti
          </h1>
          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#475569' }}>
            Installiamo, configuriamo e gestiamo Moodle e altre piattaforme LMS per la tua azienda. Tu pensi alla formazione, noi alla tecnologia.
          </p>
          <Link
            to="/contatti"
            className="inline-block font-bold px-10 py-4 rounded-xl text-base transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            style={{ background: '#1e293b', color: '#fff' }}
          >
            Richiedi consulenza gratuita →
          </Link>
        </div>
      </section>

      {/* SEZIONE 1 — Cosa gestisco */}
      <section className="py-24 px-4 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionHeader
              title="Tutto quello che serve alla tua piattaforma LMS"
              subtitle="Mi occupo di ogni aspetto — dall'installazione alla gestione quotidiana"
            />
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CARDS.map(({ icon: Icon, title, description, tags }, index) => (
              <FadeIn key={title} delay={index * 80}>
                <div className="group h-full bg-white border border-[#e2e8f0] rounded-[20px] p-8 shadow-[0_4px_24px_rgba(37,99,235,0.06)] hover:border-[#2563EB] hover:shadow-[0_12px_36px_rgba(37,99,235,0.14)] hover:-translate-y-1 transition-all">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] text-white shadow-lg shadow-blue-200 mb-5 group-hover:scale-110 transition-transform">
                    <Icon size={26} strokeWidth={2.2} />
                  </div>
                  <h3 className="text-[#1e3a5f] font-extrabold text-lg mb-3">{title}</h3>
                  <p className="text-[#64748b] text-[15px] leading-[1.75] mb-5">{description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-1 text-xs font-semibold text-[#64748b]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SEZIONE 2 — Immagini come sfondo, sfondo bianco, posizione alternata */}

      {/* A — immagine più a sinistra, card a destra */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundImage: `url(${lms1})`, backgroundColor: 'white', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'left center', minHeight: '520px' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.97) 38%, rgba(255,255,255,0.5) 65%, rgba(255,255,255,0) 100%)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 flex items-center justify-end" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <FadeIn className="w-full md:w-[45%]">
            <p className="text-sm font-bold tracking-widest mb-4" style={{ color: '#0EA5E9' }}>— DASHBOARD —</p>
            <h2 className="font-extrabold mb-4" style={{ fontSize: '26px', lineHeight: '1.3', color: '#1e3a5f' }}>
              Reportistica e analytics in tempo reale
            </h2>
            <p className="text-[15px] leading-[1.75] mb-6" style={{ color: '#64748b' }}>
              Monitoro i progressi di ogni studente — corsi completati, tempo di studio, risultati dei quiz e tassi di completamento. Report dettagliati sempre disponibili per il management.
            </p>
            <ul className="space-y-2 mb-6">
              {['Progressi individuali per ogni studente', 'Tassi di completamento per corso', 'Report esportabili per il management'].map((point) => (
                <li key={point} className="flex items-start gap-2 text-[15px]" style={{ color: '#1e3a5f' }}>
                  <span className="font-bold mt-0.5" style={{ color: '#22c55e' }}>✓</span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {['Analytics', 'KPI', 'Report', 'Dashboard'].map((tag) => (
                <span key={tag} className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-1 text-xs font-semibold" style={{ color: '#64748b' }}>{tag}</span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* B — immagine più a destra, card a sinistra */}
      <section
        className="relative overflow-hidden border-t border-[#e2e8f0]"
        style={{ backgroundImage: `url(${lms2})`, backgroundColor: 'white', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', minHeight: '520px' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.97) 38%, rgba(255,255,255,0.5) 65%, rgba(255,255,255,0) 100%)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 flex items-center justify-start" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <FadeIn className="w-full md:w-[45%]">
            <p className="text-sm font-bold tracking-widest mb-4" style={{ color: '#0EA5E9' }}>— GESTIONE CORSI —</p>
            <h2 className="font-extrabold mb-4" style={{ fontSize: '26px', lineHeight: '1.3', color: '#1e3a5f' }}>
              Installazione, gestione e caricamento corsi
            </h2>
            <p className="text-[15px] leading-[1.75] mb-6" style={{ color: '#64748b' }}>
              Installo la piattaforma LMS da zero, la brando con la tua identità aziendale e carico tutti i corsi SCORM. Gestisco utenti, permessi, percorsi formativi e certificati automatici.
            </p>
            <ul className="space-y-2 mb-6">
              {['Installazione Moodle brandizzata in 48 ore', 'Caricamento corsi SCORM e xAPI', 'Gestione utenti, ruoli e permessi'].map((point) => (
                <li key={point} className="flex items-start gap-2 text-[15px]" style={{ color: '#1e3a5f' }}>
                  <span className="font-bold mt-0.5" style={{ color: '#22c55e' }}>✓</span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {['Moodle', 'SCORM', 'Branding', 'Certificati'].map((tag) => (
                <span key={tag} className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-1 text-xs font-semibold" style={{ color: '#64748b' }}>{tag}</span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* C — immagine più a sinistra, card a destra */}
      <section
        className="relative overflow-hidden border-t border-[#e2e8f0]"
        style={{ backgroundImage: `url(${lms3})`, backgroundColor: 'white', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'left center', minHeight: '520px' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.97) 38%, rgba(255,255,255,0.5) 65%, rgba(255,255,255,0) 100%)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 flex items-center justify-end" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <FadeIn className="w-full md:w-[45%]">
            <p className="text-sm font-bold tracking-widest mb-4" style={{ color: '#0EA5E9' }}>— PLUGIN E AI —</p>
            <h2 className="font-extrabold mb-4" style={{ fontSize: '26px', lineHeight: '1.3', color: '#1e3a5f' }}>
              Plugin avanzati e tutor AI integrato
            </h2>
            <p className="text-[15px] leading-[1.75] mb-6" style={{ color: '#64748b' }}>
              Installo e configuro i plugin più utili per la tua piattaforma — pagamenti, videoconferenze, certificati automatici e il tutor AI che accompagna ogni studente durante il corso.
            </p>
            <ul className="space-y-2 mb-6">
              {['Plugin SCORM, Zoom, pagamenti', 'Tutor AI integrato nella piattaforma', 'Certificati automatici configurati'].map((point) => (
                <li key={point} className="flex items-start gap-2 text-[15px]" style={{ color: '#1e3a5f' }}>
                  <span className="font-bold mt-0.5" style={{ color: '#22c55e' }}>✓</span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {['Plugin', 'AI', 'Zoom', 'Certificati', 'SSO'].map((tag) => (
                <span key={tag} className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-1 text-xs font-semibold" style={{ color: '#64748b' }}>{tag}</span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SEZIONE 3 — Per chi è */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionHeader title="È il servizio giusto per te se..." />
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FOR_WHO.map(({ emoji, title, description }, index) => (
              <FadeIn key={title} delay={index * 80}>
                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 hover:border-[#2563EB] hover:shadow-[0_12px_36px_rgba(37,99,235,0.12)] hover:-translate-y-1 transition-all">
                  <div className="text-4xl mb-4">{emoji}</div>
                  <h3 className="text-[#1e3a5f] font-extrabold text-base mb-3">{title}</h3>
                  <p className="text-[#64748b] text-sm leading-relaxed">{description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SEZIONE 4 — FAQ */}
      <section className="py-24 px-4 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <SectionHeader title="Domande frequenti" />
          </FadeIn>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, index) => {
              const open = faqOpen === index
              return (
                <FadeIn key={q} delay={index * 60}>
                  <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white">
                    <button
                      type="button"
                      onClick={() => setFaqOpen(open ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-bold text-[#1e3a5f]">{q}</span>
                      <span className="text-2xl font-light leading-none text-[#2563EB]">{open ? '×' : '+'}</span>
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 text-[15px] leading-[1.7] text-[#64748b]">{a}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* SEZIONE 5 — CTA finale */}
      <section className="px-4 bg-gradient-to-br from-[#2563EB] to-[#0EA5E9]" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="mb-4 text-[28px] sm:text-[36px] font-extrabold leading-tight text-white">
              Vuoi una piattaforma LMS pronta in 48 ore?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-[16px] leading-relaxed text-blue-100">
              Dimmi cosa ti serve — ti rispondo entro 24 ore con una proposta.
            </p>
            <Link
              to="/contatti"
              className="inline-block rounded-xl bg-white px-10 py-4 text-[15px] font-bold text-[#2563EB] shadow-lg transition-all hover:scale-105 hover:bg-blue-50 hover:shadow-xl"
            >
              Scrivimi →
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  )
}
