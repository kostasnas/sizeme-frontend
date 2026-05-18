import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import PageShell from '../components/ui/PageShell'

export default function Auth() {
  const [mode,     setMode]     = useState('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const { signInWithEmail, signUpWithEmail } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const returnTo  = location.state?.returnTo || '/home'

  async function handleSubmit() {
    setLoading(true); setError('')
    try {
      if (mode === 'login') {
        const { error } = await signInWithEmail(email, password)
        if (error) throw error
        navigate(returnTo)
      } else {
        const { error } = await signUpWithEmail(email, password)
        if (error) throw error
        navigate('/onboarding')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell bottomPad={false}>
      <div style={{ padding:'48px 24px 32px', minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <div style={{ marginBottom:40 }}>
          <div style={{ fontFamily:'var(--font-head)', fontSize:36, fontWeight:800, letterSpacing:-1, lineHeight:1.1, whiteSpace:'pre-line' }}>
            {mode === 'login' ? 'Καλώς\nόρισες.' : 'Δημιούργησε\nλογαριασμό.'}
          </div>
          <div style={{ color:'var(--text2)', marginTop:8, fontSize:15 }}>
            {mode === 'login' ? 'Σύνδεσε με τον λογαριασμό σου.' : 'Δωρεάν, 3 scans/μήνα.'}
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="Κωδικός" value={password}
            onChange={e => setPassword(e.target.value)} style={inputStyle} />
          {error && <div style={{ color:'var(--danger)', fontSize:13 }}>{error}</div>}
          <button onClick={handleSubmit} disabled={loading} style={btnStyle}>
            {loading ? '...' : mode === 'login' ? 'Σύνδεση' : 'Εγγραφή'}
          </button>
        </div>
        <div style={{ marginTop:24, textAlign:'center', color:'var(--text2)', fontSize:14 }}>
          {mode === 'login' ? 'Δεν έχεις λογαριασμό;' : 'Έχεις ήδη λογαριασμό;'}{' '}
          <span onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            style={{ color:'var(--accent)', cursor:'pointer', fontWeight:600 }}>
            {mode === 'login' ? 'Εγγραφή' : 'Σύνδεση'}
          </span>
        </div>
      </div>
    </PageShell>
  )
}

const inputStyle = { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'14px 16px', fontSize:16, color:'var(--text)', outline:'none', width:'100%' }
const btnStyle   = { background:'var(--accent)', color:'#000', border:'none', borderRadius:'var(--radius-sm)', padding:'16px', fontSize:16, fontWeight:700, fontFamily:'var(--font-head)', cursor:'pointer', marginTop:8 }
