# StadiumPulse AI

Smart Stadium & Tournament Operations Platform for FIFA World Cup 2026.

## Overview
StadiumPulse AI is a GenAI-powered platform that enhances stadium operations and fan experience. It serves four distinct user roles — Fans, Volunteers, Venue Staff, and Tournament Organizers — through one connected ecosystem, powered by Google Cloud and Gemini.

The system utilizes a central **"Stadium Brain"**: a multi-agent orchestrator managing five cooperative sub-agents:
1. **Concierge Agent** (Fan facing assistant)
2. **Crowd-Flow Agent** (Congestion predictor and router)
3. **Mobility Agent** (Transit and journey planner)
4. **Incident & Safety Agent** (Reporter and triage)
5. **Sustainability Agent** (Carbon footprint and waste tracking)

## Tech Stack
- **AI / GenAI**: Gemini API, Vertex AI Agent Builder, Vertex AI Vision, Translation API, Speech-to-Text & Text-to-Speech
- **Data / Backend**: Firebase, Cloud Run, Cloud Functions, Pub/Sub, BigQuery
- **Maps / Mobility**: Google Maps Platform
- **Analytics / Ops**: Looker Studio
- **Frontend**: React + Vite PWAs (Material Design 3)

## Architecture

*(See implementation plan for Mermaid diagram)*

## Repository Structure
- `/frontend-fan-pwa`: React + Vite PWA for the Fan App (StadiumPulse Companion)
- `/frontend-volunteer-app`: React + Vite lightweight PWA for Volunteers (PulseAssist)
- `/ops-dashboard`: React web console embedding Looker Studio for staff
- `/agents/*`: Cloud Run microservices for each of the five Gemini agents
- `/infra`: Terraform configurations for GCP resources
- `/data/mock-sensors`: Node.js simulator for turnstile and sensor data

## Setup Instructions

1. **Install Dependencies**
   Navigate to each frontend and agent directory and run:
   ```bash
   npm install
   ```
2. **Environment Variables**
   Create a `.env` file in the respective directories containing required Google Cloud and Firebase keys.
3. **Run Locally**
   Run the dev servers for the frontends:
   ```bash
   npm run dev
   ```

## Demo Script

Follow this simulated end-to-end demo flow:
1. **Sensor Trigger**: Run the mock sensor simulator to artificially raise turnstile density at "Gate 4".
2. **Crowd Flow Action**: The Crowd-Flow Agent predicts critical congestion in 18 minutes, updates the Ops Dashboard, and pushes a reroute suggestion to the Fan App.
3. **Concierge Query**: A fan asks the Concierge (in Spanish) for the fastest way to their seat. The response auto-routes around the congested Gate 4.
4. **Incident Reporting**: A volunteer uses the Volunteer App to photograph a spilled-drink hazard. The Incident Agent triages it as low severity, auto-assigns it to the nearest cleaning team, and drafts the log entry.
5. **Sustainability Recap**: Post-match, the Sustainability Agent generates a one-page Gemini-written summary of the day's carbon savings.

## Alignment with Challenge Criteria
- **Navigation**: AR wayfinding + indoor maps (Google Maps Platform)
- **Crowd management**: Crowd-Flow Agent + predictive heatmaps
- **Accessibility**: Step-free routing, voice concierge, WCAG AA compliance
- **Transportation**: Mobility Agent + multimodal transit data
- **Sustainability**: Sustainability Agent + carbon tracking
- **Multilingual assistance**: Translation API for 10+ languages
- **Operational intelligence**: Ops Dashboard + Looker Studio + natural language querying
