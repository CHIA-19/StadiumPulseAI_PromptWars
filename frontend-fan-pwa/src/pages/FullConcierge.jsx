import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { AI_REPLIES } from '../data/mockData';

export default function FullConcierge() {
  const [msgs, setMsgs] = useState([
    { role:'ai', text:"¡Bienvenido! I'm Pulse, your AI stadium concierge powered by Gemini 2.0. I speak 10 languages and have real-time access to crowd data, maps, and transit info. How can I help you today? ⚽", time:'2:34 PM' },
    { role:'user', text:'Where is the nearest accessible restroom?', time:'2:35 PM' },
    { role:'ai', text:"♿ Nearest step-free restroom: Concourse B, 60m ahead (next to Stall 12). It is fully accessible with wide entry, grab rails, and low-height fixtures. Currently no queue. I have pinned it on your indoor map.", time:'2:35 PM' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, typing]);

  function send(txt) {
    const t = txt || input.trim(); if (!t) return;
    setMsgs(p => [...p, { role:'user', text:t, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }]);
    setInput(''); setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = AI_REPLIES[Math.floor(Math.random()*AI_REPLIES.length)];
      setMsgs(p => [...p, { role:'ai', text:reply, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }]);
    }, 1800);
  }

  const AGENTS = [
    { name:'Concierge Agent', sub:'Wayfinding · Food · Info', emoji:'🤖', active:true },
    { name:'Mobility Agent',  sub:'Transit planner',          emoji:'🚇', active:false },
    { name:'Accessibility',   sub:'Step-free routing',        emoji:'♿', active:false },
    { name:'Sustainability',  sub:'Carbon tracker',           emoji:'🌿', active:false },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">AI Concierge</h1>
          <div className="page-subtitle">Powered by Gemini 2.0 · Multilingual · Voice-enabled · 10 languages</div>
        </div>
        <div className="page-header-actions">
          <div className="live-chip"><span className="live-dot" aria-hidden="true" />Online</div>
        </div>
      </header>
      <section className="card" style={{ overflow:'hidden' }} aria-label="Chat Interface">
        <div className="chat-layout">
          <aside className="chat-sidebar-left" aria-label="Available Agents">
            <h2 style={{fontSize:11,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:1,padding:'4px 10px 8px'}}>Agents</h2>
            {AGENTS.map(a => (
              <button key={a.name} className={`chat-contact${a.active?' active':''}`} aria-pressed={a.active}>
                <div className="chat-avatar" aria-hidden="true">{a.emoji}</div>
                <div className="chat-contact-info">
                  <div className="chat-contact-name">{a.name}</div>
                  <div className="chat-contact-sub">{a.sub}</div>
                </div>
              </button>
            ))}
            <div style={{borderTop:'1px solid var(--border)', marginTop:8, paddingTop:12}}>
              <h2 style={{fontSize:11,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:1,padding:'0 10px 8px'}}>Languages</h2>
              {['🇺🇸 EN','🇪🇸 ES','🇫🇷 FR','🇧🇷 PT','🇸🇦 AR','🇨🇳 ZH'].map(l => (
                <button key={l} style={{padding:'6px 10px', fontSize:12.5, fontWeight:500, color:'var(--text-2)', borderRadius:8, cursor:'pointer', border:'none', background:'transparent', width:'100%', textAlign:'left'}} aria-label={`Switch to ${l.split(' ')[1]}`}>
                  {l}
                </button>
              ))}
            </div>
          </aside>
          <div className="chat-main">
            <header className="chat-top-bar">
              <div className="chat-avatar" style={{background:'var(--blue-light)'}} aria-hidden="true">🤖</div>
              <div>
                <h2 style={{fontSize:14,fontWeight:700,color:'var(--text)'}}>Pulse AI · Concierge Agent</h2>
                <div style={{fontSize:12,color:'var(--text-3)',display:'flex',alignItems:'center',gap:5}}><span className="live-dot" aria-hidden="true" />Online · responding in ~1.5s</div>
              </div>
              <span className="chat-model-tag">Gemini 2.0 Flash</span>
              <button className="btn btn-secondary btn-icon btn-sm" aria-label="Use voice input"><span className="ms" aria-hidden="true">mic</span></button>
              <button className="btn btn-secondary btn-icon btn-sm" aria-label="Toggle text to speech"><span className="ms" aria-hidden="true">volume_up</span></button>
            </header>
            <div className="chat-messages" role="log" aria-live="polite">
              {msgs.map((m,i) => (
                <div key={i} className={`msg-row${m.role==='user'?' user-row':''}`}>
                  <div className="msg-avatar" aria-hidden="true">{m.role==='ai'?'🤖':'👤'}</div>
                  <div>
                    {/* DOMPurify protects against XSS in AI generated responses */}
                    <div className={`msg-bubble ${m.role}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(m.text) }} />
                    <div className={`msg-time`} style={{textAlign:m.role==='user'?'right':'left'}}>{m.time}</div>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="msg-row">
                  <div className="msg-avatar" aria-hidden="true">🤖</div>
                  <div className="typing-indicator"><div className="typing-dots"><span/><span/><span/></div><span style={{fontSize:12,color:'var(--text-3)'}}>Pulse AI is typing…</span></div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            <div className="quick-chips" aria-label="Suggested prompts">
              {['🚻 Nearest restroom?','🍔 Halal food near Gate C?','♿ Step-free route to my seat','🚪 Fastest exit after match?','🚇 Best transit home?','📍 Where is Section 214?'].map(c => (
                <button key={c} className="chip" onClick={() => send(c)}>{c}</button>
              ))}
            </div>
            <div className="chat-input-bar">
              <label htmlFor="concierge-input" className="sr-only">Ask anything about the stadium in any language</label>
              <input id="concierge-input" className="chat-input" placeholder="Ask anything about the stadium in any language…" value={input}
                onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()} />
              <button className="btn btn-secondary btn-icon" title="Voice" aria-label="Voice input"><span className="ms" aria-hidden="true">mic</span></button>
              <button className="btn btn-blue" onClick={() => send()}><span className="ms" aria-hidden="true">send</span>Send</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
