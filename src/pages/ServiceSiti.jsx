import { Link } from 'react-router-dom'
import ServicePage from './ServicePage'

const data = {
  includes: [
    { icon: '🎨', title: 'Design su misura', description: 'Progettazione grafica personalizzata con identità visiva della tua azienda.' },
    { icon: '🔗', title: 'Integrazione LMS', description: 'Collegamento nativo con Moodle, Docebo e altre piattaforme di e-learning.' },
    { icon: '📚', title: 'Area corsi e catalogo', description: 'Sezione dedicata per mostrare e vendere i tuoi corsi online.' },
    { icon: '📝', title: 'Form di iscrizione', description: 'Moduli di contatto, iscrizione corsi e lead generation ottimizzati.' },
    { icon: '📱', title: 'Ottimizzazione mobile', description: 'Sito perfetto su smartphone, tablet e desktop. Mobile-first.' },
    { icon: '🛠️', title: 'CMS facile da gestire', description: 'Pannello di controllo intuitivo per aggiornare contenuti in autonomia.' },
  ],
  forWho: [
    { icon: '📚', title: 'Società di formazione', description: 'Aziende che vendono corsi online o erogano formazione a privati e imprese.' },
    { icon: '💼', title: 'Consulenti e coach', description: 'Professionisti che vogliono un sito professionale per promuovere i loro corsi.' },
    { icon: '🏛️', title: 'Enti formativi accreditati', description: 'Enti accreditati che necessitano di un sito conforme ai requisiti regionali.' },
  ],
  steps: [
    { number: '01', icon: '✏️', title: 'Design e wireframe', description: 'Progettiamo la struttura e il design visivo del sito con te.' },
    { number: '02', icon: '💻', title: 'Sviluppo', description: 'Costruiamo il sito con tecnologie moderne, veloci e sicure.' },
    { number: '03', icon: '🚀', title: 'Go live e supporto', description: 'Lanciamo il sito e ti supportiamo con aggiornamenti e assistenza.' },
  ],
}

const CODE_LINES = [
  { code: '<Hero />', color: '#60A5FA', indent: 0 },
  { code: '<Corsi />', color: '#F5C344', indent: 1 },
  { code: '<CTA />', color: '#B567C2', indent: 1 },
  { code: '</>', color: '#94a3b8', indent: 0 },
]

function SitiHero() {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 0%, #F9ED96 0%, #60A5FA 42%, #F4F8F9 72%, #F4F8F9 100%)' }}>

      <div className="absolute rounded-full blur-3xl pointer-events-none" style={{ width: 560, height: 560, top: '-160px', left: '50%', transform: 'translateX(-50%)', background: '#F9ED96', opacity: 0.5, animation: 'heroBlob1 7s ease-in-out infinite' }} />
      <div className="absolute rounded-full blur-2xl pointer-events-none" style={{ width: 260, height: 260, top: '40px', right: '8%', background: '#60A5FA', opacity: 0.35, animation: 'heroBlob2 9s ease-in-out infinite' }} />
      <div className="absolute rounded-full blur-2xl pointer-events-none" style={{ width: 180, height: 180, bottom: '0px', left: '6%', background: '#F9ED96', opacity: 0.3, animation: 'heroBlob2 6s ease-in-out infinite reverse' }} />

      {/* browser mockup flottante sinistra */}
      <div className="hidden lg:block absolute pointer-events-none" style={{ top: '130px', left: 'calc(50% - 460px)', animation: 'heroFloat 5s ease-in-out infinite' }}>
        <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 10px 28px rgba(0,0,0,0.10)', width: 200 }}>
          <div style={{ background: '#f8fafc', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5, borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {['#f87171', '#fbbf24', '#34d399'].map(c => (
                <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 4, height: 12, display: 'flex', alignItems: 'center', paddingLeft: 5, fontSize: '0.55rem', color: '#94a3b8' }}>
              learnupstudio.it
            </div>
          </div>
          <div style={{ padding: '10px 14px', fontFamily: 'monospace' }}>
            {CODE_LINES.map(({ code, color, indent }) => (
              <div key={code} style={{ fontSize: '0.68rem', color, paddingLeft: indent * 12, lineHeight: 1.85, fontWeight: 600 }}>
                {code}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* badge destra */}
      <div className="hidden lg:block absolute pointer-events-none" style={{ top: '200px', right: 'calc(50% - 460px)', animation: 'heroFloat 6.5s ease-in-out infinite reverse' }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: '7px 16px', fontSize: '0.78rem', fontWeight: 600, color: '#1e293b', boxShadow: '0 6px 16px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: '#60A5FA' }}>✦</span> React · Tailwind · LMS
        </div>
      </div>

      <style>{`
        @keyframes heroBlob1 { 0%,100%{transform:translateX(-50%) scale(1);} 50%{transform:translateX(-50%) scale(1.12) translateY(-14px);} }
        @keyframes heroBlob2 { 0%,100%{transform:scale(1);} 50%{transform:scale(1.18) translate(8px,-10px);} }
        @keyframes heroFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
      `}</style>

      <div className="max-w-4xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.75)', color: '#1e3a5f', border: '1px solid rgba(96,165,250,0.4)', backdropFilter: 'blur(8px)' }}>
          💻 Siti Formativi
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight" style={{ color: '#1e293b' }}>
          Siti web pensati per la formazione
        </h1>
        <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#475569' }}>
          Progettiamo e sviluppiamo siti web ottimizzati per chi vende o eroga formazione. Moderni, veloci e integrabili con qualsiasi LMS.
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

export default function ServiceSiti() {
  return <ServicePage {...data} heroSlot={<SitiHero />} />
}
