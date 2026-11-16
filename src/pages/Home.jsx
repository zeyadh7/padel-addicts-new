import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, CalendarDays, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { fetchPlayers, fetchStats, fetchTeams, fetchTournaments } from '../lib/data.js'
import { useAsync } from '../lib/useAsync.js'
import { formatDateTime, initials } from '../lib/format.js'
import { Container, CountUp, ProgressBar, Reveal, SectionTitle, Skeleton, StatusChip, TournamentCard } from '../components/ui.jsx'

const steps = [
  { n: '01', t: 'Create your account', d: 'Sign up once. Your profile, points and match history stay with you across every tournament.' },
  { n: '02', t: 'Register with a partner', d: 'Pick your partner, pay by Telda or Instapay and track your approval status in your account.' },
  { n: '03', t: 'Play and climb', d: 'Follow groups and brackets, win matches, collect points and chase the title.' },
]

const podiumColor = ['text-[#FFD700]', 'text-[#C9D2DC]', 'text-[#D68B4B]', 'text-white/70', 'text-white/70']

function CourtLines() {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 800" className="pointer-events-none absolute -right-20 -top-10 hidden h-[860px] w-[640px] opacity-[.12] md:block" fill="none" stroke="#fff" strokeWidth="3">
      <rect x="40" y="40" width="520" height="720" />
      <line x1="40" y1="400" x2="560" y2="400" />
      <line x1="300" y1="190" x2="300" y2="610" />
      <line x1="40" y1="190" x2="560" y2="190" />
      <line x1="40" y1="610" x2="560" y2="610" />
    </svg>
  )
}

export default function Home() {
  const tournaments = useAsync(fetchTournaments)
  const teams = useAsync(() => fetchTeams())
  const players = useAsync(() => fetchPlayers(5))
  const stats = useAsync(fetchStats)

  const list = tournaments.data ?? []
  const next = list.find((t) => t.status === 'registration') ?? list.find((t) => t.status !== 'completed') ?? list[0]
  const countFor = (id) => (teams.data ?? []).filter((tm) => tm.tournament_id === id).length

  const statItems = [
    { n: stats.data?.players, l: 'Players' },
    { n: stats.data?.tournaments, l: 'Tournaments' },
    { n: stats.data?.matches, l: 'Matches played' },
    { n: stats.data?.champions, l: 'Champions crowned' },
  ]

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <CourtLines />
        <Container className="relative flex flex-wrap items-center gap-12 py-16 md:py-20">
          <div className="min-w-0 flex-[1_1_480px]">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <img
                src={`${import.meta.env.BASE_URL}logo.jpg`}
                alt="The Padel Addicts"
                width={104}
                height={104}
                className="mb-5 h-[88px] w-[88px] rounded-3xl object-cover shadow-xl ring-2 ring-white/30 sm:h-[104px] sm:w-[104px]"
              />
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-4 py-1.5 font-mono text-xs uppercase tracking-[2px] text-gold">
                Egypt's padel community
              </span>
              <h1 className="mt-5 font-display text-[64px] leading-[.92] tracking-[3px] sm:text-[96px] lg:text-[112px]">
                Play. Compete.
                <br />
                <span className="text-gold">Climb.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-white/90">
                Register your team, follow groups and brackets, and climb the rankings, one tournament at a time.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/tournaments" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-[17px] font-bold text-ink transition hover:brightness-105">
                  Browse tournaments <ArrowRight size={20} aria-hidden="true" />
                </Link>
                <Link to="/rankings" className="inline-flex min-h-12 items-center rounded-xl border-[1.5px] border-white/40 px-7 py-3.5 text-[17px] font-semibold transition hover:bg-white/10">
                  View rankings
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Next tournament */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="min-w-0 max-w-md flex-[1_1_360px] rounded-3xl border border-white/20 bg-[#0a2864]/60 p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-semibold uppercase tracking-[2px] text-white/75">Next tournament</div>
              {next && <StatusChip status={next.status} />}
            </div>
            {tournaments.loading && <Skeleton className="mt-4 h-40" />}
            {!tournaments.loading && !next && <p className="mt-4 text-white/85">No tournaments yet. Check back soon.</p>}
            {next && (
              <>
                <div className="mt-3 font-display text-4xl leading-none tracking-wide">{next.name}</div>
                <div className="mt-4 space-y-2.5 text-[15px] text-white/90">
                  {next.match_datetime && (
                    <div className="flex items-center gap-2.5"><CalendarDays size={18} className="text-gold" aria-hidden="true" />{formatDateTime(next.match_datetime)}</div>
                  )}
                  {next.location && (
                    <div className="flex items-center gap-2.5"><MapPin size={18} className="text-gold" aria-hidden="true" />{next.location}</div>
                  )}
                  {next.prize && (
                    <div className="flex items-center gap-2.5"><Trophy size={18} className="text-gold" aria-hidden="true" />{next.prize}</div>
                  )}
                </div>
                <div className="mt-5"><ProgressBar value={countFor(next.id)} max={next.max_teams} /></div>
                <Link to={`/tournaments/${next.id}`} className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-white px-4 py-3.5 font-bold text-ink transition hover:bg-white/90">
                  See details
                </Link>
              </>
            )}
          </motion.div>
        </Container>
      </section>

      {/* STATS */}
      <Container>
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/15 bg-black/20 lg:grid-cols-4">
          {statItems.map((s) => (
            <div key={s.l} className="border-white/10 p-6 text-center [&:not(:last-child)]:border-r">
              <div className="font-display text-5xl leading-none tracking-wide text-gold">
                {s.n == null ? '–' : <CountUp to={s.n} />}
              </div>
              <div className="mt-1.5 text-xs font-semibold uppercase tracking-[1.5px] text-white/80">{s.l}</div>
            </div>
          ))}
        </div>
      </Container>

      {/* TOURNAMENTS */}
      <Container className="pt-20">
        <Reveal>
          <SectionTitle
            action={
              <Link to="/tournaments" className="inline-flex items-center gap-2 font-semibold text-gold">
                View all <ArrowRight size={18} aria-hidden="true" />
              </Link>
            }
          >
            Tournaments
          </SectionTitle>
        </Reveal>
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.loading && [0, 1, 2].map((i) => <Skeleton key={i} className="h-56" />)}
          {list.slice(0, 3).map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}><TournamentCard t={t} teamCount={countFor(t.id)} /></Reveal>
          ))}
        </div>
      </Container>

      {/* TOP PLAYERS */}
      <Container className="flex flex-wrap gap-10 pt-20">
        <Reveal className="min-w-0 flex-[1_1_320px]">
          <h2 className="font-display text-5xl leading-none tracking-[2px]">Top <span className="text-gold">players</span></h2>
          <p className="mt-4 max-w-sm text-white/85">Points carry across every tournament, so every match counts toward your all-time position.</p>
          <Link to="/rankings" className="mt-6 inline-flex min-h-12 items-center rounded-xl border-[1.5px] border-white/40 px-6 py-3 font-semibold transition hover:bg-white/10">Full rankings</Link>
        </Reveal>
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-2.5">
          {players.loading && [0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-[72px]" />)}
          {(players.data ?? []).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[.08] px-5 py-3">
                <div className={`w-9 text-center font-display text-3xl ${podiumColor[i]}`}>{i + 1}</div>
                <Avatar p={p} />
                <div className="min-w-0 flex-1 truncate text-[17px] font-semibold">{p.name}</div>
                <div className="font-display text-3xl text-gold">{p.total_points ?? 0}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* HOW IT WORKS */}
      <Container className="pt-20">
        <Reveal><SectionTitle>How it works</SectionTitle></Reveal>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/10 bg-black/20 p-7">
                <div className="font-display text-6xl leading-none text-gold">{s.n}</div>
                <div className="mt-2 text-xl font-bold">{s.t}</div>
                <div className="mt-2 text-white/85">{s.d}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  )
}

export function Avatar({ p, size = 44 }) {
  return p.avatar_url ? (
    <img src={p.avatar_url} alt="" width={size} height={size} loading="lazy" className="rounded-xl object-cover" style={{ width: size, height: size }} />
  ) : (
    <div className="grid shrink-0 place-items-center rounded-xl bg-gold/20 font-bold text-gold" style={{ width: size, height: size }}>
      {initials(p.name)}
    </div>
  )
}
