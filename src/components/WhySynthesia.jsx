const reasons = [
  {
    icon: '🎓',
    headline: 'No skills or equipment needed',
    body: 'Over 90% of Synthesia users publish their first video without watching a tutorial. Our intuitive platform handles the complexity.',
    stat: '90%',
    statLabel: 'publish first video without tutorial',
    color: 'indigo',
  },
  {
    icon: '🔒',
    headline: 'Enterprise-grade security',
    body: 'SOC2 Type II certified. GDPR compliant. ISO 42001 AI safety certified. SAML/SSO. Built for Fortune 100 requirements.',
    stat: '100%',
    statLabel: 'Fortune 100 compliant',
    color: 'emerald',
  },
  {
    icon: '💡',
    headline: 'One platform, zero extras',
    body: 'One budget, one login. Replace agencies, studios, freelancers, and separate tools with a single unified workflow.',
    stat: '90%',
    statLabel: 'cost reduction on average',
    color: 'violet',
  },
]

const colorMap = {
  indigo: { border: 'border-indigo-500/20', bg: 'bg-indigo-500/10', text: 'text-indigo-400', icon: 'bg-indigo-600/20 border-indigo-500/40' },
  emerald: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: 'bg-emerald-600/20 border-emerald-500/40' },
  violet: { border: 'border-violet-500/20', bg: 'bg-violet-500/10', text: 'text-violet-400', icon: 'bg-violet-600/20 border-violet-500/40' },
}

export default function WhySynthesia() {
  return (
    <section className="py-24 px-4 bg-[#05050f]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-sm text-indigo-400 font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-indigo-500" />
            Why Synthesia
            <span className="w-8 h-px bg-indigo-500" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            The complete AI video
            <br />
            <span className="text-indigo-400">solution for business</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {reasons.map(({ icon, headline, body, stat, statLabel, color }) => {
            const c = colorMap[color]
            return (
              <div
                key={headline}
                className={`bg-gradient-to-br from-[#0d0d20] to-[#0a0a18] border ${c.border} rounded-3xl p-8 hover:scale-[1.01] transition-transform`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl border ${c.icon} flex items-center justify-center text-3xl mb-6`}>
                  {icon}
                </div>
                {/* Stat */}
                <div className={`text-5xl font-black ${c.text} mb-1`}>{stat}</div>
                <div className="text-gray-500 text-sm mb-6">{statLabel}</div>
                {/* Content */}
                <h3 className="text-white font-bold text-xl mb-3">{headline}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
