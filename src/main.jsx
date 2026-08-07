import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import JarvisApp from './JarvisApp.jsx';
import MindHome from './MindHome.jsx';

function App() {
  const [view, setView] = useState(null);

  if (view) return <JarvisApp key={view} initialView={view} onHome={() => setView(null)} />;
  return <MindHome onNavigate={setView} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
