import React from 'react';
import { LEADERBOARD } from '../data/mockData';

export default function Sustainability() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Sustainability Hub</h1>
          <div className="page-subtitle">Track your carbon footprint & stadium impact</div>
        </div>
      </header>
      <div className="dashboard-grid">
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <section className="card" aria-label="Personal Impact">
            <header className="card-header">
              <h2><span className="ms" aria-hidden="true">person</span>Your Impact</h2>
              <span className="ai-pick-badge" style={{background:'var(--mint-light)',color:'var(--mint-dark)'}}>Green Fan Bronze</span>
            </header>
            <div style={{padding:'24px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:16}}>
              <div style={{width:100,height:100,borderRadius:'50%',background:'var(--mint-light)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <span className="ms" style={{fontSize:50,color:'var(--mint-dark)'}} aria-hidden="true">workspace_premium</span>
              </div>
              <div>
                <div style={{fontSize:28,fontWeight:800,color:'var(--mint-dark)'}}>2.7 kg</div>
                <div style={{fontSize:14,color:'var(--text-2)'}}>CO₂ saved vs driving</div>
              </div>
              <div style={{width:'100%',background:'var(--surface)',padding:16,borderRadius:12}}>
                <div style={{fontSize:13,fontWeight:600,color:'var(--text)',marginBottom:8}}>Next Tier: Silver</div>
                <div className="gate-bar-bg" aria-hidden="true"><div className="gate-bar-fg" style={{background:'var(--mint)',width:'40%'}}/></div>
                <div style={{fontSize:12,color:'var(--text-3)',marginTop:8}}>Take transit 2 more times to upgrade</div>
              </div>
            </div>
          </section>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <section className="card" aria-label="Stadium Impact">
            <header className="card-header">
              <h2><span className="ms" aria-hidden="true">stadium</span>Stadium Impact Today</h2>
            </header>
            <div style={{padding:'20px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
              <div style={{background:'var(--surface-2)',padding:16,borderRadius:12}}>
                <span className="ms" style={{fontSize:24,color:'var(--gold)',marginBottom:8}} aria-hidden="true">solar_power</span>
                <div style={{fontSize:24,fontWeight:800,color:'var(--text)'}}>42%</div>
                <div style={{fontSize:13,color:'var(--text-2)'}}>Powered by onsite solar</div>
              </div>
              <div style={{background:'var(--surface-2)',padding:16,borderRadius:12}}>
                <span className="ms" style={{fontSize:24,color:'var(--blue)',marginBottom:8}} aria-hidden="true">recycling</span>
                <div style={{fontSize:24,fontWeight:800,color:'var(--text)'}}>89%</div>
                <div style={{fontSize:13,color:'var(--text-2)'}}>Waste diverted from landfill</div>
              </div>
            </div>
          </section>
          <section className="card" aria-label="Fan Leaderboard">
            <header className="card-header">
              <h2><span className="ms" aria-hidden="true">leaderboard</span>Fan Leaderboard</h2>
            </header>
            <div className="leaderboard" role="list">
              {LEADERBOARD.map((l,i) => (
                <div key={l.name} className="leader-row" role="listitem">
                  <div className="leader-rank" aria-label={`Rank ${i+1}`}>{i+1}</div>
                  <div className="leader-flag" aria-hidden="true">{l.flag}</div>
                  <div className="leader-name">{l.name}</div>
                  <div className="leader-co2" aria-label={`${l.co2} of Carbon dioxide`}>{l.co2}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
