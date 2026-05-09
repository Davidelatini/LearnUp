import ServicePage from './ServicePage'

const data = {
  hero: {
    badge: '🌐 Sviluppo Siti Formativi',
    title: 'Siti web pensati per la formazione',
    subtitle: 'Progettiamo e sviluppiamo siti web ottimizzati per chi vende o eroga formazione. Moderni, veloci e integrabili con qualsiasi LMS.',
  },
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

export default function ServiceSiti() {
  return <ServicePage {...data} />
}
