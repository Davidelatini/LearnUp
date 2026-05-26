import { Link } from 'react-router-dom'

const SERVICES = [
  { label: 'Corsi eLearning con AI', href: '/servizi/corsi-elearning', emoji: '🎬', color: '#FFB347' },
  { label: 'Gestione LMS Moodle', href: '/servizi/gestione-lms', emoji: '🖥️', color: '#B567C2' },
  { label: 'Webinar e Lezioni Online', href: '/servizi/webinar', emoji: '🎙️', color: '#60A5FA' },
  { label: 'Siti Formativi', href: '/servizi/siti-formativi', emoji: '💻', color: '#F5C344' },
]

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 45%, #E0F2FE 100%)', borderTop: '1px solid #BFDBFE' }}>

      {/* Strip 4 colori — uno per servizio */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, #FFB347 0%, #B567C2 33%, #60A5FA 66%, #F5C344 100%)' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 0' }}>

        {/* ── Corpo principale ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '64px', alignItems: 'start', marginBottom: 64 }}>

          {/* Colonna sinistra — branding personale */}
          <div style={{ maxWidth: 520 }}>

            {/* Nome */}
            <div style={{ marginBottom: 4 }}>
              <span style={{
                fontSize: 42, fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a',
                lineHeight: 1.1,
              }}>
                Davide Latini
              </span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#2563EB', marginBottom: 24, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              eLearning & AI Specialist
            </p>

            {/* Tagline */}
            <p style={{ fontSize: 17, color: '#475569', lineHeight: 1.75, marginBottom: 32 }}>
              Trasformo la formazione aziendale in esperienze digitali che funzionano — corsi eLearning con AI, piattaforme LMS, webinar e siti formativi.
            </p>

            {/* Disponibilità */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 24, padding: '6px 16px', marginBottom: 32 }}>
              <span style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)', animation: 'footerPulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>Disponibile per nuovi progetti</span>
            </div>

            {/* CTA + email */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <a
                href="mailto:davide@learnupstudio.it"
                style={{ display: 'inline-block', background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 12, textDecoration: 'none' }}
              >
                Scrivimi →
              </a>
              <a href="mailto:davide@learnupstudio.it" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
                davide@learnupstudio.it
              </a>
            </div>
          </div>

          {/* Colonna destra — link */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 160px', gap: '48px 32px', paddingTop: 8 }}>

            {/* Servizi */}
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8', marginBottom: 18 }}>
                Servizi
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {SERVICES.map(({ label, href, emoji, color }) => (
                  <li key={href}>
                    <Link
                      to={href}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#475569', textDecoration: 'none', fontWeight: 500 }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contatti */}
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8', marginBottom: 18 }}>
                Contatti
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li>
                  <a href="https://www.linkedin.com/company/learnup-studio" target="_blank" rel="noreferrer" style={{ fontSize: 14, color: '#475569', textDecoration: 'none', fontWeight: 500 }}>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" style={{ fontSize: 14, color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</a>
                </li>
                <li>
                  <a href="#" style={{ fontSize: 14, color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Cookie Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ borderTop: '1px solid #BFDBFE', padding: '24px 0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>

          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
            © 2026 Davide Latini — P.IVA da definire
          </p>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {/* X / Twitter */}
            <a href="#" style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.7)', border: '1px solid #BFDBFE', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', textDecoration: 'none' }}>
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/learnup-studio" target="_blank" rel="noreferrer" style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.7)', border: '1px solid #BFDBFE', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', textDecoration: 'none' }}>
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.7)', border: '1px solid #BFDBFE', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', textDecoration: 'none' }}>
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>Cookie</a>
            <a href="#" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>Termini</a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes footerPulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
          50% { box-shadow: 0 0 0 6px rgba(34,197,94,0.08); }
        }
      `}</style>
    </footer>
  )
}
