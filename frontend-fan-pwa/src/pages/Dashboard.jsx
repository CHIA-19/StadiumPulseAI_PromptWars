import React, { useState, useEffect, useRef } from 'react';
import { GATES, INCIDENTS, AI_REPLIES } from '../data/mockData';

// Extracted MiniChat to its own small component for better structure
function MiniChat() {
  const [msgs, setMsgs] = useState([
    { role:'ai', text:"¡Hola! Gate C3 is congested. I've rerouted fans via Gate A1. How can I help?" },
    { role:'user', text:'¿Cuál es la ruta más rápida a la Sección 214?' },
    { role:'ai',  text:'📍 Gate A1 (clear) → Concourse North → Elevator 3 → Section 214. ETA 4 min.' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, typing]);

  function send(txt) {
    const t = txt || input.trim(); if (!t) return;
    setMsgs(p => [...p, { role:'user', text:t }]);
    setInput(''); setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { role:'ai', text: AI_REPLIES[Math.floor(Math.random()*AI_REPLIES.length)] }]);
    }, 1600);
  }

  return (
    <>
      <div className="quick-chips">
        {['🚻 Restroom?', '🍔 Halal food?', '♿ Step-free route', '🚪 Best exit?'].map(c => (
          <button key={c} className="chip" onClick={() => send(c)} aria-label={`Ask: ${c}`}>{c}</button>
        ))}
      </div>
      <div style={{ maxHeight:200, overflowY:'auto', padding:'14px 20px', display:'flex', flexDirection:'column', gap:10, background:'var(--bg)' }} role="log" aria-live="polite">
        {msgs.map((m,i) => (
          <div key={i} className={`msg-row${m.role==='user'?' user-row':''}`}>
            <div className="msg-avatar" aria-hidden="true">{m.role==='ai'?'🤖':'👤'}</div>
            <div className={`msg-bubble ${m.role}`}>{m.text}</div>
          </div>
        ))}
        {typing && <div className="typing-indicator"><div className="typing-dots"><span/><span/><span/></div><span style={{fontSize:12,color:'var(--text-3)'}}>Pulse AI is typing…</span></div>}
        <div ref={endRef} />
      </div>
      <div className="chat-input-bar">
        <label htmlFor="minichat-input" className="sr-only">Ask anything about the stadium</label>
        <input id="minichat-input" className="chat-input" placeholder="Ask anything about the stadium…" value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()} />
        <button className="btn btn-secondary btn-icon" title="Voice input" aria-label="Use voice input"><span className="ms" aria-hidden="true">mic</span></button>
        <button className="btn btn-blue btn-icon" onClick={() => send()} aria-label="Send message"><span className="ms" aria-hidden="true">send</span></button>
      </div>
    </>
  );
}

export default function Dashboard({ setActive }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Stadium Command Center</h1>
          <div className="page-subtitle">MetLife Stadium · USA vs Brazil · Group Stage · Live now</div>
        </div>
        <div className="page-header-actions">
          <div className="live-chip"><span className="live-dot" aria-hidden="true" />Stadium Brain Active</div>
          <button className="btn btn-primary" onClick={() => setActive('concierge')}>
            <span className="ms" aria-hidden="true">smart_toy</span> Ask AI
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="stats-grid" aria-label="Quick Statistics">
        {[
          { label:'Total Fans', value:'74,823', meta:'↑ 98% capacity', cls:'green', icon:'people' },
          { label:'Active Incidents', value:'5', meta:'2 high · 2 med · 1 low', cls:'red', icon:'report' },
          { label:'CO₂ Saved Today', value:'142t', meta:'82% used eco transport', cls:'gold', icon:'eco' },
          { label:'Avg Gate Wait', value:'7.2m', meta:'↓ 3.1 min from kickoff', cls:'blue', icon:'timer' },
        ].map(s => (
          <article key={s.label} className={`stat-card ${s.cls}`} style={{animationDelay:'.05s'}}>
            <h2 className="stat-label" style={{display:'flex',alignItems:'center',gap:6}}>
              <span className="ms" style={{fontSize:16}} aria-hidden="true">{s.icon}</span>{s.label}
            </h2>
            <div className="stat-value">{s.value}</div>
            <div className="stat-meta">{s.meta}</div>
          </article>
        ))}
      </section>

      {/* Main grid */}
      <div className="dashboard-grid">
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Quick gate overview */}
          <section className="card" aria-label="Gate Crowd Status">
            <header className="card-header">
              <h2><span className="ms" aria-hidden="true">heat_map</span> Gate Crowd Status</h2>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <div className="live-chip"><span className="live-dot" aria-hidden="true" />Live</div>
                <button className="btn btn-secondary btn-sm" onClick={() => setActive('heatmap')}>View All</button>
              </div>
            </header>
            <div className="gate-grid" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
              {GATES.map(g => (
                <article key={g.id} className={`gate-tile ${g.status}`}>
                  <div className="gate-tile-top">
                    <h3 className="gate-tile-name">{g.id}</h3>
                    <span className="gate-status-badge">{g.status}</span>
                  </div>
                  <div className="gate-density-val" aria-label={`${g.density}% capacity`}>{g.density}%</div>
                  <div className="gate-bar-bg" aria-hidden="true"><div className="gate-bar-fg" style={{width:`${g.density}%`}} /></div>
                  <div className="gate-tile-footer"><span className="ms" aria-hidden="true">schedule</span>{g.wait}</div>
                </article>
              ))}
            </div>
          </section>

          {/* AI Concierge mini */}
          <section className="card" aria-label="AI Concierge Preview">
            <header className="card-header">
              <h2><span className="ms" aria-hidden="true">smart_toy</span> AI Concierge · Gemini 2.0</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setActive('concierge')}>Full View</button>
            </header>
            <MiniChat />
          </section>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Match info */}
          <section className="card" aria-label="Live Match Information">
            <header className="card-header">
              <h2><span className="ms" aria-hidden="true">sports_soccer</span> Live Match</h2>
              <span className="match-status-chip live">● Live</span>
            </header>
            <div style={{ padding:'20px', textAlign:'center' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20, marginBottom:12 }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:40 }} aria-hidden="true">🇺🇸</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>USA</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:36, fontWeight:900, color:'var(--text)', letterSpacing:-2 }} aria-label="Score 2 to 1">2 – 1</div>
                  <div style={{ fontSize:13, color:'var(--red)', fontWeight:700 }}>67' · 2nd Half</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:40 }} aria-hidden="true">🇧🇷</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>Brazil</div>
                </div>
              </div>
              <div style={{ fontSize:12, color:'var(--text-2)', background:'var(--surface-2)', borderRadius:8, padding:'8px 12px' }}>
                MetLife Stadium · Group Stage · Matchday 3
              </div>
            </div>
          </section>

          {/* Incident feed mini */}
          <section className="card" aria-label="Recent Incidents">
            <header className="card-header">
              <h2><span className="ms" aria-hidden="true">report</span> Recent Incidents</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setActive('incidents')}>View All</button>
            </header>
            <div className="incident-list">
              {INCIDENTS.slice(0,3).map(inc => (
                <article key={inc.id} className="incident-row">
                  <div className={`incident-severity ${inc.sev}`} aria-hidden="true">
                    <span className="ms">{inc.sev==='high'?'warning':inc.sev==='med'?'info':'check_circle'}</span>
                  </div>
                  <div className="incident-body">
                    <h3 className="incident-title">{inc.title}</h3>
                    <div className="incident-loc">{inc.loc}</div>
                  </div>
                  <div className="incident-meta">
                    <span className={`sev-badge ${inc.sev}`}>{inc.sev}</span>
                    <span className="incident-time">{inc.time}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Quick transit */}
          <section className="card" aria-label="Transit Quick Planner">
            <header className="card-header">
              <h2><span className="ms" aria-hidden="true">directions_transit</span> Transit Planner</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setActive('transit')}>Full View</button>
            </header>
            <div style={{ padding:'14px 20px' }}>
              <div style={{ fontSize:13, color:'var(--text-2)', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
                <span className="ms" style={{fontSize:16, color:'var(--green)'}} aria-hidden="true">schedule</span>
                Post-match best departure: <strong style={{color:'var(--text)'}}> 21:47</strong>
              </div>
              <button className="btn btn-primary" style={{width:'100%'}} onClick={() => setActive('transit')}>
                <span className="ms" aria-hidden="true">navigation</span> Plan My Route Home
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
