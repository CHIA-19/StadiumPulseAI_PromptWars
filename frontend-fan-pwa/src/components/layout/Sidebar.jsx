import React, { memo } from 'react';

const SidebarItem = memo(({ id, icon, label, pill, active, setActive }) => (
  <button 
    className={`sidebar-item${active === id ? ' active' : ''}`} 
    onClick={() => setActive(id)}
    aria-current={active === id ? 'page' : undefined}
  >
    <span className="ms" aria-hidden="true">{icon}</span>
    {label}
    {pill && <span className={`sidebar-pill ${pill.cls}`} aria-label={pill.txt}>{pill.txt}</span>}
  </button>
));

const Sidebar = memo(({ active, setActive }) => {
  const items = [
    { id:'home',      icon:'dashboard',          label:'Dashboard',       pill: null },
    { id:'heatmap',   icon:'heat_map',            label:'Crowd Heatmap',   pill:{txt:'LIVE', cls:'pill-red'} },
    { id:'concierge', icon:'smart_toy',           label:'AI Concierge',    pill:{txt:'AI', cls:'pill-blue'} },
    { id:'wayfinding',icon:'explore',             label:'Wayfinding Map',  pill: null },
    { id:'transit',   icon:'directions_transit',  label:'Transit Planner', pill: null },
    { id:'incidents', icon:'report',              label:'Incident Feed',   pill:{txt:'5', cls:'pill-red'} },
    { id:'volunteer', icon:'volunteer_activism',  label:'Report Incident', pill: null },
    { id:'sustain',   icon:'eco',                 label:'Sustainability',  pill:{txt:'NEW', cls:'pill-green'} },
    { id:'schedule',  icon:'event',               label:'Match Schedule',  pill: null },
  ];

  return (
    <aside className="sidebar" aria-label="Sidebar Navigation">
      <span className="sidebar-section-label" id="nav-ops-label">Operations</span>
      <nav aria-labelledby="nav-ops-label">
        {items.slice(0,2).map(i => <SidebarItem key={i.id} {...i} active={active} setActive={setActive} />)}
      </nav>
      <div className="sidebar-divider" aria-hidden="true" />
      <span className="sidebar-section-label" id="nav-services-label">Fan Services</span>
      <nav aria-labelledby="nav-services-label">
        {items.slice(2,5).map(i => <SidebarItem key={i.id} {...i} active={active} setActive={setActive} />)}
      </nav>
      <div className="sidebar-divider" aria-hidden="true" />
      <span className="sidebar-section-label" id="nav-safety-label">Safety & Green</span>
      <nav aria-labelledby="nav-safety-label">
        {items.slice(5).map(i => <SidebarItem key={i.id} {...i} active={active} setActive={setActive} />)}
      </nav>
    </aside>
  );
});

export default Sidebar;
