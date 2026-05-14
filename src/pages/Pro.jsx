import { useNavigate } from 'react-router-dom'
import PageShell from '../components/ui/PageShell'

const PERKS = [
  ['∞',  'Unlimited Scans',          'Χωρίς μηνιαίο όριο'],
  ['💾', 'Αποθήκευση Ιστορικού',     'Δες πώς αλλάζει το σώμα σου'],
  ['🔄', 'Sync Μεταξύ Συσκευών',    'Ένα προφίλ, παντού'],
  ['🎯', 'Priority AI Lookup',       'Ταχύτερα αποτελέσματα'],
  ['📊', 'Αναλυτικά Μεγέθη',        'Ανά brand & κατηγορία'],
  ['👧', 'Παιδικά Προφίλ',          'Scans για κάθε παιδί ξεχωριστά'],
]

export default function Pro() {
  const navigate = useNavigate()
  return (
    <PageShell bottomPad={false}>
      <div style={{ padding:'24px 20px 48px' }}>
        <div onClick={() => navigate(-1)} style={{ color:'var(--text2)', marginBottom:24, cursor:'pointer', fontSize:14 }}>← Πίσω</div>

        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>✦</div>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:36, fontWeight:800, letterSpacing:-1 }}>SizeMe Pro</h1>
          <p style={{ color:'var(--text2)', marginTop:8 }}>Ξέρεις πάντα το σωστό νούμερο.</p>
        </div>

        <div style={{ display:'flex', gap:12, marginBottom:32 }}>
          <div style={{ flex:1, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:20, textAlign:'center' }}>
            <div style={{ fontSize:12, color:'var(--text2)', marginBottom:8 }}>ΜΗΝΙΑΙΟ</div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:32, fontWeight:800 }}>€2.99</div>
            <div style={{ fontSize:12, color:'var(--text2)' }}>/μήνα</div>
          </div>
          <div style={{ flex:1, background:'var(--accent)', borderRadius:'var(--radius)', padding:20, textAlign:'center', position:'relative' }}>
            <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', background:'var(--accent2)', color:'#fff', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:100, whiteSpace:'nowrap' }}>BEST VALUE</div>
            <div style={{ fontSize:12, color:'#0008', marginBottom:8 }}>ΕΤΗΣΙΟ</div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:32, fontWeight:800, color:'#000' }}>€9.99</div>
            <div style={{ fontSize:12, color:'#0008' }}>/χρόνο</div>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:32 }}>
          {PERKS.map(([ic,t,s]) => (
            <div key={t} style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 16px', background:'var(--bg2)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)' }}>
              <span style={{ fontSize:22, width:32, textAlign:'center' }}>{ic}</span>
              <div>
                <div style={{ fontWeight:600 }}>{t}</div>
                <div style={{ fontSize:13, color:'var(--text2)' }}>{s}</div>
              </div>
            </div>
          ))}
        </div>

        <button style={{ background:'var(--accent)', color:'#000', border:'none', borderRadius:'var(--radius-sm)', padding:'18px', fontSize:17, fontWeight:800, fontFamily:'var(--font-head)', cursor:'pointer', width:'100%' }}>
          Ξεκίνα δωρεάν δοκιμή 7 ημερών
        </button>
        <p style={{ textAlign:'center', color:'var(--text2)', fontSize:12, marginTop:12 }}>
          Ακύρωση οποιαδήποτε στιγμή. Χρέωση μέσω Google Play.
        </p>
      </div>
    </PageShell>
  )
}
