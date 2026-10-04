import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import { defaultWords } from '../data/defaultWords'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

// Progress is keyed by the Dutch text, so it survives edits to the English
// side and doesn't depend on a word's position in the default list.
export const wordKey = (w) => w.nl.trim().toLowerCase()

const DEFAULTS =defaultWords.map(([nl, en], i) => ({
  id: `default-${i}`,
  nl,
  en,
  isDefault: true,
}))

export function AppProvider({ children }) {
  const [session, setSession] = useState(null)
  const [dbWords, setDbWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [wordsLoaded, setWordsLoaded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => sub.subscription.unsubscribe()
  }, [])

  const fetchWords = useCallback(async () => {
    const { data, error } = await supabase
      .from('words')
      .select('id, nl, en, added_by, created_at')
      .order('created_at', { ascending: false })
    if (error) {
      setError(error.message)
      setWordsLoaded(true)
      return
    }
    setError('')
    setDbWords(data)
    setWordsLoaded(true)
  }, [])

  // Load the shared list, and keep it in sync with whatever the other person adds.
  useEffect(() => {
    if (!session) {
      setDbWords([])
      setWordsLoaded(false)
      return
    }
    fetchWords()
    const channel = supabase
      .channel('words-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'words' }, fetchWords)
      .subscribe()
    window.addEventListener('focus', fetchWords)
    return () => {
      supabase.removeChannel(channel)
      window.removeEventListener('focus', fetchWords)
    }
  }, [session, fetchWords])

  const words = useMemo(() => [...dbWords, ...DEFAULTS], [dbWords])

  // ---- personal flashcard progress: { [wordKey]: { review, known } } ----
  const [progress, setProgress] = useState({})
  const [progressError, setProgressError] = useState('')

  useEffect(() => {
    if (!session) {
      setProgress({})
      return
    }
    supabase
      .from('card_progress')
      .select('word_key, review, known')
      .then(({ data, error }) => {
        if (error) return setProgressError(error.message)
        setProgressError('')
        setProgress(Object.fromEntries(data.map((r) => [r.word_key, { review: r.review, known: r.known }])))
      })
  }, [session])

  const saveProgress = async (word, next) => {
    const key = wordKey(word)
    setProgress((p) => ({ ...p, [key]: next }))
    const { error } = await supabase.from('card_progress').upsert(
      { user_id: session.user.id, word_key: key, ...next, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,word_key' }
    )
    setProgressError(error ? error.message : '')
  }

  const getProgress = (word) => progress[wordKey(word)] || { review: false, known: 0 }

  // Swiped right: seen less often. Swiped left: into the review pile.
  const markCard = (word, knew) => {
    const p = getProgress(word)
    saveProgress(word, knew ? { review: p.review, known: p.known + 1 } : { review: true, known: 0 })
  }

  // Passed in the review test: out of the pile.
  const passReview = (word) => saveProgress(word, { review: false, known: getProgress(word).known })

  const reviewWords = useMemo(() => words.filter((w) => progress[wordKey(w)]?.review), [words, progress])

  const addWords = async (pairs) => {
    const rows = pairs.map(({ nl, en }) => ({ nl, en, added_by: session?.user?.email || null }))
    const { error } = await supabase.from('words').insert(rows)
    if (error) return { ok: false, error: error.message }
    await fetchWords()
    return { ok: true }
  }

  const deleteWord = async (id) => {
    setDbWords((ws) => ws.filter((w) => w.id !== id))
    const { error } = await supabase.from('words').delete().eq('id', id)
    if (error) setError(error.message)
    await fetchWords()
  }

  const register = async (emailInput, password) => {
    const { error } = await supabase.auth.signUp({ email: emailInput.trim().toLowerCase(), password })
    return error ? { ok: false, error: error.message } : { ok: true }
  }

  const login = async (emailInput, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email: emailInput.trim().toLowerCase(), password })
    return error ? { ok: false, error: error.message } : { ok: true }
  }

  const logout = () => supabase.auth.signOut()

  const value = {
    email: session?.user?.email || null,
    isAuthed: !!session,
    loading,
    error,
    words,
    wordsLoaded,
    addWords,
    deleteWord,
    getProgress,
    markCard,
    passReview,
    reviewWords,
    progressError,
    register,
    login,
    logout,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
