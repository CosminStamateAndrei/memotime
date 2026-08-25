import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import SituationDetail from './pages/SituationDetail'
import KnownWords from './pages/KnownWords'
import Dictionary from './pages/Dictionary'
import Respond from './pages/Respond'

export default function App() {
  const { isAuthed, data, loading } = useApp()
  const onboarded = data?.onboarded

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', fontFamily: 'var(--body)', color: 'var(--ink-soft)' }}>
        Loading…
      </div>
    )
  }

  return (
    <Routes>
      {/* Landing / auth */}
      <Route
        path="/"
        element={
          !isAuthed ? <Auth /> : <Navigate to={onboarded ? '/app' : '/onboarding'} replace />
        }
      />

      {/* First-run quiz */}
      <Route
        path="/onboarding"
        element={
          !isAuthed ? (
            <Navigate to="/" replace />
          ) : onboarded ? (
            <Navigate to="/app" replace />
          ) : (
            <Onboarding />
          )
        }
      />

      {/* Main app */}
      <Route
        path="/app"
        element={
          !isAuthed ? (
            <Navigate to="/" replace />
          ) : !onboarded ? (
            <Navigate to="/onboarding" replace />
          ) : (
            <Layout />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="situation/:id" element={<SituationDetail />} />
        <Route path="practice" element={<Respond />} />
        <Route path="words" element={<KnownWords />} />
        <Route path="dictionary" element={<Dictionary />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}