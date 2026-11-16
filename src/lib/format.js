const TZ = 'Africa/Cairo'

export const STATUS = {
  registration: { label: 'Registration open', tone: 'open' },
  group_stage: { label: 'Group stage', tone: 'live' },
  knockout: { label: 'Knockout', tone: 'live' },
  completed: { label: 'Completed', tone: 'done' },
}

export function formatDateTime(value) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value) // dates were free text in the old site
  return new Intl.DateTimeFormat('en-GB', { timeZone: TZ, dateStyle: 'medium', timeStyle: 'short', hour12: true }).format(d)
}

export function formatTime(value) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return new Intl.DateTimeFormat('en-GB', { timeZone: TZ, timeStyle: 'short', hour12: true }).format(d)
}

export function initials(name) {
  return String(name ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}
