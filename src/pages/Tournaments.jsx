import { useState } from 'react'
import { fetchTeams, fetchTournaments } from '../lib/data.js'
import { useAsync } from '../lib/useAsync.js'
import { Container, ErrorNote, Skeleton, TournamentCard, Reveal } from '../components/ui.jsx'

const FILTERS = [
  { key: 'all', label: 'All', test: () => true },
  { key: 'open', label: 'Open', test: (t) => t.status === 'registration' },
  { key: 'live', label: 'Live', test: (t) => t.status === 'group_stage' || t.status === 'knockout' },
  { key: 'done', label: 'Completed', test: (t) => t.status === 'completed' },
]

export default function Tournaments() {
  const [filter, setFilter] = useState('all')
  const tournaments = useAsync(fetchTournaments)
  const teams = useAsync(() => fetchTeams())

  const active = FILTERS.find((f) => f.key === filter)
  const shown = (tournaments.data ?? []).filter(active.test)
  const countFor = (id) => (teams.data ?? []).filter((tm) => tm.tournament_id === id).length

  return (
    <Container className="py-14">
      <h1 className="font-display text-6xl leading-none tracking-[2px] md:text-8xl">
        <span className="text-gold">Tournaments</span>
      </h1>

      <div role="tablist" aria-label="Filter tournaments" className="mt-8 inline-flex gap-1.5 rounded-xl bg-black/25 p-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={`min-h-11 rounded-lg px-4 text-[15px] font-semibold transition ${
              filter === f.key ? 'bg-gold text-ink' : 'text-white/90 hover:bg-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {tournaments.error && <div className="mt-8"><ErrorNote>Couldn't load tournaments. Please refresh and try again.</ErrorNote></div>}

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tournaments.loading && [0, 1, 2].map((i) => <Skeleton key={i} className="h-56" />)}
        {shown.map((t, i) => (
          <Reveal key={t.id} delay={Math.min(i, 5) * 0.05}>
            <TournamentCard t={t} teamCount={countFor(t.id)} />
          </Reveal>
        ))}
      </div>
      {!tournaments.loading && !tournaments.error && shown.length === 0 && (
        <p className="mt-10 text-white/85">No tournaments in this category yet.</p>
      )}
    </Container>
  )
}
