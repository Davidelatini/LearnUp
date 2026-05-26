import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import DemoModal from './DemoModal'

const BG_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4'

export default function Hero() {
  const [showDemo, setShowDemo] = useState(false)
  const [videoRef, videoVisible] = useScrollReveal({ threshold: 0.08 })

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-[140px] pb-[80px] overflow-hidden">
      {/* Video background — capovolto verticalmente, nessun overlay */}
      <video
        src={BG_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scaleY(-1)' }}
      />

      {/* Testo — larghezza contenuta */}
      <div className="relative z-10 w-full px-5 md:px-12 lg:px-20 mb-12">
        <div className="max-w-[1400px] mx-auto text-center">
          {/* Badge */}
          <div
            className="hero-in inline-flex items-center gap-2 bg-white/80 border border-blue-100 backdrop-blur-md rounded-full px-4 py-2 mb-8 text-sm text-slate-700 font-semibold shadow-lg"
            style={{ animationDelay: '0ms' }}
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Formazione e-learning a 360° per le aziende
          </div>

          {/* Headline */}
          <h1
            className="hero-in text-5xl sm:text-6xl lg:text-[72px] font-extrabold leading-tight mb-8 tracking-tight"
            style={{ animationDelay: '150ms' }}
          >
            <span
              className="text-slate-900"
              style={{ textShadow: '0 1px 12px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.6)' }}
            >
              Tutta la formazione
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.6))' }}
            >
              e-learning della tua azienda
            </span>
            <br />
            <span
              className="text-slate-900"
              style={{ textShadow: '0 1px 12px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.6)' }}
            >
              in un unico posto
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="hero-in text-[18px] text-slate-900 font-semibold max-w-[700px] mx-auto mb-12 leading-relaxed"
            style={{ textShadow: '0 1px 8px rgba(255,255,255,0.95), 0 0 20px rgba(255,255,255,0.8)', animationDelay: '300ms' }}
          >
            Mi occupo personalmente di ogni progetto — dalla produzione dei corsi eLearning
            alla gestione della tua piattaforma LMS.{' '}
            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent font-extrabold">
              Un unico riferimento, nessun intermediario.
            </span>
          </p>

          {/* CTAs */}
          <div
            className="hero-in flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ animationDelay: '450ms' }}
          >
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl text-[16px] transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 shadow-lg">
              Richiedi consulenza gratuita
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="w-full sm:w-auto bg-white/80 hover:bg-white border-2 border-blue-200 hover:border-blue-400 text-slate-800 font-semibold px-10 py-4 rounded-xl text-[16px] transition-all backdrop-blur-sm flex items-center justify-center gap-2 shadow-md"
            >
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Guarda il video demo
            </button>
          </div>
        </div>
      </div>

      {/* Video embed — reveal on scroll */}
      <div
        ref={videoRef}
        className={`relative z-10 w-full px-5 md:px-16 lg:px-24 reveal-scale ${videoVisible ? 'visible' : ''}`}
        style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}
      >
        <div className="relative">
          <div className="bg-white/90 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden shadow-2xl shadow-blue-200/50">
            {/* Browser bar decorativa */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 bg-white/95">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-slate-100 rounded-md h-6 flex items-center px-3">
                <span className="text-slate-400 text-xs">app.learnup.it — Video demo</span>
              </div>
            </div>
            {/* Synthesia video embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://share.synthesia.io/embeds/videos/ff9e6f3d-61cf-49e1-be62-0fff2e3e883a"
                title="LearnUp — Video demo"
                allow="encrypted-media; fullscreen;"
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>

          {/* Floating chips */}
          <div className="absolute -top-4 -left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-500/40">
            🎓 LMS Moodle
          </div>
          <div className="absolute -top-4 -right-4 bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-sky-400/40">
            📊 Analytics avanzati
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-400/40">
            ✓ SCORM & xAPI
          </div>
        </div>
      </div>

      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
    </section>
  )
}
