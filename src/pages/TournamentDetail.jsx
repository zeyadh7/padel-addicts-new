import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, MapPin, Trophy, Banknote, Users } from 'lucide-react'
import { fetchTeams, fetchTournament } from '../lib/data.js'
import { useAsync } from '../lib/useAsync.js'
import { formatDateTime, formatTime } from '../lib/format.js'
import { Container, ErrorNote, ProgressBar, Skeleton, StatusChip } from '../components/ui.jsx'

function Fact({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[1.5px] text-white/75">
        <Icon size={14} aria-hidden="true" />
        {label}
      </div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  )
}

export default function TournamentDetail() {
  const { id } = useParams()
  const tournament = useAsync(() => fetchTournament(id), [id])
  const teams = useAsync(() => fetchTeams(id), [id])
  const t = tournament.data

  return (
    <Container className="py-10">
      <Link to="/tournaments" className="inline-flex items-center gap-1.5 text-sm text-white/85">
        <ArrowLeft size={16} aria-hidden="true" /> All tournaments
      </Link>

      {tournament.loading && <Skeleton className="mt-6 h-64" />}
      {tournament.error && <div className="mt-6"><ErrorNote>Couldn't load this tournament.</ErrorNote></div>}
      {!tournament.loading && !tournament.error && !t && <div className="mt-6"><ErrorNote>Tournament not found.</ErrorNote></div>}

      {t && (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <StatusChip status={t.status} />
            {t.level && <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">Level {t.level}</span>}
          </div>
          <h1 className="mt-3 font-display text-6xl leading-[.95] tracking-[2px] md:text-8xl">{t.name}</h1>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Fact icon={CalendarDays} label="Date" value={[formatDateTime(t.match_datetime), t.end_datetime && `to ${formatTime(t.end_datetime)}`].filter(Boolean).join(' ')} />
            <Fact icon={MapPin} label="Venue" value={t.location} />
            <Fact icon={Banknote} label="Entry" value={t.entry_fee ? `${t.entry_fee} EGP per team` : null} />
            <Fact icon={Trophy} label="Prizes" value={[t.prize, t.prize_2nd].filter(Boolean).join(' · ')} />
          </div>

          <div className="mt-10 flex flex-wrap items-start gap-8">
            <section className="min-w-0 flex-[999_1_560px]">
              <h2 className="flex items-center gap-3 font-display text-4xl tracking-wide">
                <Users aria-hidden="true" /> Teams
              </h2>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {teams.loading && [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-14" />)}
                {(teams.data ?? []).map((tm, i) => (
                  <div key={tm.id} className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/[.08] px-4 py-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 text-xs font-bold">{i + 1}</span>
                    <span className="truncate font-semibold">{tm.name}</span>
                  </div>
                ))}
              </div>
              {!teams.loading && (teams.data ?? []).length === 0 && <p className="mt-4 text-white/85">No teams registered yet.</p>}
              <p className="mt-8 rounded-xl border border-dashed border-white/25 p-4 text-sm text-white/80">
                Groups, matches and the knockout bracket are the next pieces to move over from the old site.
              </p>
            </section>

            <aside className="min-w-0 max-w-sm flex-[1_1_300px] rounded-3xl bg-white p-6 text-ink">
              <div className="text-xs font-bold uppercase tracking-[1.5px] text-brand">Spots</div>
              <div className="mt-3 [&_span]:!text-ink [&_.text-gold]:!text-brand [&_.bg-gold]:!bg-brand [&_.bg-white\/15]:!bg-[#dbe6f7]">
                <ProgressBar value={(teams.data ?? []).length} max={t.max_teams} />
              </div>
              <p className="mt-5 text-sm text-[#3d4f73]">Registration opens in the accounts phase. For now, register through the current site.</p>
            </aside>
          </div>
        </>
      )}
    </Container>
  )
}
