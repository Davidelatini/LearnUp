import logo from '../assets/learnup-logo.svg'

const footerLinks = {
  Servizi: [
    'Creazione Corsi E-Learning',
    'Gestione LMS Moodle',
    'Applicativi Didattici',
    'Materiali Formativi',
    'Video & Animazioni',
    'Gamification',
    'Corsi Obbligatori',
    'Formazione Sicurezza',
  ],
  Soluzioni: [
    'PMI e Startup',
    'Grandi Imprese',
    'Pubblica Amministrazione',
    'Sanità & Farmaceutico',
    'Retail & GDO',
    'Finance & Assicurazioni',
    'Manifatturiero',
    'Consulenza & Servizi',
  ],
  Risorse: [
    'Prezzi',
    'Case Studies',
    'Template Gratuiti',
    'Blog Formazione',
    'LearnUp Academy',
    'Guida al Moodle',
    'API & Integrazioni',
    'Help Center',
  ],
  Azienda: [
    'Chi siamo',
    'Il nostro metodo',
    'Team',
    'Lavora con noi',
    'Newsroom',
    'Partnership',
    'Privacy Policy',
    'Termini di servizio',
  ],
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-14">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="mb-4">
              <img src={logo} alt="LearnUp" className="h-9 w-auto brightness-0 invert" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              La piattaforma e-learning a 360° per le aziende italiane. Corsi, LMS Moodle, applicativi didattici e materiali formativi.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-colors">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-colors">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-colors">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-sky-400 text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-900/50 border border-emerald-700/50 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span className="text-emerald-400 text-xs font-medium">GDPR Compliant</span>
            </div>
            <div className="bg-blue-900/50 border border-blue-700/50 rounded-lg px-3 py-1.5">
              <span className="text-blue-400 text-xs font-semibold">Moodle Partner</span>
            </div>
          </div>

          <p className="text-slate-500 text-sm">
            © 2026 LearnUp S.r.l. — P.IVA 12345678901 — Tutti i diritti riservati
          </p>

          <div className="flex gap-4 text-slate-500 text-sm">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookie</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Termini</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
