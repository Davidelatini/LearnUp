import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Logos from './components/Logos'
import UseCases from './components/UseCases'
import CTAFaq from './components/CTAFaq'
import WorkTimeline from './components/WorkTimeline'
import ChiSono from './components/ChiSono'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import ServiceElearning from './pages/ServiceElearning'
import ServiceLMS from './pages/ServiceLMS'
import ServiceWebinar from './pages/ServiceWebinar'
import ServiceSiti from './pages/ServiceSiti'
import './index.css'

function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">
      <Navbar />
      <Hero />
      <Logos />
      <ChiSono />
      <UseCases />
      <WorkTimeline />
      <CTAFaq />
      
      <Footer />
      <ChatBot />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/servizi/corsi-elearning" element={<ServiceElearning />} />
        <Route path="/servizi/gestione-lms" element={<ServiceLMS />} />
        <Route path="/servizi/webinar" element={<ServiceWebinar />} />
        <Route path="/servizi/siti-formativi" element={<ServiceSiti />} />
      </Routes>
    </BrowserRouter>
  )
}
