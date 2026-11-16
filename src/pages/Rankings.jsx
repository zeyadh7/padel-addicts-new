import { useState } from 'react'
import { Search } from 'lucide-react'
import { fetchPlayers } from '../lib/data.js'
import { useAsync } from '../lib/useAsync.js'
import { Container, ErrorNote, Reveal, Skeleton } from '../components/ui.jsx'
import { Avatar } from './Home.jsx'

const podiumStyle = [
  { order: 'md:order-2', ring: 'border-gold/60 bg-gold/10 md:pt-12 md:pb-10', badge: 'bg-[#FFD700] text-[#3a2d00]' },
  { order: 'md:order-1', ring: 'border-white/20 bg-white/[.08] md:pt-10 md:pb-8', badge: 'bg-[#C9D2DC] text-[#1d2733]' },
  { order: 'md:order-3', ring: 'border-white/20 bg-white/[.08] md:pt-10 md:pb-6', badge: 'bg-[#D68B4B] text-[#2e1a05]' },
]

export default function Rankings() {
  const players = useAsync(() => fetchPlayers())
  const [q, setQ] = useState('')
  const all = players.data ?? []
  const ranked = all.map((p, i) => ({ ...p, rank: i + 1 }))
  const top3 = ranked.slice(0, 3)
  const filtered = ranked.filter((p) => p.name?.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <Container className="py-14">
      <div className="font-mono text-xs uppercase tracking-[3px] text-gold">All-time leaderboard</div>
      <h1 className="mt-2 font-display text-6xl leading-none tracking-[3px] md:text-8xl">
        Player <span className="text-gold">rankings</span>
      </h1>

      {players.error && <div className="mt-8"><ErrorNote>Couldn't load rankings. Please refresh and try again.</ErrorNote></div>}

      {/* Podium */}
      <div className="mt-14 grid items-end gap-5 md:grid-cols-3">
        {players.loading && [0, 1, 2].map((i) => <Skeleton key={i} className="h-56" />)}
        {top3.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08} className={podiumStyle[i].order}>
            <div className={`relative rounded-3xl border p-7 pt-10 text-center ${podiumStyle[i].ring}`}>
              <span className={`absolute -top-[18px] left-1/2 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full text-lg font-extrabold ${podiumStyle[i].badge}`}>
                {p.rank}
              </span>
              <div className="mx-auto w-fit"><Avatar p={p} size={84} /></div>
              <div className="mt-3.5 truncate text-[22px] font-bold">{p.name}</div>
              <div className="mt-2 font-display text-6xl leading-none text-gold">{p.total_points ?? 0}</div>
              <div className="text-xs font-semibold uppercase tracking-[1.5px] text-white/75">points</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Table */}
      <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-4xl tracking-wide">All players</h2>
        <div className="relative w-full max-w-md">
          <label htmlFor="player-search" className="sr-only">Search player</label>
          <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/80" aria-hidden="true" />
          <input
            id="player-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name"
            className="min-h-12 w-full rounded-xl border border-white/30 bg-white/10 py-3 pl-12 pr-4 text-base text-white placeholder:text-white/70"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {filtered.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[.08] px-5 py-3">
            <span className="w-10 font-display text-3xl text-white/85">{p.rank}</span>
            <Avatar p={p} size={42} />
            <span className="min-w-0 flex-1 truncate text-[17px] font-semibold">{p.name}</span>
            <span className="font-display text-3xl text-gold">{p.total_points ?? 0}</span>
          </div>
        ))}
        {!players.loading && filtered.length === 0 && <p className="text-white/85">No players match that search.</p>}
      </div>
    </Container>
  )
}
