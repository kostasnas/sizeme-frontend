import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function Splash() {
  const navigate = useNavigate()
  const { user } = useAppStore()

  useEffect(() => {
    const t = setTimeout(() => {
      navigate(user ? '/home' : '/auth')
    }, 2000)
    return () => clearTimeout(t)
  }, [user])

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', gap: 16
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24,
        background: 'var(--accent)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 40, fontFamily: 'var(--font-head)', fontWeight: 800, color: '#000'
      }}>S</div>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>
        SizeMe
      </div>
      <div style={{ color: 'var(--text2)', fontSize: 14 }}>Το σωστό νούμερο, πάντα.</div>
      <div style={{
        marginTop: 40, width: 48, height: 4, borderRadius: 2,
        background: 'var(--border)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: '100%', background: 'var(--accent)',
          animation: 'load 2s linear forwards'
        }} />
      </div>
      <style>{`
        @keyframes load { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }
      `}</style>
    </div>
  )
}
