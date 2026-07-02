import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOnboarding, getEntries, addEntry, daysSober } from '../hooks/useStorage'

const MOODS = ['grounded', 'restless', 'grateful', 'hollow', 'clear', 'heavy']

export default function Journal() {
  const nav = useNavigate()
  const ob  = getOnboarding()
  const [text, setText]   = useState('')
  const [mood, setMood]   = useState('')
  const [saved, setSaved] = useState(false)
  const days = daysSober(ob.sobrietyDate)

  if (!ob.completed) {
    nav('/', { replace: true })
    return null
  }

  function save() {
    if (!text.trim()) return
    addEntry({ text: text.trim(), mood })
    setText('')
    setMood('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div className="screen" style={{ gap: 28 }}>
      <div className="phase-label">{ob.name}</div>

      <div className="counter-ring">
        <span className="counter-num">{days}</span>
        <span className="dim">{days === 1 ? 'day' : 'days'}</span>
      </div>

      {!saved ? (
        <>
          <div className="mood-row">
            {MOODS.map(m => (
              <button
                key={m}
                className={`mood-chip${mood === m ? ' selected' : ''}`}
                onClick={() => setMood(m === mood ? '' : m)}
              >
                {m}
              </button>
            ))}
          </div>

          <textarea
            className="input"
            placeholder="what is present right now..."
            value={text}
            onChange={e => setText(e.target.value)}
          />

          <div style={{ display: 'flex', gap: 16 }}>
            <button className="btn" onClick={save}>leave it here</button>
            <button className="btn ghost" onClick={() => nav('/journal/history')}>history</button>
            <button className="btn ghost" onClick={() => nav('/clinician')}>clinician</button>
          </div>
        </>
      ) : (
        <p className="dim" style={{ letterSpacing: 3 }}>received.</p>
      )}
    </div>
  )
}
