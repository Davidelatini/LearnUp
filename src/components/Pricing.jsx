import { useState } from 'react'
import rocketImg from '../assets/techny-rocket.png'

const plans = [
  {
    name: 'Starter',
    icon: '🌱',
    price: { monthly: 490, annual: 390 },
    description: 'Perfetto per PMI che muovono i primi passi nella formazione digitale.',
    color: 'blue',
    features: [
      'LMS Moodle configurato e gestito',
      'Fino a 100 utenti attivi',
      '3 corsi e-learning inclusi/anno',
      'Template predefiniti (sicurezza, compliance)',
      'Supporto via email entro 24h',
      'Report mensili automatici',
      'Storage 20 GB',
    ],
    notIncluded: ['Video animati custom', 'Integrazioni HR avanzate', 'App mobile branded'],
    cta: 'Inizia con Starter',
  },
  {
    name: 'Business',
    icon: '🚀',
    price: { monthly: 990, annual: 790 },
    description: 'La scelta più popolare per aziende in crescita con esigenze formative strutturate.',
    color: 'blue',
    popular: true,
    features: [
      'LMS Moodle dedicato e personalizzato',
      'Fino a 500 utenti attivi',
      '10 corsi e-learning inclusi/anno',
      'Video e animazioni custom',
      'Gamification e badge',
      'Integrazione HR (Zucchetti, SAP, Personio)',
      'Supporto prioritario H24',
      'Report avanzati e dashboard',
      'Storage 100 GB',
      'Multilingua fino a 3 lingue',
    ],
    notIncluded: ['App mobile branded', 'Sviluppo applicativi custom'],
    cta: 'Scegli Business',
  },
  {
    name: 'Enterprise',
    icon: '🏢',
    price: null,
    description: 'Soluzione su misura per grandi aziende con esigenze complesse e strutturate.',
    color: 'slate',
    features: [
      'Utenti illimitati',
      'Corsi illimitati, produzione dedicata',
      'App mobile branded iOS & Android',
      'Sviluppo applicativi didattici custom',
      'Serious game e simulatori',
      'Integrazione con qualsiasi sistema HR',
      'SLA garantito 99.9% uptime',
      'Project manager dedicato',
      'Formazione dei formatori inclusa',
      'Multilingua illimitato',
      'Storage illimitato',
      'Compliance normativa personalizzata',
    ],
    notIncluded: [],
    cta: 'Parla con un esperto',
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white" id="prezzi">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-blue-400" />
            Prezzi
            <span className="w-8 h-px bg-blue-400" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            Piani chiari e trasparenti
            <br />
            <span className="text-blue-600">senza sorprese</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto mb-8">
            Scegli il piano adatto alla tua azienda. Tutti i piani includono onboarding guidato e supporto dedicato.
          </p>

          {/* Toggle annuale/mensile */}
          <div className="inline-flex items-center gap-3 bg-slate-100 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!annual ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
            >
              Mensile
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${annual ? 'bg-white shadow text-slate-800' : 'text-slate-500'} flex items-center gap-2`}
            >
              Annuale
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">–20%</span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {plans.map(({ name, icon, price, description, features, notIncluded, cta, popular }) => (
            <div
              key={name}
              className={`relative bg-white rounded-3xl border-2 overflow-hidden transition-all hover:shadow-xl ${
                popular
                  ? 'border-blue-500 shadow-2xl shadow-blue-100 scale-[1.02]'
                  : 'border-slate-200 hover:border-blue-200'
              }`}
            >
              {popular && (
                <>
                  <div className="bg-blue-600 text-white text-xs font-bold text-center py-2 tracking-wider uppercase">
                    ⭐ Più scelto dalle aziende
                  </div>
                  <img
                    src={rocketImg}
                    alt="Rocket"
                    className="absolute -right-2 top-10 w-20 opacity-15 pointer-events-none select-none"
                  />
                </>
              )}

              <div className="p-8">
                {/* Plan header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{icon}</span>
                  <h3 className="text-xl font-extrabold text-slate-900">{name}</h3>
                </div>
                <p className="text-slate-500 text-sm mb-6">{description}</p>

                {/* Price */}
                {price ? (
                  <div className="mb-8">
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-black text-slate-900">
                        €{annual ? price.annual : price.monthly}
                      </span>
                      <span className="text-slate-400 text-sm mb-2">/mese</span>
                    </div>
                    {annual && (
                      <div className="text-emerald-600 text-sm font-medium mt-1">
                        Fatturato annualmente — risparmi €{(price.monthly - price.annual) * 12}/anno
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-8">
                    <div className="text-3xl font-black text-slate-900">Su misura</div>
                    <div className="text-slate-400 text-sm mt-1">Preventivo personalizzato</div>
                  </div>
                )}

                {/* CTA */}
                <button
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all mb-8 ${
                    popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 hover:scale-105'
                      : 'bg-slate-900 hover:bg-slate-700 text-white'
                  }`}
                >
                  {cta}
                </button>

                {/* Features */}
                <div className="space-y-2.5">
                  {features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700 text-sm">{f}</span>
                    </div>
                  ))}
                  {notIncluded.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-slate-400 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-slate-400 text-sm mt-8">
          Tutti i prezzi sono IVA esclusa. Hai bisogno di qualcosa di specifico?{' '}
          <a href="#" className="text-blue-600 font-semibold hover:underline">Contattaci</a> per un preventivo su misura.
        </p>
      </div>
    </section>
  )
}
