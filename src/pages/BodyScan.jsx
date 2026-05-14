import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { findSize, BRANDS_LIST } from '../lib/sizeCharts'
import { saveScan } from '../services/scanService'
import PageShell from '../components/ui/PageShell'

export default function BodyScan() {
  const navigate = useNavigate()
  const { user, profile, canScan, incrementFreeScans, isPro } = useAppStore()
  const [step, setStep] = useState('instructions')
  const [frontImage, setFrontImage] = useState(null)
  const [sideImage, setSideImage] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef()
  const captureTarget = useRef('front')

  if (!canScan()) {
    return (
      <PageShell>
        <div style={{ padding:'24px 20px', textAlign:'center', paddingTop:80 }}>
          <div style={{ fontSize:48 }}>🔒</div>
          <h2 style={{ fontFamily:'var(--font-head)', fontSize:24, marginTop:16 }}>Τελείωσαν τα δωρεάν scans</h2>
          <p style={{ color:'var(--text2)', marginTop:8 }}>3 scans/μήνα δωρεάν ή αναβάθμισε σε Pro.</p>
          <button onClick={() => navigate('/pro')} style={{ ...btnStyle, marginTop:32 }}>Αναβάθμιση σε Pro</button>
          <div onClick={() => navigate(-1)} style={{ color:'var(--text2)', marginTop:16, cursor:'pointer' }}>Πίσω</div>
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
    if (captureTarget.current === 'front') {
      setFrontImage(url)
      setStep('preview_front')
    } else {
      setSideImage(url)
      setStep('preview_side')
    }
    e.target.value = ''
  }

  async function processScans() {
    setStep('processing')
    setError('')
    try {
      const heightCm = profile?.height_cm || 170
      const simulated = simulateMeasurements(heightCm, profile?.gender)
      const clothingBrands = BRANDS_LIST.filter(b => !['nike','adidas'].includes(b.key))
      const sizeResults = []
      for (const brand of clothingBrands) {
        const topSize = findSize(brand.key, 'tops', simulated)
        const bottomSize = findSize(brand.key, 'bottoms', simulated)
        if (topSize)    sizeResults.push({ brand: brand.name, brand_key: brand.key, category: 'tops',    ...topSize })
        if (bottomSize) sizeResults.push({ brand: brand.name, brand_key: brand.key, category: 'bottoms', ...bottomSize })
      }
      if (user) {
        try {
          await saveScan(user.id, { scan_type: 'body', ...simulated })
        } catch (e) { console.warn('DB save failed:', e.message) }
        if (!isPro) incrementFreeScans()
      }
      navigate('/results', { state: { results: sizeResults, scanType: 'body', measurements: simulated } })
    } catch (e) {
      setError(e.message)
      setStep('instructions')
    }
  }

  if (step === 'instructions') return (
    <PageShell>
      <div style={{ padding:'24px 20px 0' }}>
        <BackBtn />
        <h1 style={pageTitle}>Body Scan</h1>
        <p style={{ color:'var(--text2)', marginBottom:28, lineHeight:1.5 }}>
          Θα χρειαστείς 2 φωτογραφίες. Σύνολο: ~30 δευτερόλεπτα.
        </p>
        {error && <ErrorBox msg={error} />}
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:32 }}>
          {[
            ['👕','Σταθείς όρθιος/α, μπροστά στην κάμερα','Φωτεινός χώρος, εφαρμοστά ρούχα'],
            ['↩️','Δεύτερη λήψη: πλαϊνά (90°)','Αριστερό ή δεξί — οποιοδήποτε'],
            ['📏','Ύψος: ' + (profile?.height_cm || '—') + ' cm','Αλλαγή από τις Ρυθμίσεις Προφίλ'],
          ].map(([ic,t,s]) => (
            <div key={t} style={infoRow}>
              <span style={{ fontSize:22 }}>{ic}</span>
              <div>
                <div style={{ fontWeight:600, fontSize:15 }}>{t}</div>
                <div style={{ color:'var(--text2)', fontSize:13, marginTop:2 }}>{s}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => { setStep('capture_front'); openCamera('front') }} style={btnStyle}>
          📸 Λήψη Μπροστινής Φωτογραφίας
        </button>
        <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display:'none' }} onChange={handleCapture} />
      </div>
    </PageShell>
  )

  if (step === 'capture_front' || step === 'preview_front') return (
    <PageShell>
      <div style={{ padding:'24px 20px 0' }}>
        <h1 style={pageTitle}>Μπροστινή Λήψη</h1>
        <p style={{ color:'var(--text2)', marginBottom:20 }}>Σταθείς όρθιος/α, ολόκληρο το σώμα ορατό.</p>
        {frontImage && (
          <img src={frontImage} alt="front"
            style={{ width:'100%', maxHeight:380, objectFit:'cover', borderRadius:'var(--radius)', marginBottom:20 }} />
        )}
        <button onClick={() => openCamera('front')}
          style={{ ...btnStyle, background:'var(--bg3)', color:'var(--text)', border:'1px solid var(--border)', marginBottom:12 }}>
          📸 {frontImage ? 'Ξαναλήψη' : 'Λήψη'}
        </button>
        {frontImage && (
          <button onClick={() => { setStep('capture_side'); openCamera('side') }} style={btnStyle}>
            Επόμενο: Πλαϊνή →
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display:'none' }} onChange={handleCapture} />
      </div>
    </PageShell>
  )

  if (step === 'capture_side' || step === 'preview_side') return (
    <PageShell>
      <div style={{ padding:'24px 20px 0' }}>
        <h1 style={pageTitle}>Πλαϊνή Λήψη</h1>
        <p style={{ color:'var(--text2)', marginBottom:20 }}>Στρέψου 90° — ολόκληρο το σώμα ορατό.</p>
        {sideImage && (
          <img src={sideImage} alt="side"
            style={{ width:'100%', maxHeight:380, objectFit:'cover', borderRadius:'var(--radius)', marginBottom:20 }} />
        )}
        <button onClick={() => openCamera('side')}
          style={{ ...btnStyle, background:'var(--bg3)', color:'var(--text)', border:'1px solid var(--border)', marginBottom:12 }}>
          📸 {sideImage ? 'Ξαναλήψη' : 'Λήψη'}
        </button>
        {sideImage && (
          <button onClick={processScans} style={btnStyle}>
            🔍 Ανάλυση →
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display:'none' }} onChange={handleCapture} />
      </div>
    </PageShell>
  )

  if (step === 'processing') return (
    <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', padding:32 }}>
        <div style={{ fontSize:56, marginBottom:20 }}>🔍</div>
        <h2 style={{ fontFamily:'var(--font-head)', fontSize:22 }}>Ανάλυση...</h2>
        <p style={{ color:'var(--text2)', marginTop:8, fontSize:14 }}>Υπολογισμός μετρήσεων & size lookup</p>
        <div style={{ marginTop:28, display:'flex', justifyContent:'center', gap:8 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width:10, height:10, borderRadius:'50%', background:'var(--accent)',
              animation:'pulse 1s ease-in-out infinite', animationDelay:`${i*0.25}s`,
            }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.2;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )

  return null
}

function simulateMeasurements(heightCm, gender) {
  const isFemale = gender !== 'male'
  const scale = heightCm / 170
  return {
    bust_cm:           Math.round((isFemale ? 90 : 96) * scale),
    waist_cm:          Math.round((isFemale ? 72 : 82) * scale),
    hips_cm:           Math.round((isFemale ? 98 : 94) * scale),
    shoulder_width_cm: Math.round((isFemale ? 38 : 44) * scale),
    inseam_cm:         Math.round((isFemale ? 76 : 80) * scale),
  }
}

function BackBtn() {
  const navigate = useNavigate()
  return <div onClick={() => navigate(-1)} style={{ color:'var(--text2)', marginBottom:16, cursor:'pointer', fontSize:14 }}>← Πίσω</div>
}
function ErrorBox({ msg }) {
  return <div style={{ background:'#ff3b5c20', border:'1px solid var(--danger)', borderRadius:'var(--radius-sm)', padding:'12px 16px', marginBottom:16, fontSize:14, color:'var(--danger)' }}>{msg}</div>
}

const pageTitle = { fontFamily:'var(--font-head)', fontSize:28, fontWeight:800, marginBottom:8 }
const infoRow   = { display:'flex', gap:14, background:'var(--bg2)', padding:'14px 16px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)', alignItems:'flex-start' }
const btnStyle  = { background:'var(--accent)', color:'#000', border:'none', borderRadius:'var(--radius-sm)', padding:'16px', fontSize:16, fontWeight:700, fontFamily:'var(--font-head)', cursor:'pointer', width:'100%' }
