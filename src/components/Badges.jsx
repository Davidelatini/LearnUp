const badges = [
  { icon: '🎓', title: 'Certified Moodle Partner', sub: 'LMS ufficiale', color: 'blue' },
  { icon: '🔒', title: 'GDPR Compliant', sub: 'Privacy & sicurezza', color: 'emerald' },
  { icon: '✅', title: 'SCORM Certified', sub: 'Standard e-learning', color: 'sky' },
  { icon: '⚖️', title: 'D.Lgs. 81/08', sub: 'Formazione sicurezza', color: 'indigo' },
  { icon: '🏆', title: 'ISO 9001:2015', sub: 'Qualità certificata', color: 'violet' },
]

const colorMap = {
  blue:    'bg-blue-50 border-blue-200 text-blue-700',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  sky:     'bg-sky-50 border-sky-200 text-sky-700',
  indigo:  'bg-indigo-50 border-indigo-200 text-indigo-700',
  violet:  'bg-violet-50 border-violet-200 text-violet-700',
}

export default function Badges() {
  return (
    <section className="py-16 px-4 bg-slate-50 border-y border-slate-100">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-slate-400 text-sm font-medium uppercase tracking-widest mb-10">
          Certificazioni e riconoscimenti
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          {badges.map(({ icon, title, sub, color }) => (
            <div
              key={title}
              className={`flex items-center gap-3 ${colorMap[color]} border rounded-2xl px-5 py-4 hover:shadow-md transition-shadow`}
            >
              <span className="text-2xl">{icon}</span>
              <div>
                <div className="font-bold text-sm">{title}</div>
                <div className="text-xs opacity-70 mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
