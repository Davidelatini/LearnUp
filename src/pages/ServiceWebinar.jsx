import ServicePage from './ServicePage'

const data = {
  hero: {
    badge: '📡 Webinar e Lezioni Online',
    title: 'Webinar e lezioni online, gestiti da A a Z',
    subtitle: 'Organizziamo e gestiamo le tue sessioni formative in diretta. Setup tecnico, coordinamento e registrazioni incluse.',
  },
  includes: [
    { icon: '🖥️', title: 'Setup piattaforma', description: 'Configurazione professionale di Zoom, Microsoft Teams o Google Meet.' },
    { icon: '🎙️', title: 'Gestione tecnica della diretta', description: 'Operatore dedicato per audio, video, screen sharing e interazioni.' },
    { icon: '🎥', title: 'Registrazione e post-produzione', description: 'Registrazione HD e editing professionale del webinar.' },
    { icon: '📧', title: 'Inviti e gestione partecipanti', description: 'Comunicazioni, reminder e gestione delle iscrizioni.' },
    { icon: '📋', title: 'Report presenze', description: 'Report dettagliato con presenze, tempi di connessione e domande.' },
    { icon: '📁', title: 'Materiali post-sessione', description: 'Distribuzione di slide, registrazione e materiali ai partecipanti.' },
  ],
  forWho: [
    { icon: '🎓', title: 'Formatori e coach', description: 'Professionisti che erogano formazione live online a gruppi o singoli.' },
    { icon: '🏢', title: 'Aziende con team distribuiti', description: 'Organizzazioni con dipendenti da formare da remoto in tutta Italia.' },
    { icon: '📚', title: 'Enti di formazione continua', description: 'Ordini professionali, associazioni e enti con obblighi ECM/CPD.' },
  ],
  steps: [
    { number: '01', icon: '📅', title: 'Pianificazione sessione', description: 'Definiamo data, piattaforma, agenda e requisiti tecnici.' },
    { number: '02', icon: '📡', title: 'Gestione diretta', description: 'Gestiamo ogni aspetto tecnico durante la sessione in diretta.' },
    { number: '03', icon: '📬', title: 'Consegna registrazione e report', description: 'Inviamo registrazione editata, materiali e report presenze.' },
  ],
}

export default function ServiceWebinar() {
  return <ServicePage {...data} />
}
