import React, { useState } from 'react';
import { INCIDENTS } from '../data/mockData';

export default function IncidentFeed() {
  const [filter, setFilter] = useState('all');

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Live Incident Feed</h1>
          <div className="page-subtitle">AI-Triaged reports from Volunteers & IoT sensors</div>
        </div>
        <div className="page-header-actions" role="group" aria-label="Filter incidents by severity">
          {['all','high','med','low'].map(f => (
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
      <section className="card" aria-label="Incident List">
        <div className="incident-list" role="feed" aria-busy="false">
          {INCIDENTS.filter(i => filter === 'all' || i.sev === filter).map(inc => (
            <article key={inc.id} className="incident-row" style={{padding:'20px'}}>
              <div className={`incident-severity ${inc.sev}`} aria-hidden="true">
                <span className="ms">{inc.sev==='high'?'warning':inc.sev==='med'?'info':'check_circle'}</span>
              </div>
              <div className="incident-body" style={{gap:8}}>
                <h3 className="incident-title" style={{fontSize:16}}>{inc.title}</h3>
                <div className="incident-loc" style={{fontSize:14,color:'var(--text)'}}><span className="ms" style={{fontSize:16,color:'var(--text-3)'}} aria-hidden="true">place</span>{inc.loc}</div>
                <div style={{fontSize:13,color:'var(--text-2)',display:'flex',gap:16,marginTop:4}}>
                  <div style={{display:'flex',alignItems:'center',gap:4}}><span className="ms" style={{fontSize:16}} aria-hidden="true">assignment_ind</span>Assigned: {inc.assigned}</div>
                  <div style={{display:'flex',alignItems:'center',gap:4}}><span className="ms" style={{fontSize:16}} aria-hidden="true">smart_toy</span>Triaged by AI Agent</div>
                </div>
              </div>
              <div className="incident-meta" style={{alignItems:'flex-end',gap:12}}>
                <span className={`sev-badge ${inc.sev}`} style={{padding:'6px 14px',fontSize:12}}>{inc.sev} SEVERITY</span>
                <span className="incident-time" style={{fontSize:14}}>{inc.time}</span>
                <button className="btn btn-secondary btn-sm" aria-label={`View details for ${inc.title}`}>View Details</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
