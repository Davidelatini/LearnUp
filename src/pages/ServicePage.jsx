import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ServicePage({ hero, includes, forWho, steps }) {
  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-sky-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 mb-6 text-sm text-white font-medium">
            {hero.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            {hero.title}
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>
          <Link
            to="/contatti"
            className="inline-block bg-white text-blue-700 font-bold px-10 py-4 rounded-xl text-base hover:bg-blue-50 hover:shadow-xl transition-all hover:scale-105 shadow-lg"
          >
            Richiedi consulenza gratuita →
          </Link>
        </div>
      </section>

      {/* Cosa include */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-blue-400" />
              Nel dettaglio
              <span className="w-8 h-px bg-blue-400" />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900">Cosa include</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {includes.map(({ icon, title, description }) => (
              <div
                key={title}
                className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md hover:shadow-blue-100 hover:border-blue-200 hover:-translate-y-1 transition-all group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <h3 className="text-slate-800 font-bold text-sm mb-2">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Per chi è */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-blue-400" />
              Ideale per
              <span className="w-8 h-px bg-blue-400" />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900">Per chi è</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {forWho.map(({ icon, title, description }) => (
              <div
                key={title}
                className="bg-white border border-slate-100 rounded-2xl p-8 text-center hover:shadow-md hover:shadow-blue-100 hover:border-blue-200 transition-all group cursor-default"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-2xl mx-auto mb-5 group-hover:scale-110 transition-transform shadow-md shadow-blue-200">
                  {icon}
                </div>
                <h3 className="text-slate-800 font-bold text-base mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-blue-400" />
              Il processo
              <span className="w-8 h-px bg-blue-400" />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900">Come funziona</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map(({ number, icon, title, description }) => (
              <div key={number} className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-blue-600 flex flex-col items-center justify-center shadow-lg shadow-blue-200">
                  <span className="text-xs font-bold text-blue-100 leading-none">{number}</span>
                  <span className="text-2xl leading-none mt-0.5">{icon}</span>
                </div>
                <div>
                  <h3 className="text-slate-800 font-bold text-base mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="py-20 px-4 bg-[#2563EB]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            Pronto a iniziare?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Contattaci oggi per una consulenza gratuita senza impegno.
          </p>
          <Link
            to="/contatti"
            className="inline-block bg-white text-[#2563EB] font-bold px-10 py-4 rounded-xl text-base hover:bg-blue-50 hover:shadow-xl transition-all hover:scale-105 shadow-lg"
          >
            Contattaci →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
