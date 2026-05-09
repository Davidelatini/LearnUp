import dashboardGif from '../assets/tablet-dashboard-with-charts-and-graphs-business-performance-monitoring.gif'

const testimonials = [
  {
    company: 'Fincantieri',
    quote: 'LearnUp ha rivoluzionato la nostra formazione. Abbiamo ridotto i costi del 60% e aumentato il completamento dei corsi.',
    name: 'Marco R.',
    role: 'HR Manager',
    color: 'from-blue-50 to-blue-50/50',
    accent: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    border: 'border-blue-100',
  },
  {
    company: 'TIM',
    quote: 'I corsi e-learning creati da LearnUp sono di qualità eccellente. I nostri dipendenti li completano con piacere.',
    name: 'Lucia B.',
    role: 'L&D Director',
    color: 'from-sky-50 to-sky-50/50',
    accent: 'text-sky-700',
    badge: 'bg-sky-100 text-sky-700',
    border: 'border-sky-100',
  },
  {
    company: 'Generali',
    quote: 'La gestione del Moodle affidata a LearnUp ci ha liberato da un peso enorme. Tutto funziona perfettamente.',
    name: 'Alberto F.',
    role: 'IT & Training Lead',
    color: 'from-indigo-50 to-indigo-50/50',
    accent: 'text-indigo-700',
    badge: 'bg-indigo-100 text-indigo-700',
    border: 'border-indigo-100',
  },
  {
    company: 'Enel',
    quote: 'In 3 mesi LearnUp ha digitalizzato tutta la nostra formazione obbligatoria. Risultati incredibili.',
    name: 'Sara P.',
    role: 'Chief People Officer',
    color: 'from-cyan-50 to-cyan-50/50',
    accent: 'text-cyan-700',
    badge: 'bg-cyan-100 text-cyan-700',
    border: 'border-cyan-100',
  },
]

export default function TrustSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-blue-400" />
            Clienti soddisfatti
            <span className="w-8 h-px bg-blue-400" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            Le aziende che ci scelgono
            <br />
            <span className="text-blue-600">crescono più velocemente</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Oltre 200 aziende italiane affidano a LearnUp tutta la loro formazione e-learning.
          </p>
        </div>

        {/* Dashboard visual + rating bar */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-14">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-100 w-full max-w-xs shrink-0">
            <img src={dashboardGif} alt="Dashboard analytics" className="w-full object-cover" />
          </div>
          <div className="flex items-center justify-center gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 flex items-center gap-5 shadow-sm">
            <div>
              <div className="text-yellow-500 text-2xl font-bold">4.9 / 5</div>
              <div className="text-yellow-400 text-sm">★★★★★</div>
            </div>
            <div className="w-px h-10 bg-slate-100" />
            <div>
              <div className="text-slate-800 font-semibold">500+</div>
              <div className="text-slate-400 text-sm">Recensioni verificate</div>
            </div>
            <div className="w-px h-10 bg-slate-100" />
            <div>
              <div className="text-slate-800 font-semibold">200+</div>
              <div className="text-slate-400 text-sm">Aziende clienti</div>
            </div>
          </div>
        </div>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map(({ company, quote, name, role, color, accent, badge, border }) => (
            <div
              key={company}
              className={`bg-gradient-to-br ${color} border ${border} rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 transition-all`}
            >
              <div>
                <div className={`text-xs font-bold uppercase tracking-widest ${badge} rounded-full px-3 py-1 w-fit mb-4`}>{company}</div>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">"{quote}"</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/80">
                <div className={`w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700`}>
                  {name[0]}
                </div>
                <div>
                  <div className="text-slate-800 text-xs font-semibold">{name}</div>
                  <div className="text-slate-400 text-xs">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
