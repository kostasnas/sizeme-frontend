/**
 * PageShell — wraps every page with correct scroll behaviour.
 * Usage: <PageShell>...content...</PageShell>
 * Pass bottomPad={false} on pages without BottomNav (auth, onboarding).
 */
export default function PageShell({ children, bottomPad = true, style = {} }) {
  return (
    <div
      className="page"
      style={{
        paddingTop: 'var(--safe-top)',
        paddingBottom: bottomPad ? 'calc(var(--nav-height) + var(--safe-bottom) + 16px)' : '32px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
