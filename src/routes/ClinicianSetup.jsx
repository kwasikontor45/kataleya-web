import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOnboarding, setOnboarding, hashPin } from '../hooks/useStorage'

export default function ClinicianSetup() {
  const nav = useNavigate()
  const [pin,        setPin]        = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [err,        setErr]        = useState('')
  const [done,       setDone]       = useState(false)

  async function save(e) {
    e.preventDefault()
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) { setErr('four digits only.'); return }
    if (pin !== pinConfirm) { setErr('they don\'t match.'); return }
    const h = await hashPin(pin)
    setOnboarding({ clinicianPin: h })
    sessionStorage.setItem('clinicianUnlocked', '1')
    setDone(true)
    setTimeout(() => nav('/clinician', { replace: true }), 1200)
  }

  function remove(e) {
    e.preventDefault()
    setOnboarding({ clinicianPin: null })
    sessionStorage.removeItem('clinicianUnlocked')
    nav('/journal', { replace: true })
  }

  if (done) return (
    <div className="screen"><p className="dim">PIN updated.</p></div>
  )

  return (
    <div className="screen" style={{ gap: 24 }}>
      <div className="phase-label">update clinician PIN</div>
      <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <input
          className="input"
          type="password"
          inputMode="numeric"
          maxLength={4}
          autoFocus
          placeholder="new PIN (4 digits)"
          value={pin}
          onChange={e => { setPin(e.target.value.replace(/\D/g,'').slice(0,4)); setErr('') }}
        />
        <input
          className="input"
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder="confirm"
          value={pinConfirm}
          onChange={e => { setPinConfirm(e.target.value.replace(/\D/g,'').slice(0,4)); setErr('') }}
        />
        {err && <p style={{ fontSize: 10, color: '#cc4444', letterSpacing: 2 }}>{err}</p>}
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn" type="submit">save PIN</button>
          <button className="btn ghost" onClick={remove}>remove PIN</button>
          <button className="btn ghost" onClick={() => nav(-1)}>cancel</button>
        </div>
      </form>
    </div>
  )
}
