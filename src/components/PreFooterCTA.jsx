import megaphoneImg from '../assets/megaphone-bell-and-smartphone-with-new-email-newsletter-subscription-or-email-marketing.png'

export default function PreFooterCTA() {
  return (
    <section className="py-20 px-5 md:px-12 lg:px-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-[1200px] mx-auto text-center">
        <div className="relative bg-gradient-to-br from-blue-600 to-sky-500 rounded-3xl px-8 py-16 overflow-hidden shadow-2xl shadow-blue-200">
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-white/10 rounded-full" />
          {/* Megaphone image */}
          <img
            src={megaphoneImg}
            alt=""
            className="absolute right-0 bottom-0 w-52 lg:w-64 opacity-20 pointer-events-none select-none object-contain"
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-8 text-sm text-white font-medium">
              📞 Consulenza gratuita senza impegno
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Parliamo della tua
              <br />
              formazione aziendale
            </h2>

            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
              Una call gratuita di 20 minuti. Nessun impegno. Ti rispondo personalmente entro 24 ore.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-white hover:bg-blue-50 text-blue-700 font-bold px-10 py-4 rounded-xl text-base transition-all hover:scale-105 hover:shadow-xl shadow-lg">
                Scrivimi →
              </button>
              <button className="w-full sm:w-auto border-2 border-white/50 hover:border-white text-white font-semibold px-10 py-4 rounded-xl text-base transition-all hover:bg-white/10">
                Scopri i prezzi
              </button>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-blue-100 flex-wrap">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Risposta entro 24 ore
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Nessun impegno
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                200+ aziende soddisfatte
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
