import { useLocation, useNavigate } from 'react-router-dom'

const TABS = [
  { path: '/home',      icon: '🏠', label: 'Αρχική'  },
  { path: '/scan/body', icon: '👕', label: 'Body'    },
  { path: '/scan/foot', icon: '👟', label: 'Πόδι'    },
  { path: '/history',   icon: '📋', label: 'Ιστορικό'},
  { path: '/profile',   icon: '👤', label: 'Προφίλ'  },
]

const HIDE_ON = ['/onboarding', '/auth', '/']

export default function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  if (HIDE_ON.includes(pathname)) return null

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      background: 'var(--bg2)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      paddingBottom: 'var(--safe-bottom)',
      zIndex: 999,
    }}>
      {TABS.map(({ path, icon, label }) => {
        const active = pathname === path
        return (
          <button key={path} onClick={() => navigate(path)} style={{
            flex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '10px 0 8px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: active ? 'var(--accent)' : 'var(--text2)',
            transition: 'color 0.15s',
            WebkitTapHighlightColor: 'transparent',
          }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{
              fontSize: 10, marginTop: 3,
              fontWeight: active ? 700 : 400,
              fontFamily: 'var(--font-body)',
            }}>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
