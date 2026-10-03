import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import Words from './pages/Words'
import Quiz from './pages/Quiz'
import Flashcards from './pages/Flashcards'

export default function App() {
  const { isAuthed, loading } = useApp()

  if (loading) return <p className="empty">Loading…</p>
  if (!isAuthed) return <Auth />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Words />} />
        <Route path="cards" element={<Flashcards />} />
        <Route path="nl-en" element={<Quiz key="nl-en" direction="nl-en" />} />
        <Route path="en-nl" element={<Quiz key="en-nl" direction="en-nl" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
