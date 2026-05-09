import { useState } from 'react'

const steps = [
  {
    number: '01',
    title: 'Pre-produzione',
    optional: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5l-4 4-2-2" />
      </svg>
    ),
    description:
      'Analisi degli obiettivi formativi, definizione del pubblico, scrittura dello script e creazione dello storyboard. Tutto parte da una call conoscitiva gratuita.',
    tags: ['Storyboard', 'Script', 'Obiettivi formativi'],
    color: 'blue',
    detail: 'Nella fase di pre-produzione definiamo insieme il perimetro del progetto: chi è il tuo pubblico, cosa deve imparare e come misurare il successo. Il risultato è uno script validato e uno storyboard completo, pronti per la fase produttiva.',
  },
  {
    number: '02',
    title: 'Produzione',
    optional: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9.75a3 3 0 110 4.5" />
      </svg>
    ),
    description:
      'Registrazione video con avatar AI, generazione audio con voci AI in italiano, sviluppo contenuti interattivi e quiz. Il corso prende forma.',
    tags: ['Avatar AI', 'Audio AI', 'Quiz', 'Contenuti interattivi'],
    color: 'sky',
    detail: 'Utilizziamo avatar AI ad alta fedeltà e voci sintetiche in italiano per produrre video di qualità broadcast senza costi di studio. Ogni modulo include elementi interattivi — quiz, drag & drop, scenari ramificati — per massimizzare il coinvolgimento.',
  },
  {
    number: '03',
    title: 'Packaging SCORM',
    optional: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    description:
      'Il corso viene pacchettizzato in formato SCORM 1.2 o xAPI, testato su tutti i principali LMS e consegnato pronto all\'uso.',
    tags: ['SCORM 1.2', 'xAPI', 'Testing', 'Compatibilità LMS'],
    color: 'blue',
    detail: 'Il pacchetto finale è testato su Moodle, Docebo, TalentLMS, Cornerstone e altri LMS principali. Consegniamo un file .zip pronto all\'upload con documentazione tecnica inclusa e supporto all\'installazione.',
  },
  {
    number: '04',
    title: 'Installazione LMS',
    optional: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
      </svg>
    ),
    description:
      'Se non hai ancora una piattaforma, installiamo e configuriamo Moodle o integriamo con Docebo, TalentLMS e altri. Chiavi in mano.',
    tags: ['Moodle', 'Docebo', 'TalentLMS', 'Configurazione'],
    color: 'indigo',
    detail: 'Attiviamo l\'LMS in 72 ore, lo personalizziamo con il tuo brand e lo integriamo con il tuo gestionale HR. Se hai già una piattaforma, la usiamo direttamente. Se parti da zero, ti guidiamo nella scelta migliore per le tue esigenze.',
  },
  {
    number: '05',
    title: 'Gestione e manutenzione',
    optional: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    description:
      'Monitoriamo le statistiche di completamento, aggiorniamo i contenuti, gestiamo gli utenti e garantiamo il funzionamento continuo della piattaforma.',
    tags: ['Analytics', 'Aggiornamenti', 'Supporto', 'Reportistica'],
    color: 'sky',
    detail: 'Il servizio non finisce con la consegna. Forniamo report mensili sulle performance dei corsi, aggiornamenti dei contenuti quando le normative cambiano, gestione degli utenti e supporto tecnico H24. Sei sempre coperto.',
  },
]

const tagColors = {
  blue:   'bg-blue-50 text-blue-700 border-blue-200',
  sky:    'bg-sky-50 text-sky-700 border-sky-100',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

const activeColors = {
  blue:   { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-500', light: 'bg-blue-50', icon: 'text-blue-600' },
  sky:    { bg: 'bg-sky-500',  text: 'text-sky-600',  border: 'border-sky-400',  light: 'bg-sky-50',  icon: 'text-sky-600'  },
  indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-500', light: 'bg-indigo-50', icon: 'text-indigo-600' },
}

export default function HowWeWork() {
  const [active, setActive] = useState(0)
  const step = steps[active]
  const ac = activeColors[step.color]

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-blue-400" />
            Il nostro metodo
            <span className="w-8 h-px bg-blue-400" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            Come lavoriamo
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Un processo collaudato in 5 fasi per portare la tua formazione online in modo rapido, efficace e senza pensieri.
          </p>
        </div>

        {/* Dashboard */}
        <div className="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-xl shadow-blue-50">
          <div className="flex flex-col lg:flex-row min-h-[480px]">

            {/* Left — step list */}
            <div className="lg:w-72 xl:w-80 shrink-0 border-b-2 lg:border-b-0 lg:border-r-2 border-slate-100 bg-slate-50 p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
              {steps.map((s, i) => {
                const isActive = i === active
                return (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`shrink-0 lg:shrink flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all w-auto lg:w-full
                      ${isActive
                        ? 'bg-blue-600 shadow-md shadow-blue-200'
                        : 'hover:bg-white hover:shadow-sm'
                      }`}
                  >
                    {/* Number bubble */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-colors
                      ${isActive ? 'bg-white/20 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>
                      {s.number}
                    </div>

                    <div className="hidden sm:flex lg:flex flex-col min-w-0">
                      <span className={`text-sm font-bold leading-tight truncate transition-colors
                        ${isActive ? 'text-white' : 'text-slate-700'}`}>
                        {s.title}
                      </span>
                      {s.optional && (
                        <span className={`text-xs font-semibold mt-0.5 transition-colors
                          ${isActive ? 'text-blue-200' : 'text-sky-500'}`}>
                          opzionale
                        </span>
                      )}
                    </div>

                    {/* Active indicator dot on mobile */}
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-white/70 hidden lg:block shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Right — content panel */}
            <div className="flex-1 p-8 lg:p-12 flex flex-col justify-between">
              {/* Animated content — key forces remount on step change */}
              <div
                key={active}
                className="flex flex-col gap-6 animate-[fadeSlideIn_0.3s_ease_forwards]"
                style={{ animation: 'fadeSlideIn 0.28s ease forwards' }}
              >
                {/* Step number + badge */}
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black uppercase tracking-widest ${ac.text}`}>
                    Step {step.number}
                  </span>
                  {step.optional && (
                    <span className="text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      Opzionale
                    </span>
                  )}
                </div>

                {/* Icon + title */}
                <div className="flex items-start gap-5">
                  <div className={`w-16 h-16 ${ac.light} rounded-2xl flex items-center justify-center p-3.5 shrink-0 border ${ac.border}`}>
                    <div className={ac.icon}>
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Detail text */}
                <p className={`text-sm leading-relaxed pl-5 border-l-4 ${ac.border} text-slate-600 italic`}>
                  {step.detail}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${tagColors[step.color]}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom nav */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
                <button
                  onClick={() => setActive((a) => Math.max(0, a - 1))}
                  disabled={active === 0}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Precedente
                </button>

                {/* Dot indicators */}
                <div className="flex gap-2">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`rounded-full transition-all ${
                        i === active
                          ? 'w-6 h-2.5 bg-blue-600'
                          : 'w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActive((a) => Math.min(steps.length - 1, a + 1))}
                  disabled={active === steps.length - 1}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  Successivo
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* CTA bottom */}
        <div className="text-center mt-10">
          <p className="text-slate-400 text-sm mb-4">Pronto a iniziare? La prima call è gratuita e senza impegno.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-200 shadow-md">
            Prenota una call gratuita →
          </button>
        </div>

      </div>

      {/* Keyframe animation via a style tag — Tailwind doesn't ship arbitrary keyframes */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
