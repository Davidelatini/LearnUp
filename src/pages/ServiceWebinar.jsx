import { Link } from 'react-router-dom'
import ServicePage from './ServicePage'

const data = {
  includes: [
    { icon: '🖥️', title: 'Setup piattaforma', description: 'Configurazione professionale di Zoom, Microsoft Teams o Google Meet.' },
    { icon: '🎙️', title: 'Gestione tecnica della diretta', description: 'Operatore dedicato per audio, video, screen sharing e interazioni.' },
    { icon: '🎥', title: 'Registrazione e post-produzione', description: 'Registrazione HD e editing professionale del webinar.' },
    { icon: '📧', title: 'Inviti e gestione partecipanti', description: 'Comunicazioni, reminder e gestione delle iscrizioni.' },
    { icon: '📋', title: 'Report presenze', description: 'Report dettagliato con presenze, tempi di connessione e domande.' },
    { icon: '📁', title: 'Materiali post-sessione', description: 'Distribuzione di slide, registrazione e materiali ai partecipanti.' },
  ],
  forWho: [
    { icon: '🎓', title: 'Formatori e coach', description: 'Professionisti che erogano formazione live online a gruppi o singoli.' },
    { icon: '🏢', title: 'Aziende con team distribuiti', description: 'Organizzazioni con dipendenti da formare da remoto in tutta Italia.' },
    { icon: '📚', title: 'Enti di formazione continua', description: 'Ordini professionali, associazioni e enti con obblighi ECM/CPD.' },
  ],
  steps: [
    { number: '01', icon: '📅', title: 'Pianificazione sessione', description: 'Definiamo data, piattaforma, agenda e requisiti tecnici.' },
    { number: '02', icon: '📡', title: 'Gestione diretta', description: 'Gestiamo ogni aspetto tecnico durante la sessione in diretta.' },
    { number: '03', icon: '📬', title: 'Consegna registrazione e report', description: 'Inviamo registrazione editata, materiali e report presenze.' },
  ],
}

const ATTENDEES = [
  { initials: 'DL', bg: '#60A5FA' },
  { initials: 'SM', bg: '#E5A1F5' },
  { initials: 'MR', bg: '#fbbf24' },
  { initials: 'AR', bg: '#F28482' },
]

function WebinarHero() {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 0%, #60A5FA 0%, #E5A1F5 42%, #F4F8F9 72%, #F4F8F9 100%)' }}>

      <div className="absolute rounded-full blur-3xl pointer-events-none" style={{ width: 560, height: 560, top: '-160px', left: '50%', transform: 'translateX(-50%)', background: '#60A5FA', opacity: 0.32, animation: 'heroBlob1 7s ease-in-out infinite' }} />
      <div className="absolute rounded-full blur-2xl pointer-events-none" style={{ width: 260, height: 260, top: '40px', right: '8%', background: '#E5A1F5', opacity: 0.45, animation: 'heroBlob2 9s ease-in-out infinite' }} />
      <div className="absolute rounded-full blur-2xl pointer-events-none" style={{ width: 180, height: 180, bottom: '0px', left: '6%', background: '#60A5FA', opacity: 0.22, animation: 'heroBlob2 6s ease-in-out infinite reverse' }} />

      {/* griglia attendees flottante sinistra */}
      <div className="hidden lg:block absolute pointer-events-none" style={{ top: '130px', left: 'calc(50% - 460px)', animation: 'heroFloat 5s ease-in-out infinite' }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: '12px', boxShadow: '0 10px 28px rgba(0,0,0,0.10)', width: 180, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 8, right: 8, background: '#ef4444', borderRadius: 20, padding: '2px 8px', fontSize: '0.6rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ width: 4, height: 4, background: '#fff', borderRadius: '50%', display: 'inline-block' }} />LIVE
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 4 }}>
            {ATTENDEES.map(({ initials, bg }) => (
              <div key={initials} style={{ background: bg, borderRadius: 8, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700, color: '#fff' }}>
                  {initials}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* badge destra */}
      <div className="hidden lg:block absolute pointer-events-none" style={{ top: '200px', right: 'calc(50% - 460px)', animation: 'heroFloat 6.5s ease-in-out infinite reverse' }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: '7px 16px', fontSize: '0.78rem', fontWeight: 600, color: '#1e293b', boxShadow: '0 6px 16px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: '#60A5FA' }}>✦</span> Zoom · Teams · Meet
        </div>
      </div>

      <style>{`
        @keyframes heroBlob1 { 0%,100%{transform:translateX(-50%) scale(1);} 50%{transform:translateX(-50%) scale(1.12) translateY(-14px);} }
        @keyframes heroBlob2 { 0%,100%{transform:scale(1);} 50%{transform:scale(1.18) translate(8px,-10px);} }
        @keyframes heroFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
      `}</style>

      <div className="max-w-4xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.75)', color: '#1e3a8a', border: '1px solid rgba(96,165,250,0.4)', backdropFilter: 'blur(8px)' }}>
          🎙️ Webinar e Lezioni Online
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight" style={{ color: '#1e293b' }}>
          Webinar e lezioni online, gestiti da A a Z
        </h1>
        <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#475569' }}>
          Organizziamo e gestiamo le tue sessioni formative in diretta. Setup tecnico, coordinamento e registrazioni incluse.
        </p>
        <Link
          to="/contatti"
          className="inline-block font-bold px-10 py-4 rounded-xl text-base transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          style={{ background: '#1e293b', color: '#fff' }}
        >
          Richiedi consulenza gratuita →
        </Link>
      </div>
    </section>
  )
}

export default function ServiceWebinar() {
  return <ServicePage {...data} heroSlot={<WebinarHero />} />
}
