import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Auth() {
  const { login, register } = useApp()
  const [mode, setMode] = useState('register') // 'register' | 'login'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setError('')
    const fn = mode === 'register' ? register : login
    const res = fn(email, password)
    if (!res.ok) setError(res.error)
    // on success, App's guards redirect automatically
  }

  return (
    <div className="auth">
      <div className="auth__brand">
        <div className="auth__mark">m</div>
        <div>
          <div className="auth__name">memotime</div>
          <div className="auth__tag">Leer Nederlands, één gesprek per keer.</div>
        </div>
      </div>

      <div className="auth__grid">
        <section className="auth__pitch">
          <p className="eyebrow">Dutch, for the moments that matter</p>
          <h1>
            Learn the words you'll actually
            <br />
            need — <em>in the situation you'll need them.</em>
          </h1>
          <p className="auth__lede">
            memotime builds around real situations: the bus, the café, the doctor.
            Start with what's most common, and earn your way to fluent.
          </p>
          <ul className="auth__points">
            <li><b>Attained levels.</b> Clear Makkelijk to unlock Gemiddeld, then Moeilijk.</li>
            <li><b>Hear everything.</b> Every word and sentence has a pronounce key.</li>
            <li><b>Speak back.</b> A separate Respond tab where you reply for yourself.</li>
          </ul>
        </section>

        <section className="auth__card">
          <div className="segmented">
            <button
              className={mode === 'register' ? 'is-active' : ''}
              onClick={() => { setMode('register'); setError('') }}
              type="button"
            >
              Create account
            </button>
            <button
              className={mode === 'login' ? 'is-active' : ''}
              onClick={() => { setMode('login'); setError('') }}
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
                required
              />
            </label>

            {error && <p className="form__error">{error}</p>}

            <button className="btn btn--primary btn--block" type="submit">
              {mode === 'register' ? 'Create account & start quiz' : 'Log in'}
            </button>
          </form>

          <p className="auth__note">
            {mode === 'register'
              ? 'New here? A quick quiz sets your starting vocabulary.'
              : 'Welcome back — pick up where you left off.'}
          </p>
        </section>
      </div>
    </div>
  )
}
