import React, { useState } from 'react';
import DOMPurify from 'dompurify';

export default function VolunteerReport({ setActive, addToast }) {
  const [photo, setPhoto] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiDraft, setAiDraft] = useState(null);
  
  // Form State
  const [desc, setDesc] = useState('');
  const [loc, setLoc] = useState('');
  const [errors, setErrors] = useState({});

  function handlePhoto() {
    setPhoto(true);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAiDraft({
        title: 'Spilled liquid on concourse',
        loc: 'Gate C, Section 112',
        sev: 'low',
        category: 'Cleaning/Janitorial'
      });
      setDesc('Spilled liquid on concourse. Needs immediate mopping.');
      setLoc('Gate C, Section 112');
    }, 2000);
  }

  function submit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!desc.trim()) newErrors.desc = 'Description is required';
    if (!loc.trim()) newErrors.loc = 'Location is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Sanitize inputs before "sending" to server
    const safeDesc = DOMPurify.sanitize(desc);
    const safeLoc = DOMPurify.sanitize(loc);

    console.log("Submitting safe data:", { safeDesc, safeLoc });

    addToast('success', 'Report Submitted', 'Incident assigned to Cleaning Team 3');
    setActive('incidents');
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Report Incident</h1>
          <div className="page-subtitle">PulseAssist · AI Vision will auto-triage your photo</div>
        </div>
      </header>
      <div className="dashboard-grid">
        <section className="card" aria-label="Incident Reporting Form">
          <div style={{padding:'24px', display:'flex', flexDirection:'column', gap:20}}>
            
            {/* Photo Upload Area */}
            {!photo ? (
              <button 
                className="upload-area" 
                onClick={handlePhoto}
                aria-label="Upload photo for AI analysis"
              >
                <span className="ms" style={{fontSize:48,color:'var(--green)'}} aria-hidden="true">add_a_photo</span>
                <div style={{fontSize:16,fontWeight:600,color:'var(--text)',marginTop:10}}>Take a Photo</div>
                <div style={{fontSize:13,color:'var(--text-2)',marginTop:4}}>Gemini Vision will auto-fill the report</div>
              </button>
            ) : analyzing ? (
              <div className="upload-area" aria-live="polite">
                <div className="typing-dots"><span/><span/><span/></div>
                <div style={{fontSize:14,fontWeight:600,color:'var(--text)',marginTop:10}}>Gemini Vision analyzing...</div>
              </div>
            ) : (
              <div style={{display:'flex', gap:20, alignItems:'center', background:'var(--surface-2)', padding:16, borderRadius:12}}>
                <div style={{width:80,height:80,background:'var(--blue-light)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span className="ms" style={{fontSize:32,color:'var(--blue)'}} aria-hidden="true">image</span>
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:'var(--text)'}}>Photo captured</div>
                  <div style={{fontSize:13,color:'var(--green)',marginTop:4,display:'flex',alignItems:'center',gap:4}}>
                    <span className="ms" style={{fontSize:16}} aria-hidden="true">check_circle</span> AI analysis complete
                  </div>
                </div>
              </div>
            )}

            {/* AI Draft Banner */}
            {aiDraft && (
              <div style={{background:'var(--blue-light)',border:'1px solid var(--blue)',borderRadius:12,padding:16}} role="status" aria-live="polite">
                <h3 style={{fontSize:13,color:'var(--blue)',fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
                  <span className="ms" style={{fontSize:16}} aria-hidden="true">smart_toy</span> Gemini AI Draft
                </h3>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div>
                    <div style={{fontSize:11,color:'var(--text-3)'}}>Predicted Severity</div>
                    <div style={{fontSize:14,fontWeight:700,color:'var(--text)'}}><span className="sev-badge low" style={{padding:'2px 8px'}}>{aiDraft.sev}</span></div>
                  </div>
                  <div>
                    <div style={{fontSize:11,color:'var(--text-3)'}}>Required Team</div>
                    <div style={{fontSize:14,fontWeight:700,color:'var(--text)'}}>{aiDraft.category}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:16}} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="loc">Location</label>
                <input 
                  id="loc"
                  className="form-input" 
                  value={loc} 
                  onChange={e => setLoc(e.target.value)}
                  placeholder="e.g. Gate C, Section 112" 
                  aria-invalid={!!errors.loc}
                  aria-describedby={errors.loc ? "loc-error" : undefined}
                />
                {errors.loc && <div id="loc-error" className="form-error" style={{color:'var(--red)', fontSize:12, marginTop:4}}>{errors.loc}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="desc">Description</label>
                <textarea 
                  id="desc"
                  className="form-input" 
                  value={desc} 
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Describe the incident..." 
                  rows={4}
                  aria-invalid={!!errors.desc}
                  aria-describedby={errors.desc ? "desc-error" : undefined}
                />
                {errors.desc && <div id="desc-error" className="form-error" style={{color:'var(--red)', fontSize:12, marginTop:4}}>{errors.desc}</div>}
              </div>

              <button type="submit" className="btn btn-primary" style={{width:'100%',padding:14,fontSize:15}}>
                Submit Report to Command
              </button>
            </form>
          </div>
        </section>

        {/* Right side - Guidelines */}
        <section className="card" aria-label="Reporting Guidelines">
          <header className="card-header"><h2><span className="ms" aria-hidden="true">info</span>Reporting Guidelines</h2></header>
          <div style={{padding:'20px', display:'flex', flexDirection:'column', gap:16}}>
            {[
              { t:'Always take a photo', d:'Gemini Vision needs a clear photo to auto-triage severity and assign the right team.'},
              { t:'Be specific with location', d:'Include gate, concourse, or section numbers if possible.'},
              { t:'Stay safe', d:'Do not intervene in high-severity incidents. Report and wait for Security.'}
            ].map((g,i) => (
              <div key={i} style={{display:'flex',gap:12}}>
                <div style={{width:24,height:24,borderRadius:'50%',background:'var(--surface)',color:'var(--text-2)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:12,flexShrink:0}}>{i+1}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:14,color:'var(--text)'}}>{g.t}</div>
                  <div style={{fontSize:13,color:'var(--text-2)',marginTop:4,lineHeight:1.4}}>{g.d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
