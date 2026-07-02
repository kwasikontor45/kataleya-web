import { useState, useEffect } from 'react'

const PHASES = [
  { id: 'nyx',        label: 'nyx',         h0: 21, h1: 6,  bg: '#1d1015', ph: '#ea9a97', rgb: '234,154,151' },
  { id: 'choice',     label: 'choice',      h0: 6,  h1: 11, bg: '#060d1a', ph: '#5ec8ed', rgb: '94,200,237'  },
  { id: 'desire',     label: 'desire',      h0: 11, h1: 17, bg: '#1a1208', ph: '#f6c177', rgb: '246,193,119' },
  { id: 'still-pine', label: 'still-pine',  h0: 17, h1: 21, bg: '#14111e', ph: '#c4a7e7', rgb: '196,167,231' },
]

function getPhase(h) {
  if (h >= 6  && h < 11) return PHASES[1]
  if (h >= 11 && h < 17) return PHASES[2]
  if (h >= 17 && h < 21) return PHASES[3]
  return PHASES[0]
}

export function useCircadian() {
  const [phase, setPhase] = useState(() => getPhase(new Date().getHours()))

  useEffect(() => {
    const tick = () => setPhase(getPhase(new Date().getHours()))
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const r = document.documentElement.style
    r.setProperty('--bg',  phase.bg)
    r.setProperty('--ph',  phase.ph)
    r.setProperty('--rgb', phase.rgb)
  }, [phase])

  return phase
}
