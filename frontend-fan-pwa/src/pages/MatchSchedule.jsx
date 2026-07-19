import React, { useState } from 'react';
import { MATCHES } from '../data/mockData';

export default function MatchSchedule() {
  const [filter, setFilter] = useState('all');

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Tournament Schedule</h1>
          <div className="page-subtitle">FIFA World Cup 2026 · Group Stage Matches</div>
        </div>
        <div className="page-header-actions" role="group" aria-label="Filter matches">
          {['all','live','today','done'].map(f => (
            <button 
              key={f} 
              className={`btn ${filter===f?'btn-primary':'btn-secondary'} btn-sm`} 
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </header>
      <section className="card" aria-label="Match List">
        <div className="incident-list">
          {MATCHES.filter(m => filter === 'all' || m.status === filter).map((m,i) => (
            <article key={i} className="incident-row" style={{padding:'20px'}}>
              <div style={{display:'flex', alignItems:'center', gap:20, width:180}}>
                <div style={{textAlign:'right',flex:1}}>
                  <div style={{fontSize:24}} aria-hidden="true">{m.flag1}</div>
                  <div style={{fontWeight:600,fontSize:14}}>{m.t1}</div>
                </div>
                <div style={{fontSize:20,fontWeight:800,color:'var(--text)',width:60,textAlign:'center',letterSpacing:-1}}>{m.score}</div>
                <div style={{textAlign:'left',flex:1}}>
                  <div style={{fontSize:24}} aria-hidden="true">{m.flag2}</div>
                  <div style={{fontWeight:600,fontSize:14}}>{m.t2}</div>
                </div>
              </div>
              <div className="incident-body" style={{justifyContent:'center',paddingLeft:40}}>
                <div style={{fontSize:14,color:'var(--text)',display:'flex',alignItems:'center',gap:6}}><span className="ms" style={{fontSize:16,color:'var(--text-3)'}} aria-hidden="true">stadium</span>{m.venue}</div>
              </div>
              <div className="incident-meta" style={{alignItems:'flex-end'}}>
                <span className={`match-status-chip ${m.status}`}>{m.status==='live'?'● Live':m.date}</span>
                <button className="btn btn-secondary btn-sm" aria-label={`View match details for ${m.t1} vs ${m.t2}`}>Match Center</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
