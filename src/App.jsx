import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
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
import LinkScan    from './pages/LinkScan'
import BottomNav   from './components/ui/BottomNav'

export default function App() {
  const { user, authReady } = useAppStore()
  useAuth()

  return (
    <BrowserRouter>
      <div style={{
        position:'fixed', inset:0,
        maxWidth:480, margin:'0 auto',
        background:'var(--bg)', overflow:'hidden',
      }}>
        {/* Auth not resolved yet — show nothing to avoid flash */}
        {!authReady ? (
          <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:800, fontSize:20, color:'#000' }}>S</div>
          </div>
        ) : (
          <>
            <ShareIntentHandler />
            <Routes>
              <Route path="/"           element={<Splash />} />
              <Route path="/auth"       element={<Auth />} />
              <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/auth" />} />
              <Route path="/home"       element={user ? <Home />      : <Navigate to="/auth" />} />
              <Route path="/scan/body"  element={user ? <BodyScan />  : <Navigate to="/auth" />} />
              <Route path="/scan/foot"  element={user ? <FootScan />  : <Navigate to="/auth" />} />
              <Route path="/results"    element={user ? <Results />   : <Navigate to="/auth" />} />
              <Route path="/history"    element={user ? <History />   : <Navigate to="/auth" />} />
              <Route path="/profile"    element={user ? <Profile />   : <Navigate to="/auth" />} />
              <Route path="/pro"        element={<Pro />} />
              <Route path="/link-scan"  element={user ? <LinkScan />  : <Navigate to="/auth" state={{ returnTo: '/link-scan' }} />} />
              <Route path="*"           element={<Navigate to="/" />} />
            </Routes>
            {user && <BottomNav />}
          </>
        )}
      </div>
    </BrowserRouter>
  )
}

/**
 * Listens for the 'shareIntent' CustomEvent fired by MainActivity.java.
 * Waits until user is authenticated, then navigates to /link-scan with the URL.
 */
function ShareIntentHandler() {
  const navigate = useNavigate()
  const { user } = useAppStore()
  const [pendingUrl, setPendingUrl] = useState(null)

  useEffect(() => {
    function onShareIntent(e) {
      const url = e.detail?.url
      if (!url) return
      setPendingUrl(url)
    }
    window.addEventListener('shareIntent', onShareIntent)
    return () => window.removeEventListener('shareIntent', onShareIntent)
  }, [])

  // Once we have both a pending URL and an authenticated user, navigate
  useEffect(() => {
    if (pendingUrl && user) {
      navigate(`/link-scan?url=${encodeURIComponent(pendingUrl)}`)
      setPendingUrl(null)
    }
  }, [pendingUrl, user])

  return null
}
