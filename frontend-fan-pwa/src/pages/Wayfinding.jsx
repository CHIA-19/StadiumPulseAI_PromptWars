import React from 'react';

export default function Wayfinding() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Indoor Wayfinding</h1>
          <div className="page-subtitle">AI-powered · Step-free routing · Google Maps Indoor Platform</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><span className="ms" aria-hidden="true">my_location</span>My Location</button>
          <button className="btn btn-primary"><span className="ms" aria-hidden="true">navigation</span>Start AR Navigation</button>
        </div>
      </header>
      <div className="dashboard-grid">
        <section className="card" style={{ overflow:'hidden' }} aria-label="Interactive Map">
          <header className="card-header">
            <h2><span className="ms" aria-hidden="true">map</span>Stadium Map — Level 2</h2>
            <div style={{display:'flex',gap:6}} role="group" aria-label="Floor selection">
              {['L1','L2','L3','L4'].map(l => (
                <button key={l} className={`btn btn-sm ${l==='L2'?'btn-primary':'btn-secondary'}`} aria-pressed={l === 'L2'}>{l}</button>
              ))}
            </div>
          </header>
          <div className="map-container" aria-hidden="true">
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
          <footer className="map-controls-bar">
            <span className="ms" style={{fontSize:20,color:'var(--blue)'}} aria-hidden="true">stadium</span>
            <div className="route-info">
              <div className="route-dest">📍 Section 214, Row G, Seat 12</div>
              <div className="route-sub">Via Gate A1 (clear) → Concourse North → Elevator 3 → 4 min · Step-free ✓</div>
            </div>
            <button className="btn btn-blue"><span className="ms" aria-hidden="true">navigation</span>Navigate</button>
          </footer>
        </section>

        {/* Right panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <section className="card" aria-label="Search Destinations">
            <header className="card-header"><h2><span className="ms" aria-hidden="true">search</span>Search Destination</h2></header>
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
                  <span className="ms" style={{fontSize:22,color:d.color}} aria-hidden="true">{d.icon}</span>
                  <div>
                    <div style={{fontSize:13.5,fontWeight:600,color:'var(--text)'}}>{d.label}</div>
                    <div style={{fontSize:11.5,color:'var(--text-2)'}}>{d.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
          <section className="card" aria-label="Accessibility Features">
            <header className="card-header"><h2><span className="ms" aria-hidden="true">accessible</span>Accessibility Info</h2></header>
            <div style={{padding:'14px 20px', display:'flex', flexDirection:'column', gap:10}}>
              {[
                { icon:'elevator',  label:'Elevators', value:'3 available', ok:true },
                { icon:'ramp_left', label:'Ramp Access', value:'All gates',    ok:true },
                { icon:'hearing',   label:'Hearing Loop', value:'Sections 100–120', ok:true },
                { icon:'wc',        label:'Accessible WC', value:'5 locations',  ok:true },
              ].map(a => (
                <div key={a.label} style={{display:'flex',alignItems:'center',gap:10}}>
                  <span className="ms" style={{fontSize:18,color:'var(--green)'}} aria-hidden="true">{a.icon}</span>
                  <span style={{flex:1,fontSize:13,color:'var(--text)'}}>{a.label}</span>
                  <span style={{fontSize:12,color:'#1a9960',fontWeight:600}}>✓ {a.value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
