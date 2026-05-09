const techs = [
  { name: 'Moodle', icon: '🎓' },
  { name: 'Synthesia', icon: '🎥' },
  { name: 'SCORM', icon: '📦' },
  { name: 'xAPI', icon: '📡' },
  { name: 'Zoom', icon: '💬' },
  { name: 'Google Meet', icon: '📹' },
  { name: 'HeyGen', icon: '🤖' },
]

export default function TechStack() {
  return (
    <section className="py-16 px-4 bg-slate-50 border-y border-slate-100">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-slate-500 text-sm font-semibold uppercase tracking-widest mb-10">
          Le tecnologie che utilizziamo
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {techs.map(({ name, icon }) => (
            <div
              key={name}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-sm sm:text-base transition-colors cursor-default"
            >
              <span className="text-xl">{icon}</span>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
