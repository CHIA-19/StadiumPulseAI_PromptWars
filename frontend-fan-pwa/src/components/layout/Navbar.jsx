import React, { memo } from 'react';

const Navbar = memo(({ onLangClick, lang, dark, setDark, onAlertClick, alertCount }) => {
  const tickers = [
    { label:'USA 🇺🇸 vs 🇧🇷 Brazil', score:'2 – 1', live:true  },
    { label:'Mexico 🇲🇽 vs 🇦🇷 Argentina', score:'Kickoff 19:30', live:false },
    { label:'Gate C3 ⚠ Critical – Rerouting active', score:'', live:true },
    { label:'MetLife Stadium · 74,823 fans · 82°F', score:'', live:false },
    { label:'🌿 82% fans used eco transport today', score:'+142t CO₂ saved', live:false },
  ];

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="nav-logo">
        <div className="nav-logo-icon" aria-hidden="true">⚡</div>
        <div>
          <div className="nav-logo-text">StadiumPulse AI</div>
          <div className="nav-logo-sub">FIFA World Cup 2026</div>
        </div>
      </div>

      <div className="nav-ticker" aria-live="polite">
        <div className="nav-ticker-inner">
          {[...tickers, ...tickers].map((t, i) => (
            <div key={i} className="ticker-item">
              {t.live && <span className="live-dot" aria-hidden="true" />}
              {t.label}
              {t.score && <span className="ticker-score">{t.score}</span>}
              <span style={{ opacity:.3 }} aria-hidden="true">|</span>
            </div>
          ))}
        </div>
      </div>

      <div className="nav-actions">
        <button className="nav-btn" onClick={onLangClick} aria-label={`Change language, current is ${lang}`}>
          <span className="ms" style={{fontSize:16}} aria-hidden="true">language</span>
          {lang}
        </button>
        <button className="nav-icon-btn" onClick={onAlertClick} aria-label="View notifications">
          <span className="ms" aria-hidden="true">notifications</span>
          {alertCount > 0 && <span className="nav-badge" aria-label={`${alertCount} unread notifications`}>{alertCount}</span>}
        </button>
        <button className="nav-icon-btn" onClick={() => setDark(d => !d)} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
          <span className="ms" aria-hidden="true">{dark ? 'light_mode' : 'dark_mode'}</span>
        </button>
        <button className="nav-icon-btn" aria-label="User profile">
          <span className="ms" aria-hidden="true">account_circle</span>
        </button>
      </div>
    </nav>
  );
});

export default Navbar;
