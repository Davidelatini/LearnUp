import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import sitiBgImg from '../assets/siti/siti-bg.jpg'

export default function ServiceSiti() {
  return (
    <div className="min-h-screen text-slate-800 overflow-x-hidden" style={{ background: 'linear-gradient(160deg, #60A5FA 0%, #38BDF8 15%, #2563EB 38%, #0EA5E9 60%, #EFF6FF 82%, #f8fafc 100%)' }}>
      <Navbar />

      {/* HERO */}
      <section
        className="relative overflow-hidden flex items-center"
        style={{ minHeight: '100vh' }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${sitiBgImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.88) 0%, rgba(56,189,248,0.85) 30%, rgba(37,99,235,0.82) 60%, rgba(14,165,233,0.75) 100%)' }}
        />

        <style>{`
          @keyframes heroFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
        `}</style>

        <div className="relative w-full max-w-5xl mx-auto px-6 sm:px-10 py-32 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 text-sm font-semibold"
            style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)' }}
          >
            💻 Siti Formativi
          </div>

          {/* Titolo */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-white">
            Sviluppo Siti Formativi
          </h1>

          {/* Descrizione */}
          <p className="text-xl sm:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.90)' }}>
            Progetto e sviluppo siti web ottimizzati per chi vende o eroga formazione. Moderni, veloci e integrabili con qualsiasi LMS.
          </p>

          {/* Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['✓ React · Tailwind', '✓ Integrazione LMS', '✓ Mobile first'].map((label) => (
              <span
                key={label}
                style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '7px 18px', fontSize: 13, fontWeight: 600 }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* CTA */}
          <Link
            to="/contatti"
            className="inline-block font-bold px-12 py-5 rounded-2xl text-base transition-all hover:scale-105 shadow-xl hover:shadow-2xl mb-16"
            style={{ background: '#fff', color: '#2563EB' }}
          >
            Richiedi consulenza gratuita →
          </Link>

          {/* Card feature */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: '⚛️', title: 'React · Tailwind', desc: 'Siti moderni e performanti sviluppati con le tecnologie più richieste dal mercato.' },
              { icon: '🔗', title: 'Integrazione LMS', desc: 'Connessione nativa con Moodle, Docebo e qualsiasi altra piattaforma di e-learning.' },
              { icon: '📱', title: 'Mobile first', desc: 'Design responsivo ottimizzato per ogni dispositivo, dalla scrivania allo smartphone.' },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 20,
                  padding: '28px 24px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{icon}</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem', marginBottom: 8 }}>{title}</div>
                <div style={{ color: 'rgba(255,255,255,0.80)', fontSize: '0.85rem', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
