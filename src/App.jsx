import { useMemo, useState } from 'react'
import './App.css'

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value))

function computeFraudSignals(worker, event) {
  const speedKmh = worker.lastSeenMinutes > 0
    ? (worker.lastSeenKm / worker.lastSeenMinutes) * 60
    : 0

  const signalRows = [
    {
      name: 'Motion consistency',
      detail: `acc ${worker.accel}/10, gyro ${worker.gyro}/10`,
      contribution: ((worker.accel + worker.gyro) / 2 - 5) * 4,
    },
    {
      name: 'Route continuity',
      detail: worker.routeAligned ? 'Route aligns with work shift' : 'Route mismatch for shift',
      contribution: worker.routeAligned ? 14 : -18,
    },
    {
      name: 'Cell tower match',
      detail: worker.cellTowerMatch ? 'Tower triangulation supports claim' : 'Tower mismatch',
      contribution: worker.cellTowerMatch ? 16 : -22,
    },
    {
      name: 'Wi-Fi context',
      detail: worker.homeWifi ? 'Connected to known home Wi-Fi' : 'No home Wi-Fi overlap',
      contribution: worker.homeWifi ? -26 : 6,
    },
    {
      name: 'Spoofing surface check',
      detail: worker.mockLocationEnabled
        ? 'Mock/developer location appears enabled'
        : 'No spoofing footprint found',
      contribution: worker.mockLocationEnabled ? -30 : 12,
    },
    {
      name: 'Impossible travel test',
      detail: `${speedKmh.toFixed(1)} km/h since last verified point`,
      contribution: speedKmh > 90 ? -20 : 8,
    },
    {
      name: 'Claim spike pressure',
      detail: `${event.claimsLast10Min}% claims in 10m window`,
      contribution: event.claimsLast10Min > 55 ? -18 : 8,
    },
    {
      name: 'Zone saturation',
      detail: `${event.zoneSaturation}% active workers claiming`,
      contribution: event.zoneSaturation > 65 ? -16 : 7,
    },
  ]

  if (event.weatherSeverity === 'red' && worker.gpsSignalDrop) {
    signalRows.push({
      name: 'Storm GPS degradation handling',
      detail: 'Signal drop treated as expected in severe weather',
      contribution: 6,
    })
  }

  const total = signalRows.reduce((acc, item) => acc + item.contribution, 50)
  const confidence = clamp(Math.round(total))

  let tier = 'Low'
  let action = 'Human review within 4 hours + one-tap appeal enabled'
  if (confidence >= 85) {
    tier = 'High'
    action = 'Instant payout approved'
  } else if (confidence >= 50) {
    tier = 'Medium'
    action = '2-hour soft hold + quick live photo verification'
  }

  return { confidence, tier, action, signalRows }
}

function App() {
  const [worker, setWorker] = useState({
    workerId: 'DLV-10982',
    currentZone: 'Chennai-Central',
    routeAligned: true,
    cellTowerMatch: true,
    mockLocationEnabled: false,
    homeWifi: false,
    gpsSignalDrop: true,
    accel: 8,
    gyro: 7,
    lastSeenKm: 6,
    lastSeenMinutes: 22,
  })

  const [event, setEvent] = useState({
    weatherSeverity: 'red',
    eventZone: 'Chennai-Central',
    claimsLast10Min: 38,
    zoneSaturation: 46,
    payoutINR: 540,
  })

  const [evaluated, setEvaluated] = useState(false)

  const isEligibleEvent =
    event.weatherSeverity === 'red' && worker.currentZone === event.eventZone

  const decision = useMemo(() => computeFraudSignals(worker, event), [worker, event])

  const payoutStatus = !isEligibleEvent
    ? 'No red-alert trigger in this worker zone'
    : decision.tier === 'High'
      ? `Payout queued: INR ${event.payoutINR}`
      : decision.tier === 'Medium'
        ? 'Soft hold started, pending quick verification'
        : 'Escalated to human reviewer'

  function updateWorker(key, value) {
    setWorker((prev) => ({ ...prev, [key]: value }))
  }

  function updateEvent(key, value) {
    setEvent((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">DEVTrails 2026 | Phase 1</p>
        <h1>GigShield | Fraud-Resistant AI powered Insurance system</h1>
        <p>
          Functional React prototype for parametric insurance triage. Toggle worker and event
          signals to see how payout confidence changes in real time.
        </p>
      </header>

      <section className="grid">
        <article className="card">
          <h2>Worker Signals</h2>
          <div className="field-grid">
            <label>
              Worker ID
              <input
                value={worker.workerId}
                onChange={(e) => updateWorker('workerId', e.target.value)}
              />
            </label>
            <label>
              Current Zone
              <input
                value={worker.currentZone}
                onChange={(e) => updateWorker('currentZone', e.target.value)}
              />
            </label>
            <label>
              Last Seen Distance (km)
              <input
                type="number"
                min="0"
                value={worker.lastSeenKm}
                onChange={(e) => updateWorker('lastSeenKm', Number(e.target.value))}
              />
            </label>
            <label>
              Last Seen Time (minutes)
              <input
                type="number"
                min="1"
                value={worker.lastSeenMinutes}
                onChange={(e) => updateWorker('lastSeenMinutes', Number(e.target.value))}
              />
            </label>
          </div>

          <div className="toggles">
            <label>
              <input
                type="checkbox"
                checked={worker.routeAligned}
                onChange={(e) => updateWorker('routeAligned', e.target.checked)}
              />
              Route aligns with shift
            </label>
            <label>
              <input
                type="checkbox"
                checked={worker.cellTowerMatch}
                onChange={(e) => updateWorker('cellTowerMatch', e.target.checked)}
              />
              Cell tower triangulation match
            </label>
            <label>
              <input
                type="checkbox"
                checked={worker.mockLocationEnabled}
                onChange={(e) => updateWorker('mockLocationEnabled', e.target.checked)}
              />
              Mock location footprint detected
            </label>
            <label>
              <input
                type="checkbox"
                checked={worker.homeWifi}
                onChange={(e) => updateWorker('homeWifi', e.target.checked)}
              />
              Home Wi-Fi overlap detected
            </label>
            <label>
              <input
                type="checkbox"
                checked={worker.gpsSignalDrop}
                onChange={(e) => updateWorker('gpsSignalDrop', e.target.checked)}
              />
              GPS signal drop
            </label>
          </div>

          <div className="slider-row">
            <label>
              Accelerometer quality: <strong>{worker.accel}/10</strong>
              <input
                type="range"
                min="0"
                max="10"
                value={worker.accel}
                onChange={(e) => updateWorker('accel', Number(e.target.value))}
              />
            </label>
            <label>
              Gyroscope quality: <strong>{worker.gyro}/10</strong>
              <input
                type="range"
                min="0"
                max="10"
                value={worker.gyro}
                onChange={(e) => updateWorker('gyro', Number(e.target.value))}
              />
            </label>
          </div>
        </article>

        <article className="card">
          <h2>Weather Event Inputs</h2>
          <div className="field-grid">
            <label>
              Event Severity
              <select
                value={event.weatherSeverity}
                onChange={(e) => updateEvent('weatherSeverity', e.target.value)}
              >
                <option value="green">Green</option>
                <option value="amber">Amber</option>
                <option value="red">Red</option>
              </select>
            </label>
            <label>
              Alert Zone
              <input
                value={event.eventZone}
                onChange={(e) => updateEvent('eventZone', e.target.value)}
              />
            </label>
            <label>
              Claims in last 10 min (%)
              <input
                type="number"
                min="0"
                max="100"
                value={event.claimsLast10Min}
                onChange={(e) => updateEvent('claimsLast10Min', Number(e.target.value))}
              />
            </label>
            <label>
              Zone saturation (%)
              <input
                type="number"
                min="0"
                max="100"
                value={event.zoneSaturation}
                onChange={(e) => updateEvent('zoneSaturation', Number(e.target.value))}
              />
            </label>
            <label>
              Payout amount (INR)
              <input
                type="number"
                min="100"
                value={event.payoutINR}
                onChange={(e) => updateEvent('payoutINR', Number(e.target.value))}
              />
            </label>
          </div>

          <button className="cta" onClick={() => setEvaluated(true)}>
            Evaluate Claim
          </button>

          <p className="event-status">
            Event eligibility:{' '}
            <strong>{isEligibleEvent ? 'Matched red-alert zone' : 'Not eligible for payout trigger'}</strong>
          </p>
        </article>
      </section>

      <section className="card results">
        <h2>Decision Engine Output</h2>
        {!evaluated ? (
          <p className="muted">Run evaluation to generate confidence score and action path.</p>
        ) : (
          <>
            <div className="score-wrap">
              <p className="score">{decision.confidence}%</p>
              <div>
                <p>
                  Confidence tier: <strong>{decision.tier}</strong>
                </p>
                <p>Action: {decision.action}</p>
                <p>Payout flow: {payoutStatus}</p>
              </div>
            </div>

            <div className="signal-list">
              {decision.signalRows.map((signal) => (
                <article key={signal.name} className="signal-item">
                  <h3>{signal.name}</h3>
                  <p>{signal.detail}</p>
                  <p className={signal.contribution >= 0 ? 'up' : 'down'}>
                    {signal.contribution >= 0 ? '+' : ''}
                    {signal.contribution.toFixed(1)}
                  </p>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <footer className="footer">
        <p>Stack fit: React frontend now live. Next phase can wire FastAPI + Redis + XGBoost API.</p>
      </footer>
    </main>
  )
}

export default App
