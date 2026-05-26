import { useState } from 'react'

const faqs = [
  {
    q: 'Quanto tempo ci vuole per avere il primo corso online?',
    a: 'Il tempo medio dalla briefing alla pubblicazione del primo corso è 3-4 settimane. Per corsi più semplici (es. adattamento di materiali esistenti) possiamo scendere a 10 giorni lavorativi. Il Moodle viene attivato entro 72 ore dalla firma del contratto.',
  },
  {
    q: 'Posso usare il mio Moodle esistente o devo rifarlo da zero?',
    a: 'Lavoriamo sia su Moodle esistenti da ottimizzare, sia su nuove installazioni. Se hai già un Moodle, facciamo un audit gratuito per capire cosa migliorare senza perdere corsi o dati degli studenti.',
  },
  {
    q: 'I corsi rispettano la normativa sulla formazione obbligatoria?',
    a: 'Sì. Tutti i corsi obbligatori (sicurezza D.Lgs. 81/08, antincendio, privacy GDPR, primo soccorso ecc.) sono progettati con consulenti legali specializzati. Rilasciamo attestati validi ai fini di legge e teniamo aggiornati i contenuti quando cambiano le normative.',
  },
  {
    q: 'Il piano Business include davvero corsi illimitati?',
    a: 'Il piano Business include 10 nuovi corsi prodotti ogni anno da LearnUp. L\'accesso alla piattaforma e la distribuzione dei corsi esistenti sono invece illimitati. Corsi aggiuntivi oltre quota sono disponibili a pacchetti a tariffe scontate.',
  },
  {
    q: 'Come funziona l\'integrazione con il gestionale HR?',
    a: 'Integriamo Moodle con i principali HR italiani (Zucchetti, TeamSystem, SAP HR) e internazionali (Personio, BambooHR, Workday). L\'integrazione sincronizza automaticamente dipendenti, ruoli, gruppi e registra le ore di formazione nel gestionale.',
  },
  {
    q: 'Posso richiedere una demo prima di decidere?',
    a: 'Assolutamente sì. Offriamo una consulenza gratuita di 60 minuti in cui analizziamo le tue esigenze e mostriamo la piattaforma dal vivo. Compila il form o scrivici a info@learnup.it — ti contatteremo entro 24 ore lavorative.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section className="py-20 px-5 md:px-12 lg:px-20 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[13px] text-blue-600 font-semibold uppercase tracking-[0.15em] mb-4">
            <span className="w-8 h-px bg-blue-400" />
            FAQ
            <span className="w-8 h-px bg-blue-400" />
          </div>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[52px] font-extrabold text-slate-900 mb-4 leading-tight">
            Domande frequenti
          </h2>
          <p className="text-slate-500">Hai altre domande? <a href="#" className="text-blue-600 font-semibold hover:underline">Scrivici</a>, rispondiamo entro 24 ore.</p>
        </div>

        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div
              key={q}
              className={`border-2 rounded-2xl overflow-hidden transition-all ${
                open === i ? 'border-blue-300 bg-blue-50/50' : 'border-slate-100 bg-white hover:border-blue-200'
              }`}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-slate-800 font-semibold text-[15px] pr-4">{q}</span>
                <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition-all ${
                  open === i ? 'bg-blue-600 rotate-45' : 'bg-slate-100'
                }`}>
                  <svg className={`w-4 h-4 ${open === i ? 'text-white' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </button>
              {open === i && (
                <div className="px-6 pb-6">
                  <p className="text-slate-600 text-[15px] leading-[1.7]">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
