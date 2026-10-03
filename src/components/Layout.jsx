import { NavLink, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ThemeToggle from './ThemeToggle'

const icon = (d) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)

const tabs = [
  { to: '/', label: 'Words', end: true, icon: icon(<path d="M4 6h16M4 12h16M4 18h10" />) },
  { to: '/cards', label: 'Cards', icon: icon(<><rect x="3" y="6" width="14" height="14" rx="2" /><path d="M7 3h12a2 2 0 0 1 2 2v12" /></>) },
  { to: '/nl-en', label: 'NL → EN', icon: icon(<path d="M5 12h14M13 6l6 6-6 6" />) },
  { to: '/en-nl', label: 'EN → NL', icon: icon(<path d="M19 12H5M11 6l-6 6 6 6" />) },
]

export default function Layout() {
  const { email, logout } = useApp()

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar__inner">
          <NavLink to="/" className="brand" aria-label="memotime home">
            <span className="brand__mark">m</span>
            <span className="brand__word">memotime</span>
          </NavLink>

          <nav className="tabs" aria-label="Primary">
            {tabs.map((t) => (
              <NavLink key={t.to} to={t.to} end={t.end} className="tab">
                {t.icon}
                <span>{t.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="topbar__account">
            <span className="topbar__email" title={email}>{email}</span>
            <ThemeToggle />
            <button className="btn btn--ghost btn--sm" onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}
