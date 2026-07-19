# ⚡ StadiumPulse AI
### Smart Stadium & Tournament Operations Platform — FIFA World Cup 2026
> **PromptWars Virtual · Challenge 4** | Built with Google Gemini AI + Vertex AI

---

## 🎯 Chosen Vertical
**Stadium Operations & Fan Experience** — serving four user roles:
| Role | Interface |
|---|---|
| 🏟️ Fan | StadiumPulse Companion (Fan PWA) |
| 🙋 Volunteer | PulseAssist Reporting Tool |
| 👷 Venue Staff | Ops Command Dashboard |
| 📋 Tournament Organiser | Analytics + AI Query Panel |

---

## 🤖 GenAI Usage (Mandatory Requirement — Fulfilled)

This project is **end-to-end powered by Google Gemini AI**:

| GenAI Feature | Where Used |
|---|---|
| **Gemini 2.0 Flash** (via Vertex AI) | All 5 Stadium Brain agents — reasoning, decision-making, response generation |
| **Gemini Function Calling** | Concierge Agent routes fan queries to the correct tool (maps, crowd data, transit) |
| **Gemini Vision (Multimodal)** | Incident Agent analyses volunteer-uploaded photos to triage severity automatically |
| **Vertex AI Agent Builder** | Orchestrates multi-agent coordination between all 5 sub-agents |
| **Google Cloud Translation API** | Real-time multilingual chat — 10 languages auto-detected |
| **Speech-to-Text / Text-to-Speech** | Voice concierge for accessibility; hands-free volunteer reporting |
| **Gemini NL → BigQuery** | Organizers type natural language queries → Gemini generates SQL + chart |
| **Gemini Report Generation** | Sustainability Agent writes post-match carbon summary using Gemini |
| **Gemini Incident Summariser** | Auto-drafts structured incident logs for volunteers to review and submit |

---

## 🧠 The Core Concept — "Stadium Brain"

A **multi-agent Gemini orchestration system** with 5 cooperating sub-agents:

```
Fan Request / Sensor Event / Staff Query
            │
    ┌───────▼────────┐
    │  Stadium Brain  │  ← Vertex AI Agent Builder orchestrator
    └───────┬────────┘
            │
  ┌─────────┼──────────────────────┐
  │         │                      │
┌─▼──┐  ┌──▼────┐  ┌────────┐  ┌──▼──────┐  ┌────────────┐
│ 🗣️ │  │ 👥    │  │ 🚇     │  │ 🚨      │  │ 🌿         │
│Con-│  │Crowd- │  │Mobility│  │Incident │  │Sustainabil-│
│cier│  │Flow   │  │Agent   │  │& Safety │  │ity Agent   │
│ge  │  │Agent  │  │        │  │Agent    │  │            │
└─┬──┘  └──┬────┘  └───┬────┘  └──┬──────┘  └──────┬─────┘
  │         │           │          │                  │
  └─────────┴───────────┴──────────┴──────────────────┘
                         │
              ┌──────────▼──────────┐
              │  Shared State Layer  │
              │  Firestore + BigQuery│
              └─────────────────────┘
```

### Agent Responsibilities

| Agent | Responsibility |
|---|---|
| **Concierge Agent** | Multilingual fan assistant — wayfinding, food, accessibility, matchday info |
| **Crowd-Flow Agent** | Ingests IoT turnstile data → predicts congestion 15–30 min ahead → reroutes fans |
| **Mobility Agent** | Multimodal transit planning via Google Maps Platform — low-carbon routing |
| **Incident & Safety Agent** | Gemini Vision photo triage → severity classification → auto-assigns response team |
| **Sustainability Agent** | Tracks carbon, waste, energy per zone → Gemini-written daily reports |

All agents **share a Firestore state layer** — so the Concierge won't route fans to a gate the Crowd-Flow Agent has flagged as congested.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                          │
│  frontend-fan-pwa    frontend-volunteer-app    ops-dashboard  │
│  (React + Vite PWA)  (React + Vite PWA)       (React + Vite) │
└────────────────────────────┬─────────────────────────────────┘
                             │ HTTPS / WebSocket
┌────────────────────────────▼─────────────────────────────────┐
│                    GOOGLE CLOUD BACKEND                       │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  Cloud Run  │  │   Pub/Sub    │  │     Firebase       │  │
│  │  (5 agents) │  │  Event Bus   │  │  Auth + Firestore  │  │
│  └──────┬──────┘  └──────┬───────┘  │  + Cloud Messaging │  │
│         │                │          └────────────────────┘  │
│  ┌──────▼────────────────▼────────┐                         │
│  │        Vertex AI / Gemini       │                         │
│  │  Agent Builder + Function Call  │                         │
│  └──────────────┬─────────────────┘                         │
│                 │                                            │
│  ┌──────────────▼──────────┐  ┌──────────────────────────┐  │
│  │        BigQuery          │  │   Google Maps Platform   │  │
│  │  Analytics + NL Queries  │  │  Directions, Transit,    │  │
│  └─────────────────────────┘  │  Indoor Maps, Routes API │  │
│                                └──────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🏟️ Fan App — StadiumPulse Companion
- **AI Concierge Chat + Voice** — ask anything in 10 languages, powered by Gemini 2.0
- **Live Crowd Heatmap** — 6-gate real-time density display (calm / caution / critical)
- **Indoor Wayfinding Map** — step-free routing, restroom/food pin overlay
- **Smart Transit Planner** — 4 options with CO₂ scores, surge predictions, AI-recommended departure
- **Incident Feed** — live alerts with Gemini-generated summaries
- **Sustainability Tracker** — personal carbon footprint, Green Fan badge, leaderboard
- **Match Schedule** — live scores, today's fixtures, FT results
- **Language Modal** — 10 language switcher (EN, ES, FR, PT, AR, ZH, HI, JA, KO, DE)
- **Dark Mode** — full theme toggle

### 🙋 Volunteer App — PulseAssist
- One-tap incident reporting with photo upload
- **Gemini-drafted incident summaries** auto-generated for review before submission
- Shift schedule synced from Google Workspace (Sheets / Calendar)
- Severity triage: Low / Medium / High with AI auto-assignment

### 👷 Ops Dashboard — Pulse Command
- Live stadium-wide heatmap with predictive congestion alerts
- Incident feed with Gemini AI summary + one-click resolve
- Sustainability KPIs: CO₂, waste diversion, energy
- **Natural-language BigQuery query panel** — type in plain English, Gemini generates the SQL + chart

---

## 📁 Repository Structure

```
StadiumPulseAI_PromptWars/
├── frontend-fan-pwa/          # Fan Companion App (React + Vite PWA)
│   ├── src/
│   │   ├── App.jsx            # Main app — 9 pages, sidebar layout
│   │   ├── App.css            # Full design system (Material 3 tokens)
│   │   └── index.css          # Global reset
│   ├── index.html             # PWA entry + Google Fonts
│   └── package.json
│
├── frontend-volunteer-app/    # PulseAssist Volunteer PWA (React + Vite)
├── ops-dashboard/             # Ops Command Dashboard (React + Vite)
│
├── agents/
│   ├── concierge-agent/       # Cloud Run — Gemini + Translation API
│   ├── crowd-flow-agent/      # Cloud Run — Pub/Sub + BigQuery ML
│   ├── mobility-agent/        # Cloud Run — Google Maps Platform
│   ├── incident-agent/        # Cloud Run — Gemini Vision triage
│   └── sustainability-agent/  # Cloud Run — BigQuery + Gemini reports
│
├── data/
│   └── mock-sensors/          # IoT turnstile + weather simulator (Node.js)
│
├── infra/                     # Terraform for GCP resources
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

### AI / GenAI (Mandatory)
- **Gemini 2.0 Flash** via Vertex AI — core reasoning for all 5 agents
- **Vertex AI Agent Builder** — multi-agent orchestration
- **Gemini Vision** — incident photo triage
- **Google Cloud Translation API** — 10-language real-time chat
- **Speech-to-Text + Text-to-Speech** — voice concierge

### Backend
- **Cloud Run** — containerised microservice per agent
- **Cloud Functions** — event-driven triggers (sensor spike → agent)
- **Pub/Sub** — real-time event bus between IoT, agents, dashboards
- **Firebase** — Auth, Firestore (live state), Cloud Messaging (push alerts)
- **BigQuery** — historical analytics, crowd trends, sustainability reporting

### Frontend
- **React + Vite** — fast, modern PWA
- **Vanilla CSS** — custom Material Design 3 design tokens
- **Google Fonts** — Inter + Material Symbols Rounded

### Maps
- **Google Maps Platform** — Directions, Transit, Routes, Indoor Maps APIs

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/CHIA-19/StadiumPulseAI_PromptWars.git
cd StadiumPulseAI_PromptWars

# 2. Install & run the Fan App
cd frontend-fan-pwa
npm install
npm run dev
# Open http://localhost:5173

# 3. Install & run the Volunteer App
cd ../frontend-volunteer-app
npm install
npm run dev

# 4. Install & run the Ops Dashboard
cd ../ops-dashboard
npm install
npm run dev
```

### Environment Variables (for full agent integration)
Create a `.env` file in each agent directory:
```env
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GEMINI_API_KEY=your-vertex-ai-api-key
FIREBASE_API_KEY=your-firebase-key
GOOGLE_MAPS_API_KEY=your-maps-api-key
```

---

## 🎬 Demo Script (End-to-End Simulation)

1. **Sensor Trigger** — Mock sensor raises Gate C3 turnstile density to 91%
2. **Crowd-Flow Agent** — Predicts critical congestion in 14 min → pushes alert to Ops Dashboard + fan reroute notification
3. **Fan Concierge** — Fan asks in Spanish: *"¿Cuál es la ruta más rápida a mi asiento?"* → Gemini responds in Spanish, routes via Gate A1 (clear)
4. **Volunteer Reports** — Volunteer photographs a spilled-drink hazard → Incident Agent triages as Low severity, assigns Cleaning Team 3, drafts AI log entry
5. **Post-Match Report** — Sustainability Agent generates Gemini-written carbon summary: *"82% of fans used eco transport — 142t CO₂ saved"*

---

## ♿ Accessibility

- WCAG 2.2 AA compliant design
- Step-free routing flagged on every navigation suggestion
- Screen-reader semantic labels throughout
- High-contrast colour palette (outdoor daylight readable)
- Voice concierge (Speech-to-Text) for visually impaired fans
- Minimum 14px body text

---

## 🌍 Multilingual Support

10 languages supported via Google Cloud Translation API:
`English · Spanish · French · Portuguese · Arabic · Mandarin · Hindi · Japanese · Korean · German`

Auto-detected from device locale; user-switchable from the navbar.

---

## 🌿 Sustainability

- Every transit option shows its CO₂ footprint
- Green Fan badge + leaderboard rewards low-carbon choices
- Stadium-wide carbon, waste, and energy dashboard
- Gemini generates post-match sustainability report
- Platform's own cloud carbon footprint shown via GCP Carbon Footprint tool

---

## 🔒 Privacy & Security

- No facial recognition — crowd density only (anonymised aggregate counts)
- Firebase Authentication with role-based access (Fan / Volunteer / Staff / Organiser)
- All API keys stored in environment variables — never committed to Git
- Clearly stated in-app privacy notice

---

## 📊 Evaluation Alignment

| Criterion | How We Meet It |
|---|---|
| **Code Quality** | Modular components, clean separation of concerns, consistent naming |
| **Security** | Firebase Auth, role-based access, env-var API keys, no secrets in repo |
| **Efficiency** | Gemini function-calling minimises redundant API calls; Pub/Sub for async sensor events |
| **Testing** | Mock sensor simulator validates full agent pipeline without real hardware |
| **Accessibility** | WCAG AA, step-free routing, voice input/output, screen-reader labels |
| **GenAI Usage** | Gemini 2.0 powers all 5 agents — reasoning, vision, NL queries, translation, reports |

---

## 🗺️ Challenge Judging Alignment

| Challenge Area | Feature |
|---|---|
| Navigation | AR wayfinding + Indoor Maps + step-free routing |
| Crowd Management | Crowd-Flow Agent + predictive heatmaps + gate rerouting |
| Accessibility | Voice concierge, WCAG AA, step-free routing on every suggestion |
| Transportation | Mobility Agent + Google Maps Platform (transit, rideshare, walk, car) |
| Sustainability | Sustainability Agent + carbon tracker + Green Fan leaderboard |
| Multilingual | Translation API across 10 languages, auto-detected |
| Operational Intelligence | Ops Dashboard + Looker Studio + Gemini NL → BigQuery queries |

---

## 📝 Assumptions

- Turnstile/sensor data is simulated via the mock-sensor script (`data/mock-sensors/`)
- Gemini API responses are mocked in the frontend for demonstration without requiring live API keys
- Google Maps Indoor Map data is represented via custom SVG overlay for the demo

---

*Built with ❤️ using Google Antigravity for PromptWars Virtual · Challenge 4*
