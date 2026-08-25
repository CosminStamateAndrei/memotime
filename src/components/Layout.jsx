import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const tabs = [
  { to: '/app', label: 'Situations', end: true },
  { to: '/app/practice', label: 'Respond' },
  { to: '/app/words', label: 'My words' },
  { to: '/app/dictionary', label: 'Dictionary' },
]

export default function Layout() {
  const { email, logout } = useApp()
  const navigate = useNavigate()

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar__inner">
          <button className="brand" onClick={() => navigate('/app')} aria-label="memotime home">
            <span className="brand__mark">m</span>
            <span className="brand__word">memotime</span>
          </button>

          <nav className="tabs" aria-label="Primary">
            {tabs.map((t) => (
              <NavLink key={t.to} to={t.to} end={t.end} className="tab">
                {t.label}
              </NavLink>
            ))}
          </nav>

          <div className="topbar__account">
            <span className="topbar__email" title={email}>{email}</span>
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
