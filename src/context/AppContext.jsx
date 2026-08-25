import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const blankData = () => ({
  onboarded: false,
  known: [],
  progress: {},
})

// Fetch this user's row, or create a blank one on their very first login.
async function fetchOrCreateRow(userId) {
  const { data, error } = await supabase
    .from('progress')
    .select('onboarded, known, progress')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  if (data) return data

  const fresh = blankData()
  const { error: insertError } = await supabase
    .from('progress')
    .insert({ user_id: userId, ...fresh })
  if (insertError) throw insertError
  return fresh
}

export function AppProvider({ children }) {
  const [session, setSession] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session on load (this is what makes it work across devices —
    // Supabase's own session, not anything stored per-browser).
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session) setData(await fetchOrCreateRow(session.user.id))
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session) {
        setData(await fetchOrCreateRow(session.user.id))
      } else {
        setData(null)
      }
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  // Write straight to the database, keyed by the logged-in user's id.
  const persist = async (next) => {
    setData(next)
    if (!session) return
    await supabase
      .from('progress')
      .update({
        onboarded: next.onboarded,
        known: next.known,
        progress: next.progress,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', session.user.id)
  }

  const register = async (emailInput, password) => {
    const email = emailInput.trim().toLowerCase()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }

  const login = async (emailInput, password) => {
    const email = emailInput.trim().toLowerCase()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const addKnownWords = (words) => {
    if (!data) return
    const set = new Set(data.known)
    words.forEach((w) => set.add(w))
    persist({ ...data, known: [...set] })
  }

  const finishOnboarding = (knownWords) => {
    if (!data) return
    const set = new Set(data.known)
    knownWords.forEach((w) => set.add(w))
    persist({ ...data, onboarded: true, known: [...set] })
  }

  const completeLevel = (situationId, levelKey, words) => {
    if (!data) return
    const prog = { ...(data.progress || {}) }
    prog[situationId] = { ...(prog[situationId] || {}), [levelKey]: true }
    const set = new Set(data.known)
    words.forEach((w) => set.add(w))
    persist({ ...data, progress: prog, known: [...set] })
  }

  const value = useMemo(
    () => ({
      email: session?.user?.email || null,
      data,
      isAuthed: !!session,
      loading,
      register,
      login,
      logout,
      addKnownWords,
      finishOnboarding,
      completeLevel,
    }),
    [session, data, loading]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}