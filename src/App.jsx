import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useAppStore } from './store/useAppStore'

import Splash      from './pages/Splash'
import Auth        from './pages/Auth'
import Onboarding  from './pages/Onboarding'
import Home        from './pages/Home'
import BodyScan    from './pages/BodyScan'
import FootScan    from './pages/FootScan'
import Results     from './pages/Results'
import History     from './pages/History'
import Profile     from './pages/Profile'
import Pro         from './pages/Pro'
import BottomNav   from './components/ui/BottomNav'

export default function App() {
  const { user } = useAppStore()
  useAuth()

  return (
    <BrowserRouter>
      <div style={{
        position: 'fixed', inset: 0,
        maxWidth: 480, margin: '0 auto',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}>
        <Routes>
          <Route path="/"           element={<Splash />} />
          <Route path="/auth"       element={<Auth />} />
          <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/auth" />} />
          <Route path="/home"       element={user ? <Home />     : <Navigate to="/auth" />} />
          <Route path="/scan/body"  element={user ? <BodyScan /> : <Navigate to="/auth" />} />
          <Route path="/scan/foot"  element={user ? <FootScan /> : <Navigate to="/auth" />} />
          <Route path="/results"    element={user ? <Results />  : <Navigate to="/auth" />} />
          <Route path="/history"    element={user ? <History />  : <Navigate to="/auth" />} />
          <Route path="/profile"    element={user ? <Profile />  : <Navigate to="/auth" />} />
          <Route path="/pro"        element={<Pro />} />
          <Route path="*"           element={<Navigate to="/" />} />
        </Routes>
        {user && <BottomNav />}
      </div>
    </BrowserRouter>
  )
}
