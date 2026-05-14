import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import PageShell from '../components/ui/PageShell'

export default function Home() {
  const navigate = useNavigate()
  const { profile, isPro, freeScansUsed, FREE_SCAN_LIMIT } = useAppStore()
  const scansLeft = isPro ? '∞' : Math.max(0, FREE_SCAN_LIMIT - freeScansUsed)

  return (
    <PageShell>
      <div style={{ padding: '24px 20px 0' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <div>
            <div style={{ color:'var(--text2)', fontSize:13 }}>Γεια σου,</div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:24, fontWeight:800 }}>
              {profile?.full_name || 'Χρήστη'} 👋
            </div>
          </div>
          {!isPro && (
            <div onClick={() => navigate('/pro')} style={{
              background:'var(--accent)', color:'#000',
              padding:'6px 14px', borderRadius:100,
              fontSize:13, fontWeight:700, cursor:'pointer',
            }}>Pro ✦</div>
          )}
        </div>

        {/* Free scans counter */}
        {!isPro && (
          <div style={{
            background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:'var(--radius)', padding:'16px 20px',
            marginBottom:24, display:'flex', justifyContent:'space-between', alignItems:'center',
          }}>
            <div>
              <div style={{ fontSize:13, color:'var(--text2)' }}>Δωρεάν scans</div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:22, fontWeight:800 }}>
                {scansLeft} / {FREE_SCAN_LIMIT}
              </div>
            </div>
            <div onClick={() => navigate('/pro')} style={{ color:'var(--accent)', fontSize:13, fontWeight:600, cursor:'pointer' }}>
              Αναβάθμιση →
            </div>
          </div>
        )}

        {/* Scan cards */}
        <div style={{ fontSize:12, color:'var(--text2)', fontWeight:700, letterSpacing:1, marginBottom:12 }}>ΣΚΑΝ</div>
        <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:32 }}>
          <ScanCard
            icon="👕" title="Body Scan"
            sub="Ρούχα · Tops · Bottoms"
            desc="Φωτογράφισε τον εαυτό σου μπροστά & πλαϊνά"
            accent="var(--accent)"
            onClick={() => navigate('/scan/body')}
          />
          <ScanCard
            icon="👟" title="Foot Scan"
            sub="Παπούτσια · Wide fit · Ανατομικά"
            desc="Βάλε το πόδι σου πάνω σε χαρτί Α4"
            accent="var(--accent2)"
            onClick={() => navigate('/scan/foot')}
          />
        </div>

        {/* Brands */}
        <div style={{ fontSize:12, color:'var(--text2)', fontWeight:700, letterSpacing:1, marginBottom:12 }}>BRANDS</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {['Zara','H&M','Shein','Temu','AliExpress','Nike','Adidas'].map(b => (
            <div key={b} style={{
              background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:100, padding:'6px 14px', fontSize:13, color:'var(--text2)',
            }}>{b}</div>
          ))}
        </div>

      </div>
    </PageShell>
  )
}

function ScanCard({ icon, title, sub, desc, accent, onClick }) {
  return (
    <div onClick={onClick} style={{
      background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:'var(--radius)', padding:'20px', cursor:'pointer',
      position:'relative', overflow:'hidden',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{ position:'absolute', top:-20, right:-20, fontSize:90, opacity:0.06, userSelect:'none', pointerEvents:'none' }}>
        {icon}
      </div>
      <div style={{ fontSize:32, marginBottom:10 }}>{icon}</div>
      <div style={{ fontFamily:'var(--font-head)', fontSize:20, fontWeight:800 }}>{title}</div>
      <div style={{ fontSize:12, color: accent, fontWeight:600, marginTop:4 }}>{sub}</div>
      <div style={{ fontSize:14, color:'var(--text2)', marginTop:8, lineHeight:1.4 }}>{desc}</div>
      <div style={{
        marginTop:16, display:'inline-flex', alignItems:'center', gap:6,
        background: accent, color:'#000', padding:'8px 16px',
        borderRadius:100, fontSize:13, fontWeight:700,
      }}>
        Έναρξη Scan →
      </div>
    </div>
  )
}
