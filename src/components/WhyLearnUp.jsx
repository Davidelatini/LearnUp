import laptopImg from '../assets/laptop-displaying-financial-dashboard-online-stock-trading-and-monitoring.png'
import lockImg from '../assets/techny-secure-lock-and-key-successfully-unlocked.png'

const reasons = [
  {
    icon: '🎯',
    headline: 'Un partner, non un fornitore',
    body: 'Non vendiamo solo software. Affianchiamo ogni cliente con un project manager dedicato che conosce la tua azienda, i tuoi obiettivi e il tuo settore.',
    stat: '1',
    statSuffix: 'PM dedicato',
    statLabel: 'per ogni cliente',
    color: 'blue',
  },
  {
    icon: '⚡',
    headline: 'Tempi di consegna certi',
    body: 'Il primo corso va online in meno di 4 settimane. Il Moodle è operativo entro 72 ore. Rispettiamo sempre le deadline, senza eccezioni.',
    stat: '72h',
    statSuffix: '',
    statLabel: 'attivazione LMS garantita',
    color: 'sky',
  },
  {
    icon: '🔒',
    headline: 'Conformità garantita',
    body: 'Tutti i materiali rispettano D.Lgs. 81/08, GDPR, normative ANPAL e standard SCORM. La tua formazione obbligatoria è sempre a norma di legge.',
    stat: '100%',
    statSuffix: '',
    statLabel: 'compliance normativa',
    color: 'indigo',
  },
]

const colorMap = {
  blue:   { border: 'border-blue-100', icon: 'bg-blue-50 border-blue-200', stat: 'text-blue-600', badge: 'bg-blue-50 text-blue-600' },
  sky:    { border: 'border-sky-100', icon: 'bg-sky-50 border-sky-200', stat: 'text-sky-600', badge: 'bg-sky-50 text-sky-600' },
  indigo: { border: 'border-indigo-100', icon: 'bg-indigo-50 border-indigo-200', stat: 'text-indigo-600', badge: 'bg-indigo-50 text-indigo-600' },
}

export default function WhyLearnUp() {
  return (
    <section className="py-20 px-5 md:px-12 lg:px-20 bg-white">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[13px] text-blue-600 font-semibold uppercase tracking-[0.15em] mb-4">
            <span className="w-8 h-px bg-blue-400" />
            Perché sceglierci
            <span className="w-8 h-px bg-blue-400" />
          </div>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[52px] font-extrabold text-slate-900 mb-4 leading-tight">
            La formazione e-learning
            <br />
            <span className="text-blue-600">che fa davvero la differenza</span>
          </h2>
          <p className="text-slate-500 text-[18px] max-w-2xl mx-auto leading-[1.7]">
            Non siamo una piattaforma generica. Siamo specialisti della formazione aziendale con anni di esperienza sul campo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {reasons.map(({ icon, headline, body, stat, statSuffix, statLabel, color }) => {
            const c = colorMap[color]
            const isSecure = headline.includes('Conformità')
            return (
              <div
                key={headline}
                className={`bg-white border-2 ${c.border} rounded-3xl p-8 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 transition-all overflow-hidden relative`}
              >
                {isSecure && (
                  <img
                    src={lockImg}
                    alt="Sicurezza"
                    className="absolute -right-4 -bottom-4 w-32 opacity-20 pointer-events-none select-none"
                  />
                )}
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl border ${c.icon} flex items-center justify-center text-3xl mb-6`}>
                  {icon}
                </div>
                {/* Stat */}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-5xl font-black ${c.stat}`}>{stat}</span>
                  {statSuffix && <span className={`text-xl font-bold ${c.stat}`}>{statSuffix}</span>}
                </div>
                <div className="text-slate-400 text-sm mb-6">{statLabel}</div>
                {/* Content */}
                <h3 className="text-slate-900 font-extrabold text-xl mb-3">{headline}</h3>
                <p className="text-slate-500 text-[15px] leading-[1.7]">{body}</p>
              </div>
            )
          })}
        </div>

        {/* Extra proof bar con laptop */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-sky-500 rounded-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="flex-1 px-8 py-8 flex flex-col sm:flex-row items-center justify-around gap-6">
              {[
                { value: '200+', label: 'Aziende clienti' },
                { value: '1.500+', label: 'Corsi prodotti' },
                { value: '98%', label: 'Rinnovo contratti' },
                { value: '4.9/5', label: 'Soddisfazione media' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center text-white">
                  <div className="text-3xl sm:text-4xl font-black">{value}</div>
                  <div className="text-blue-100 text-sm mt-1">{label}</div>
                </div>
              ))}
            </div>
            <div className="shrink-0 w-full lg:w-72 lg:self-end">
              <img
                src={laptopImg}
                alt="Dashboard LearnUp"
                className="w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
