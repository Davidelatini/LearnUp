import ServicePage from './ServicePage'

const data = {
  hero: {
    badge: '🎬 Corsi eLearning con AI',
    title: 'Corsi eLearning professionali, creati con AI',
    subtitle: 'Trasformiamo i tuoi contenuti formativi in corsi video interattivi con avatar AI, pronti per qualsiasi piattaforma LMS.',
  },
  includes: [
    { icon: '📝', title: 'Script e storyboard', description: 'Scriviamo e strutturiamo i contenuti didattici per un apprendimento ottimale.' },
    { icon: '🤖', title: 'Avatar AI professionale', description: 'Presentatore AI realistico che parla in italiano con voce naturale.' },
    { icon: '🎙️', title: 'Audio AI in italiano', description: 'Voiceover professionale generato con AI in italiano perfetto.' },
    { icon: '✅', title: 'Quiz e test interattivi', description: 'Verifiche di apprendimento integrate per misurare i risultati.' },
    { icon: '📦', title: 'Pacchetto SCORM/xAPI', description: 'Consegna in formato standard compatibile con qualsiasi LMS.' },
    { icon: '💬', title: 'Sottotitoli automatici', description: 'Sottotitoli generati e revisionati per accessibilità completa.' },
  ],
  forWho: [
    { icon: '🏢', title: 'Aziende con formazione obbligatoria', description: 'Privacy, sicurezza sul lavoro, antincendio e compliance normativa.' },
    { icon: '🎓', title: 'Enti di formazione', description: 'Scuole, accademie e società che erogano corsi professionali.' },
    { icon: '💼', title: 'Professionisti che vendono corsi online', description: 'Coach, consulenti e formatori indipendenti.' },
  ],
  steps: [
    { number: '01', icon: '📋', title: 'Briefing e storyboard', description: 'Analizziamo i contenuti e costruiamo la struttura del corso insieme a te.' },
    { number: '02', icon: '🤖', title: 'Produzione con AI', description: 'Produciamo video, quiz e materiali didattici con tecnologia AI.' },
    { number: '03', icon: '📦', title: 'Consegna SCORM pronto', description: 'Ricevi il corso in formato SCORM/xAPI pronto per il caricamento sul tuo LMS.' },
  ],
}

export default function ServiceElearning() {
  return <ServicePage {...data} />
}
