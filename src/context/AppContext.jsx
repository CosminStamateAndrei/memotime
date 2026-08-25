import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

// ---- storage helpers -------------------------------------------------------
const USERS_KEY = 'memotime.users'
const SESSION_KEY = 'memotime.session'
const dataKey = (email) => `memotime.data.${email.toLowerCase()}`

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable — ignore for this prototype */
  }
}

const blankData = () => ({
  onboarded: false,
  known: [], // array of Dutch words the user knows
  // progress: { [situationId]: { makkelijk: bool, gemiddeld: bool, moeilijk: bool } }
  progress: {},
})

// ---- provider --------------------------------------------------------------
export function AppProvider({ children }) {
  const [email, setEmail] = useState(() => readJSON(SESSION_KEY, null))
  const [data, setData] = useState(() =>
    email ? readJSON(dataKey(email), blankData()) : null
  )

  // persist data whenever it changes
  useEffect(() => {
    if (email && data) writeJSON(dataKey(email), data)
  }, [email, data])

  const register = (emailInput, password) => {
    const e = emailInput.trim().toLowerCase()
    if (!e || !password) return { ok: false, error: 'Enter an email and password.' }
    const users = readJSON(USERS_KEY, {})
    if (users[e]) return { ok: false, error: 'That email is already registered. Try logging in.' }
    users[e] = { password } // NOTE: plaintext, prototype only — see README.
    writeJSON(USERS_KEY, users)
    const fresh = blankData()
    writeJSON(dataKey(e), fresh)
    writeJSON(SESSION_KEY, e)
    setEmail(e)
    setData(fresh)
    return { ok: true }
  }

  const login = (emailInput, password) => {
    const e = emailInput.trim().toLowerCase()
    const users = readJSON(USERS_KEY, {})
    if (!users[e]) return { ok: false, error: 'No account with that email. Register first.' }
    if (users[e].password !== password) return { ok: false, error: 'Wrong password.' }
    writeJSON(SESSION_KEY, e)
    setEmail(e)
    setData(readJSON(dataKey(e), blankData()))
    return { ok: true }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setEmail(null)
    setData(null)
  }

  // ---- learning mutations --------------------------------------------------
  const addKnownWords = (words) => {
    setData((d) => {
      if (!d) return d
      const set = new Set(d.known)
      words.forEach((w) => set.add(w))
      return { ...d, known: [...set] }
    })
  }

  const finishOnboarding = (knownWords) => {
    setData((d) => {
      if (!d) return d
      const set = new Set(d.known)
      knownWords.forEach((w) => set.add(w))
      return { ...d, onboarded: true, known: [...set] }
    })
  }

  const completeLevel = (situationId, levelKey, words) => {
    setData((d) => {
      if (!d) return d
      const prog = { ...(d.progress || {}) }
      prog[situationId] = { ...(prog[situationId] || {}), [levelKey]: true }
      const set = new Set(d.known)
      words.forEach((w) => set.add(w))
      return { ...d, progress: prog, known: [...set] }
    })
  }

  const value = useMemo(
    () => ({
      email,
      data,
      isAuthed: !!email,
      register,
      login,
      logout,
      addKnownWords,
      finishOnboarding,
      completeLevel,
    }),
    [email, data]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
