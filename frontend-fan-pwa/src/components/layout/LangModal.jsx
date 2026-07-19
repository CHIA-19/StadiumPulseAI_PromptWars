import React from 'react';

export default function LangModal({ current, setCurrent, onClose }) {
  const langs = [
    {code:'EN',flag:'🇺🇸',name:'English'},{code:'ES',flag:'🇪🇸',name:'Español'},
    {code:'FR',flag:'🇫🇷',name:'Français'},{code:'PT',flag:'🇧🇷',name:'Português'},
    {code:'AR',flag:'🇸🇦',name:'العربية'},{code:'ZH',flag:'🇨🇳',name:'中文'},
    {code:'HI',flag:'🇮🇳',name:'हिन्दी'},{code:'JA',flag:'🇯🇵',name:'日本語'},
    {code:'KO',flag:'🇰🇷',name:'한국어'},{code:'DE',flag:'🇩🇪',name:'Deutsch'},
  ];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="lang-modal-title">
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title" id="lang-modal-title">Select Language</h2>
          <button className="btn btn-secondary btn-icon" onClick={onClose} aria-label="Close language selector">
            <span className="ms" aria-hidden="true">close</span>
          </button>
        </div>
        <div className="lang-grid" role="radiogroup" aria-label="Available Languages">
          {langs.map(l => (
            <button 
              key={l.code} 
              className={`lang-btn${current===l.code?' active':''}`} 
              onClick={() => { setCurrent(l.code); onClose(); }}
              role="radio"
              aria-checked={current === l.code}
            >
              <span className="lang-flag" aria-hidden="true">{l.flag}</span>
              <span className="lang-code">{l.code}</span>
              <span className="lang-name">{l.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
