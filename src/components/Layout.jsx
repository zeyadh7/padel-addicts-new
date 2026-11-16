import { NavLink, Link, Outlet } from 'react-router-dom'
import { Home, Trophy, BarChart3 } from 'lucide-react'
import ErrorBoundary from './ErrorBoundary.jsx'

const links = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/tournaments', label: 'Tournaments', icon: Trophy },
  { to: '/rankings', label: 'Rankings', icon: BarChart3 },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="The Padel Addicts logo" width={44} height={44} className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/30" />
      <span className="font-display text-2xl tracking-[3px]">
        THE PADEL <span className="text-gold">ADDICTS</span>
      </span>
    </Link>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col pb-20 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-white/15 bg-deep/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2.5 text-[15px] font-semibold transition ${
                    isActive ? 'bg-white/15' : 'text-white/85 hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          {/* Log in / Sign up arrive in the accounts phase */}
          <div className="hidden w-40 md:block" />
        </div>
      </header>

      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      <footer className="mt-24 border-t border-white/15 bg-black/20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8">
          <div className="flex items-center gap-3 font-display text-xl tracking-[3px]">
            <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="" width={36} height={36} className="h-9 w-9 rounded-lg object-cover" />
            <span>THE PADEL <span className="text-gold">ADDICTS</span></span>
          </div>
          <div className="flex flex-wrap gap-6 text-[15px] text-white/85">
            <Link to="/tournaments">Tournaments</Link>
            <Link to="/rankings">Rankings</Link>
          </div>
        </div>
      </footer>

      {/* Phone bottom tab bar */}
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-white/15 bg-[#0a2d70] px-2 pb-3 pt-2 md:hidden">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-h-[52px] flex-col items-center justify-center gap-0.5 text-xs font-semibold ${
                isActive ? 'text-gold' : 'text-white/85'
              }`
            }
          >
            <Icon size={24} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
