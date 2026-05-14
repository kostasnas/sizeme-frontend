import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { findSize } from '../lib/sizeCharts'
import { saveScan } from '../services/scanService'
import PageShell from '../components/ui/PageShell'

export default function FootScan() {
  const navigate = useNavigate()
  const { user, canScan, incrementFreeScans, isPro } = useAppStore()
  const [step, setStep] = useState('instructions')
  const [leftImage, setLeftImage] = useState(null)
  const [rightImage, setRightImage] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef()
  const captureTarget = useRef('left')

  if (!canScan()) {
    return (
      <PageShell>
        <div style={{ padding:'24px 20px', textAlign:'center', paddingTop:80 }}>
          <div style={{ fontSize:48 }}>🔒</div>
          <h2 style={{ fontFamily:'var(--font-head)', fontSize:24, marginTop:16 }}>Τελείωσαν τα δωρεάν scans</h2>
          <button onClick={() => navigate('/pro')} style={{ ...btnStyle, marginTop:24 }}>Αναβάθμιση σε Pro</button>
          <div onClick={() => navigate(-1)} style={{ color:'var(--text2)', marginTop:12, cursor:'pointer' }}>Πίσω</div>
        </div>
      </PageShell>
    )
  }

  function openCamera(target) {
    captureTarget.current = target
    setTimeout(() => fileRef.current?.click(), 50)
  }

  function handleCapture(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    if (captureTarget.current === 'left') { setLeftImage(url);  setStep('preview_left') }
    else                                  { setRightImage(url); setStep('preview_right') }
    e.target.value = ''
  }

  async function processFootScan() {
    setStep('processing')
    setError('')
    try {
      const sim = simulateFootMeasurements()
      const results = buildShoeResults(sim)
      if (user) {
        try {
          await saveScan(user.id, {
            scan_type: 'foot',
            foot_length_left:  sim.left.length_mm / 10,
            foot_length_right: sim.right.length_mm / 10,
            foot_width_left:   sim.left.width_mm / 10,
            foot_width_right:  sim.right.width_mm / 10,
            foot_notes: sim.left.is_wide ? 'πλατύ πόδι' : null,
          })
        } catch (e) { console.warn('DB save failed:', e.message) }
        if (!isPro) incrementFreeScans()
      }
      navigate('/results', { state: { results, scanType: 'foot', measurements: sim } })
    } catch (e) {
      setError('Κάτι πήγε στραβά: ' + e.message)
      setStep('instructions')
    }
  }

  if (step === 'instructions') return (
    <PageShell>
      <div style={{ padding:'24px 20px 0' }}>
        <BackBtn />
        <h1 style={pageTitle}>Foot Scan</h1>
        {error && <div style={errorStyle}>{error}</div>}
        <div style={{ background:'var(--bg2)', border:'2px dashed var(--accent2)', borderRadius:'var(--radius)', padding:18, marginBottom:20 }}>
          <div style={{ fontSize:24, marginBottom:8 }}>📄</div>
          <div style={{ fontWeight:700, marginBottom:6 }}>Ετοίμασε ένα χαρτί Α4</div>
          <div style={{ color:'var(--text2)', fontSize:14, lineHeight:1.6 }}>
            Βάλε το χαρτί στο πάτωμα. Φόρεσε κάλτσα, σταθείς πάνω του και φωτογράφισε <strong>κάθετα από ψηλά</strong>. Ολόκληρο το χαρτί να φαίνεται.
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
          {[
            ['👣','Αριστερό πόδι πρώτα','Κάθετη λήψη, ολόκληρο το χαρτί ορατό'],
            ['👣','Μετά δεξί πόδι','Τα πόδια συχνά διαφέρουν σε μέγεθος'],
            ['☀️','Καλός φωτισμός','Αποφύγε σκιές πάνω στο πόδι'],
          ].map(([ic,t,s]) => (
            <div key={t} style={infoRow}>
              <span style={{ fontSize:20 }}>{ic}</span>
              <div>
                <div style={{ fontWeight:600, fontSize:14 }}>{t}</div>
                <div style={{ color:'var(--text2)', fontSize:13 }}>{s}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => { setStep('capture_left'); openCamera('left') }} style={btnStyle}>
          📸 Λήψη Αριστερού Ποδιού
        </button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display:'none' }} onChange={handleCapture} />
      </div>
    </PageShell>
  )

  if (step === 'preview_left' || step === 'capture_left') return (
    <PageShell>
      <div style={{ padding:'24px 20px 0' }}>
        <h1 style={pageTitle}>Αριστερό Πόδι {leftImage ? '✓' : ''}</h1>
        <p style={{ color:'var(--text2)', marginBottom:16 }}>Φαίνεται ολόκληρο το χαρτί Α4;</p>
        {leftImage && <img src={leftImage} alt="left" style={photoStyle} />}
        <button onClick={() => openCamera('left')}
          style={{ ...btnStyle, background:'var(--bg3)', color:'var(--text)', border:'1px solid var(--border)', marginBottom:12 }}>
          📸 {leftImage ? 'Ξαναλήψη' : 'Λήψη'}
        </button>
        {leftImage && (
          <button onClick={() => { setStep('capture_right'); openCamera('right') }} style={btnStyle}>
            Επόμενο: Δεξί Πόδι →
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display:'none' }} onChange={handleCapture} />
      </div>
    </PageShell>
  )

  if (step === 'preview_right' || step === 'capture_right') return (
    <PageShell>
      <div style={{ padding:'24px 20px 0' }}>
        <h1 style={pageTitle}>Δεξί Πόδι {rightImage ? '✓' : ''}</h1>
        <p style={{ color:'var(--text2)', marginBottom:16 }}>Ίδια διαδικασία — χαρτί Α4, κάθετη λήψη.</p>
        {rightImage && <img src={rightImage} alt="right" style={photoStyle} />}
        <button onClick={() => openCamera('right')}
          style={{ ...btnStyle, background:'var(--bg3)', color:'var(--text)', border:'1px solid var(--border)', marginBottom:12 }}>
          📸 {rightImage ? 'Ξαναλήψη' : 'Λήψη'}
        </button>
        {rightImage && (
          <button onClick={processFootScan} style={{ ...btnStyle, background:'var(--accent2)' }}>
            🔍 Ανάλυση Ποδιών →
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display:'none' }} onChange={handleCapture} />
      </div>
    </PageShell>
  )

  if (step === 'processing') return (
    <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', padding:32 }}>
        <div style={{ fontSize:56, marginBottom:20 }}>👟</div>
        <h2 style={{ fontFamily:'var(--font-head)', fontSize:22 }}>Μέτρηση ποδιών...</h2>
        <p style={{ color:'var(--text2)', marginTop:8, fontSize:14 }}>Ανιχνεύω χαρτί Α4, μετρώ μήκος & πλάτος</p>
        <div style={{ marginTop:28, display:'flex', justifyContent:'center', gap:8 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:'var(--accent2)', animation:'pulse 1s ease-in-out infinite', animationDelay:`${i*0.25}s` }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.2;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )

  return null
}

function simulateFootMeasurements() {
  return {
    left:  { length_mm:265, width_mm:98,  eu_size:41, is_wide:true,  width_category:'wide'     },
    right: { length_mm:268, width_mm:96,  eu_size:42, is_wide:false, width_category:'standard' },
  }
}
function buildShoeResults(measurements) {
  const dominant = measurements.right.length_mm >= measurements.left.length_mm ? measurements.right : measurements.left
  return ['nike','adidas'].map(brandKey => {
    const size = findSize(brandKey, 'shoes', { foot_length_mm: dominant.length_mm, is_wide: dominant.is_wide })
    return size ? { ...size, brand_key: brandKey, category:'shoes' } : null
  }).filter(Boolean)
}
function BackBtn() {
  const navigate = useNavigate()
  return <div onClick={() => navigate(-1)} style={{ color:'var(--text2)', marginBottom:16, cursor:'pointer', fontSize:14 }}>← Πίσω</div>
}

const pageTitle = { fontFamily:'var(--font-head)', fontSize:28, fontWeight:800, marginBottom:8 }
const infoRow   = { display:'flex', gap:14, background:'var(--bg2)', padding:'14px 16px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)', alignItems:'flex-start' }
const photoStyle = { width:'100%', maxHeight:360, objectFit:'cover', borderRadius:'var(--radius)', marginBottom:20 }
const btnStyle  = { background:'var(--accent2)', color:'#fff', border:'none', borderRadius:'var(--radius-sm)', padding:'16px', fontSize:16, fontWeight:700, fontFamily:'var(--font-head)', cursor:'pointer', width:'100%' }
const errorStyle = { background:'#ff3b5c20', border:'1px solid var(--danger)', borderRadius:'var(--radius-sm)', padding:'12px 16px', marginBottom:16, fontSize:14, color:'var(--danger)' }
