import { Link } from 'react-router-dom'

const services = [
  {
    icon: '🎬',
    gradient: 'from-blue-500 to-blue-700',
    glow: 'shadow-blue-200',
    badge: 'bg-blue-50 text-blue-600 border-blue-100',
    title: 'Corsi eLearning con AI',
    description: 'Creiamo corsi video interattivi con avatar AI, quiz e pacchetti SCORM pronti per qualsiasi LMS. Dalla sceneggiatura alla consegna.',
    href: '/servizi/corsi-elearning',
    tag: 'Più richiesto',
  },
  {
    icon: '🖥️',
    gradient: 'from-sky-400 to-blue-600',
    glow: 'shadow-sky-200',
    badge: 'bg-sky-50 text-sky-600 border-sky-100',
    title: 'Gestione LMS',
    description: 'Installiamo, configuriamo e gestiamo Moodle e altri LMS. Tu pensi ai contenuti, noi alla tecnologia.',
    href: '/servizi/gestione-lms',
    tag: null,
  },
  {
    icon: '📡',
    gradient: 'from-indigo-500 to-blue-600',
    glow: 'shadow-indigo-200',
    badge: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    title: 'Webinar e Lezioni Online',
    description: 'Organizziamo e gestiamo sessioni formative live su Zoom, Teams e Meet. Setup tecnico, diretta e registrazione inclusi.',
    href: '/servizi/webinar',
    tag: null,
  },
  {
    icon: '🌐',
    gradient: 'from-cyan-500 to-sky-600',
    glow: 'shadow-cyan-200',
    badge: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    title: 'Sviluppo Siti Formativi',
    description: 'Siti web moderni, veloci e integrabili con qualsiasi piattaforma LMS. Pensati per chi vende o eroga formazione.',
    href: '/servizi/siti-formativi',
    tag: null,
  },
]

export default function ServicesGrid() {
  return (
    <section className="py-24 px-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-blue-400" />
            Servizi
            <span className="w-8 h-px bg-blue-400" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            I nostri servizi
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Tutto quello che serve per la formazione digitale della tua azienda, in un unico posto.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map(({ icon, gradient, glow, badge, title, description, href, tag }) => (
            <Link
              key={title}
              to={href}
              className="group relative bg-white border border-slate-100 rounded-2xl p-7 hover:shadow-xl hover:shadow-blue-100 hover:border-blue-200 hover:-translate-y-1.5 transition-all flex flex-col gap-5 overflow-hidden"
            >
              {/* top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl`} />

              {tag && (
                <span className={`self-start text-xs font-semibold px-3 py-1 rounded-full border ${badge}`}>
                  {tag}
                </span>
              )}

              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg ${glow} group-hover:scale-110 transition-transform`}>
                {icon}
              </div>

              <div className="flex-1">
                <h3 className="text-slate-900 font-extrabold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                Scopri di più
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
