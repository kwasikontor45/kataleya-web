import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOnboarding, setOnboarding, hashPin } from '../hooks/useStorage'

const STEPS = ['wake', 'name', 'date', 'pin', 'seal']

export default function Landing() {
  const nav = useNavigate()
  const [step, setStep]       = useState('wake')
  const [name, setName]       = useState('')
  const [date, setDate]       = useState('')
  const [pin, setPin]         = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [err, setErr]         = useState('')
  const [orbLit, setOrbLit]   = useState(false)

  useEffect(() => {
    const ob = getOnboarding()
    if (ob.completed) nav('/journal', { replace: true })
  }, [])

  function wakeOrb() {
    setOrbLit(true)
    setTimeout(() => setStep('name'), 700)
  }

  function submitName(e) {
    e.preventDefault()
    if (!name.trim()) return
    setStep('date')
  }

  function submitDate(e) {
    e.preventDefault()
    const d = new Date(date)
    if (isNaN(d) || d > new Date()) { setErr('that date doesn\'t exist or is in the future.'); return }
    setErr('')
    setStep('pin')
  }

  async function submitPin(e) {
    e.preventDefault()
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) { setErr('four digits only.'); return }
    if (pin !== pinConfirm) { setErr('they don\'t match.'); return }
    setErr('')
    setStep('seal')
  }

  function skipPin(e) {
    e.preventDefault()
    setStep('seal')
  }

  async function seal() {
    const ob = getOnboarding()
    const pinHash = pin ? await hashPin(pin) : null
    setOnboarding({
      completed: true,
      name: name.trim(),
      sobrietyDate: date,
      clinicianPin: pinHash,
    })
    nav('/journal', { replace: true })
  }

  return (
    <div className="screen" style={{ gap: 32 }}>
      <div className="phase-label">kataleya</div>

      <div
        className="orb"
        style={{ opacity: orbLit ? 1 : 0.25, transform: orbLit ? 'scale(1.08)' : 'scale(1)' }}
        onClick={step === 'wake' ? wakeOrb : undefined}
      />

      {step === 'wake' && (
        <div style={{ textAlign: 'center' }}>
          <p className="dim">the garden is sleeping.</p>
          <p className="dim" style={{ marginTop: 8 }}>tap the orb to wake it.</p>
        </div>
      )}

      {step === 'name' && (
        <form onSubmit={submitName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <p className="dim">who is walking here?</p>
          <input className="input" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="your name" />
          <button className="btn" type="submit">continue</button>
        </form>
      )}

      {step === 'date' && (
        <form onSubmit={submitDate} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <p className="dim">when did your winter begin?</p>
          <input className="input" type="date" autoFocus value={date} onChange={e => { setDate(e.target.value); setErr('') }} />
          {err && <p style={{ fontSize: 10, color: '#cc4444', letterSpacing: 2 }}>{err}</p>}
          <button className="btn" type="submit">continue</button>
        </form>
      )}

      {step === 'pin' && (
        <form onSubmit={submitPin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <p className="dim">clinician PIN — optional</p>
          <input className="input" type="password" inputMode="numeric" maxLength={4} autoFocus placeholder="4 digits" value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0,4)); setErr('') }} />
          <input className="input" type="password" inputMode="numeric" maxLength={4} placeholder="confirm" value={pinConfirm} onChange={e => { setPinConfirm(e.target.value.replace(/\D/g, '').slice(0,4)); setErr('') }} />
          {err && <p style={{ fontSize: 10, color: '#cc4444', letterSpacing: 2 }}>{err}</p>}
          <div style={{ display: 'flex', gap: 16 }}>
            <button className="btn" type="submit">set PIN</button>
            <button className="btn" style={{ opacity: 0.5 }} onClick={skipPin}>skip</button>
          </div>
        </form>
      )}

      {step === 'seal' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <p style={{ fontSize: 18, letterSpacing: 4, color: 'var(--ph)' }}>we are here now.</p>
          <p className="dim">welcome, {name}.</p>
          <button className="btn" onClick={seal}>enter the garden</button>
        </div>
      )}
    </div>
  )
}
