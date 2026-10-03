import { useState } from 'react'
import { useApp } from '../context/AppContext'
import ThemeToggle from '../components/ThemeToggle'

export default function Auth() {
  const { login, register } = useApp()
  const [mode, setMode] = useState('register') // 'register' | 'login'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)
    const fn = mode === 'register' ? register : login
    const res = await fn(email, password)
    setSubmitting(false)

    if (!res.ok) {
      setError(res.error)
      return
    }
    if (mode === 'register') {
      // If email confirmation is on in Supabase, there's no session yet —
      // let the person know instead of looking like nothing happened.
      setNotice('Check your inbox to confirm your email, then log in.')
    }
    // on success with an active session, App's guards redirect automatically
  }

  return (
    <div className="auth">
      <div className="auth__top">
        <div className="auth__brand">
          <div className="auth__mark">m</div>
          <div>
            <div className="auth__name">memotime</div>
            <div className="auth__tag">Onze Nederlandse woordenlijst</div>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="auth__grid">
        <section className="auth__pitch">
          <p className="eyebrow">Onze woordenlijst</p>
          <h1>
            Our shared Dutch word list —
            <br />
            <em>add words, then test yourself.</em>
          </h1>
          <ul className="auth__points">
            <li><b>Add in bulk.</b> Paste a whole list of Dutch–English pairs at once.</li>
            <li><b>Shared.</b> Everyone who logs in sees the same list.</li>
            <li><b>Practise both ways.</b> Dutch → English and English → Dutch.</li>
          </ul>
        </section>

        <section className="auth__card">
          <div className="segmented">
            <button
              className={mode === 'register' ? 'is-active' : ''}
              onClick={() => { setMode('register'); setError(''); setNotice('') }}
              type="button"
            >
              Create account
            </button>
            <button
              className={mode === 'login' ? 'is-active' : ''}
              onClick={() => { setMode('login'); setError(''); setNotice('') }}
              type="button"
            >
              Log in
            </button>
          </div>

          <form onSubmit={submit} className="form">
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jij@voorbeeld.nl"
                autoComplete="email"
                required
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                minLength={6}
                required
              />
            </label>

            {error && <p className="form__error">{error}</p>}
            {notice && <p className="auth__note" style={{ color: 'var(--grass)' }}>{notice}</p>}

            <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
              {submitting
                ? 'One moment…'
                : mode === 'register'
                ? 'Create account'
                : 'Log in'}
            </button>
          </form>

          <p className="auth__note">
            {mode === 'register'
              ? 'New here? Create an account to see the shared list.'
              : 'Welcome back.'}
          </p>
        </section>
      </div>
    </div>
  )
}