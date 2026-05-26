import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutTemplate, PlayCircle, Server } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { DemoTutorExperience } from '../components/DemoModal'

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

const PROCESS = [
  {
    number: '01',
    icon: LayoutTemplate,
    title: 'Script e Storyboard',
    description:
      'Analizziamo insieme gli obiettivi formativi. Scrivo lo script e progetto la struttura del corso — testi, sequenze, quiz e flow di apprendimento. Tutto definito prima di iniziare la produzione.',
    tags: ['Script', 'Obiettivi', 'Struttura', 'Revisione inclusa'],
    timing: 'Giorni 1–3',
  },
  {
    number: '02',
    icon: PlayCircle,
    title: 'Produzione con AI',
    description:
      'Produco il corso con avatar AI professionale, voiceover in italiano, animazioni e quiz interattivi. Il tutor AI viene integrato per guidare lo studente in tempo reale e adattare il percorso alle sue risposte.',
    tags: ['Avatar AI', 'Audio AI', 'Quiz', 'Tutor AI', 'Animazioni'],
    timing: 'Giorni 4–8',
    special: '✨ Tutor AI incluso',
  },
  {
    number: '03',
    icon: Server,
    title: 'Test e Consegna SCORM',
    description:
      "Il corso viene pacchettizzato in SCORM 1.2 e xAPI, testato su Moodle, Docebo e altri LMS principali. Consegno il pacchetto pronto all'uso — o lo carico direttamente sulla tua piattaforma.",
    tags: ['SCORM 1.2', 'xAPI', 'Testing', 'Moodle', 'Docebo'],
    timing: 'Giorno 9–10',
    special: "✓ Pronto all'uso",
  },
]

const GALLERY = [
  ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', 'Sicurezza sul Lavoro', 'D.Lgs. 81/08'],
  ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600', 'Gestione LMS', 'Dashboard Analytics'],
  ['https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600', 'Webinar', 'Formazione Remota'],
  ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600', 'Compliance', 'GDPR Aziendale'],
  ['https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600', 'Onboarding', 'Nuovi Dipendenti'],
  ['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600', 'Sicurezza', 'Antincendio'],
]

const FAQS = [
  {
    q: 'Quanto tempo ci vuole per avere il corso pronto?',
    a: 'Per un micro-corso da 5–10 minuti: 3 giorni lavorativi. Per un corso standard da 30–60 minuti: 5–10 giorni. Per percorsi multi-modulo con tutor AI: 10–15 giorni. I tempi dipendono dalla complessità dei contenuti e dalla velocità con cui ricevo i materiali.',
  },
  {
    q: 'Devo fornire materiali già pronti?',
    a: 'No — puoi mandarmi un PDF, una presentazione PowerPoint, un manuale aziendale o anche solo una descrizione degli obiettivi. Mi occupo io di script, struttura e contenuti visivi.',
  },
  {
    q: 'Il tutor AI funziona su qualsiasi LMS?',
    a: 'Il tutor AI è integrato nel corso SCORM — funziona su qualsiasi LMS compatibile con SCORM 1.2 o xAPI: Moodle, Docebo, TalentLMS, Cornerstone e molti altri.',
  },
  {
    q: 'Posso richiedere modifiche dopo la consegna?',
    a: 'Sì — includo sempre un ciclo di revisione. Modifiche ai contenuti vengono gestite entro 48 ore dalla richiesta.',
  },
  {
    q: 'Quanto costa un corso?',
    a: 'Il costo dipende dalla durata, dalla complessità e dai servizi inclusi. Preferisco sempre fare un preventivo personalizzato dopo una call di 20 minuti — così posso capire esattamente cosa ti serve e darti un prezzo preciso. La call è gratuita e senza impegno.',
  },
]

function SectionHeader({ title, subtitle, dark = false }) {
  return (
    <div className="text-center mb-14">
      <h2 className={`text-[28px] sm:text-[36px] lg:text-[44px] font-extrabold ${dark ? 'text-white' : 'text-[#1e3a5f]'}`}>
        {title}
      </h2>
      <p className={`mt-3 text-base sm:text-lg leading-relaxed ${dark ? 'text-slate-400' : 'text-[#64748b]'}`}>
        {subtitle}
      </p>
    </div>
  )
}

export default function ServiceElearning() {
  const [faqOpen, setFaqOpen] = useState(null)

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">
      <Navbar />

      <section className="pt-32 pb-20 px-4 relative overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 0%, #FFB347 0%, #F9ED96 42%, #F4F8F9 72%, #F4F8F9 100%)' }}>

        {/* blob arancio animati */}
        <div className="absolute rounded-full blur-3xl pointer-events-none" style={{ width: 560, height: 560, top: '-160px', left: '50%', transform: 'translateX(-50%)', background: '#FFB347', opacity: 0.35, animation: 'heroBlob1 7s ease-in-out infinite' }} />
        <div className="absolute rounded-full blur-2xl pointer-events-none" style={{ width: 260, height: 260, top: '40px', right: '8%', background: '#F9ED96', opacity: 0.5, animation: 'heroBlob2 9s ease-in-out infinite' }} />
        <div className="absolute rounded-full blur-2xl pointer-events-none" style={{ width: 180, height: 180, bottom: '0px', left: '6%', background: '#FFB347', opacity: 0.25, animation: 'heroBlob2 6s ease-in-out infinite reverse' }} />

        {/* card decorativa sinistra */}
        <div className="hidden lg:block absolute pointer-events-none" style={{ top: '140px', left: 'calc(50% - 460px)', animation: 'heroFloat 5s ease-in-out infinite' }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: '14px 18px', fontSize: '0.8rem', color: '#475569', lineHeight: 1.6, boxShadow: '0 10px 28px rgba(0,0,0,0.10)', maxWidth: 220 }}>
            Crea un corso su{' '}
            <span style={{ background: 'linear-gradient(90deg,#FFB347,#B567C2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>
              sicurezza sul lavoro
            </span>
            {' '}con avatar AI e quiz finali
          </div>
        </div>

        {/* badge decorativo destra */}
        <div className="hidden lg:block absolute pointer-events-none" style={{ top: '200px', right: 'calc(50% - 460px)', animation: 'heroFloat 6.5s ease-in-out infinite reverse' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: '7px 16px', fontSize: '0.78rem', fontWeight: 600, color: '#1e293b', boxShadow: '0 6px 16px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ color: '#a855f7' }}>✦</span> SCORM ready
          </div>
        </div>

        <style>{`
          @keyframes heroBlob1 { 0%,100%{transform:translateX(-50%) scale(1);} 50%{transform:translateX(-50%) scale(1.12) translateY(-14px);} }
          @keyframes heroBlob2 { 0%,100%{transform:scale(1);} 50%{transform:scale(1.18) translate(8px,-10px);} }
          @keyframes heroFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
        `}</style>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.75)', color: '#92400e', border: '1px solid rgba(255,179,71,0.4)', backdropFilter: 'blur(8px)' }}>
            🎬 Corsi eLearning con AI
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight" style={{ color: '#1e293b' }}>
            Corsi eLearning professionali,<br className="hidden sm:block" /> creati con AI
          </h1>
          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#475569' }}>
            Trasformo i tuoi contenuti formativi in corsi video interattivi con avatar AI, pronti per qualsiasi piattaforma LMS.
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

      <section className="py-24 px-4 bg-[#EFF6FF]">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <SectionHeader title="Come creo il tuo corso" subtitle="Un processo in 3 fasi — semplice, trasparente e veloce" />
          </FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {PROCESS.map(({ number, icon: Icon, title, description, tags, timing, special }, index) => (
              <FadeIn key={title} delay={index * 90} className="relative h-full">
                {index > 0 && (
                  <div className="hidden lg:block absolute top-1/2 -left-8 -translate-y-1/2 text-[#0EA5E9] text-4xl font-light z-10">→</div>
                )}
                <div className="group relative h-full overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white p-8 shadow-[0_4px_24px_rgba(37,99,235,0.08)] transition-all duration-300 hover:scale-[1.02] hover:border-[#2563EB] hover:shadow-[0_18px_45px_rgba(37,99,235,0.16)]">
                  <div className="absolute right-6 top-4 text-8xl font-black leading-none text-[#EFF6FF]">{number}</div>
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-6 flex items-center justify-between gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] text-white shadow-lg shadow-blue-200">
                        <Icon size={28} strokeWidth={2.4} />
                      </div>
                      <span className="rounded-full bg-[#EFF6FF] px-4 py-1.5 text-xs font-bold text-[#2563EB]">{timing}</span>
                    </div>
                    <h3 className="mb-4 text-xl font-extrabold text-[#1e3a5f]">{title}</h3>
                    <p className="mb-6 text-[15px] leading-[1.75] text-[#64748b]">{description}</p>
                    <div className="mt-auto flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-1 text-xs font-semibold text-[#64748b]">
                          {tag}
                        </span>
                      ))}
                      {special && (
                        <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#2563EB]">{special}</span>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <SectionHeader
              title="Prova il tutor AI in diretta"
              subtitle="Questo è un esempio reale di come funziona il corso — non un video, ma un'esperienza interattiva"
            />
          </FadeIn>
          <FadeIn delay={120}>
            <DemoTutorExperience
              inline
              bannerText="🎓 Demo interattiva — Sicurezza sul Lavoro · 5 moduli · Tutor AI adattivo"
            />
          </FadeIn>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <SectionHeader
              title="Esempi di corsi realizzati"
              subtitle="Screenshot da corsi dimostrativi — ogni progetto è personalizzato per il cliente"
            />
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY.map(([src, category, title], index) => (
              <FadeIn key={src} delay={index * 60}>
                <div className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg shadow-slate-200/70">
                  <img src={src} alt={`${category} · ${title}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center bg-[rgba(37,99,235,0.8)] p-6 text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div>
                      <p className="text-sm font-semibold">{category}</p>
                      <p className="mt-1 text-xl font-extrabold">{title}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="mt-10 text-center text-sm italic text-[#64748b]">
            Le immagini mostrano corsi dimostrativi. I progetti reali vengono personalizzati con brand, contenuti e obiettivi del cliente.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <SectionHeader title="Domande frequenti" subtitle="" />
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
                    <div className="grid transition-[grid-template-rows] duration-300 ease-in-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
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

      <section className="py-20 px-4 bg-gradient-to-br from-[#2563EB] to-[#0EA5E9]">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="mb-4 text-[28px] sm:text-[32px] font-extrabold leading-tight text-white">
              Hai materiali da trasformare in un corso?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-[16px] leading-relaxed text-blue-100">
              Mandami quello che hai — PDF, PPT, Word. Ti rispondo entro 24 ore con una proposta.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/contatti" className="w-full rounded-xl bg-white px-10 py-4 text-[15px] font-bold text-[#2563EB] shadow-lg transition-all hover:scale-105 hover:bg-blue-50 hover:shadow-xl sm:w-auto">
                Scrivimi →
              </Link>
              <Link to="/" className="w-full rounded-xl border-2 border-white px-10 py-4 text-[15px] font-semibold text-white transition-all hover:bg-white/10 sm:w-auto">
                Torna alla home →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  )
}
