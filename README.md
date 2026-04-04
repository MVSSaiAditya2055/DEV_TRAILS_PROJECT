# GigShield - Fraud-Resistant AI powered Insurance system

**Guidewire DEVTrails 2026 | Phase 1**

---

## What is this?

Delivery workers get caught in storms and can't work, but nobody pays them for it. GigShield does. When severe weather hits a zone where a delivery partner is working, our platform detects it, verifies they were actually there, and sends the payout automatically — no claim form, no waiting.

---

## How it works

1. Worker signs up and enables location + motion access on the app
2. We monitor real-time weather data across delivery zones
3. When a red-alert event is declared, we check which active workers are in that zone
4. Their presence is verified using multiple signals (not just GPS)
5. Payout fires automatically via smart contract — money hits their wallet within minutes

---

## Tech stack

- **Backend:** FastAPI (Python)
- **Mobile:** React Native
- **Fraud Detection:** XGBoost
- **Weather Data:** OpenWeatherMap + IMD feeds
- **Payouts:** Polygon smart contracts
- **Database:** PostgreSQL + Redis

---

## Adversarial Defense & Anti-Spoofing Strategy

During Phase 1, a coordinated group of 500 workers was caught using GPS spoofing apps to fake their location in red-alert zones and trigger false payouts. Here's how we stop that.

### 1. How we tell a real worker from a faker

GPS alone is useless — it takes two taps to fake. So we don't rely on it.

A person genuinely stranded in a storm leaves a completely different digital footprint than someone sitting at home with a spoofing app running.

- **Motion sensors** — A real worker is moving. Someone on their couch isn't. Accelerometer and gyroscope data can't be faked by a GPS spoofer.
- **Route continuity** — If the claimed zone has nothing to do with the worker's delivery route that day, that's a red flag. Stranded workers are stranded *on the job*.
- **Cell tower cross-check** — Cell towers place your phone independently of GPS. If tower data says you're in a residential area but GPS claims you're in a flood zone, we catch that.
- **Wi-Fi check** — Connected to your home Wi-Fi while claiming to be in a disaster zone? Flagged.
- **Spoofing app detection** — These apps require developer/mock location settings and leave timing inconsistencies in sensor data. We scan for both.

All signals combine into one confidence score. No single data point decides anything.

### 2. Catching coordinated rings, not just individuals

- **Claim spikes** — Real workers submit claims at random times. A synchronized wave of claims right after a Telegram message is a pattern, not a coincidence.
- **Zone saturation** — If an unusually high percentage of workers in a zone all claim at once, the whole batch gets flagged.
- **Linked accounts** — Shared devices, referral chains, and linked payment accounts reveal fraud networks.
- **Impossible travel** — If you were verified 40km away 15 minutes ago, you can't be here now.

### 3. Keeping it fair for honest workers

Bad weather kills GPS signals and connectivity. If our system is too aggressive, we end up denying the exact people we're supposed to help. So instead of approve/deny, we use three tiers:

| Confidence | What happens |
|---|---|
| High (85%+) | Instant payout, no friction |
| Medium (50–84%) | 2-hour soft hold, one simple verification step (quick live photo) |
| Low (below 50%) | Human review within 4 hours, worker told exactly why, one-tap appeal |

A few extra protections:
- GPS signal drops during a storm are treated as *expected*, not suspicious
- Workers can file claims offline — the app stores sensor data locally and syncs later
- One ambiguous claim never affects a worker's trust score

The goal: make fraud hard, make appeals easy.

---

## Insurance Product Fundamentals (Added)

To make GigShield a viable parametric insurance product, the prototype now includes product, pricing, and compliance building blocks in addition to fraud control.

### 1. Premium model (indicative monthly pricing)

The app computes an indicative premium using:

- Base payout amount
- Trigger probability
- Zone hazard band
- Historical event frequency band
- Expense loading
- Risk margin

Core pricing logic:

`Expected Loss = Base Payout x Trigger Probability x Severity Factor x Frequency Factor x Zone Factor x Exposure Factor`

`Monthly Premium = (Expected Loss + Expense Loading) x (1 + Risk Margin)`

The UI displays:

- Expected monthly loss
- Indicative monthly premium
- Resulting loss ratio (%)

### 2. Actuarial view in product flow

The decision screen now includes a practical actuarial summary so pricing can be calibrated before launch:

- Expected loss per worker segment
- Premium adequacy signal via loss ratio
- Rate sensitivity through hazard/frequency band changes

This gives a clear bridge between event-trigger mechanics and portfolio-level sustainability.

### 3. Regulatory readiness checks

The prototype now tracks baseline compliance controls required before product rollout:

- Explicit telematics and data processing consent
- KYC verification status
- Trigger and exclusion disclosure acceptance
- Grievance/escalation contact availability

A compliance status banner indicates whether launch-blocking items are still missing.

### 4. Coverage exclusions (explicit)

The product now includes clear exclusion logic that is shown in the UX and evaluated per claim:

- Worker outside insured zone at trigger time
- Non-red-alert weather event
- Mock location settings detected in event window
- Home Wi-Fi overlap indicating non-field activity

Each exclusion is marked as `Triggered` or `Clear` for transparency and auditable decisioning.

---

## Running locally

```bash
# Clone the repository
git clone https://github.com/MVSSaiAditya2055/DEV_TRAILS_PROJECT.git
cd DEV_TRAILS_PROJECT

# Run mobile app
cd mobile
npm install
npx react-native run-android
```

---

## Team

| Name | Role |
|---|---|
| [N Veda Sivakumar] | Backend |
| [M V S Sai Aditya] | ML / Fraud Detection |
| [AaftaabRabbani Khan] | Mobile |
| [S Kishore Kumar] | Smart Contracts |

---

*DEVTrails 2026 — Phase 1*