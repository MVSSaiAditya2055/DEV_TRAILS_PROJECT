# GigShield - Parametric Insurance for Delivery Workers

Guidewire DEVTrails 2026 | Phase 1

## What is this?

Delivery workers get caught in storms and cannot work, but nobody pays them for it. GigShield does. When severe weather hits a zone where a delivery partner is working, the platform detects it, verifies they were actually there, and triggers payout automatically.

This repository now contains a functional React frontend prototype with a live anti-spoofing decision simulator.

## Functional React Prototype (Current)

Implemented in this phase:

- Worker signal intake panel (route, motion, tower, Wi-Fi, spoofing footprint)
- Weather event control panel (severity, zone, claim spikes, saturation)
- Real-time confidence engine with tiered actioning:
	- High (85%+): instant payout
	- Medium (50-84%): soft hold + lightweight verification
	- Low (<50%): human review + one-tap appeal
- Signal-by-signal contribution breakdown for transparency

## How to run locally

```bash
npm install
npm run dev
```

Open the URL shown in terminal (typically http://localhost:5173).

## How it works (Product Workflow)

1. Worker signs up and enables location + motion access on the app.
2. Platform monitors weather feeds across delivery zones.
3. On red-alert declaration, active workers in zone are shortlisted.
4. Presence is verified using multi-signal anti-spoofing logic.
5. Decision tier determines instant payout, soft hold, or rapid human review.

## Tech stack

- Backend: FastAPI (Python)
- Mobile: React Native
- Fraud Detection: XGBoost
- Weather Data: OpenWeatherMap + IMD feeds
- Payouts: Polygon smart contracts
- Database: PostgreSQL + Redis
- Frontend prototype in this repo: React + Vite

## Adversarial Defense & Anti-Spoofing Strategy

### 1) The Differentiation

GPS alone is not trusted. The model differentiates genuine stranded workers from spoofers using a multi-signal confidence architecture:

- Motion sensor consistency (accelerometer + gyroscope)
- Route continuity with the worker's active delivery path
- Cell tower triangulation match versus claimed zone
- Wi-Fi context checks (home network overlap)
- Mock-location and spoofing footprint detection
- Impossible-travel detection from last verified point

Each signal contributes to a confidence score. No single signal can auto-reject.

### 2) The Data

Beyond basic GPS coordinates, the platform analyzes:

- Accelerometer and gyroscope quality metrics
- Shift route alignment metadata
- Cell tower verification confidence
- Known Wi-Fi overlap indicators
- Device mock-location/developer-mode signals
- Claim-timing anomalies (batch spikes in 10-minute windows)
- Zone saturation ratios (unusually high simultaneous claimant percentage)
- Cross-account linkage markers (device/payment/referral graph)
- Temporal travel feasibility between verified checkpoints

These are aggregated to detect both individual spoofing and coordinated fraud rings.

### 3) The UX Balance

To avoid punishing honest workers during poor weather connectivity, flagged claims use a tiered workflow:

- High confidence (>=85%): instant payout, no friction
- Medium confidence (50-84%): 2-hour soft hold + one simple verification step
- Low confidence (<50%): human review within 4 hours, transparent reason, one-tap appeal

Fairness safeguards:

- GPS signal drops during severe storms are treated as expected context
- Offline claim capture is allowed and syncs later
- A single ambiguous event does not permanently reduce trust score

## Team

- N Veda Sivakumar - Backend
- M V S Sai Aditya - ML / Fraud Detection
- AaftaabRabbani Khan - Mobile
- S Kishore Kumar - Smart Contracts
