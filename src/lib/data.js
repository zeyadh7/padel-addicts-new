import { supabase } from './supabase.js'

// Tournament rows hold no personal data, so we read all columns. That way a column that is missing
// or renamed in the database can never make the request fail. (Players are different: see fetchPlayers.)
function unwrap({ data, error }) {
  if (error) throw error
  return data ?? []
}

const isPublic = (t) => (t.visibility || 'public') !== 'private'

export async function fetchTournaments() {
  const rows = unwrap(await supabase.from('tournaments').select('*'))
  return rows
    .filter(isPublic)
    .sort((a, b) => String(b.created_at ?? '').localeCompare(String(a.created_at ?? '')))
}

export async function fetchTournament(id) {
  const rows = unwrap(await supabase.from('tournaments').select('*').eq('id', id).limit(1))
  const t = rows[0] ?? null
  return t && isPublic(t) ? t : null
}

// Team counts per tournament, plus the teams themselves (names only)
export async function fetchTeams(tournamentId) {
  let q = supabase.from('teams').select('id,tournament_id,name').order('name', { ascending: true })
  if (tournamentId) q = q.eq('tournament_id', tournamentId)
  return unwrap(await q)
}

export async function fetchPlayers(limit) {
  let q = supabase
    .from('players')
    .select('id,name,avatar_url,total_points')
    .order('total_points', { ascending: false })
  if (limit) q = q.limit(limit)
  return unwrap(await q)
}

export async function fetchStats() {
  const count = async (table, filter) => {
    let q = supabase.from(table).select('*', { count: 'exact', head: true })
    if (filter) q = filter(q)
    const { count: c, error } = await q
    if (error) throw error
    return c ?? 0
  }
  const [players, matches, tournamentRows] = await Promise.all([
    count('players'),
    count('matches', (q) => q.eq('status', 'completed')),
    supabase.from('tournaments').select('*').then(unwrap),
  ])
  const visible = tournamentRows.filter(isPublic)
  return {
    players,
    tournaments: visible.length,
    matches,
    champions: visible.filter((t) => t.status === 'completed').length,
  }
}
