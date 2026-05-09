import { useState } from 'react'

const avatars = [
  { id: 'alex', name: 'Alex', color: 'from-indigo-500 to-blue-500' },
  { id: 'julia', name: 'Julia', color: 'from-pink-500 to-rose-500' },
  { id: 'joshua', name: 'Joshua', color: 'from-amber-500 to-orange-500' },
]

export default function FreeDemo() {
  const [selectedAvatar, setSelectedAvatar] = useState('alex')
  const [script, setScript] = useState('')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !script) return
    setSubmitted(true)
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-[#0a0a1f] to-[#05050f]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-sm text-indigo-400 font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-indigo-500" />
            Try It Free
            <span className="w-8 h-px bg-indigo-500" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Create your free AI video
            <br />
            <span className="text-indigo-400">in minutes</span>
          </h2>
          <p className="text-gray-400 text-lg">You'll receive your video via email. No credit card required.</p>
        </div>

        <div className="bg-gradient-to-br from-[#0d0d20] to-[#0a0a18] border border-white/10 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Form */}
            <div className="p-8 lg:p-10">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">Your video is being created!</h3>
                  <p className="text-gray-400">Check your email in a few minutes for the finished video.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Avatar selection */}
                  <div>
                    <label className="text-gray-400 text-sm font-medium mb-3 block">Choose your AI Avatar</label>
                    <div className="flex gap-3">
                      {avatars.map(({ id, name, color }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedAvatar(id)}
                          className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                            selectedAvatar === id
                              ? 'border-indigo-500 bg-indigo-600/20'
                              : 'border-white/10 bg-white/5 hover:border-white/30'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold`}>
                            {name[0]}
                          </div>
                          <span className="text-xs text-white font-medium">{name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Script textarea */}
                  <div>
                    <label className="text-gray-400 text-sm font-medium mb-2 block">Your script</label>
                    <textarea
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      placeholder="Type your script here... e.g. 'Hello, welcome to our Q3 product update. Today we'll cover...'"
                      rows={4}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <div className="text-right text-gray-600 text-xs mt-1">{script.length}/500</div>
                  </div>

                  {/* Name fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="First name"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Last name"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      placeholder="Work email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/30"
                  >
                    Create my free video →
                  </button>

                  <p className="text-gray-600 text-xs text-center">
                    By submitting you agree to our Privacy Policy. No spam, ever.
                  </p>
                </form>
              )}
            </div>

            {/* Right: Preview */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-violet-900/10 p-8 lg:p-10 flex flex-col justify-center">
              <h3 className="text-white font-bold text-lg mb-6">How it works</h3>
              <div className="space-y-5">
                {[
                  { step: '01', title: 'Choose your avatar', desc: 'Pick from 230+ realistic AI presenters' },
                  { step: '02', title: 'Write your script', desc: 'Type in any language — AI handles the rest' },
                  { step: '03', title: 'Enter your email', desc: 'We\'ll send your finished video in minutes' },
                  { step: '04', title: 'Download & share', desc: 'HD video ready for any platform' },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
                      {step}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{title}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
