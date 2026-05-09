const companies = [
  'Gruppo Fincantieri',
  'TIM',
  'Generali',
  'Enel',
  'Ferrovie dello Stato',
  'UniCredit',
  'A2A',
  'Poste Italiane',
  'Leonardo S.p.A.',
  'Eni',
  'Intesa Sanpaolo',
  'Mediaset',
]

export default function Logos() {
  return (
    <section className="py-16 bg-white border-y border-slate-100 overflow-hidden">
      {/* Label */}
      <div className="flex items-center justify-center gap-4 mb-10 px-4">
        <span className="flex-1 max-w-[120px] h-px bg-gradient-to-r from-transparent to-slate-200" />
        <p className="text-center text-slate-400 text-xs font-semibold uppercase tracking-[0.2em]">
          Scelto da oltre 200 aziende in tutta Italia
        </p>
        <span className="flex-1 max-w-[120px] h-px bg-gradient-to-l from-transparent to-slate-200" />
      </div>

      {/* Marquee wrapper */}
      <div className="relative">
        {/* Gradient fade left */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, white, transparent)' }}
        />
        {/* Gradient fade right */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, white, transparent)' }}
        />

        {/* Track */}
        <div className="flex" style={{ animation: 'logosScroll 28s linear infinite' }}>
          {/* Duplicated twice for seamless loop */}
          {[...companies, ...companies].map((name, i) => (
            <LogoChip key={i} name={name} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes logosScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .logos-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}

function LogoChip({ name }) {
  return (
    <div className="flex-shrink-0 mx-5 flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm transition-all duration-200 group cursor-default whitespace-nowrap">
      {/* Decorative dot */}
      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-400 transition-colors flex-shrink-0" />
      <span className="text-slate-500 group-hover:text-blue-700 font-semibold text-sm tracking-wide transition-colors">
        {name}
      </span>
    </div>
  )
}
