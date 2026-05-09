import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Logos from './components/Logos'
import HowWeWork from './components/HowWeWork'
import UseCases from './components/UseCases'
import Features from './components/Features'
import Pricing from './components/Pricing'
import WhyLearnUp from './components/WhyLearnUp'
import Badges from './components/Badges'
import GetStarted from './components/GetStarted'
import FAQ from './components/FAQ'
import PreFooterCTA from './components/PreFooterCTA'
import TechStack from './components/TechStack'
import ServicesGrid from './components/ServicesGrid'
import WorkProcess from './components/WorkProcess'
import StrengthPoints from './components/StrengthPoints'
import FinalCTA from './components/FinalCTA'
import ErrorBoundary from './components/ErrorBoundary'

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
      <HowWeWork />
      <UseCases />
      <Features />
      <Pricing />
      <WhyLearnUp />
      <Badges />
      <GetStarted />
      <FAQ />
      <PreFooterCTA />
      <TechStack />
      <ServicesGrid />
      <WorkProcess />
      <StrengthPoints />
      <FinalCTA />
      
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
