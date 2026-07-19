import { useState, useEffect, useRef } from 'react'
import './App.css'

/* ─── Static Data ────────────────────────────────────── */
const GATES = [
  { id: 'A1', name: 'Gate A1 – North', density: 34, status: 'calm',     wait: '< 1 min',  crowd: 2340 },
  { id: 'B2', name: 'Gate B2 – East',  density: 62, status: 'caution',  wait: '5–8 min',  crowd: 4180 },
  { id: 'C3', name: 'Gate C3 – South', density: 91, status: 'critical', wait: '22 min',   crowd: 6120 },
  { id: 'D4', name: 'Gate D4 – West',  density: 28, status: 'calm',     wait: '< 1 min',  crowd: 1890 },
  { id: 'E5', name: 'Gate E5 – NE',    density: 73, status: 'caution',  wait: '8–12 min', crowd: 4920 },
  { id: 'F6', name: 'Gate F6 – NW',    density: 19, status: 'calm',     wait: '< 1 min',  crowd: 1280 },
]

const TRANSITS = [
  { type:'train', icon:'train',          name:'Metro Line 3',    sub:'Platform 2 · departs 21:47 · 3 min walk', time:'12 min', co2:'0.4 kg',  rec:true  },
  { type:'bus',   icon:'directions_bus', name:'Bus 47X Express', sub:'Stop C1 · departs 21:52',                 time:'24 min', co2:'1.2 kg',  rec:false },
  { type:'walk',  icon:'directions_walk',name:'Walk – East Gate',sub:'Via East Promenade · Step-free',          time:'28 min', co2:'0 kg',    rec:false },
  { type:'car',   icon:'directions_car', name:'Rideshare / Uber',sub:'Surge ×2.4 active – not recommended',    time:'18 min', co2:'3.1 kg',  rec:false },
]

const INCIDENTS = [
  { id:1, title:'Spilled liquid hazard',     loc:'Concourse B, near Stall 12',   time:'2 min ago',  sev:'low',  assigned:'Cleaning Team 3' },
  { id:2, title:'Gate C3 – Critical congestion', loc:'Gate C3 entrance',         time:'8 min ago',  sev:'high', assigned:'Security Lead' },
  { id:3, title:'Medical assistance needed', loc:'Section 108, Row F',           time:'15 min ago', sev:'med',  assigned:'First Aid Team' },
  { id:4, title:'Lost child reported',       loc:'Fan Info Desk – South',        time:'22 min ago', sev:'med',  assigned:'Security Team 1' },
  { id:5, title:'Barrier malfunction',       loc:'Gate A1 turnstile 4',          time:'31 min ago', sev:'low',  assigned:'Maintenance' },
]

const MATCHES = [
  { flag1:'🇺🇸', t1:'USA',     flag2:'🇧🇷', t2:'Brazil',  score:'2 – 1', venue:'MetLife, NJ',    date:'NOW',   status:'live'  },
  { flag1:'🇲🇽', t1:'Mexico',  flag2:'🇦🇷', t2:'Argentina',score:'–',    venue:'AT&T, Dallas',    date:'Today', status:'today' },
  { flag1:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', t1:'England', flag2:'🇫🇷', t2:'France', score:'1 – 0', venue:'SoFi, LA',        date:'FT',    status:'done'  },
  { flag1:'🇩🇪', t1:'Germany', flag2:'🇯🇵', t2:'Japan',   score:'2 – 2', venue:'Allegiant, Vegas', date:'FT',    status:'done'  },
]

const LEADERBOARD = [
  { flag:'🇸🇪', name:'Björn Larsson',    co2:'0.2 kg', pct:98 },
  { flag:'🇨🇦', name:'Anika Patel',      co2:'0.4 kg', pct:92 },
  { flag:'🇧🇷', name:'Gabriel Costa',   co2:'0.6 kg', pct:85 },
  { flag:'🇯🇵', name:'Yuki Tanaka',      co2:'0.7 kg', pct:80 },
  { flag:'🇩🇪', name:'Lena Müller',      co2:'1.0 kg', pct:72 },
]

const AI_REPLIES = [
  "📍 Head to **Gate A1** (34% capacity, fully clear) → Concourse North → Elevator 3 to Level 2 → Section 214 is on your right. ETA: ~4 min. Shall I start AR navigation?",
  "🚻 Nearest accessible restroom is **60m ahead on Concourse B** — step-free, spacious, and currently clear. I've pinned it on your indoor map.",
  "🍔 I found **3 halal-certified stalls** near Gate C: Al-Bayt Kitchen (Concourse 2 ⭐4.6), Crescent Bites (Section 108 ⭐4.4), and Medina Street Food (Gate B ⭐4.8).",
  "🚇 Post-match exit: **Metro Line 3 departs 21:47** from Platform 2 — I recommend leaving your seat at the 88th minute. Walk time to platform: 3 min. No surge pricing!",
  "♿ Step-free route from Gate A1 to Section 214: Ground floor → Lift 3 (Level 2) → Left at Concourse North. Companion seat availability: ✅ Row G, Seats 11–12.",
  "🌿 Your trip via metro saved **2.7 kg CO₂** vs driving! You've earned the **Green Fan Bronze badge**. 82% of fans today chose low-carbon transport — amazing!",
]

/* ─── Sub-components ─────────────────────────────────── */

function Navbar({ onLangClick, lang, dark, setDark, onAlertClick, alertCount }) {
  const tickers = [
    { label:'USA 🇺🇸 vs 🇧🇷 Brazil', score:'2 – 1', live:true  },
    { label:'Mexico 🇲🇽 vs 🇦🇷 Argentina', score:'Kickoff 19:30', live:false },
    { label:'Gate C3 ⚠ Critical – Rerouting active', score:'', live:true },
    { label:'MetLife Stadium · 74,823 fans · 82°F', score:'', live:false },
    { label:'🌿 82% fans used eco transport today', score:'+142t CO₂ saved', live:false },
  ]
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <div className="nav-logo-icon">⚡</div>
        <div>
          <div className="nav-logo-text">StadiumPulse AI</div>
          <div className="nav-logo-sub">FIFA World Cup 2026</div>
        </div>
      </div>

      <div className="nav-ticker">
        <div className="nav-ticker-inner">
          {[...tickers, ...tickers].map((t, i) => (
            <div key={i} className="ticker-item">
              {t.live && <span className="live-dot" />}
              {t.label}
              {t.score && <span className="ticker-score">{t.score}</span>}
              <span style={{ opacity:.3 }}>|</span>
            </div>
          ))}
        </div>
      </div>

      <div className="nav-actions">
        <button className="nav-btn" onClick={onLangClick}>
          <span className="ms" style={{fontSize:16}}>language</span>
          {lang}
        </button>
        <button className="nav-icon-btn" onClick={onAlertClick} title="Alerts">
          <span className="ms">notifications</span>
          {alertCount > 0 && <span className="nav-badge">{alertCount}</span>}
        </button>
        <button className="nav-icon-btn" onClick={() => setDark(d => !d)} title="Toggle theme">
          <span className="ms">{dark ? 'light_mode' : 'dark_mode'}</span>
        </button>
        <button className="nav-icon-btn" title="Profile">
          <span className="ms">account_circle</span>
        </button>
      </div>
    </nav>
  )
}

function Sidebar({ active, setActive }) {
  const items = [
    { id:'home',      icon:'dashboard',          label:'Dashboard',       pill: null },
    { id:'heatmap',   icon:'heat_map',            label:'Crowd Heatmap',   pill:{txt:'LIVE', cls:'pill-red'} },
    { id:'concierge', icon:'smart_toy',           label:'AI Concierge',    pill:{txt:'AI', cls:'pill-blue'} },
    { id:'wayfinding',icon:'explore',             label:'Wayfinding Map',  pill: null },
    { id:'transit',   icon:'directions_transit',  label:'Transit Planner', pill: null },
    { id:'incidents', icon:'report',              label:'Incident Feed',   pill:{txt:'5', cls:'pill-red'} },
    { id:'volunteer', icon:'volunteer_activism',  label:'Report Incident', pill: null },
    { id:'sustain',   icon:'eco',                 label:'Sustainability',  pill:{txt:'NEW', cls:'pill-green'} },
    { id:'schedule',  icon:'event',               label:'Match Schedule',  pill: null },
  ]
  return (
    <aside className="sidebar">
      <span className="sidebar-section-label">Operations</span>
      {items.slice(0,2).map(i => <SidebarItem key={i.id} {...i} active={active} setActive={setActive} />)}
      <div className="sidebar-divider" />
      <span className="sidebar-section-label">Fan Services</span>
      {items.slice(2,5).map(i => <SidebarItem key={i.id} {...i} active={active} setActive={setActive} />)}
      <div className="sidebar-divider" />
      <span className="sidebar-section-label">Safety & Green</span>
      {items.slice(5).map(i => <SidebarItem key={i.id} {...i} active={active} setActive={setActive} />)}
    </aside>
  )
}

function SidebarItem({ id, icon, label, pill, active, setActive }) {
  return (
    <button className={`sidebar-item${active === id ? ' active' : ''}`} onClick={() => setActive(id)}>
      <span className="ms">{icon}</span>
      {label}
      {pill && <span className={`sidebar-pill ${pill.cls}`}>{pill.txt}</span>}
    </button>
  )
}

/* ── Dashboard Home ── */
function Dashboard({ setActive }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Stadium Command Center</div>
          <div className="page-subtitle">MetLife Stadium · USA vs Brazil · Group Stage · Live now</div>
        </div>
        <div className="page-header-actions">
          <div className="live-chip"><span className="live-dot" />Stadium Brain Active</div>
          <button className="btn btn-primary" onClick={() => setActive('concierge')}>
            <span className="ms">smart_toy</span> Ask AI
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label:'Total Fans', value:'74,823', meta:'↑ 98% capacity', cls:'green', icon:'people' },
          { label:'Active Incidents', value:'5', meta:'2 high · 2 med · 1 low', cls:'red', icon:'report' },
          { label:'CO₂ Saved Today', value:'142t', meta:'82% used eco transport', cls:'gold', icon:'eco' },
          { label:'Avg Gate Wait', value:'7.2m', meta:'↓ 3.1 min from kickoff', cls:'blue', icon:'timer' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cls}`} style={{animationDelay:'.05s'}}>
            <div className="stat-label" style={{display:'flex',alignItems:'center',gap:6}}>
              <span className="ms" style={{fontSize:16}}>{s.icon}</span>{s.label}
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-meta">{s.meta}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="dashboard-grid">
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Quick gate overview */}
          <div className="card">
            <div className="card-header">
              <h3><span className="ms">heat_map</span> Gate Crowd Status</h3>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <div className="live-chip"><span className="live-dot" />Live</div>
                <button className="btn btn-secondary btn-sm" onClick={() => setActive('heatmap')}>View All</button>
              </div>
            </div>
            <div className="gate-grid" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
              {GATES.map(g => (
                <div key={g.id} className={`gate-tile ${g.status}`}>
                  <div className="gate-tile-top">
                    <div className="gate-tile-name">{g.id}</div>
                    <span className="gate-status-badge">{g.status}</span>
                  </div>
                  <div className="gate-density-val">{g.density}%</div>
                  <div className="gate-bar-bg"><div className="gate-bar-fg" style={{width:`${g.density}%`}} /></div>
                  <div className="gate-tile-footer"><span className="ms">schedule</span>{g.wait}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Concierge mini */}
          <div className="card">
            <div className="card-header">
              <h3><span className="ms">smart_toy</span> AI Concierge · Gemini 2.0</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setActive('concierge')}>Full View</button>
            </div>
            <MiniChat />
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Match info */}
          <div className="card">
            <div className="card-header">
              <h3><span className="ms">sports_soccer</span> Live Match</h3>
              <span className="match-status-chip live">● Live</span>
            </div>
            <div style={{ padding:'20px', textAlign:'center' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20, marginBottom:12 }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:40 }}>🇺🇸</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>USA</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:36, fontWeight:900, color:'var(--text)', letterSpacing:-2 }}>2 – 1</div>
                  <div style={{ fontSize:13, color:'var(--red)', fontWeight:700 }}>67' · 2nd Half</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:40 }}>🇧🇷</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>Brazil</div>
                </div>
              </div>
              <div style={{ fontSize:12, color:'var(--text-2)', background:'var(--surface-2)', borderRadius:8, padding:'8px 12px' }}>
                MetLife Stadium · Group Stage · Matchday 3
              </div>
            </div>
          </div>

          {/* Incident feed mini */}
          <div className="card">
            <div className="card-header">
              <h3><span className="ms">report</span> Recent Incidents</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setActive('incidents')}>View All</button>
            </div>
            <div className="incident-list">
              {INCIDENTS.slice(0,3).map(inc => (
                <div key={inc.id} className="incident-row">
                  <div className={`incident-severity ${inc.sev}`}>
                    <span className="ms">{inc.sev==='high'?'warning':inc.sev==='med'?'info':'check_circle'}</span>
                  </div>
                  <div className="incident-body">
                    <div className="incident-title">{inc.title}</div>
                    <div className="incident-loc">{inc.loc}</div>
                  </div>
                  <div className="incident-meta">
                    <span className={`sev-badge ${inc.sev}`}>{inc.sev}</span>
                    <span className="incident-time">{inc.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick transit */}
          <div className="card">
            <div className="card-header">
              <h3><span className="ms">directions_transit</span> Transit Planner</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setActive('transit')}>Full View</button>
            </div>
            <div style={{ padding:'14px 20px' }}>
              <div style={{ fontSize:13, color:'var(--text-2)', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
                <span className="ms" style={{fontSize:16, color:'var(--green)'}}>schedule</span>
                Post-match best departure: <strong style={{color:'var(--text)'}}> 21:47</strong>
              </div>
              <button className="btn btn-primary" style={{width:'100%'}} onClick={() => setActive('transit')}>
                <span className="ms">navigation</span> Plan My Route Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Mini Chat ── */
function MiniChat() {
  const [msgs, setMsgs] = useState([
    { role:'ai', text:"¡Hola! Gate C3 is congested. I've rerouted fans via Gate A1. How can I help?" },
    { role:'user', text:'¿Cuál es la ruta más rápida a la Sección 214?' },
    { role:'ai',  text:'📍 Gate A1 (clear) → Concourse North → Elevator 3 → Section 214. ETA 4 min.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef()

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs, typing])

  function send(txt) {
    const t = txt || input.trim(); if (!t) return
    setMsgs(p => [...p, { role:'user', text:t }])
    setInput(''); setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs(p => [...p, { role:'ai', text: AI_REPLIES[Math.floor(Math.random()*AI_REPLIES.length)] }])
    }, 1600)
  }

  return (
    <>
      <div className="quick-chips">
        {['🚻 Restroom?', '🍔 Halal food?', '♿ Step-free route', '🚪 Best exit?'].map(c => (
          <button key={c} className="chip" onClick={() => send(c)}>{c}</button>
        ))}
      </div>
      <div style={{ maxHeight:200, overflowY:'auto', padding:'14px 20px', display:'flex', flexDirection:'column', gap:10, background:'var(--bg)' }}>
        {msgs.map((m,i) => (
          <div key={i} className={`msg-row${m.role==='user'?' user-row':''}`}>
            <div className="msg-avatar">{m.role==='ai'?'🤖':'👤'}</div>
            <div className={`msg-bubble ${m.role}`}>{m.text}</div>
          </div>
        ))}
        {typing && <div className="typing-indicator"><div className="typing-dots"><span/><span/><span/></div><span style={{fontSize:12,color:'var(--text-3)'}}>Pulse AI is typing…</span></div>}
        <div ref={endRef} />
      </div>
      <div className="chat-input-bar">
        <input className="chat-input" placeholder="Ask anything about the stadium…" value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()} />
        <button className="btn btn-secondary btn-icon" title="Voice input"><span className="ms">mic</span></button>
        <button className="btn btn-blue btn-icon" onClick={() => send()}><span className="ms">send</span></button>
      </div>
    </>
  )
}

/* ── Full AI Concierge ── */
function FullConcierge() {
  const [msgs, setMsgs] = useState([
    { role:'ai', text:"¡Bienvenido! I'm Pulse, your AI stadium concierge powered by Gemini 2.0. I speak 10 languages and have real-time access to crowd data, maps, and transit info. How can I help you today? ⚽", time:'2:34 PM' },
    { role:'user', text:'Where is the nearest accessible restroom?', time:'2:35 PM' },
    { role:'ai', text:"♿ Nearest step-free restroom: Concourse B, 60m ahead (next to Stall 12). It is fully accessible with wide entry, grab rails, and low-height fixtures. Currently no queue. I have pinned it on your indoor map.", time:'2:35 PM' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef()

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs, typing])

  function send(txt) {
    const t = txt || input.trim(); if (!t) return
    setMsgs(p => [...p, { role:'user', text:t, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }])
    setInput(''); setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const reply = AI_REPLIES[Math.floor(Math.random()*AI_REPLIES.length)]
      setMsgs(p => [...p, { role:'ai', text:reply, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }])
    }, 1800)
  }

  const AGENTS = [
    { name:'Concierge Agent', sub:'Wayfinding · Food · Info', emoji:'🤖', active:true },
    { name:'Mobility Agent',  sub:'Transit planner',          emoji:'🚇', active:false },
    { name:'Accessibility',   sub:'Step-free routing',        emoji:'♿', active:false },
    { name:'Sustainability',  sub:'Carbon tracker',           emoji:'🌿', active:false },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div className="page-header">
        <div>
          <div className="page-title">AI Concierge</div>
          <div className="page-subtitle">Powered by Gemini 2.0 · Multilingual · Voice-enabled · 10 languages</div>
        </div>
        <div className="page-header-actions">
          <div className="live-chip"><span className="live-dot" />Online</div>
        </div>
      </div>
      <div className="card" style={{ overflow:'hidden' }}>
        <div className="chat-layout">
          <div className="chat-sidebar-left">
            <div style={{fontSize:11,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:1,padding:'4px 10px 8px'}}>Agents</div>
            {AGENTS.map(a => (
              <div key={a.name} className={`chat-contact${a.active?' active':''}`}>
                <div className="chat-avatar">{a.emoji}</div>
                <div className="chat-contact-info">
                  <div className="chat-contact-name">{a.name}</div>
                  <div className="chat-contact-sub">{a.sub}</div>
                </div>
              </div>
            ))}
            <div style={{borderTop:'1px solid var(--border)', marginTop:8, paddingTop:12}}>
              <div style={{fontSize:11,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:1,padding:'0 10px 8px'}}>Languages</div>
              {['🇺🇸 EN','🇪🇸 ES','🇫🇷 FR','🇧🇷 PT','🇸🇦 AR','🇨🇳 ZH'].map(l => (
                <div key={l} style={{padding:'6px 10px', fontSize:12.5, fontWeight:500, color:'var(--text-2)', borderRadius:8, cursor:'pointer'}}>{l}</div>
              ))}
            </div>
          </div>
          <div className="chat-main">
            <div className="chat-top-bar">
              <div className="chat-avatar" style={{background:'var(--blue-light)'}}>🤖</div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:'var(--text)'}}>Pulse AI · Concierge Agent</div>
                <div style={{fontSize:12,color:'var(--text-3)',display:'flex',alignItems:'center',gap:5}}><span className="live-dot" />Online · responding in ~1.5s</div>
              </div>
              <span className="chat-model-tag">Gemini 2.0 Flash</span>
              <button className="btn btn-secondary btn-icon btn-sm"><span className="ms">mic</span></button>
              <button className="btn btn-secondary btn-icon btn-sm"><span className="ms">volume_up</span></button>
            </div>
            <div className="chat-messages">
              {msgs.map((m,i) => (
                <div key={i} className={`msg-row${m.role==='user'?' user-row':''}`}>
                  <div className="msg-avatar">{m.role==='ai'?'🤖':'👤'}</div>
                  <div>
                    <div className={`msg-bubble ${m.role}`}>{m.text}</div>
                    <div className={`msg-time`} style={{textAlign:m.role==='user'?'right':'left'}}>{m.time}</div>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="msg-row">
                  <div className="msg-avatar">🤖</div>
                  <div className="typing-indicator"><div className="typing-dots"><span/><span/><span/></div><span style={{fontSize:12,color:'var(--text-3)'}}>Pulse AI is typing…</span></div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            <div className="quick-chips">
              {['🚻 Nearest restroom?','🍔 Halal food near Gate C?','♿ Step-free route to my seat','🚪 Fastest exit after match?','🚇 Best transit home?','📍 Where is Section 214?'].map(c => (
                <button key={c} className="chip" onClick={() => send(c)}>{c}</button>
              ))}
            </div>
            <div className="chat-input-bar">
              <input className="chat-input" placeholder="Ask anything about the stadium in any language…" value={input}
                onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()} />
              <button className="btn btn-secondary btn-icon" title="Voice"><span className="ms">mic</span></button>
              <button className="btn btn-blue" onClick={() => send()}><span className="ms">send</span>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Crowd Heatmap Full ── */
function CrowdHeatmap() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? GATES : GATES.filter(g => g.status === filter)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Live Gate Heatmap</div>
          <div className="page-subtitle">Real-time crowd density from IoT turnstile sensors · Updated every 30s</div>
        </div>
        <div className="page-header-actions">
          <div className="live-chip"><span className="live-dot" />Updating</div>
          {['all','calm','caution','critical'].map(f => (
            <button key={f} className={`btn ${filter===f?'btn-primary':'btn-secondary'} btn-sm`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="stats-grid">
        {[
          { label:'Clear Gates', value: GATES.filter(g=>g.status==='calm').length,     cls:'green', icon:'check_circle' },
          { label:'Caution Gates', value: GATES.filter(g=>g.status==='caution').length, cls:'gold',  icon:'warning_amber' },
          { label:'Critical Gates', value: GATES.filter(g=>g.status==='critical').length,cls:'red',   icon:'error' },
          { label:'Total Fans Inside', value:'74,823', cls:'blue', icon:'people' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div className="stat-label" style={{display:'flex',alignItems:'center',gap:6}}><span className="ms" style={{fontSize:16}}>{s.icon}</span>{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header">
          <h3><span className="ms">heat_map</span>All Gates — Crowd Density</h3>
          <span style={{fontSize:12,color:'var(--text-2)'}}>Last updated: 2 seconds ago</span>
        </div>
        <div className="gate-grid" style={{ gridTemplateColumns:'repeat(3,1fr)', padding:20 }}>
          {filtered.map(g => (
            <div key={g.id} className={`gate-tile ${g.status}`}>
              <div className="gate-tile-top">
                <div className="gate-tile-name">{g.name}</div>
                <span className="gate-status-badge">{g.status}</span>
              </div>
              <div className="gate-density-val">{g.density}%</div>
              <div style={{fontSize:12,color:'var(--text-2)',marginBottom:6}}>{g.crowd.toLocaleString()} people</div>
              <div className="gate-bar-bg"><div className="gate-bar-fg" style={{width:`${g.density}%`}} /></div>
              <div className="gate-tile-footer"><span className="ms">schedule</span>Wait: {g.wait}</div>
            </div>
          ))}
        </div>
      </div>
      {GATES.some(g => g.status === 'critical') && (
        <div style={{ padding:'16px 20px', background:'var(--red-light)', border:'1.5px solid rgba(232,72,58,.3)', borderRadius:14, display:'flex', alignItems:'center', gap:14 }}>
          <span className="ms" style={{fontSize:28, color:'var(--red)'}}>warning</span>
          <div>
            <div style={{fontWeight:700, color:'var(--red)', fontSize:14}}>AI Recommendation — Stadium Brain</div>
            <div style={{fontSize:13, color:'var(--text)', marginTop:3}}>Gate C3 will reach critical capacity in approx. 14 minutes. Recommend opening auxiliary Gate C3-B and redirecting stewards. Fan concierge has auto-rerouted inbound fans to Gates A1 and F6.</div>
          </div>
          <button className="btn btn-primary btn-sm" style={{flexShrink:0}}>Accept &amp; Deploy</button>
        </div>
      )}
    </div>
  )
}

/* ── Wayfinding ── */
function Wayfinding() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Indoor Wayfinding</div>
          <div className="page-subtitle">AI-powered · Step-free routing · Google Maps Indoor Platform</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><span className="ms">my_location</span>My Location</button>
          <button className="btn btn-primary"><span className="ms">navigation</span>Start AR Navigation</button>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="card" style={{ overflow:'hidden' }}>
          <div className="card-header">
            <h3><span className="ms">map</span>Stadium Map — Level 2</h3>
            <div style={{display:'flex',gap:6}}>
              {['L1','L2','L3','L4'].map(l => (
                <button key={l} className={`btn btn-sm ${l==='L2'?'btn-primary':'btn-secondary'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="map-container">
            {/* SVG Pitch */}
            <svg className="pitch-svg" width="280" height="180" viewBox="0 0 280 180">
              <rect x="10" y="10" width="260" height="160" rx="8" fill="none" stroke="#0B8457" strokeWidth="3" opacity=".5"/>
              <circle cx="140" cy="90" r="36" fill="none" stroke="#0B8457" strokeWidth="2" opacity=".4"/>
              <circle cx="140" cy="90" r="4" fill="#0B8457" opacity=".5"/>
              <rect x="10" y="60" width="36" height="60" rx="2" fill="none" stroke="#0B8457" strokeWidth="2" opacity=".3"/>
              <rect x="234" y="60" width="36" height="60" rx="2" fill="none" stroke="#0B8457" strokeWidth="2" opacity=".3"/>
              <line x1="140" y1="10" x2="140" y2="170" stroke="#0B8457" strokeWidth="1.5" opacity=".3"/>
            </svg>
            {/* You pin */}
            <div className="you-marker">
              <div className="you-circle"/>
              <div className="you-tag">You — Gate A1 entrance</div>
            </div>
            {/* Route */}
            <div className="route-line"/>
            {/* Gate pins */}
            <div className="map-pin" style={{top:18,left:36}}>
              <div className="pin-circle calm">A1</div>
              <div className="pin-label">Gate A1 · 34%</div>
            </div>
            <div className="map-pin" style={{top:18,left:'50%',transform:'translateX(-50%)'}}>
              <div className="pin-circle critical">C3</div>
              <div className="pin-label">Gate C3 · 91% ⚠</div>
            </div>
            <div className="map-pin" style={{top:18,right:36}}>
              <div className="pin-circle calm">F6</div>
              <div className="pin-label">Gate F6 · 19%</div>
            </div>
            <div className="map-pin" style={{bottom:20,left:36}}>
              <div className="pin-circle calm">D4</div>
              <div className="pin-label">Gate D4 · 28%</div>
            </div>
            {/* Restroom pin */}
            <div style={{position:'absolute',top:80,left:'38%',backgroundColor:'#1470F0',color:'#fff',borderRadius:7,padding:'3px 9px',fontSize:10,fontWeight:800,boxShadow:'0 2px 8px rgba(20,112,240,.4)',whiteSpace:'nowrap'}}>
              🚻 Restroom · 60m
            </div>
            {/* Food pin */}
            <div style={{position:'absolute',top:120,left:'55%',background:'var(--gold)',color:'var(--green-dark)',borderRadius:7,padding:'3px 9px',fontSize:10,fontWeight:800,boxShadow:'0 2px 8px rgba(242,183,5,.4)',whiteSpace:'nowrap'}}>
              🍔 Halal · Stall 12
            </div>
            <div className="map-legend">
              {[['var(--mint)','Clear'],['var(--gold)','Caution'],['var(--red)','Critical'],['var(--blue)','You']].map(([c,l]) => (
                <div key={l} className="legend-item">
                  <div className="legend-dot" style={{background:c}}/>
                  {l}
                </div>
              ))}
            </div>
          </div>
          <div className="map-controls-bar">
            <span className="ms" style={{fontSize:20,color:'var(--blue)'}}>stadium</span>
            <div className="route-info">
              <div className="route-dest">📍 Section 214, Row G, Seat 12</div>
              <div className="route-sub">Via Gate A1 (clear) → Concourse North → Elevator 3 → 4 min · Step-free ✓</div>
            </div>
            <button className="btn btn-blue"><span className="ms">navigation</span>Navigate</button>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="card">
            <div className="card-header"><h3><span className="ms">search</span>Search Destination</h3></div>
            <div style={{padding:'16px 20px', display:'flex', flexDirection:'column', gap:12}}>
              {[
                { icon:'chair', label:'My Seat', sub:'Section 214, Row G, Seat 12', color:'var(--blue)' },
                { icon:'wc',    label:'Nearest Restroom', sub:'Concourse B · 60m · Step-free', color:'var(--blue)' },
                { icon:'restaurant', label:'Food & Drink', sub:'12 stalls near you',      color:'var(--gold)' },
                { icon:'local_pharmacy', label:'First Aid', sub:'Gate B, Concourse 1',    color:'var(--red)' },
                { icon:'directions_walk', label:'Exit Routes', sub:'3 options · fastest: Gate A1', color:'var(--mint)' },
              ].map(d => (
                <button key={d.label} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:10, border:'1.5px solid var(--border)', background:'var(--surface-2)', cursor:'pointer', transition:'all .2s', textAlign:'left' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='var(--green)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
                >
                  <span className="ms" style={{fontSize:22,color:d.color}}>{d.icon}</span>
                  <div>
                    <div style={{fontSize:13.5,fontWeight:600,color:'var(--text)'}}>{d.label}</div>
                    <div style={{fontSize:11.5,color:'var(--text-2)'}}>{d.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3><span className="ms">accessible</span>Accessibility Info</h3></div>
            <div style={{padding:'14px 20px', display:'flex', flexDirection:'column', gap:10}}>
              {[
                { icon:'elevator',  label:'Elevators', value:'3 available', ok:true },
                { icon:'ramp_left', label:'Ramp Access', value:'All gates',    ok:true },
                { icon:'hearing',   label:'Hearing Loop', value:'Sections 100–120', ok:true },
                { icon:'wc',        label:'Accessible WC', value:'5 locations',  ok:true },
              ].map(a => (
                <div key={a.label} style={{display:'flex',alignItems:'center',gap:10}}>
                  <span className="ms" style={{fontSize:18,color:'var(--green)'}}>{a.icon}</span>
                  <span style={{flex:1,fontSize:13,color:'var(--text)'}}>{a.label}</span>
                  <span style={{fontSize:12,color:'#1a9960',fontWeight:600}}>✓ {a.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Transit Planner Full ── */
function TransitPlanner() {
  const [selected, setSelected] = useState(0)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Smart Transit Planner</div>
          <div className="page-subtitle">Mobility Agent · Google Maps Platform · Low-carbon routing</div>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="card" style={{overflow:'hidden'}}>
          <div className="card-header">
            <h3><span className="ms">directions_transit</span>Post-Match Routes</h3>
            <div style={{fontSize:13,color:'var(--text-2)'}}>Best departure: <strong style={{color:'var(--text)'}}>21:47</strong></div>
          </div>
          <div className="transit-list">
            {TRANSITS.map((t,i) => (
              <div key={t.name} className={`transit-row${selected===i?' selected':''}`} onClick={() => setSelected(i)}>
                <div className={`transit-icon-box ${t.type}`}><span className="ms">{t.icon}</span></div>
                <div className="transit-info">
                  <div className="transit-name">
                    {t.name}
                    {t.rec && <span className="ai-pick-badge">✓ AI Pick</span>}
                  </div>
                  <div className="transit-sub">{t.sub}</div>
                </div>
                <div className="transit-meta">
                  <div className="transit-time">{t.time}</div>
                  <div className="transit-co2">🌿 {t.co2} CO₂</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{padding:'16px 20px'}}>
            <button className="btn btn-primary" style={{width:'100%', padding:'13px'}}>
              <span className="ms">navigation</span>
              Start Navigation — {TRANSITS[selected].name}
            </button>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="card">
            <div className="card-header"><h3><span className="ms">schedule</span>Surge Predictions</h3></div>
            <div style={{padding:'16px 20px', display:'flex', flexDirection:'column', gap:10}}>
              {[
                { time:'21:30', level:'Low',      note:'Leave now — no crowd',     cls:'calm'   },
                { time:'21:45', level:'Medium',   note:'Match ends · light surge',  cls:'caution'},
                { time:'22:00', level:'Critical', note:'Peak crowd — delay if poss',cls:'critical'},
                { time:'22:20', level:'Low',      note:'Crowds dispersed',          cls:'calm'   },
              ].map(r => (
                <div key={r.time} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:10, background:'var(--surface-2)', border:'1px solid var(--border)' }}>
                  <div style={{fontWeight:800,fontSize:14,color:'var(--text)',width:44,flexShrink:0}}>{r.time}</div>
                  <div className={`gate-status-badge`} style={{
                    background: r.cls==='calm'?'var(--mint-light)':r.cls==='caution'?'var(--gold-light)':'var(--red-light)',
                    color: r.cls==='calm'?'#1a9960':r.cls==='caution'?'#8a6400':'var(--red)',
                    padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:800, flexShrink:0
                  }}>{r.level}</div>
                  <div style={{fontSize:12,color:'var(--text-2)'}}>{r.note}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3><span className="ms">eco</span>Carbon Comparison</h3></div>
            <div style={{padding:'16px 20px', display:'flex', flexDirection:'column', gap:10}}>
              {TRANSITS.map(t => (
                <div key={t.name} style={{display:'flex',alignItems:'center',gap:10}}>
                  <span className="ms" style={{fontSize:18, color: t.co2==='0 kg'?'var(--mint)':t.co2<'1'?'var(--green)':'var(--red)'}}>{t.icon}</span>
                  <div style={{flex:1,fontSize:13,color:'var(--text)',fontWeight:500}}>{t.name}</div>
                  <div style={{fontSize:12,fontWeight:700,color:'#1a9960'}}>🌿 {t.co2}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Incident Feed Full ── */
function IncidentFeed() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Incident Feed</div>
          <div className="page-subtitle">AI-triaged by Gemini Vision · Real-time severity classification</div>
        </div>
        <div className="page-header-actions">
          <div className="live-chip"><span className="live-dot" />Live</div>
          <button className="btn btn-primary"><span className="ms">add</span>Report Incident</button>
        </div>
      </div>
      <div className="stats-grid">
        {[
          { label:'Total Active', value:5,  cls:'blue', icon:'list' },
          { label:'High Severity', value:1, cls:'red',  icon:'error' },
          { label:'Medium', value:2,        cls:'gold', icon:'warning_amber' },
          { label:'Low / Resolved', value:2,cls:'green',icon:'check_circle' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div className="stat-label" style={{display:'flex',alignItems:'center',gap:6}}><span className="ms" style={{fontSize:16}}>{s.icon}</span>{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header">
          <h3><span className="ms">report</span>All Incidents</h3>
          <div style={{display:'flex',gap:8}}>
            {['All','High','Medium','Low'].map(f => (
              <button key={f} className="btn btn-secondary btn-sm">{f}</button>
            ))}
          </div>
        </div>
        <div className="incident-list">
          {INCIDENTS.map(inc => (
            <div key={inc.id} className="incident-row">
              <div className={`incident-severity ${inc.sev}`}>
                <span className="ms">{inc.sev==='high'?'warning':inc.sev==='med'?'info':'check_circle'}</span>
              </div>
              <div className="incident-body">
                <div className="incident-title">{inc.title}</div>
                <div className="incident-loc"><span className="ms" style={{fontSize:13}}>location_on</span> {inc.loc}</div>
                <div className="incident-time">Assigned to: <strong>{inc.assigned}</strong> · {inc.time}</div>
              </div>
              <div className="incident-meta">
                <span className={`sev-badge ${inc.sev}`}>{inc.sev.toUpperCase()}</span>
                <button className="assign-btn">View Details</button>
                <button className="assign-btn">Resolve</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-header"><h3><span className="ms">smart_toy</span>AI Incident Summary · Gemini</h3></div>
        <div style={{padding:'18px 20px', background:'var(--blue-light)', margin:'0 0 0 0'}}>
          <div style={{fontSize:12,fontWeight:800,color:'var(--blue)',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
            <span className="ms" style={{fontSize:16}}>auto_awesome</span> GEMINI-GENERATED SUMMARY
          </div>
          <div style={{fontSize:13.5, color:'var(--text)', lineHeight:1.7}}>
            As of 14:35 local time, MetLife Stadium is managing <strong>5 active incidents</strong>. The highest-priority issue is the <strong>Gate C3 critical congestion</strong> — Stadium Brain has already rerouted approximately 2,100 inbound fans to Gates A1 and F6. A medical assistance case at Section 108 has been assigned to First Aid Team 2 (ETA 2 min). The spilled liquid hazard on Concourse B (low severity) is being addressed by Cleaning Team 3. All other incidents are under control. Recommend increasing steward presence at the East Stand for the next 20 minutes.
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Volunteer Report Form ── */
function VolunteerReport() {
  const [sev, setSev] = useState('low')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ title:'', location:'', notes:'' })
  const draft = `Incident Report — ${new Date().toLocaleTimeString()}\n\nType: Hazard\nLocation: ${form.location||'[Location]'}\nSeverity: ${sev.toUpperCase()}\nDescription: ${form.notes||'[Details]'}\n\nAuto-assigned to: ${sev==='high'?'Security Lead':sev==='med'?'Duty Manager':'Cleaning/Maintenance Team'}\nAction required: Immediate response and area clearance.`

  if (submitted) return (
    <div style={{display:'flex',flexDirection:'column',gap:20,alignItems:'center',justifyContent:'center',padding:'60px 20px'}}>
      <div style={{width:80,height:80,borderRadius:'50%',background:'var(--mint-light)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <span className="ms" style={{fontSize:44,color:'var(--green)'}}>check_circle</span>
      </div>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:22,fontWeight:800,color:'var(--text)'}}>Incident Reported!</div>
        <div style={{fontSize:14,color:'var(--text-2)',marginTop:6}}>Gemini AI has triaged your report and auto-assigned it to the response team.</div>
      </div>
      <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({title:'',location:'',notes:''}); setSev('low') }}>
        <span className="ms">add</span>Report Another
      </button>
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Report Incident</div>
          <div className="page-subtitle">PulseAssist · Volunteer Reporting Tool · AI-triaged by Gemini Vision</div>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header"><h3><span className="ms">volunteer_activism</span>Incident Report Form</h3></div>
          <div className="report-form">
            <div className="form-group">
              <label>Incident Title</label>
              <input className="form-input" placeholder="e.g. Spilled liquid near Gate B" value={form.title} onChange={e => setForm(f => ({...f,title:e.target.value}))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input className="form-input" placeholder="Gate, Section, Concourse…" value={form.location} onChange={e => setForm(f => ({...f,location:e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-select">
                  <option>Safety Hazard</option>
                  <option>Medical</option>
                  <option>Security</option>
                  <option>Infrastructure</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Severity</label>
              <div className="severity-radios">
                {['low','med','high'].map(s => (
                  <div key={s} className={`sev-radio${sev===s?` sel-${s}`:''}`} onClick={() => setSev(s)}>
                    {s==='low'?'🟢 Low':s==='med'?'🟡 Medium':'🔴 High'}
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea className="form-textarea" placeholder="Describe what you observed…" value={form.notes} onChange={e => setForm(f => ({...f,notes:e.target.value}))} />
            </div>
            <div className="form-group">
              <label>Photo / Video</label>
              <div className="upload-zone">
                <span className="ms">photo_camera</span>
                <p>Click to upload or drag & drop · Gemini Vision will auto-analyze</p>
              </div>
            </div>
            <button className="btn btn-primary" style={{width:'100%',padding:14}} onClick={() => setSubmitted(true)}>
              <span className="ms">send</span>Submit Report
            </button>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="card">
            <div className="card-header"><h3><span className="ms">auto_awesome</span>AI Draft Preview</h3></div>
            <div style={{padding:'16px 20px'}}>
              <div className="ai-draft-box">
                <div className="ai-label"><span className="ms" style={{fontSize:16}}>smart_toy</span>Gemini-Generated Summary</div>
                <p style={{whiteSpace:'pre-wrap',fontFamily:'monospace',fontSize:12.5,color:'var(--text)'}}>{draft}</p>
              </div>
              <div style={{fontSize:12,color:'var(--text-3)',marginTop:10}}>This summary will be auto-sent to the response team. You can edit before submitting.</div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3><span className="ms">today</span>Today's Shift</h3></div>
            <div style={{padding:'16px 20px',display:'flex',flexDirection:'column',gap:10}}>
              {[
                { time:'12:00–14:00', task:'Gate A1 Entry Control', done:true },
                { time:'14:00–16:00', task:'Concourse B Patrol',    done:true },
                { time:'16:00–18:00', task:'Section 100–120 Assist', done:false },
                { time:'18:00–20:00', task:'Post-match Exit Management', done:false },
              ].map(s => (
                <div key={s.time} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:9,background:'var(--surface-2)',border:'1px solid var(--border)'}}>
                  <span className="ms" style={{fontSize:18,color:s.done?'var(--mint)':'var(--text-3)'}}>{s.done?'check_circle':'radio_button_unchecked'}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:s.done?'var(--text-3)':'var(--text)',textDecoration:s.done?'line-through':'none'}}>{s.task}</div>
                    <div style={{fontSize:11,color:'var(--text-3)'}}>{s.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Sustainability ── */
function Sustainability() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Sustainability Dashboard</div>
          <div className="page-subtitle">Carbon tracking · Waste & Energy · Gemini-powered daily reports</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary"><span className="ms">download</span>Export Report</button>
        </div>
      </div>
      <div className="stats-grid">
        {[
          { label:'CO₂ Saved Today', value:'142t',  cls:'green', icon:'eco' },
          { label:'Eco Transport',   value:'82%',   cls:'mint',  icon:'directions_transit' },
          { label:'Waste Diverted',  value:'67%',   cls:'gold',  icon:'recycling' },
          { label:'Energy Used',     value:'4.2 MW',cls:'blue',  icon:'bolt' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cls||'green'}`}>
            <div className="stat-label" style={{display:'flex',alignItems:'center',gap:6}}><span className="ms" style={{fontSize:16}}>{s.icon}</span>{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="card">
            <div className="card-header"><h3><span className="ms">eco</span>Stadium Carbon Summary</h3></div>
            <div className="sustain-overview">
              {[
                { val:'142t', label:'CO₂ Saved vs all-driving' },
                { val:'🥉', label:'Sustainability Rating' },
                { val:'2.7 kg', label:'Your personal saving' },
              ].map(s => (
                <div key={s.label} className="sustain-stat">
                  <div className="sustain-stat-val">{s.val}</div>
                  <div className="sustain-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="carbon-bar-wrap">
              <div style={{fontSize:12,fontWeight:700,color:'var(--text-2)',marginBottom:8}}>Stadium Carbon Score — Today</div>
              <div className="carbon-bar-track">
                <div className="carbon-thumb" style={{left:'18%'}}/>
              </div>
              <div className="carbon-labels">
                <span>🌿 Zero carbon</span>
                <span>Average</span>
                <span>🔴 High impact</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3><span className="ms">smart_toy</span>AI Sustainability Report · Gemini</h3></div>
            <div style={{ padding:'18px 20px', background:'var(--mint-light)', lineHeight:1.7 }}>
              <div style={{fontSize:11,fontWeight:800,color:'#1a9960',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
                <span className="ms" style={{fontSize:16,color:'#1a9960'}}>auto_awesome</span> GEMINI POST-MATCH REPORT
              </div>
              <p style={{fontSize:13.5,color:'var(--text)'}}>
                Today's USA vs Brazil match achieved a <strong>Green Rating of B+</strong> at MetLife Stadium. <strong>82% of 74,823 fans</strong> used public transit, walking, or cycling — saving an estimated <strong>142 tonnes of CO₂</strong> compared to a scenario where all fans drove. The stadium's renewable energy grid covered 61% of power consumption. Waste diversion reached 67%, with 23 tonnes of recyclable material collected. <strong>Top recommendation</strong>: increasing post-match transit frequency on Metro Line 3 could push eco-transport adoption to 88%+ for future matches.
              </p>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="card">
            <div className="card-header"><h3><span className="ms">leaderboard</span>Green Fan Leaderboard</h3></div>
            <div className="leader-list">
              {LEADERBOARD.map((l,i) => (
                <div key={l.name} className="leader-row">
                  <div className={`leader-rank ${i===0?'gold':i===1?'silver':i===2?'bronze':''}`}>
                    {i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
                  </div>
                  <div className="leader-flag">{l.flag}</div>
                  <div className="leader-name">{l.name}</div>
                  <div>
                    <div className="leader-bar-bg"><div className="leader-bar-fg" style={{width:`${l.pct}%`}}/></div>
                  </div>
                  <div className="leader-co2">🌿 {l.co2}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3><span className="ms">bolt</span>Real-time Energy & Waste</h3></div>
            <div style={{padding:'16px 20px',display:'flex',flexDirection:'column',gap:12}}>
              {[
                { label:'Solar generation', val:'1.8 MW', pct:43, color:'var(--gold)' },
                { label:'Grid usage',       val:'2.4 MW', pct:57, color:'var(--blue)' },
                { label:'Recycling bins',   val:'67% full', pct:67, color:'var(--mint)' },
                { label:'General waste',    val:'33% full', pct:33, color:'var(--green)' },
              ].map(e => (
                <div key={e.label}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12.5,marginBottom:4}}>
                    <span style={{color:'var(--text)',fontWeight:500}}>{e.label}</span>
                    <span style={{color:e.color,fontWeight:700}}>{e.val}</span>
                  </div>
                  <div style={{height:6,background:'var(--border)',borderRadius:3,overflow:'hidden'}}>
                    <div style={{width:`${e.pct}%`,height:'100%',background:e.color,borderRadius:3,animation:'bar-fill 1s ease both'}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Match Schedule ── */
function MatchSchedule() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Match Schedule</div>
          <div className="page-subtitle">FIFA World Cup 2026 · USA · Mexico · Canada</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><h3><span className="ms">event</span>Today's Matches</h3></div>
        <div className="schedule-list">
          {MATCHES.map((m,i) => (
            <div key={i} className="match-row">
              <div className="match-date">{m.date}</div>
              <div className="match-teams">
                <div className="match-teams-row">{m.flag1} {m.t1} <span style={{color:'var(--text-3)',fontWeight:400}}>vs</span> {m.flag2} {m.t2}</div>
                <div className="match-venue">{m.venue}</div>
              </div>
              <div className="match-score-box">{m.score}</div>
              <span className={`match-status-chip ${m.status}`}>{m.status==='live'?'● LIVE':m.status==='today'?'Today':'FT'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Language Modal ── */
function LangModal({ current, setCurrent, onClose }) {
  const langs = [
    {code:'EN',flag:'🇺🇸',name:'English'},{code:'ES',flag:'🇪🇸',name:'Español'},
    {code:'FR',flag:'🇫🇷',name:'Français'},{code:'PT',flag:'🇧🇷',name:'Português'},
    {code:'AR',flag:'🇸🇦',name:'العربية'},{code:'ZH',flag:'🇨🇳',name:'中文'},
    {code:'HI',flag:'🇮🇳',name:'हिन्दी'},{code:'JA',flag:'🇯🇵',name:'日本語'},
    {code:'KO',flag:'🇰🇷',name:'한국어'},{code:'DE',flag:'🇩🇪',name:'Deutsch'},
  ]
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Select Language</div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}><span className="ms">close</span></button>
        </div>
        <div className="lang-grid">
          {langs.map(l => (
            <button key={l.code} className={`lang-btn${current===l.code?' active':''}`} onClick={() => { setCurrent(l.code); onClose() }}>
              <span className="lang-flag">{l.flag}</span>
              <span className="lang-code">{l.code}</span>
              <span className="lang-name">{l.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Toast Notifications ── */
function Toasts({ toasts, dismiss }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <div className="toast-icon"><span className="ms">{t.type==='critical'?'warning':t.type==='success'?'check_circle':'info'}</span></div>
          <div className="toast-body">
            <div className="toast-title">{t.title}</div>
            <div className="toast-msg">{t.msg}</div>
          </div>
          <button className="toast-close" onClick={() => dismiss(t.id)}><span className="ms">close</span></button>
        </div>
      ))}
    </div>
  )
}

/* ─── Main App ───────────────────────────────────────── */
export default function App() {
  const [active, setActive] = useState('home')
  const [dark, setDark] = useState(false)
  const [lang, setLang] = useState('EN')
  const [showLang, setShowLang] = useState(false)
  const [toasts, setToasts] = useState([
    { id:1, type:'critical', title:'Gate C3 Alert', msg:'91% capacity · Stadium Brain rerouting active.' },
    { id:2, type:'warning',  title:'Post-match surge in 45 min', msg:'Leave early or take Metro Line 3 at 21:47.' },
  ])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  // Auto-dismiss toasts after 8s
  useEffect(() => {
    if (toasts.length === 0) return
    const t = setTimeout(() => setToasts(prev => prev.slice(1)), 8000)
    return () => clearTimeout(t)
  }, [toasts])

  function dismiss(id) { setToasts(prev => prev.filter(t => t.id !== id)) }

  const PAGES = {
    home:      <Dashboard setActive={setActive} />,
    heatmap:   <CrowdHeatmap />,
    concierge: <FullConcierge />,
    wayfinding:<Wayfinding />,
    transit:   <TransitPlanner />,
    incidents: <IncidentFeed />,
    volunteer: <VolunteerReport />,
    sustain:   <Sustainability />,
    schedule:  <MatchSchedule />,
  }

  return (
    <div className="app-shell">
      <Navbar
        onLangClick={() => setShowLang(true)}
        lang={lang}
        dark={dark}
        setDark={setDark}
        onAlertClick={() => {}}
        alertCount={toasts.length}
      />
      <div className="body-layout">
        <Sidebar active={active} setActive={setActive} />
        <main className="main-content">
          {PAGES[active]}
        </main>
      </div>
      <Toasts toasts={toasts} dismiss={dismiss} />
      {showLang && <LangModal current={lang} setCurrent={setLang} onClose={() => setShowLang(false)} />}
    </div>
  )
}
