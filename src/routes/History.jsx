import { useNavigate } from 'react-router-dom'
import { getEntries } from '../hooks/useStorage'

function fmt(ts) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

export default function History() {
  const nav     = useNavigate()
  const entries = getEntries()

  return (
    <div className="screen" style={{ gap: 24, justifyContent: 'flex-start', paddingTop: 56 }}>
      <div className="phase-label" style={{ marginBottom: 8 }}>journal history</div>

      {entries.length === 0 ? (
        <p className="dim">nothing here yet.</p>
      ) : (
        entries.map(e => (
          <div key={e.id} className="entry-card">
            <p className="entry-text">{e.text}</p>
            <p className="entry-ts">
              {e.mood ? `${e.mood} · ` : ''}{fmt(e.ts)}
            </p>
          </div>
        ))
      )}

      <button className="btn ghost" style={{ marginTop: 16 }} onClick={() => nav('/journal')}>
        back
      </button>
    </div>
  )
}
