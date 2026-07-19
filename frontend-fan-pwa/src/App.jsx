import React, { useState, Suspense, lazy } from 'react';
import './App.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Toasts from './components/layout/Toasts';
import LangModal from './components/layout/LangModal';

// Lazy-loaded Page Components for Performance Efficiency
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CrowdHeatmap = lazy(() => import('./pages/CrowdHeatmap'));
const FullConcierge = lazy(() => import('./pages/FullConcierge'));
const Wayfinding = lazy(() => import('./pages/Wayfinding'));
const TransitPlanner = lazy(() => import('./pages/TransitPlanner'));
const IncidentFeed = lazy(() => import('./pages/IncidentFeed'));
const VolunteerReport = lazy(() => import('./pages/VolunteerReport'));
const Sustainability = lazy(() => import('./pages/Sustainability'));
const MatchSchedule = lazy(() => import('./pages/MatchSchedule'));

function App() {
  const [active, setActive] = useState('home');
  const [lang, setLang] = useState('EN');
  const [showLang, setShowLang] = useState(false);
  const [dark, setDark] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Apply theme to document
  React.useEffect(() => {
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }, [dark]);

  function addToast(type, title, msg) {
    const id = Date.now();
    setToasts(p => [...p, { id, type, title, msg }]);
    setTimeout(() => {
      setToasts(p => p.filter(t => t.id !== id));
    }, 5000);
  }

  function dismissToast(id) {
    setToasts(p => p.filter(t => t.id !== id));
  }

  return (
    <div className="app-shell">
      <Navbar 
        onLangClick={() => setShowLang(true)} 
        lang={lang} 
        dark={dark} 
        setDark={setDark} 
        onAlertClick={() => setActive('incidents')}
        alertCount={5}
      />
      <div className="app-body">
        <Sidebar active={active} setActive={setActive} />
        <main className="app-main" id="main-content" tabIndex="-1">
          <Suspense fallback={
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
              <div className="typing-dots"><span/><span/><span/></div>
            </div>
          }>
            {active === 'home' && <Dashboard setActive={setActive} />}
            {active === 'heatmap' && <CrowdHeatmap />}
            {active === 'concierge' && <FullConcierge />}
            {active === 'wayfinding' && <Wayfinding />}
            {active === 'transit' && <TransitPlanner />}
            {active === 'incidents' && <IncidentFeed />}
            {active === 'volunteer' && <VolunteerReport setActive={setActive} addToast={addToast} />}
            {active === 'sustain' && <Sustainability />}
            {active === 'schedule' && <MatchSchedule />}
          </Suspense>
        </main>
      </div>

      <Toasts toasts={toasts} dismiss={dismissToast} />
      
      {showLang && (
        <LangModal current={lang} setCurrent={setLang} onClose={() => setShowLang(false)} />
      )}
    </div>
  );
}

export default App;
