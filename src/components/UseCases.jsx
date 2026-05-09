import { useState } from 'react'
import courseGif from '../assets/online-course-text-on-tablet-screen-remote-learning-setup.gif'

const useCases = [
  {
    tab: 'Creazione Corsi',
    icon: '📚',
    headline: 'Corsi e-learning professionali, pronti in tempi record',
    description: 'Progettiamo e sviluppiamo corsi e-learning interattivi su misura per la tua azienda. Dalla sceneggiatura alla pubblicazione, gestiamo tutto noi: video, quiz, simulazioni, scenari ramificati e molto altro.',
    quote: '"In 6 settimane LearnUp ha digitalizzato 18 mesi di formazione manuale. I nostri trainer ora si concentrano su ciò che conta davvero."',
    author: 'Marco R., HR Manager @ Fincantieri',
    tags: ['SCORM & xAPI', 'Video e animazioni', 'Quiz interattivi', 'Microlearning', 'Gamification'],
    color: 'blue',
  },
  {
    tab: 'LMS Moodle',
    icon: '⚙️',
    headline: 'Il tuo LMS Moodle gestito, configurato e ottimizzato',
    description: 'Installiamo, personalizziamo e gestiamo la tua piattaforma Moodle al 100%. Aggiornamenti, sicurezza, integrazioni HR, reportistica avanzata e supporto tecnico dedicato. Tu formI, noi gestiamo la tecnologia.',
    quote: '"Prima perdevamo 2 giorni al mese a gestire il Moodle. Oggi è tutto automatico e funziona sempre perfettamente."',
    author: 'Alberto F., IT Lead @ Generali',
    tags: ['Hosting dedicato', 'Personalizzazione grafica', 'Integrazione HR', 'Backup automatici', 'Supporto H24'],
    color: 'sky',
  },
  {
    tab: 'Applicativi Didattici',
    icon: '💻',
    headline: 'Software e app su misura per la formazione',
    description: 'Sviluppiamo applicativi web e mobile personalizzati per la formazione aziendale: simulatori, serious game, strumenti di assessment, chatbot didattici e portali formativi completamente custom.',
    quote: '"Il simulatore di vendita che ci ha sviluppato LearnUp ha migliorato le performance del nostro team del 40% in tre mesi."',
    author: 'Sara P., CPO @ Enel',
    tags: ['Web App', 'Mobile App', 'Serious Games', 'Simulatori', 'Chatbot didattici'],
    color: 'indigo',
  },
  {
    tab: 'Materiali Didattici',
    icon: '🎨',
    headline: 'Materiali formativi visivi, chiari e coinvolgenti',
    description: 'Progettiamo tutti i materiali di supporto alla formazione: slide, infografiche, video tutorial, manuali interattivi, schede operative, poster e comunicazioni interne che i tuoi dipendenti vogliono davvero leggere.',
    quote: '"I materiali prodotti da LearnUp hanno un livello qualitativo che prima non pensavamo possibile con il nostro budget."',
    author: 'Lucia B., L&D Director @ TIM',
    tags: ['Slide & presentazioni', 'Infografiche', 'Video tutorial', 'Manuali digitali', 'Schede operative'],
    color: 'cyan',
  },
]

const colorMap = {
  blue:   { active: 'bg-blue-600 text-white shadow-blue-200', tag: 'bg-blue-50 text-blue-700 border-blue-200', bar: 'bg-blue-500', border: 'border-blue-100', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  sky:    { active: 'bg-sky-500 text-white shadow-sky-200', tag: 'bg-sky-50 text-sky-700 border-sky-200', bar: 'bg-sky-500', border: 'border-sky-100', badge: 'bg-sky-50 text-sky-700 border-sky-200' },
  indigo: { active: 'bg-indigo-600 text-white shadow-indigo-200', tag: 'bg-indigo-50 text-indigo-700 border-indigo-200', bar: 'bg-indigo-500', border: 'border-indigo-100', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  cyan:   { active: 'bg-cyan-600 text-white shadow-cyan-200', tag: 'bg-cyan-50 text-cyan-700 border-cyan-200', bar: 'bg-cyan-500', border: 'border-cyan-100', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
}

export default function UseCases() {
  const [active, setActive] = useState(0)
  const uc = useCases[active]
  const c = colorMap[uc.color]

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-blue-400" />
            I nostri servizi
            <span className="w-8 h-px bg-blue-400" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            Tutto ciò che serve alla tua
            <br />
            <span className="text-blue-600">formazione aziendale</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Dalla strategia all'esecuzione: un partner unico per ogni aspetto della tua formazione e-learning.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {useCases.map((u, i) => {
            const isActive = i === active
            const colors = colorMap[u.color]
            return (
              <button
                key={u.tab}
                onClick={() => setActive(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? `${colors.active} shadow-lg`
                    : 'text-slate-500 border border-slate-200 hover:border-blue-300 hover:text-blue-600 bg-white'
                }`}
              >
                <span>{u.icon}</span>
                {u.tab}
              </button>
            )
          })}
        </div>

        {/* Content card */}
        <div className={`bg-white border ${c.border} rounded-3xl overflow-hidden shadow-lg shadow-blue-50`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: text */}
            <div className="p-10 flex flex-col justify-center">
              <div className={`inline-flex items-center gap-2 ${c.badge} border rounded-full px-3 py-1 w-fit mb-6`}>
                <span className="text-lg">{uc.icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider">{uc.tab}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">{uc.headline}</h3>
              <p className="text-slate-500 leading-relaxed mb-8">{uc.description}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {uc.tags.map((tag) => (
                  <span key={tag} className={`text-xs font-medium ${c.tag} border px-3 py-1 rounded-full`}>
                    {tag}
                  </span>
                ))}
              </div>
              <blockquote className="border-l-4 border-blue-400 pl-5 bg-blue-50 rounded-r-xl py-3 pr-4">
                <p className="text-slate-700 italic text-sm leading-relaxed mb-2">{uc.quote}</p>
                <footer className="text-slate-400 text-xs">{uc.author}</footer>
              </blockquote>
            </div>

            {/* Right: visual */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 p-8 flex items-center justify-center border-l border-slate-100">
              <div className="w-full max-w-sm">
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
                  <img
                    src={courseGif}
                    alt="Corso e-learning su tablet"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
