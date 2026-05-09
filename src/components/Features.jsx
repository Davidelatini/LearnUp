import aiGif from '../assets/artificial-intelligence-analytics-on-tablet-screen.gif'

const features = [
  { icon: '🎬', title: 'Video e animazioni', description: 'Produciamo video didattici professionali, screencast e animazioni 2D/3D su ogni argomento.', color: 'blue' },
  { icon: '🧩', title: 'SCORM & xAPI', description: 'Tutti i corsi sono compatibili con qualsiasi LMS tramite standard SCORM 1.2, 2004 e xAPI.', color: 'sky' },
  { icon: '📱', title: 'Mobile-first', description: 'Corsi ottimizzati per smartphone e tablet. La formazione ovunque e in qualsiasi momento.', color: 'indigo' },
  { icon: '🎮', title: 'Gamification', description: 'Badge, punti, classifiche e ricompense per aumentare engagement e motivazione.', color: 'violet' },
  { icon: '📊', title: 'Reportistica avanzata', description: 'Dashboard con dati in tempo reale: completamenti, punteggi, tempi e analisi per dipendente.', color: 'cyan' },
  { icon: '🔗', title: 'Integrazione HR', description: 'Collegamento nativo con Zucchetti, SAP HR, Personio, BambooHR e tutti i principali gestionali.', color: 'teal' },
  { icon: '🔒', title: 'Sicurezza & Privacy', description: 'Hosting in data center italiani, GDPR compliant, backup giornalieri e accesso SSO/SAML.', color: 'blue' },
  { icon: '📋', title: 'Corsi obbligatori', description: 'Template pronti per formazione sicurezza (D.Lgs. 81/08), antincendio, privacy e compliance.', color: 'sky' },
  { icon: '🌐', title: 'Multilingua', description: 'Corsi disponibili in italiano, inglese, spagnolo, francese e ogni altra lingua su richiesta.', color: 'indigo' },
  { icon: '🤝', title: 'Supporto dedicato', description: 'Un project manager dedicato, supporto tecnico H24 e aggiornamenti continui inclusi.', color: 'violet' },
]

const colorMap = {
  blue:   'bg-blue-50 text-blue-600 border-blue-200',
  sky:    'bg-sky-50 text-sky-600 border-sky-200',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  violet: 'bg-violet-50 text-violet-600 border-violet-200',
  cyan:   'bg-cyan-50 text-cyan-600 border-cyan-200',
  teal:   'bg-teal-50 text-teal-600 border-teal-200',
}

export default function Features() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center gap-10 mb-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-blue-400" />
              Funzionalità
              <span className="w-8 h-px bg-blue-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
              Una piattaforma completa
              <br />
              <span className="text-blue-600">per ogni esigenza formativa</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl">
              Tutto ciò che serve per creare, distribuire e misurare la formazione aziendale — senza compromessi.
            </p>
          </div>
          <div className="shrink-0 w-full max-w-xs lg:max-w-sm rounded-2xl overflow-hidden shadow-xl border border-slate-100">
            <img src={aiGif} alt="AI analytics" className="w-full object-cover" />
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {features.map(({ icon, title, description, color }) => (
            <div
              key={title}
              className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:shadow-blue-100 hover:border-blue-200 hover:-translate-y-1 transition-all group cursor-default"
            >
              <div className={`w-11 h-11 rounded-xl border ${colorMap[color]} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <h3 className="text-slate-800 font-bold text-sm mb-2">{title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
