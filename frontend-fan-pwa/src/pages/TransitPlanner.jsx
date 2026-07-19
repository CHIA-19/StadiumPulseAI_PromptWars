import React, { useState } from 'react';
import { TRANSITS } from '../data/mockData';

export default function TransitPlanner() {
  const [selected, setSelected] = useState(0);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Smart Transit Planner</h1>
          <div className="page-subtitle">Mobility Agent · Google Maps Platform · Low-carbon routing</div>
        </div>
      </header>
      <div className="dashboard-grid">
        <section className="card" style={{overflow:'hidden'}} aria-label="Post-Match Transit Options">
          <header className="card-header">
            <h2><span className="ms" aria-hidden="true">directions_transit</span>Post-Match Routes</h2>
            <div style={{fontSize:13,color:'var(--text-2)'}}>Best departure: <strong style={{color:'var(--text)'}}>21:47</strong></div>
          </header>
          <div className="transit-list" role="listbox" aria-label="Transit options">
            {TRANSITS.map((t,i) => (
              <div 
                key={t.name} 
                className={`transit-row${selected===i?' selected':''}`} 
                onClick={() => setSelected(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelected(i); }}
                tabIndex={0}
                role="option"
                aria-selected={selected === i}
              >
                <div className={`transit-icon-box ${t.type}`}><span className="ms" aria-hidden="true">{t.icon}</span></div>
                <div className="transit-info">
                  <h3 className="transit-name">
                    {t.name}
                    {t.rec && <span className="ai-pick-badge">✓ AI Pick</span>}
                  </h3>
                  <div className="transit-sub">{t.sub}</div>
                </div>
                <div className="transit-meta">
                  <div className="transit-time">{t.time}</div>
                  <div className="transit-co2" aria-label={`${t.co2} of Carbon dioxide`}>🌿 {t.co2} CO₂</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{padding:'16px 20px'}}>
            <button className="btn btn-primary" style={{width:'100%', padding:'13px'}}>
              <span className="ms" aria-hidden="true">navigation</span>
              Start Navigation — {TRANSITS[selected].name}
            </button>
          </div>
        </section>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <section className="card" aria-label="Surge Predictions">
            <header className="card-header"><h2><span className="ms" aria-hidden="true">schedule</span>Surge Predictions</h2></header>
            <div style={{padding:'16px 20px', display:'flex', flexDirection:'column', gap:10}}>
              {[
                { time:'21:30', level:'Low',      note:'Leave now — no crowd',     cls:'calm'   },
                { time:'21:45', level:'Medium',   note:'Match ends · light surge',  cls:'caution'},
                { time:'22:00', level:'Critical', note:'Peak crowd — delay if poss',cls:'critical'},
                { time:'22:20', level:'Low',      note:'Crowds dispersed',          cls:'calm'   },
              ].map(r => (
                <article key={r.time} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:10, background:'var(--surface-2)', border:'1px solid var(--border)' }}>
                  <div style={{fontWeight:800,fontSize:14,color:'var(--text)',width:44,flexShrink:0}}>{r.time}</div>
                  <div className={`gate-status-badge`} style={{
                    background: r.cls==='calm'?'var(--mint-light)':r.cls==='caution'?'var(--gold-light)':'var(--red-light)',
                    color: r.cls==='calm'?'#1a9960':r.cls==='caution'?'#8a6400':'var(--red)',
                    padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:800, flexShrink:0
                  }}>{r.level}</div>
                  <div style={{fontSize:12,color:'var(--text-2)'}}>{r.note}</div>
                </article>
              ))}
            </div>
          </section>
          <section className="card" aria-label="Carbon Footprint Comparison">
            <header className="card-header"><h2><span className="ms" aria-hidden="true">eco</span>Carbon Comparison</h2></header>
            <div style={{padding:'16px 20px', display:'flex', flexDirection:'column', gap:10}}>
              {TRANSITS.map(t => (
                <div key={t.name} style={{display:'flex',alignItems:'center',gap:10}}>
                  <span className="ms" style={{fontSize:18, color: t.co2==='0 kg'?'var(--mint)':t.co2<'1'?'var(--green)':'var(--red)'}} aria-hidden="true">{t.icon}</span>
                  <div style={{flex:1,fontSize:13,color:'var(--text)',fontWeight:500}}>{t.name}</div>
                  <div style={{fontSize:12,fontWeight:700,color:'#1a9960'}}>🌿 {t.co2}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
