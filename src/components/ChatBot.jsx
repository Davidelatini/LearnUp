import { useState, useRef, useEffect } from 'react'
import logo from '../assets/grafic/learnup-logo.svg'

const QUICK_REPLIES = [
  'Che servizi offrite?',
  'Come funziona il Moodle?',
  'Quanto costa?',
  'Tempi di consegna?',
  'Corsi obbligatori?',
]

const BOT_RESPONSES = {
  'che servizi offrite':
    'Offriamo una soluzione e-learning a 360°:\n• 📚 Creazione corsi e-learning su misura\n• ⚙️ Gestione LMS Moodle completa\n• 💻 Sviluppo applicativi didattici\n• 🎨 Materiali formativi (video, slide, infografiche)\n\nVuoi saperne di più su uno di questi?',
  'come funziona il moodle':
    'Gestiamo il tuo Moodle in modo completo:\n• Installazione e configurazione in 72 ore\n• Personalizzazione grafica con il tuo brand\n• Integrazione con il tuo gestionale HR\n• Aggiornamenti, backup e supporto H24\n\nHai già un Moodle attivo o parti da zero?',
  'quanto costa':
    'Abbiamo 3 piani:\n\n🌱 Starter — €390/mese\nFino a 100 utenti, 3 corsi/anno, LMS incluso\n\n🚀 Business — €790/mese (più scelto!)\nFino a 500 utenti, 10 corsi/anno, video custom\n\n🏢 Enterprise — Su misura\nUtenti e corsi illimitati, app mobile, dedicato\n\nVuoi un preventivo personalizzato?',
  'tempi di consegna':
    'I nostri tempi garantiti:\n• ⚡ LMS Moodle attivo in 72 ore\n• 📖 Primo corso online in 3-4 settimane\n• 🎬 Materiali semplici in 5-10 giorni\n\nRispettiamo sempre le deadline. Hai una scadenza specifica?',
  'corsi obbligatori':
    'Sì, siamo specializzati in formazione obbligatoria:\n• 🦺 Sicurezza D.Lgs. 81/08\n• 🔥 Antincendio\n• 🔒 Privacy GDPR\n• 🏥 Primo soccorso\n• ✅ Compliance aziendale\n\nTutti con attestati validi ai fini di legge. Quanti dipendenti hai?',
}

function getBotReply(text) {
  const lower = text.toLowerCase()
  for (const [key, val] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(key.split(' ')[0]) || lower.includes(key.split(' ')[1] ?? '')) {
      return val
    }
  }
  return 'Grazie per la tua domanda! 😊 Per una risposta precisa ti metto in contatto con un nostro esperto.\n\nPuoi anche:\n📧 Scrivere a info@learnup.it\n📞 Chiamare lo 02 1234 5678\n📅 Prenotare una demo gratuita'
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Ciao! 👋 Sono l\'assistente LearnUp.\nCome posso aiutarti oggi?',
      time: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function sendMessage(text) {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMessages((prev) => [...prev, { from: 'user', text: msg, time: new Date() }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, { from: 'bot', text: getBotReply(msg), time: new Date() }])
    }, 900)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl shadow-blue-200/60 border border-slate-200 flex flex-col overflow-hidden"
          style={{ maxHeight: '520px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <img src={logo} alt="LearnUp" className="h-5 w-auto brightness-0 invert" />
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-sm">Assistente LearnUp</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-blue-100 text-xs">Online ora</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.from === 'bot' && (
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex justify-start">
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                  </svg>
                </div>
                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                  {[0, 1, 2].map((n) => (
                    <span
                      key={n}
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${n * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 flex gap-2 overflow-x-auto bg-white border-t border-slate-100">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="shrink-0 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Scrivi un messaggio..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-4 sm:right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white rounded-2xl shadow-xl shadow-blue-300/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}
        {/* Badge notifica */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
        )}
      </button>
    </>
  )
}
