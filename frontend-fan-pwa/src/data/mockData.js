export const GATES = [
  { id: 'A1', name: 'Gate A1 – North', density: 34, status: 'calm',     wait: '< 1 min',  crowd: 2340 },
  { id: 'B2', name: 'Gate B2 – East',  density: 62, status: 'caution',  wait: '5–8 min',  crowd: 4180 },
  { id: 'C3', name: 'Gate C3 – South', density: 91, status: 'critical', wait: '22 min',   crowd: 6120 },
  { id: 'D4', name: 'Gate D4 – West',  density: 28, status: 'calm',     wait: '< 1 min',  crowd: 1890 },
  { id: 'E5', name: 'Gate E5 – NE',    density: 73, status: 'caution',  wait: '8–12 min', crowd: 4920 },
  { id: 'F6', name: 'Gate F6 – NW',    density: 19, status: 'calm',     wait: '< 1 min',  crowd: 1280 },
];

export const TRANSITS = [
  { type:'train', icon:'train',          name:'Metro Line 3',    sub:'Platform 2 · departs 21:47 · 3 min walk', time:'12 min', co2:'0.4 kg',  rec:true  },
  { type:'bus',   icon:'directions_bus', name:'Bus 47X Express', sub:'Stop C1 · departs 21:52',                 time:'24 min', co2:'1.2 kg',  rec:false },
  { type:'walk',  icon:'directions_walk',name:'Walk – East Gate',sub:'Via East Promenade · Step-free',          time:'28 min', co2:'0 kg',    rec:false },
  { type:'car',   icon:'directions_car', name:'Rideshare / Uber',sub:'Surge ×2.4 active – not recommended',    time:'18 min', co2:'3.1 kg',  rec:false },
];

export const INCIDENTS = [
  { id:1, title:'Spilled liquid hazard',     loc:'Concourse B, near Stall 12',   time:'2 min ago',  sev:'low',  assigned:'Cleaning Team 3' },
  { id:2, title:'Gate C3 – Critical congestion', loc:'Gate C3 entrance',         time:'8 min ago',  sev:'high', assigned:'Security Lead' },
  { id:3, title:'Medical assistance needed', loc:'Section 108, Row F',           time:'15 min ago', sev:'med',  assigned:'First Aid Team' },
  { id:4, title:'Lost child reported',       loc:'Fan Info Desk – South',        time:'22 min ago', sev:'med',  assigned:'Security Team 1' },
  { id:5, title:'Barrier malfunction',       loc:'Gate A1 turnstile 4',          time:'31 min ago', sev:'low',  assigned:'Maintenance' },
];

export const MATCHES = [
  { flag1:'🇺🇸', t1:'USA',     flag2:'🇧🇷', t2:'Brazil',  score:'2 – 1', venue:'MetLife, NJ',    date:'NOW',   status:'live'  },
  { flag1:'🇲🇽', t1:'Mexico',  flag2:'🇦🇷', t2:'Argentina',score:'–',    venue:'AT&T, Dallas',    date:'Today', status:'today' },
  { flag1:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', t1:'England', flag2:'🇫🇷', t2:'France', score:'1 – 0', venue:'SoFi, LA',        date:'FT',    status:'done'  },
  { flag1:'🇩🇪', t1:'Germany', flag2:'🇯🇵', t2:'Japan',   score:'2 – 2', venue:'Allegiant, Vegas', date:'FT',    status:'done'  },
];

export const LEADERBOARD = [
  { flag:'🇸🇪', name:'Björn Larsson',    co2:'0.2 kg', pct:98 },
  { flag:'🇨🇦', name:'Anika Patel',      co2:'0.4 kg', pct:92 },
  { flag:'🇧🇷', name:'Gabriel Costa',   co2:'0.6 kg', pct:85 },
  { flag:'🇯🇵', name:'Yuki Tanaka',      co2:'0.7 kg', pct:80 },
  { flag:'🇩🇪', name:'Lena Müller',      co2:'1.0 kg', pct:72 },
];

export const AI_REPLIES = [
  "📍 Head to **Gate A1** (34% capacity, fully clear) → Concourse North → Elevator 3 to Level 2 → Section 214 is on your right. ETA: ~4 min. Shall I start AR navigation?",
  "🚻 Nearest accessible restroom is **60m ahead on Concourse B** — step-free, spacious, and currently clear. I've pinned it on your indoor map.",
  "🍔 I found **3 halal-certified stalls** near Gate C: Al-Bayt Kitchen (Concourse 2 ⭐4.6), Crescent Bites (Section 108 ⭐4.4), and Medina Street Food (Gate B ⭐4.8).",
  "🚇 Post-match exit: **Metro Line 3 departs 21:47** from Platform 2 — I recommend leaving your seat at the 88th minute. Walk time to platform: 3 min. No surge pricing!",
  "♿ Step-free route from Gate A1 to Section 214: Ground floor → Lift 3 (Level 2) → Left at Concourse North. Companion seat availability: ✅ Row G, Seats 11–12.",
  "🌿 Your trip via metro saved **2.7 kg CO₂** vs driving! You've earned the **Green Fan Bronze badge**. 82% of fans today chose low-carbon transport — amazing!",
];
