import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/learnup-logo.svg'

const serviziLinks = [
  { label: 'Corsi eLearning con AI', href: '/servizi/corsi-elearning', icon: '🎬' },
  { label: 'Gestione LMS', href: '/servizi/gestione-lms', icon: '🖥️' },
  { label: 'Webinar e Lezioni Online', href: '/servizi/webinar', icon: '📡' },
  { label: 'Sviluppo Siti Formativi', href: '/servizi/siti-formativi', icon: '🌐' },
]

const otherItems = ['Soluzioni', 'Risorse', 'Prezzi', 'Chi siamo']

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [serviziOpen, setServiziOpen] = useState(false)
  const [mobileServiziOpen, setMobileServiziOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServiziOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img src={logo} alt="LearnUp" className="h-9 w-auto" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Servizi dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServiziOpen(!serviziOpen)}
                className="text-slate-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50 flex items-center gap-1"
              >
                Servizi
                <svg
                  className={`w-3.5 h-3.5 opacity-50 transition-transform ${serviziOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {serviziOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden z-50">
                  <div className="p-2">
                    {serviziLinks.map(({ label, href, icon }) => (
                      <Link
                        key={href}
                        to={href}
                        onClick={() => setServiziOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                      >
                        <span className="text-base">{icon}</span>
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {otherItems.map((item) => (
              <button
                key={item}
                className="text-slate-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50 flex items-center gap-1"
              >
                {item}
                {item !== 'Prezzi' && item !== 'Chi siamo' && (
                  <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="text-sm font-medium text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 px-4 py-2 rounded-lg transition-colors">
              Richiedi demo
            </button>
            <button className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors shadow-md shadow-blue-200">
              Inizia gratis
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-slate-500 hover:text-slate-700 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-1">
          {/* Servizi accordion */}
          <button
            onClick={() => setMobileServiziOpen(!mobileServiziOpen)}
            className="text-slate-600 hover:text-blue-600 text-left px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-between"
          >
            Servizi
            <svg
              className={`w-4 h-4 opacity-50 transition-transform ${mobileServiziOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {mobileServiziOpen && (
            <div className="ml-4 flex flex-col gap-1 border-l-2 border-blue-100 pl-4 mb-1">
              {serviziLinks.map(({ label, href, icon }) => (
                <Link
                  key={href}
                  to={href}
                  onClick={() => { setMobileOpen(false); setMobileServiziOpen(false) }}
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-600 py-2 text-sm font-medium transition-colors"
                >
                  <span>{icon}</span>
                  {label}
                </Link>
              ))}
            </div>
          )}

          {otherItems.map((item) => (
            <button key={item} className="text-slate-600 hover:text-blue-600 text-left px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
              {item}
            </button>
          ))}
          <hr className="border-slate-100 my-2" />
          <button className="text-slate-500 text-left px-4 py-3 text-sm font-medium">Richiedi demo</button>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-colors">
            Inizia gratis
          </button>
        </div>
      )}
    </nav>
  )
}
