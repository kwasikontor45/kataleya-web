const KEYS = {
  onboarding: 'kataleya:onboarding',
  entries:    'kataleya:entries',
  settings:   'kataleya:settings',
}

function read(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}

function write(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

export function getOnboarding() {
  return read(KEYS.onboarding) ?? { completed: false, name: null, sobrietyDate: null, clinicianPin: null }
}

export function setOnboarding(data) {
  write(KEYS.onboarding, { ...getOnboarding(), ...data })
}

export function getEntries() {
  return read(KEYS.entries) ?? []
}

export function addEntry(entry) {
  const entries = getEntries()
  entries.unshift({ id: crypto.randomUUID(), ts: Date.now(), ...entry })
  write(KEYS.entries, entries)
}

export function getSettings() {
  return read(KEYS.settings) ?? {}
}

export function setSettings(data) {
  write(KEYS.settings, { ...getSettings(), ...data })
}

export function daysSober(sobrietyDate) {
  if (!sobrietyDate) return 0
  return Math.max(0, Math.floor((Date.now() - new Date(sobrietyDate).getTime()) / 86400000))
}

export async function hashPin(pin) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pin))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPin(pin, stored) {
  return (await hashPin(pin)) === stored
}
