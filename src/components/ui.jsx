import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView } from 'framer-motion'
import { Trophy, MapPin, CalendarDays } from 'lucide-react'
import { STATUS, formatDateTime } from '../lib/format.js'

export function Container({ className = '', children }) {
  return <div className={`mx-auto max-w-6xl px-5 ${className}`}>{children}</div>
}

export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

export function CountUp({ to = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || !ref.current) return
    const controls = animate(0, to, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v)
      },
    })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>0</span>
}

export function SectionTitle({ children, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <h2 className="font-display text-5xl leading-none tracking-[2px]">{children}</h2>
      {action}
    </div>
  )
}

const chipTone = {
  open: 'bg-gold/20 text-gold',
  live: 'bg-white text-ink',
  done: 'bg-white/15 text-white/90',
}

export function StatusChip({ status }) {
  const s = STATUS[status] ?? { label: status, tone: 'done' }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${chipTone[s.tone]}`}>{s.label}</span>
  )
}

export function ProgressBar({ value, max }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-white/80">Teams</span>
        <span className="font-mono text-gold">
          {value}/{max || '∞'}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/15">
        <div className="h-1.5 rounded-full bg-gold transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function TournamentCard({ t, teamCount }) {
  return (
    <Link
      to={`/tournaments/${t.id}`}
      className="block rounded-2xl border border-white/15 bg-white/[.08] p-6 transition hover:-translate-y-1 hover:border-gold/50 hover:bg-white/[.12]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15">
          <Trophy size={24} className="text-gold" aria-hidden="true" />
        </span>
        <StatusChip status={t.status} />
      </div>
      <div className="mt-4 font-display text-3xl leading-tight tracking-wide">{t.name}</div>
      <div className="mt-2 space-y-1 text-sm text-white/85">
        {t.location && (
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-gold" aria-hidden="true" />
            {t.location}
          </div>
        )}
        {t.match_datetime && (
          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="text-gold" aria-hidden="true" />
            {formatDateTime(t.match_datetime)}
          </div>
        )}
      </div>
      <div className="mt-5">
        <ProgressBar value={teamCount} max={t.max_teams} />
      </div>
    </Link>
  )
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} />
}

export function ErrorNote({ children }) {
  return <div className="rounded-xl border border-white/20 bg-black/20 p-4 text-white/90">{children}</div>
}
