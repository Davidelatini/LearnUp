const steps = [
  {
    number: '01',
    icon: '📞',
    title: 'Briefing gratuito',
    description: 'Analizziamo insieme le tue esigenze formative in una call di 20 minuti',
  },
  {
    number: '02',
    icon: '🤖',
    title: 'Produzione con AI',
    description: 'Creiamo i tuoi contenuti con tecnologia AI in tempi rapidi',
  },
  {
    number: '03',
    icon: '🚀',
    title: 'Consegna e supporto',
    description: 'Rilasciamo tutto pronto all\'uso e ti supportiamo nel tempo',
  },
]

export default function WorkProcess() {
  return (
    <section className="py-24 px-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-blue-400" />
            Il processo
            <span className="w-8 h-px bg-blue-400" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
            Come lavoriamo
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          {/* connector line — visible on sm+ */}
          <div className="hidden sm:block absolute top-10 left-1/3 right-1/3 h-px bg-blue-200" style={{ zIndex: 0 }} />

          {steps.map(({ number, icon, title, description }, idx) => (
            <div key={number} className="relative flex flex-col items-center text-center gap-4 z-10">
              {/* connector dots */}
              {idx < steps.length - 1 && (
                <div className="hidden sm:block absolute top-10 -right-4 w-8 h-px bg-blue-200" />
              )}
              <div className="w-20 h-20 rounded-full bg-blue-600 flex flex-col items-center justify-center shadow-lg shadow-blue-200">
                <span className="text-xs font-bold text-blue-100 leading-none">{number}</span>
                <span className="text-2xl leading-none mt-0.5">{icon}</span>
              </div>
              <div>
                <h3 className="text-slate-800 font-bold text-base mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
