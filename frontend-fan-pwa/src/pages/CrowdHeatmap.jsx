import React, { useState, useMemo } from 'react';
import { GATES } from '../data/mockData';

export default function CrowdHeatmap() {
  const [filter, setFilter] = useState('all');
  
  // useMemo for performance efficiency
  const filtered = useMemo(() => {
    return filter === 'all' ? GATES : GATES.filter(g => g.status === filter);
  }, [filter]);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Live Gate Heatmap</h1>
          <div className="page-subtitle">Real-time crowd density from IoT turnstile sensors · Updated every 30s</div>
        </div>
        <div className="page-header-actions" role="group" aria-label="Filter gates by status">
          <div className="live-chip"><span className="live-dot" aria-hidden="true" />Updating</div>
          {['all','calm','caution','critical'].map(f => (
            <button 
              key={f} 
              className={`btn ${filter===f?'btn-primary':'btn-secondary'} btn-sm`} 
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </header>
      <section className="stats-grid" aria-label="Gate Statistics">
        {[
          { label:'Clear Gates', value: GATES.filter(g=>g.status==='calm').length,     cls:'green', icon:'check_circle' },
          { label:'Caution Gates', value: GATES.filter(g=>g.status==='caution').length, cls:'gold',  icon:'warning_amber' },
          { label:'Critical Gates', value: GATES.filter(g=>g.status==='critical').length,cls:'red',   icon:'error' },
          { label:'Total Fans Inside', value:'74,823', cls:'blue', icon:'people' },
        ].map(s => (
          <article key={s.label} className={`stat-card ${s.cls}`}>
            <h2 className="stat-label" style={{display:'flex',alignItems:'center',gap:6}}><span className="ms" style={{fontSize:16}} aria-hidden="true">{s.icon}</span>{s.label}</h2>
            <div className="stat-value">{s.value}</div>
          </article>
        ))}
      </section>
      <section className="card" aria-label="Gate Density Details">
        <header className="card-header">
          <h2><span className="ms" aria-hidden="true">heat_map</span>All Gates — Crowd Density</h2>
          <span style={{fontSize:12,color:'var(--text-2)'}}>Last updated: 2 seconds ago</span>
        </header>
        <div className="gate-grid" style={{ gridTemplateColumns:'repeat(3,1fr)', padding:20 }}>
          {filtered.map(g => (
            <article key={g.id} className={`gate-tile ${g.status}`}>
              <div className="gate-tile-top">
                <h3 className="gate-tile-name">{g.name}</h3>
                <span className="gate-status-badge">{g.status}</span>
              </div>
              <div className="gate-density-val" aria-label={`${g.density}% full`}>{g.density}%</div>
              <div style={{fontSize:12,color:'var(--text-2)',marginBottom:6}}>{g.crowd.toLocaleString()} people</div>
              <div className="gate-bar-bg" aria-hidden="true"><div className="gate-bar-fg" style={{width:`${g.density}%`}} /></div>
              <div className="gate-tile-footer"><span className="ms" aria-hidden="true">schedule</span>Wait: {g.wait}</div>
            </article>
          ))}
        </div>
      </section>
      {GATES.some(g => g.status === 'critical') && (
        <section style={{ padding:'16px 20px', background:'var(--red-light)', border:'1.5px solid rgba(232,72,58,.3)', borderRadius:14, display:'flex', alignItems:'center', gap:14 }} role="alert">
          <span className="ms" style={{fontSize:28, color:'var(--red)'}} aria-hidden="true">warning</span>
          <div>
            <h2 style={{fontWeight:700, color:'var(--red)', fontSize:14}}>AI Recommendation — Stadium Brain</h2>
            <div style={{fontSize:13, color:'var(--text)', marginTop:3}}>Gate C3 will reach critical capacity in approx. 14 minutes. Recommend opening auxiliary Gate C3-B and redirecting stewards. Fan concierge has auto-rerouted inbound fans to Gates A1 and F6.</div>
          </div>
          <button className="btn btn-primary btn-sm" style={{flexShrink:0}}>Accept &amp; Deploy</button>
        </section>
      )}
    </div>
  );
}
