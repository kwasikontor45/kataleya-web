import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOnboarding, getEntries, daysSober, verifyPin } from '../hooks/useStorage'

const MAX_ATTEMPTS = 3
const LOCKOUT_MS   = 30000

export default function Clinician() {
  const nav = useNavigate()
  const ob  = getOnboarding()

  const [unlocked,  setUnlocked]  = useState(() => !!sessionStorage.getItem('clinicianUnlocked'))
  const [pin,       setPin]       = useState('')
  const [attempts,  setAttempts]  = useState(0)
  const [locked,    setLocked]    = useState(false)
  const [lockedUntil, setLockedUntil] = useState(null)
  const [err,       setErr]       = useState('')
  const timerRef = useRef(null)

  if (!ob.completed) { nav('/', { replace: true }); return null }

  const noPin = !ob.clinicianPin

  async function tryPin(digit) {
    const next = pin + digit
    setPin(next)
    if (next.length < 4) return
    const ok = await verifyPin(next, ob.clinicianPin)
    if (ok) {
      sessionStorage.setItem('clinicianUnlocked', '1')
      setUnlocked(true)
      setPin('')
      setErr('')
    } else {
      const a = attempts + 1
      setAttempts(a)
      setPin('')
      if (a >= MAX_ATTEMPTS) {
        setLocked(true)
        const until = Date.now() + LOCKOUT_MS
        setLockedUntil(until)
        timerRef.current = setTimeout(() => {
          setLocked(false)
          setAttempts(0)
          setLockedUntil(null)
        }, LOCKOUT_MS)
        setErr(`too many attempts. wait 30s.`)
      } else {
        setErr(`incorrect. ${MAX_ATTEMPTS - a} left.`)
      }
    }
  }

  function backspace() {
    setPin(p => p.slice(0, -1))
    setErr('')
  }

  if (!noPin && !unlocked) {
    return (
      <div className="screen" style={{ gap: 28 }}>
        <div className="phase-label">clinician access</div>
        <div className="dots">
          {[0,1,2,3].map(i => (
            <div key={i} className={`dot${pin.length > i ? ' filled' : ''}`} />
          ))}
        </div>
        {err && <p style={{ fontSize: 10, color: '#cc4444', letterSpacing: 2 }}>{err}</p>}
        {!locked && (
          <div className="pin-pad">
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) =>
              k === '' ? <div key={i} /> :
              <button key={i} className="pin-key" onClick={() => k === '⌫' ? backspace() : tryPin(k)}>
                {k}
              </button>
            )}
          </div>
        )}
        <p className="dim" style={{ maxWidth: 260, textAlign: 'center', lineHeight: 1.8 }}>
          protected on this device only.<br/>not a substitute for clinical security.
        </p>
        <button className="btn ghost" onClick={() => nav('/journal')}>back</button>
      </div>
    )
  }

  const entries = getEntries()
  const days    = daysSober(ob.sobrietyDate)

  return (
    <div className="screen" style={{ gap: 24, justifyContent: 'flex-start', paddingTop: 56 }}>
      <div className="phase-label">clinician view</div>

      <div style={{ display: 'flex', gap: 32, marginBottom: 8 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="counter-num" style={{ fontSize: 32 }}>{days}</div>
          <div className="dim">days sober</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="counter-num" style={{ fontSize: 32 }}>{entries.length}</div>
          <div className="dim">entries</div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 380 }}>
        {entries.length === 0 ? (
          <p className="dim">no journal entries yet.</p>
        ) : (
          entries.slice(0, 20).map(e => (
            <div key={e.id} className="entry-card">
              <p className="entry-text">{e.text}</p>
              <p className="entry-ts">
                {e.mood ? `${e.mood} · ` : ''}
                {new Date(e.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <button className="btn ghost" onClick={() => { sessionStorage.removeItem('clinicianUnlocked'); nav('/journal') }}>
          lock + exit
        </button>
        <button className="btn ghost" onClick={() => nav('/clinician/setup')}>change PIN</button>
      </div>
    </div>
  )
}
