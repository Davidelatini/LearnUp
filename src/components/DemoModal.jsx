import { useState, useEffect, useRef } from 'react'

// ─── Helpers & constants ──────────────────────────────────────────────────────

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// Swap with /videos/modulo1.mp4 … when Synthesia exports are ready
const V = 'https://www.w3schools.com/html/mov_bbb.mp4'

const MODULES = [
  {
    id: 1,
    icon: '⚠️',
    color: 'blue',
    title: 'Rischi sul lavoro',
    subtitle: 'Fisici, chimici, biologici, ergonomici',
    videoSrc: V,
    question: 'Ottimo! Iniziamo con una verifica: quali sono le 4 categorie principali di rischio sul lavoro che abbiamo appena visto?',
  },
  {
    id: 2,
    icon: '🦺',
    color: 'sky',
    title: 'Dispositivi di Protezione (DPI)',
    subtitle: 'Tipologie, obbligo e uso corretto',
    videoSrc: V,
    question: 'Perfetto! Ora dimmi: in quali situazioni è obbligatorio indossare il casco su un cantiere edile?',
  },
  {
    id: 3,
    icon: '🚨',
    color: 'red',
    title: 'Procedure di emergenza',
    subtitle: 'Evacuazione, pronto soccorso, numeri utili',
    videoSrc: V,
    question: 'Bene! Sul tema emergenze: qual è il numero da chiamare in caso di infortunio grave sul lavoro in Italia?',
  },
  {
    id: 4,
    icon: '🧍',
    color: 'indigo',
    title: 'Ergonomia e postura',
    subtitle: 'Prevenzione disturbi muscolo-scheletrici',
    videoSrc: V,
    question: 'Quasi finito! Sull\'ergonomia: quali sono le 3 regole fondamentali per sollevare correttamente un carico pesante?',
  },
  {
    id: 5,
    icon: '🧠',
    color: 'violet',
    title: 'Stress lavoro-correlato',
    subtitle: 'Riconoscerlo, prevenirlo, gestirlo',
    videoSrc: V,
    question: 'Ultimo modulo! Sai dirmi: quali sono i principali segnali fisici che indicano un livello di stress lavoro-correlato elevato?',
  },
]

const COLOR_MAP = {
  blue:   'bg-blue-50 text-blue-600 border-blue-200',
  sky:    'bg-sky-50 text-sky-600 border-sky-200',
  red:    'bg-red-50 text-red-500 border-red-200',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  violet: 'bg-violet-50 text-violet-600 border-violet-200',
}

const SYSTEM_PROMPT = `Sei Sofia, tutor AI di LearnUp Studio. Stai valutando le risposte di un dipendente su un corso obbligatorio di Sicurezza sul Lavoro (D.Lgs. 81/08).

Regole:
- Valuta la risposta in modo incoraggiante e professionale
- Risposta corretta → complimentati in 1 frase, anticipa il prossimo modulo
- Risposta parziale → integra le info mancanti in 2 frasi, chiedi conferma
- Risposta errata → correggi gentilmente, rispiega brevemente, rifai la domanda
- Rispondi SEMPRE in italiano, max 3-4 frasi, tono caldo e professionale

Quando la risposta è soddisfacente termina SEMPRE con: RISPOSTA_CORRETTA
(questa parola è invisibile all'utente, usata internamente per avanzare)`

// ─── Main component ───────────────────────────────────────────────────────────

export default function DemoModal({ onClose }) {
  const [phase, setPhase] = useState('video')    // 'video' | 'chat' | 'complete'
  const [currentModule, setCurrentModule] = useState(1)
  const [completedModules, setCompletedModules] = useState([])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fading, setFading] = useState(false)

  const videoRef = useRef(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const modRef = useRef(1)

  const mod = MODULES[currentModule - 1]
  const total = MODULES.length

  // Esc to close
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input when entering chat
  useEffect(() => {
    if (phase === 'chat') setTimeout(() => inputRef.current?.focus(), 180)
  }, [phase])

  // ── Fade transition ──────────────────────────────────────────────────────────
  const transition = async (fn) => {
    setFading(true)
    await delay(280)
    fn()
    setFading(false)
  }

  // ── Video done / skip → chat ─────────────────────────────────────────────────
  const goToChat = () => {
    videoRef.current?.pause()
    const q = MODULES[modRef.current - 1].question
    transition(() => {
      setPhase('chat')
      setMessages([{ role: 'assistant', content: q }])
    })
  }

  // ── Advance module or complete ───────────────────────────────────────────────
  const advance = async () => {
    const m = modRef.current
    setCompletedModules((prev) => [...new Set([...prev, m])])

    if (m >= total) {
      setProgress(100)
      await transition(() => setPhase('complete'))
    } else {
      const next = m + 1
      modRef.current = next
      setProgress(Math.round((m / total) * 100))
      await transition(() => {
        setCurrentModule(next)
        setMessages([])
        setPhase('video')
      })
    }
  }

  // ── OpenAI ───────────────────────────────────────────────────────────────────
  const callAI = async (history) => {
    setIsTyping(true)
    try {
      const key = import.meta.env.VITE_OPENAI_API_KEY
      if (!key) throw new Error('no key')
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
          max_tokens: 300,
          temperature: 0.7,
        }),
      })
      if (!res.ok) throw new Error('api')
      const data = await res.json()
      let text = data.choices[0].message.content
      const correct = text.includes('RISPOSTA_CORRETTA')
      text = text.replace('RISPOSTA_CORRETTA', '').trim()
      setMessages((p) => [...p, { role: 'assistant', content: text }])
      if (correct) { await delay(1400); await advance() }
    } catch {
      setMessages((p) => [...p, {
        role: 'assistant',
        content: 'Sofia è momentaneamente non disponibile. Riprova tra poco.',
      }])
    } finally {
      setIsTyping(false)
    }
  }

  // ── Send message ─────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    const msg = { role: 'user', content: input.trim() }
    const next = [...messages, msg]
    setMessages(next)
    setInput('')
    await callAI(next)
  }

  const modStatus = (id) =>
    completedModules.includes(id) ? 'done' : id === currentModule ? 'active' : 'locked'

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
      style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full bg-white flex flex-col overflow-hidden"
        style={{
          maxWidth: 940,
          maxHeight: '92vh',
          borderRadius: 20,
          boxShadow: '0 32px 80px rgba(15,23,42,0.22), 0 0 0 1px rgba(15,23,42,0.06)',
          animation: 'demoIn 0.24s cubic-bezier(0.16,1,0.3,1) forwards',
        }}
      >
        {/* ── Banner ── */}
        <div className="flex-shrink-0 flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold text-white bg-blue-600">
          <span>🎓</span>
          <span>Demo interattiva — Prova il tutor AI di LearnUp Studio</span>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* ══ SIDEBAR (desktop) ══ */}
          <aside className="hidden md:flex flex-col flex-shrink-0 border-r border-slate-100 bg-slate-50" style={{ width: 260 }}>

            {/* Logo + course */}
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-sm"
                  style={{ background: 'linear-gradient(135deg,#2563EB,#38BDF8)' }}
                >
                  L&gt;
                </div>
                <div>
                  <p className="font-extrabold text-slate-800 text-sm leading-none">LearnUp</p>
                  <p className="text-xs text-slate-400">Studio</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-bold text-slate-800 text-sm leading-tight">Sicurezza sul Lavoro</p>
                  <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                    AI
                  </span>
                </div>
                <p className="text-xs text-slate-400">D.Lgs. 81/08 — {total} moduli</p>
              </div>
            </div>

            {/* Progress */}
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-500 font-medium">Avanzamento corso</span>
                <span className="font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#2563EB,#38BDF8)' }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                {completedModules.length} di {total} completati
              </p>
            </div>

            {/* Module list */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 px-1">
                Moduli
              </p>
              {MODULES.map((m) => {
                const s = modStatus(m.id)
                return (
                  <div
                    key={m.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      s === 'active'
                        ? 'bg-blue-50 border-blue-200 shadow-sm shadow-blue-100'
                        : s === 'done'
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 border ${
                        s === 'active' ? COLOR_MAP[m.color] : s === 'done' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-300 border-slate-100'
                      }`}
                    >
                      {s === 'done' ? '✓' : m.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${s === 'locked' ? 'text-slate-400' : 'text-slate-800'}`}>
                        {m.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{m.subtitle}</p>
                    </div>
                    {s === 'active' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
                    )}
                    {s === 'locked' && (
                      <span className="text-slate-300 text-xs flex-shrink-0">🔒</span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Sofia avatar footer */}
            <div className="p-4 border-t border-slate-100 flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
                  style={{ background: 'linear-gradient(135deg,#2563EB,#38BDF8)' }}
                >
                  <SofiaIcon size={20} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-50 animate-pulse" />
              </div>
              <div>
                <p className="text-slate-800 text-xs font-bold">Sofia</p>
                <p className="text-[10px] text-emerald-600 font-medium">● Online ora</p>
              </div>
            </div>
          </aside>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="flex flex-col flex-1 min-w-0">

            {/* Mobile bar */}
            <div className="md:hidden flex items-center gap-2.5 px-3 py-2.5 border-b border-slate-100 bg-slate-50 flex-shrink-0">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#2563EB,#38BDF8)' }}
              >L&gt;</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-slate-800 text-[11px] font-bold truncate">Sicurezza sul Lavoro</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex-shrink-0">AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#2563EB,#38BDF8)' }} />
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {MODULES.map((m) => (
                      <span key={m.id} className="text-sm" style={{ opacity: modStatus(m.id) === 'locked' ? 0.2 : 1 }}>
                        {m.icon}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors flex-shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Desktop header */}
            <div className="hidden md:flex flex-shrink-0 items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border ${COLOR_MAP[mod.color]}`}>
                  {mod.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Modulo {currentModule} di {total}</p>
                  <p className="text-sm font-bold text-slate-800">{mod.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {phase === 'video' && (
                  <span className="flex items-center gap-1.5 text-xs text-sky-600 font-medium bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                    Sofia sta spiegando...
                  </span>
                )}
                {phase === 'chat' && (
                  <span className="flex items-center gap-1.5 text-xs text-blue-600 font-medium bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Chat con Sofia
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            {/* Phase content */}
            <div
              className="flex-1 overflow-hidden flex flex-col min-h-0"
              style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.25s ease' }}
            >
              {phase === 'video' && (
                <VideoPhase videoRef={videoRef} mod={mod} onEnded={goToChat} onSkip={goToChat} />
              )}
              {phase === 'chat' && (
                <ChatPhase
                  messages={messages}
                  isTyping={isTyping}
                  input={input}
                  setInput={setInput}
                  onSend={handleSend}
                  inputRef={inputRef}
                  messagesEndRef={messagesEndRef}
                />
              )}
              {phase === 'complete' && <CompletePhase onClose={onClose} total={total} />}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes demoIn {
          from { opacity:0; transform:scale(0.94) translateY(20px); }
          to   { opacity:1; transform:scale(1)    translateY(0); }
        }
        @keyframes confettiFall {
          0%   { transform:translateY(-10px) rotate(0deg);   opacity:1; }
          100% { transform:translateY(500px)  rotate(720deg); opacity:0; }
        }
        @keyframes trophyFloat {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-8px); }
        }
      `}</style>
    </div>
  )
}

// ─── VideoPhase ───────────────────────────────────────────────────────────────

function VideoPhase({ videoRef, mod, onEnded, onSkip }) {
  return (
    <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={mod.videoSrc}
        className="w-full h-full object-contain"
        autoPlay muted playsInline
        onEnded={onEnded}
      />

      {/* Bottom info bar */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 py-4"
        style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.92) 0%, transparent 100%)' }}
      >
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg" style={{ background: 'linear-gradient(135deg,#2563EB,#38BDF8)' }}>
              <SofiaIcon size={20} />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Sofia — Tutor AI</p>
              <p className="text-slate-300 text-xs">{mod.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-sky-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Lezione in corso
          </div>
        </div>
      </div>

      {/* Skip */}
      <button
        onClick={onSkip}
        className="absolute top-4 right-4 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all hover:bg-white/20"
        style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
      >
        Salta intro →
      </button>

      {/* Module badge */}
      <div className="absolute top-4 left-4">
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${COLOR_MAP[mod.color]}`}>
          {mod.icon} Modulo {mod.id}
        </span>
      </div>
    </div>
  )
}

// ─── ChatPhase ────────────────────────────────────────────────────────────────

function ChatPhase({ messages, isTyping, input, setInput, onSend, inputRef, messagesEndRef }) {
  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4 bg-slate-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm" style={{ background: 'linear-gradient(135deg,#2563EB,#38BDF8)' }}>
                <SofiaIcon size={16} />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                msg.role === 'assistant'
                  ? 'bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-tl-sm'
                  : 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg,#2563EB,#38BDF8)' }}>
              <SofiaIcon size={16} />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
              <span className="text-xs text-slate-400 mr-0.5">Sofia sta scrivendo</span>
              {[0, 150, 300].map((d) => (
                <span key={d} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-white">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend() } }}
            placeholder="Scrivi la tua risposta..."
            disabled={isTyping}
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white"
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isTyping}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 hover:shadow-md hover:shadow-blue-200 hover:-translate-y-px active:translate-y-0"
            style={{ background: 'linear-gradient(135deg,#2563EB,#0EA5E9)' }}
          >
            <span>Invia</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">Enter per inviare · Esc per chiudere</p>
      </div>
    </>
  )
}

// ─── CompletePhase ────────────────────────────────────────────────────────────

function CompletePhase({ onClose, total }) {
  const confettiRef = useRef(null)
  if (!confettiRef.current) {
    const colors = ['#2563EB', '#0EA5E9', '#38BDF8', '#f59e0b', '#10b981', '#f472b6', '#a855f7', '#ef4444']
    confettiRef.current = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${(i / 40) * 100 + (Math.random() * 4 - 2)}%`,
      delay: `${(Math.random() * 2.5).toFixed(2)}s`,
      duration: `${(2.8 + Math.random() * 2).toFixed(2)}s`,
      color: colors[i % colors.length],
      size: `${Math.round(5 + Math.random() * 9)}px`,
      radius: i % 4 === 0 ? '50%' : '2px',
    }))
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden bg-gradient-to-b from-slate-50 to-white text-center">
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiRef.current.map((p) => (
          <div key={p.id} className="absolute top-0"
            style={{ left: p.left, width: p.size, height: p.size, background: p.color, borderRadius: p.radius, animation: `confettiFall ${p.duration} ${p.delay} ease-in infinite` }} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5 max-w-md">
        {/* Trophy */}
        <div className="text-8xl" style={{ animation: 'trophyFloat 2.2s ease-in-out infinite', filter: 'drop-shadow(0 4px 16px rgba(245,158,11,0.4))' }}>
          🏆
        </div>

        {/* Badge */}
        <span className="text-sm font-bold px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          ✓ Corso completato — {total}/{total} moduli
        </span>

        {/* Title */}
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Complimenti!</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Hai completato il corso sulla{' '}
            <span className="text-slate-800 font-semibold">Sicurezza sul Lavoro</span>.{' '}
            Sofia ha valutato tutte le tue risposte: ottima preparazione!
          </p>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 w-full">
          {[
            { value: '100%', label: 'Completamento' },
            { value: `${total}/5`, label: 'Moduli superati' },
            { value: '✓', label: 'Valutazione AI' },
          ].map(({ value, label }) => (
            <div key={label} className="flex-1 bg-white border border-slate-200 rounded-xl py-3 px-2 shadow-sm">
              <p className="text-blue-600 font-extrabold text-lg">{value}</p>
              <p className="text-slate-400 text-[11px] font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#2563EB,#0EA5E9)' }}
        >
          Vuoi un corso così per la tua azienda? Contattaci →
        </button>
        <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600 underline transition-colors">
          chiudi la demo
        </button>
      </div>
    </div>
  )
}

// ─── SofiaIcon ────────────────────────────────────────────────────────────────

function SofiaIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="11" r="6" fill="white" fillOpacity="0.92" />
      <path d="M5 30c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="25" cy="6" r="4" fill="#38BDF8" />
      <path d="M25 3.5v5M22.5 6h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
