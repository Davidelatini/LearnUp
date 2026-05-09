import ServicePage from './ServicePage'

const data = {
  hero: {
    badge: '🖥️ Gestione LMS',
    title: 'La tua piattaforma LMS, gestita da esperti',
    subtitle: 'Installiamo, configuriamo e gestiamo Moodle e altre piattaforme LMS per la tua azienda. Tu pensi alla formazione, noi alla tecnologia.',
  },
  includes: [
    { icon: '🛠️', title: 'Installazione Moodle/Docebo', description: 'Setup completo della piattaforma su server dedicato o cloud.' },
    { icon: '🎨', title: 'Configurazione e branding', description: 'Personalizzazione grafica con logo, colori e tema della tua azienda.' },
    { icon: '👥', title: 'Gestione utenti', description: 'Creazione, importazione e organizzazione di tutti gli utenti e gruppi.' },
    { icon: '📤', title: 'Caricamento corsi SCORM', description: 'Caricamento e configurazione di tutti i corsi e materiali formativi.' },
    { icon: '🔄', title: 'Aggiornamenti e manutenzione', description: 'Aggiornamenti periodici, backup e monitoraggio delle performance.' },
    { icon: '📊', title: 'Reportistica e analytics', description: 'Dashboard con completamenti, punteggi e statistiche per dipendente.' },
  ],
  forWho: [
    { icon: '🏭', title: 'PMI senza reparto IT', description: 'Piccole e medie imprese che vogliono una LMS senza gestirla internamente.' },
    { icon: '📚', title: 'Società di formazione', description: 'Enti che erogano formazione a clienti esterni e devono gestire molti corsi.' },
    { icon: '🏛️', title: 'Enti pubblici e PA', description: 'Pubblica amministrazione con obblighi di formazione del personale.' },
  ],
  steps: [
    { number: '01', icon: '🔍', title: 'Analisi esigenze', description: 'Valutiamo numero utenti, corsi, integrazioni necessarie e budget.' },
    { number: '02', icon: '⚙️', title: 'Setup e configurazione', description: 'Installiamo e configuriamo la piattaforma con il tuo branding.' },
    { number: '03', icon: '📡', title: 'Gestione continuativa', description: 'Gestiamo la piattaforma con aggiornamenti, supporto e reportistica mensile.' },
  ],
}

export default function ServiceLMS() {
  return <ServicePage {...data} />
}
