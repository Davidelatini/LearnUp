const points = [
  {
    icon: '🤝',
    title: 'Un solo partner per tutto',
    description: 'Corsi, piattaforma, webinar e sito. Niente fornitori multipli.',
  },
  {
    icon: '⚡',
    title: 'Consegna in 5–10 giorni',
    description: 'Tempi rapidi senza compromessi sulla qualità.',
  },
  {
    icon: '🔗',
    title: 'Compatibile con tutti gli LMS',
    description: 'SCORM 1.2, xAPI, Moodle, Docebo e molto altro.',
  },
  {
    icon: '🤖',
    title: 'Powered by AI',
    description: 'Tecnologia AI per contenuti professionali a costi accessibili.',
  },
]

export default function StrengthPoints() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-blue-400" />
            Vantaggi
            <span className="w-8 h-px bg-blue-400" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
            Perché scegliere LearnUp Studio
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {points.map(({ icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-5 bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md hover:shadow-blue-100 hover:border-blue-200 hover:-translate-y-1 transition-all group cursor-default"
            >
              <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {icon}
              </div>
              <div>
                <h3 className="text-slate-800 font-bold text-base mb-1">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
