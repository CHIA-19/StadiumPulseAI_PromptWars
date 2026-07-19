import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';

/**
 * @typedef {Object} Gate
 * @property {string} name
 * @property {number} density
 * @property {string} status
 */

/**
 * @typedef {Object} Incident
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} severity
 * @property {string} location
 * @property {string} status
 */

const PRESETS = [
  {
    query: "Show total crowd attendance per gate in the last hour",
    sql: "SELECT gate_id, SUM(turnstile_count) as total_fans \nFROM `stadium-pulse.sensor_data.turnstiles` \nWHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR) \nGROUP BY gate_id \nORDER BY total_fans DESC;",
    data: [
      { label: "Gate A1", val: 85, color: "var(--primary)" },
      { label: "Gate A2", val: 55, color: "var(--primary)" },
      { label: "Gate B1", val: 40, color: "var(--primary)" },
      { label: "Gate B2", val: 75, color: "var(--primary)" },
      { label: "Gate C1", val: 30, color: "var(--primary)" },
      { label: "Gate C3", val: 95, color: "var(--danger)" }
    ]
  },
  {
    query: "Get cumulative carbon offset per transit method today",
    sql: "SELECT transit_mode, SUM(co2_saved_kg) as carbon_offsets \nFROM `stadium-pulse.mobility.transactions` \nWHERE DATE(timestamp) = CURRENT_DATE() \nGROUP BY transit_mode \nORDER BY carbon_offsets DESC;",
    data: [
      { label: "Metro", val: 90, color: "var(--success)" },
      { label: "Bus", val: 65, color: "var(--success)" },
      { label: "Rideshare", val: 35, color: "var(--success)" },
      { label: "Bicycle", val: 20, color: "var(--success)" }
    ]
  }
];

export default function App() {
  const [dark, setDark] = useState(false);
  const [systemState, setSystemState] = useState('Gate C3 Congested');
  const [toast, setToast] = useState('');
  
  // Natural Language query panel states
  const [nlQuery, setNlQuery] = useState('Show total crowd attendance per gate in the last hour');
  const [generating, setGenerating] = useState(false);
  const [activeSql, setActiveSql] = useState('');
  const [activeChartData, setActiveChartData] = useState([]);

  // Gate sensor states
  const [gates, setGates] = useState([
    { name: 'Gate A1 – North', density: 12050, status: 'calm' },
    { name: 'Gate A2 – North', density: 8400, status: 'calm' },
    { name: 'Gate B1 – East', density: 6300, status: 'calm' },
    { name: 'Gate B2 – East', density: 18400, status: 'caution' },
    { name: 'Gate C1 – West', density: 4100, status: 'calm' },
    { name: 'Gate C3 – South', density: 25573, status: 'critical' }
  ]);

  // Incident state
  const [incidents, setIncidents] = useState([
    {
      id: '101',
      title: 'Gate C3 turnstile density jam (IoT Flagged)',
      description: 'Density spike at Gate C3 detected (91%). Automated fan redirection recommended.',
      severity: 'high',
      location: 'Gate C3',
      status: 'unresolved'
    },
    {
      id: '102',
      title: 'Spilled drink slip hazard',
      description: 'Volunteer reported liquid spill on Section 102 exit ramp. Dispatched cleaning team.',
      severity: 'medium',
      location: 'Concourse Section 102',
      status: 'unresolved'
    }
  ]);

  // Manage theme toggle
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  const handleResolveIncident = useCallback((id) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
    showToast(`Incident #${id} resolved successfully!`);
    
    // If Gate C3 jam is resolved, restore system status to optimal
    if (id === '101') {
      setSystemState('All Systems Operational');
      setGates(prev => prev.map(g => g.name.includes('C3') ? { ...g, density: 14200, status: 'calm' } : g));
      showToast('Gate C3 turnstiles cleared. Redirection route ended.');
    }
  }, [showToast]);

  const handleGenerateSql = useCallback(() => {
    setGenerating(true);
    setActiveSql('');
    setActiveChartData([]);

    // Simulate Gemini NL -> BigQuery SQL Generation
    setTimeout(() => {
      setGenerating(false);
      // Try to match search terms with presets, default to the first preset
      const match = PRESETS.find(p => p.query.toLowerCase().includes(nlQuery.toLowerCase().substring(0, 10))) || PRESETS[0];
      setActiveSql(match.sql);
      setActiveChartData(match.data);
      showToast('Gemini parsed query and compiled BigQuery SQL!');
    }, 1200);
  }, [nlQuery, showToast]);

  // Memoized KPIs to avoid useless calculations
  const kpis = useMemo(() => [
    { label: 'CO₂ Saved Today', value: '142.4 t', icon: 'eco', colorClass: 'green' },
    { label: 'Energy Performance', value: '94.2%', icon: 'bolt', colorClass: 'warning' },
    { label: 'Total Fan Influx', value: '74,823', icon: 'groups', colorClass: 'blue' },
    { label: 'Active Incidents', value: String(incidents.length), icon: 'warning', colorClass: incidents.length > 0 ? 'danger' : 'green' }
  ], [incidents.length]);

  return (
    <div className="ops-dashboard">
      {/* Dashboard Top Header */}
      <header className="app-header" aria-label="Operations Header">
        <div className="brand">
          <div className="logo-icon" aria-hidden="true">👷</div>
          <div className="logo-text">
            <h1>Pulse Command</h1>
            <p>Stadium Operations Dashboard — FIFA World Cup 2026</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="system-status">
            <span className={`status-dot ${systemState !== 'All Systems Operational' ? 'danger' : ''}`} aria-hidden="true"></span>
            {systemState}
          </div>
          <button 
            className="theme-toggle" 
            onClick={() => setDark(d => !d)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="ms">{dark ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </div>
      </header>

      {/* Grid Dashboard Layout */}
      <main className="dashboard-grid" id="main-dashboard">
        
        {/* Row 1: KPI Cards */}
        {kpis.map((kpi, i) => (
          <section key={i} className="kpi-card" aria-label={kpi.label}>
            <div className={`kpi-icon ${kpi.colorClass}`} aria-hidden="true">
              <span className="ms">{kpi.icon}</span>
            </div>
            <div className="kpi-details">
              <span className="kpi-value">{kpi.value}</span>
              <span className="kpi-label">{kpi.label}</span>
            </div>
          </section>
        ))}

        {/* Row 2: Live Heatmap & Predictive Alerts */}
        <section className="card col-span-4" aria-labelledby="heatmap-title">
          <div className="card-header">
            <h2 id="heatmap-title" className="card-title">
              <span className="ms" aria-hidden="true">grid_view</span>
              Live Stadium Gate Congestion Heatmap (IoT Influx Feed)
            </h2>
          </div>

          {/* Predictive Alerts */}
          {systemState !== 'All Systems Operational' && (
            <div className="predictive-alert-box" role="alert">
              <span className="ms" style={{ color: 'var(--danger)' }} aria-hidden="true">error_outline</span>
              <span className="predictive-alert-text">
                Predictive AI Warning: Gate C3 turnstiles will reach critical overflow capacity in 14 minutes.
                Redirection route active through Gate A1.
              </span>
            </div>
          )}

          {/* Gates Matrix */}
          <div className="heatmap-visual">
            {gates.map((g, i) => (
              <div key={i} className="gate-sensor">
                <div className={`gate-status-stripe ${g.status}`} />
                <span className="gate-name">{g.name}</span>
                <span className="gate-density">{g.density.toLocaleString()} fans</span>
                <span className={`gate-label ${g.status}`}>{g.status.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Row 3 Column 1: BigQuery AI Assistant */}
        <section className="card col-span-2" aria-labelledby="bq-title">
          <div className="card-header">
            <h2 id="bq-title" className="card-title">
              <span className="ms" aria-hidden="true">database</span>
              Gemini NL-to-BigQuery Query Panel
            </h2>
          </div>
          <div className="query-panel">
            <label htmlFor="nl-query-input">Ask Gemini in Natural Language:</label>
            <textarea
              id="nl-query-input"
              className="text-area-input"
              rows={3}
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              placeholder="e.g. Show average attendance per gate from last hour..."
            />
            
            <button 
              className="btn-primary" 
              onClick={handleGenerateSql}
              disabled={generating}
              aria-label="Submit natural language query to Gemini"
            >
              <span className="ms" aria-hidden="true">psychology</span>
              {generating ? 'Compiling SQL Query...' : 'Generate BigQuery SQL'}
            </button>

            {activeSql && (
              <div className="sql-result-box">
                <span className="sql-badge">BIGQUERY SQL</span>
                <code>{activeSql}</code>
              </div>
            )}

            {activeChartData.length > 0 && (
              <div className="chart-container">
                <span style={{ fontSize: 13, fontWeight: 700 }}>AI Generated Visualization</span>
                <div className="chart-bars">
                  {activeChartData.map((bar, i) => (
                    <div key={i} className="chart-bar-col">
                      <div 
                        className={`chart-bar ${bar.color === 'var(--danger)' ? 'highlight' : ''}`} 
                        style={{ height: `${bar.val}%` }} 
                        aria-label={`${bar.label}: ${bar.val} units`}
                      />
                      <span className="chart-bar-label">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Row 3 Column 2: Incident Command Center */}
        <section className="card col-span-2" aria-labelledby="incidents-title">
          <div className="card-header">
            <h2 id="incidents-title" className="card-title">
              <span className="ms" aria-hidden="true">notifications_active</span>
              Incident Control Center
            </h2>
          </div>
          <div className="incident-list">
            {incidents.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--success)', fontWeight: 'bold' }}>
                ✅ All active incidents resolved. Operations are optimal.
              </div>
            ) : (
              incidents.map(inc => (
                <div key={inc.id} className="incident-item">
                  <div className="incident-info">
                    <span className="incident-title">{inc.title}</span>
                    <span className="incident-description">{inc.description}</span>
                    <span style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--primary)' }}>📍 Location: {inc.location}</span>
                  </div>
                  <button 
                    className="btn-success-sm" 
                    onClick={() => handleResolveIncident(inc.id)}
                    aria-label={`Mark incident ${inc.id} as resolved`}
                  >
                    <span className="ms" style={{ fontSize: 16 }} aria-hidden="true">check</span>
                    Resolve
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

      </main>

      {/* Toast Alert */}
      {toast && (
        <div className="toast" role="alert" aria-live="assertive">
          {toast}
        </div>
      )}
    </div>
  );
}
