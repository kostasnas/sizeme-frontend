import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAppStore } from '../store/useAppStore'

const STEPS = ['gender', 'height', 'done']

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [gender, setGender] = useState('')
  const [height, setHeight] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, setProfile } = useAppStore()
  const navigate = useNavigate()

  async function finish() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .update({ gender, height_cm: parseInt(height) })
      .eq('id', user.id)
      .select().single()
    setProfile(data)
    navigate('/home')
  }

  if (STEPS[step] === 'gender') return (
    <div style={container}>
      <div style={stepIndicator}>1 / 2</div>
      <h2 style={title}>Ποιο είναι το φύλο σου;</h2>
      <p style={sub}>Χρησιμοποιείται για ακριβέστερα size charts.</p>
      <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:32 }}>
        {[['female','Γυναίκα','♀'],['male','Άντρας','♂'],['unisex','Non-binary / Unisex','◎']].map(([v,l,ic]) => (
          <button key={v} onClick={() => { setGender(v); setStep(1) }} style={{
            ...optBtn, background: gender===v ? 'var(--accent)' : 'var(--bg2)',
            color: gender===v ? '#000' : 'var(--text)',
            borderColor: gender===v ? 'var(--accent)' : 'var(--border)',
          }}>
            <span style={{ fontSize:22 }}>{ic}</span>
            <span style={{ fontWeight:600 }}>{l}</span>
          </button>
        ))}
      </div>
    </div>
  )

  if (STEPS[step] === 'height') return (
    <div style={container}>
      <div style={stepIndicator}>2 / 2</div>
      <h2 style={title}>Ποιο είναι το ύψος σου;</h2>
      <p style={sub}>Χρειάζεται μία φορά για να μετατρέψουμε το scan σε πραγματικά εκατοστά.</p>
      <div style={{ marginTop:40, display:'flex', alignItems:'center', gap:12 }}>
        <input
          type="number" placeholder="175" value={height}
          onChange={e => setHeight(e.target.value)} min={130} max={220}
          style={{ ...inputStyle, flex:1, fontSize:36, fontFamily:'var(--font-head)', fontWeight:700, textAlign:'center' }}
        />
        <span style={{ fontSize:20, color:'var(--text2)', fontWeight:600 }}>cm</span>
      </div>
      <button
        onClick={finish} disabled={!height || loading}
        style={{ ...btnStyle, marginTop:40, opacity: height ? 1 : 0.4 }}
      >
        {loading ? 'Αποθήκευση...' : 'Ξεκινάμε →'}
      </button>
    </div>
  )
}

const container = { height:'100vh', padding:'56px 24px 32px', display:'flex', flexDirection:'column' }
const title = { fontSize:28, fontWeight:800, lineHeight:1.2, marginTop:16 }
const sub = { color:'var(--text2)', fontSize:15, marginTop:8 }
const stepIndicator = { fontSize:13, color:'var(--text2)', fontWeight:600, letterSpacing:1 }
const optBtn = { display:'flex', alignItems:'center', gap:16, padding:'16px 20px', borderRadius:'var(--radius)', border:'1px solid', cursor:'pointer', fontSize:17, transition:'all 0.15s' }
const inputStyle = { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'14px 16px', color:'var(--text)', outline:'none', width:'100%' }
const btnStyle = { background:'var(--accent)', color:'#000', border:'none', borderRadius:'var(--radius-sm)', padding:'16px', fontSize:16, fontWeight:700, fontFamily:'var(--font-head)', cursor:'pointer', width:'100%' }
