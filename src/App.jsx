import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import Words from './pages/Words'
import Quiz from './pages/Quiz'
import Flashcards from './pages/Flashcards'
import Review from './pages/Review'

export default function App() {
  const { isAuthed, loading } = useApp()

  if (loading) return <p className="empty">Loading…</p>
  if (!isAuthed) return <Auth />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Words />} />
        <Route path="cards" element={<Flashcards />} />
        <Route path="review" element={<Review />} />
        <Route path="nl-en" element={<Quiz key="nl-en" direction="nl-en" />} />
        <Route path="en-nl" element={<Quiz key="en-nl" direction="en-nl" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
