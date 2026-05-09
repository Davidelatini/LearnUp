import aiRobotImg from '../assets/techny-lettering-artificial-intelligence-with-tablet-robot-and-gears-text.png'

const resources = [
  {
    icon: '📖',
    title: 'Guide e Tutorial',
    description: 'Risorse gratuite su come progettare corsi e-learning efficaci, gestire un LMS e misurare i risultati della formazione.',
    cta: 'Esplora le risorse',
    color: 'blue',
  },
  {
    icon: '👥',
    title: 'Community HR & L&D',
    description: 'Entra nella community italiana di HR manager e formatori aziendali. Condividi esperienze e best practice.',
    cta: 'Unisciti alla community',
    color: 'sky',
  },
  {
    icon: '🎓',
    title: 'LearnUp Academy',
    description: 'Formazione gratuita per i nostri clienti: come usare Moodle, creare contenuti efficaci e gestire la formazione aziendale.',
    cta: 'Accedi all\'Academy',
    color: 'indigo',
  },
]

const colorMap = {
  blue:   { border: 'border-blue-100', icon: 'bg-blue-50 border-blue-200', btn: 'bg-blue-600 hover:bg-blue-700' },
  sky:    { border: 'border-sky-100', icon: 'bg-sky-50 border-sky-200', btn: 'bg-sky-500 hover:bg-sky-600' },
  indigo: { border: 'border-indigo-100', icon: 'bg-indigo-50 border-indigo-200', btn: 'bg-indigo-600 hover:bg-indigo-700' },
}

export default function GetStarted() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center gap-8 mb-14">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-blue-400" />
              Risorse gratuite
              <span className="w-8 h-px bg-blue-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
              Tutto il supporto che ti serve
              <br />
              <span className="text-blue-600">per crescere nella formazione</span>
            </h2>
          </div>
          <div className="shrink-0 w-full max-w-xs lg:max-w-sm">
            <img src={aiRobotImg} alt="AI e formazione" className="w-full object-contain" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map(({ icon, title, description, cta, color }) => {
            const c = colorMap[color]
            return (
              <div
                key={title}
                className={`bg-white border-2 ${c.border} rounded-2xl p-7 flex flex-col hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 transition-all`}
              >
                <div className={`w-14 h-14 rounded-2xl border ${c.icon} flex items-center justify-center text-3xl mb-5`}>
                  {icon}
                </div>
                <h3 className="text-slate-900 font-extrabold text-xl mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-6">{description}</p>
                <button className={`${c.btn} text-white font-semibold py-3 px-5 rounded-xl text-sm transition-colors`}>
                  {cta} →
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
