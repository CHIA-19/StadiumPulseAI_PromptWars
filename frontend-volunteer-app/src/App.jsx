import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';

/**
 * @typedef {Object} Incident
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} location
 * @property {string} severity
 * @property {string} assignedTeam
 * @property {string} time
 */

const MOCK_PHOTOS = [
  {
    id: 'spill',
    label: 'Spilled Drink',
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=150&q=80',
    description: 'Liquid spill detected near section 102 exit. High slip risk on concrete ramp.',
    severity: 'medium',
    assignedTeam: 'Cleaning Crew Bravo'
  },
  {
    id: 'seat',
    label: 'Broken Seat',
    imageUrl: 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?auto=format&fit=crop&w=150&q=80',
    description: 'Damaged stadium seat in Row G, Seat 14. Plastic support cracked and unsafe to sit.',
    severity: 'low',
    assignedTeam: 'Maintenance & Facilities'
  },
  {
    id: 'medical',
    label: 'Fainting Fan',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=150&q=80',
    description: 'Spectator reported feeling dizzy and collapsed near food court B. Conscious but needs medical check.',
    severity: 'high',
    assignedTeam: 'Medical First Responders'
  }
];

export default function App() {
  const [dark, setDark] = useState(false);
  const [location, setLocation] = useState('Concourse Section 102');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [customReport, setCustomReport] = useState('');
  const [severity, setSeverity] = useState('low');
  const [assignedTeam, setAssignedTeam] = useState('General Staff');
  const [toast, setToast] = useState('');
  
  const [incidents, setIncidents] = useState([
    {
      id: '1',
      title: 'Gate A turnstile gate jam',
      description: 'Scanner failed to read ticket bar codes. Restarting scanner unit.',
      location: 'Gate A1',
      severity: 'medium',
      assignedTeam: 'IT Support Team 1',
      time: '10 mins ago'
    },
    {
      id: '2',
      title: 'Overflowing recycle bin',
      description: 'Trash starting to accumulate next to recycling station near entrance 3.',
      location: 'Entrance 3 Outer Lobby',
      severity: 'low',
      assignedTeam: 'Cleaning Crew Alpha',
      time: '32 mins ago'
    }
  ]);

  // Dark Theme support
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  const handlePhotoSelect = useCallback((photo) => {
    setSelectedPhoto(photo.id);
    setAnalyzing(true);
    setAiReport(null);

    // Simulate Gemini Multimodal Vision analysis API
    setTimeout(() => {
      setAnalyzing(false);
      setAiReport(photo.description);
      setCustomReport(photo.description);
      setSeverity(photo.severity);
      setAssignedTeam(photo.assignedTeam);
      showToast('Gemini Vision AI auto-triaged the hazard!');
    }, 1500);
  }, [showToast]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!customReport) return;

    const newIncident = {
      id: String(Date.now()),
      title: customReport.split('.')[0] || 'New Incident Reported',
      description: customReport,
      location,
      severity,
      assignedTeam,
      time: 'Just now'
    };

    setIncidents(prev => [newIncident, ...prev]);
    showToast('Incident logged and dispatched successfully!');
    
    // Reset state
    setSelectedPhoto(null);
    setAiReport(null);
    setCustomReport('');
    setLocation('Concourse Section 102');
    setSeverity('low');
    setAssignedTeam('General Staff');
  }, [customReport, location, severity, assignedTeam, showToast]);

  // Memoized shift schedule items for rendering efficiency
  const shiftSchedule = useMemo(() => [
    { time: '14:00 - 16:30', role: 'Crowd Marshal', zone: 'East Gate Area' },
    { time: '16:30 - 19:00', role: 'Wayfinding Guide', zone: 'Concourse A' },
    { time: '19:00 - 22:00', role: 'Incident Reporting Officer', zone: 'Section 100-110' }
  ], []);

  return (
    <div className="volunteer-app">
      {/* Top Header */}
      <header className="app-header" aria-label="Application Header">
        <div className="brand">
          <div className="logo-icon" aria-hidden="true">🙋</div>
          <div className="logo-text">
            <h1>PulseAssist</h1>
            <p>Volunteer Reporting Portal — FIFA 2026</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="status-badge">
            <span className="status-dot" aria-hidden="true"></span>
            On Duty
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

      {/* Main Grid Layout */}
      <main className="app-container" id="main-content">
        <div className="main-content">
          
          {/* Report Incident Card */}
          <section className="card" aria-labelledby="report-title">
            <div className="card-header">
              <h2 id="report-title" className="card-title">
                <span className="ms" aria-hidden="true">add_alert</span>
                Report Active Hazard / Incident
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Photo Input Simulation */}
              <div className="form-group">
                <label>Capture / Select Mock Photo (Simulates Mobile Camera Upload)</label>
                <div className="photo-upload-container">
                  {MOCK_PHOTOS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      className={`mock-photo-btn ${selectedPhoto === p.id ? 'selected' : ''}`}
                      onClick={() => handlePhotoSelect(p)}
                      aria-label={`Select mock photo of ${p.label}`}
                    >
                      <img src={p.imageUrl} alt={p.label} />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gemini Vision Triage Status */}
              {analyzing && (
                <div className="gemini-analysis" role="status">
                  <div className="gemini-analysis-title">
                    <span className="ms" aria-hidden="true">psychology</span>
                    Gemini Vision AI is analyzing photo...
                  </div>
                  <div className="gemini-analysis-content">Extracting details and classifying severity level...</div>
                </div>
              )}

              {aiReport && (
                <div className="gemini-analysis" role="status" style={{ borderStyle: 'solid' }}>
                  <div className="gemini-analysis-title" style={{ color: 'var(--success)' }}>
                    <span className="ms" aria-hidden="true">check_circle</span>
                    Gemini AI Drafted Summary & Triage
                  </div>
                  <div className="gemini-analysis-content">"{aiReport}"</div>
                </div>
              )}

              {/* Location Input */}
              <div className="form-group">
                <label htmlFor="incident-location">Location / Zone</label>
                <input
                  id="incident-location"
                  type="text"
                  className="text-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Concourse A Section 102"
                  required
                />
              </div>

              {/* Custom Report / AI Correction Area */}
              <div className="form-group">
                <label htmlFor="incident-desc">Incident Details / Report Description</label>
                <textarea
                  id="incident-desc"
                  className="text-input"
                  rows={3}
                  value={customReport}
                  onChange={(e) => setCustomReport(e.target.value)}
                  placeholder="Describe the incident here, or tap a mock photo to generate via Gemini Vision..."
                  required
                />
              </div>

              {/* Triage Auto-fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label htmlFor="incident-severity">Severity Level (AI Auto-assigned)</label>
                  <select
                    id="incident-severity"
                    className="select-input"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="low">Low Severity</option>
                    <option value="medium">Medium Severity</option>
                    <option value="high">High Severity</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="incident-team">Dispatched Response Team</label>
                  <select
                    id="incident-team"
                    className="select-input"
                    value={assignedTeam}
                    onChange={(e) => setAssignedTeam(e.target.value)}
                  >
                    <option value="General Staff">General Staff</option>
                    <option value="Cleaning Crew Bravo">Cleaning Crew Bravo</option>
                    <option value="Maintenance & Facilities">Maintenance & Facilities</option>
                    <option value="Medical First Responders">Medical First Responders</option>
                    <option value="IT Support Team 1">IT Support Team 1</option>
                  </select>
                </div>
              </div>

              {/* Submit Dispatch */}
              <button 
                type="submit" 
                className="btn-primary"
                disabled={analyzing || !customReport}
                aria-label="Submit incident to dispatch"
              >
                <span className="ms" aria-hidden="true">send</span>
                Submit Report & Dispatch AI Route
              </button>
            </form>
          </section>

          {/* Active Incidents Feed */}
          <section className="card" aria-labelledby="feed-title">
            <div className="card-header">
              <h2 id="feed-title" className="card-title">
                <span className="ms" aria-hidden="true">rss_feed</span>
                My Reported Incidents (Recent Dispatch)
              </h2>
            </div>
            <div className="incident-feed-list">
              {incidents.map(inc => (
                <div key={inc.id} className="incident-feed-item">
                  <div className="incident-feed-header">
                    <span className="incident-feed-title">{inc.title}</span>
                    <span className={`severity-pill severity-${inc.severity}`}>
                      {inc.severity}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{inc.description}</p>
                  <div className="incident-feed-meta">
                    <span>📍 {inc.location}</span>
                    <span>👷 Assigned: {inc.assignedTeam}</span>
                    <span>🕒 {inc.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar Content */}
        <div className="sidebar-content">
          
          {/* Shift Schedule */}
          <section className="card" aria-labelledby="shift-title">
            <div className="card-header">
              <h2 id="shift-title" className="card-title">
                <span className="ms" aria-hidden="true">calendar_today</span>
                My Shifts (Google Calendar Sync)
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {shiftSchedule.map((shift, i) => (
                <div key={i} className="shift-item">
                  <div className="shift-time">{shift.time}</div>
                  <div className="shift-details">
                    <h4>{shift.role}</h4>
                    <p>{shift.zone}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Accessibility & Guidelines Card */}
          <section className="card" aria-labelledby="guidelines-title">
            <div className="card-header">
              <h2 id="guidelines-title" className="card-title">
                <span className="ms" aria-hidden="true">info</span>
                Volunteer Guidelines
              </h2>
            </div>
            <ul style={{ paddingLeft: 18, fontSize: 12, display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--text-muted)' }}>
              <li>Always check Gemini Vision auto-triage output to confirm incident class.</li>
              <li>Toggle "On Duty" status to receive notifications on your active sector.</li>
              <li>Escalate critical medical alerts immediately via direct voice channel.</li>
            </ul>
          </section>

        </div>
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
