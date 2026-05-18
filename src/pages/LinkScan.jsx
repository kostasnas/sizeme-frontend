import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { scanProductLink, detectBrandFromUrl } from '../services/linkScanService'
import BodyAvatar from '../components/ui/BodyAvatar'
import PageShell from '../components/ui/PageShell'

const CONFIDENCE_UI = {
  high:   { label:'✓ Υψηλή ακρίβεια',  color:'#c8ff00' },
  medium: { label:'~ Μέτρια ακρίβεια', color:'#f5c518' },
  low:    { label:'⚠ Χαμηλή ακρίβεια', color:'#ff6b35' },
}

const FIT_LABELS = {
  tight:   { label:'Στενό',    color:'#ff3c3c', bg:'#ff3c3c18' },
  perfect: { label:'Ιδανικό',  color:'#50dc64', bg:'#50dc6418' },
  loose:   { label:'Χαλαρό',   color:'#ffc800', bg:'#ffc80018' },
}

export default function LinkScan() {
  const navigate    = useNavigate()
  const [params]    = useSearchParams()
  const { profile } = useAppStore()

  const sharedUrl = params.get('url') || ''

  const [manualUrl, setManualUrl] = useState(sharedUrl)
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState(null)
  const [error,     setError]     = useState('')
  const [showAvatar, setShowAvatar] = useState(false)

  const brand = detectBrandFromUrl(manualUrl)

  useEffect(() => {
    if (sharedUrl) {
      setManualUrl(sharedUrl)
      handleScan(sharedUrl)
    }
  }, [sharedUrl])

  async function handleScan(url = manualUrl) {
    if (!url) return
    setLoading(true); setError(''); setResult(null); setShowAvatar(false)

    try {
      const measurements = {
        bust_cm:           profile?.bust_cm,
        waist_cm:          profile?.waist_cm,
        hips_cm:           profile?.hips_cm,
        shoulder_width_cm: profile?.shoulder_width_cm,
      }
      const data = await scanProductLink(url, measurements, profile?.gender)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <div style={{ padding:'24px 20px 0' }}>
        <BackBtn />
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:26, fontWeight:800, marginBottom:4 }}>🔗 Link Scan</h1>
        <p style={{ color:'var(--text2)', fontSize:14, marginBottom:20, lineHeight:1.5 }}>
          Paste το link ενός ρούχου — βρίσκει αυτόματα το νούμερο σου.
        </p>

        {/* URL input */}
        <div style={{ display:'flex', gap:8, marginBottom:12 }}>
          <input
            value={manualUrl}
            onChange={e => { setManualUrl(e.target.value); setResult(null); setError('') }}
            placeholder="https://www.shein.com/..."
            style={{ flex:1, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'13px 14px', color:'var(--text)', fontSize:14, outline:'none' }}
          />
          <button
            onClick={() => handleScan()}
            disabled={!manualUrl || loading}
            style={{ background: manualUrl ? 'var(--accent)' : 'var(--bg3)', color: manualUrl ? '#000' : 'var(--text2)', border:'none', borderRadius:'var(--radius-sm)', padding:'0 18px', fontWeight:700, fontSize:15, cursor: manualUrl ? 'pointer' : 'default', flexShrink:0 }}
          >
            {loading ? '...' : '→'}
          </button>
        </div>

        {manualUrl && brand && (
          <div style={{ fontSize:13, color:'var(--text2)', marginBottom:16 }}>
            {brand.flag} <strong style={{ color:'var(--text)' }}>{brand.name}</strong>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingState />}

        {/* Error */}
        {error && !loading && (
          <div style={{ background:'#ff3b5c18', border:'1px solid var(--danger)', borderRadius:'var(--radius-sm)', padding:'14px', fontSize:14, color:'var(--danger)', lineHeight:1.5 }}>
            {error}
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <>
            <ScanResult
              result={result}
              originalUrl={manualUrl}
              onShowAvatar={() => setShowAvatar(v => !v)}
              showAvatar={showAvatar}
            />

            {/* Avatar with heatmap */}
            {showAvatar && (
              <div style={{ background:'linear-gradient(180deg,#1c1c2e,#13131a)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'24px 16px 20px', marginTop:4, display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
                <div style={{ fontSize:12, color:'var(--text2)', fontWeight:600, letterSpacing:0.8 }}>
                  ΑΝΑΛΥΣΗ ΕΦΑΡΜΟΓΗΣ
                </div>

                <BodyAvatar
                  measurements={{
                    bust_cm:           profile?.bust_cm,
                    waist_cm:          profile?.waist_cm,
                    hips_cm:           profile?.hips_cm,
                    shoulder_width_cm: profile?.shoulder_width_cm,
                  }}
                  gender={profile?.gender}
                  fitAnalysis={result.fitAnalysis}
                  size={360}
                />

                {/* Heatmap legend */}
                <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
                  {Object.entries(FIT_LABELS).map(([key, { label, color, bg }]) => (
                    <div key={key} style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:100, background:bg, border:`1px solid ${color}40` }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:color }} />
                      <span style={{ fontSize:12, color, fontWeight:600 }}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Per-zone breakdown */}
                {result.fitAnalysis && (
                  <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:8 }}>
                    {[
                      ['Στήθος', result.fitAnalysis.bust],
                      ['Μέση',   result.fitAnalysis.waist],
                      ['Γοφοί',  result.fitAnalysis.hips],
                    ].filter(([, v]) => v && v !== 'null').map(([zone, fit]) => {
                      const ui = FIT_LABELS[fit]
                      if (!ui) return null
                      return (
                        <div key={zone} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'var(--bg3)', borderRadius:'var(--radius-sm)' }}>
                          <span style={{ fontSize:14, fontWeight:600 }}>{zone}</span>
                          <span style={{ fontSize:13, color:ui.color, fontWeight:600, background:ui.bg, padding:'3px 12px', borderRadius:100 }}>
                            {ui.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {!result && !loading && !error && <HowTo />}
      </div>
    </PageShell>
  )
}

function ScanResult({ result, originalUrl, onShowAvatar, showAvatar }) {
  const confUI = CONFIDENCE_UI[result.confidence] || CONFIDENCE_UI.medium

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

      {/* Product */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'14px 18px' }}>
        <div style={{ fontSize:12, color:'var(--text2)', fontWeight:600, letterSpacing:0.5, marginBottom:6 }}>ΠΡΟΪΟΝ</div>
        <div style={{ fontFamily:'var(--font-head)', fontSize:17, fontWeight:800 }}>{result.productName || 'Προϊόν'}</div>
        <div style={{ fontSize:13, color:'var(--text2)', marginTop:2 }}>{result.brand}</div>
      </div>

      {/* Hero size */}
      <div style={{ background:'linear-gradient(135deg,rgba(200,255,0,0.12),rgba(200,255,0,0.04))', border:'1px solid rgba(200,255,0,0.3)', borderRadius:'var(--radius)', padding:'22px 20px', textAlign:'center' }}>
        <div style={{ fontSize:12, color:'var(--text2)', marginBottom:8 }}>ΤΟ ΝΟΥΜΕΡΟ ΣΟΥ</div>
        {result.recommendedSize ? (
          <>
            <div style={{ fontFamily:'var(--font-head)', fontSize:72, fontWeight:800, color:'var(--accent)', lineHeight:1 }}>
              {result.recommendedSize}
            </div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:10, padding:'4px 14px', borderRadius:100, background:confUI.color+'18', border:`1px solid ${confUI.color}40`, fontSize:12, fontWeight:600, color:confUI.color }}>
              {confUI.label}
            </div>
          </>
        ) : (
          <div style={{ color:'var(--text2)', fontSize:15 }}>Δεν βρέθηκε πίνακας μεγεθών.</div>
        )}
      </div>

      {/* Show avatar button */}
      {result.fitAnalysis && (
        <button onClick={onShowAvatar} style={{ background: showAvatar ? 'var(--bg3)' : 'var(--bg2)', border:`1px solid ${showAvatar ? 'var(--accent)' : 'var(--border)'}`, color: showAvatar ? 'var(--accent)' : 'var(--text)', borderRadius:'var(--radius-sm)', padding:'13px', fontSize:14, fontWeight:600, cursor:'pointer', width:'100%' }}>
          {showAvatar ? '▲ Κλείσε Ανάλυση Σώματος' : '🧍 Δες Ανάλυση στο Avatar →'}
        </button>
      )}

      {/* Note & Warning */}
      {result.note && (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'13px 15px', fontSize:14, color:'var(--text)', lineHeight:1.6 }}>
          💡 {result.note}
        </div>
      )}
      {result.warning && (
        <div style={{ background:'#ff6b3515', border:'1px solid #ff6b3540', borderRadius:'var(--radius-sm)', padding:'13px 15px', fontSize:14, color:'var(--accent2)', lineHeight:1.6 }}>
          ⚠️ {result.warning}
        </div>
      )}

      {/* Size chart table */}
      {result.sizeChart?.length > 0 && (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:16 }}>
          <div style={{ fontSize:12, color:'var(--text2)', fontWeight:600, letterSpacing:0.5, marginBottom:12 }}>ΠΙΝΑΚΑΣ ΜΕΓΕΘΩΝ</div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr>
                  {Object.keys(result.sizeChart[0]).map(col => (
                    <th key={col} style={{ padding:'7px 10px', textAlign:'left', color:'var(--text2)', fontWeight:600, borderBottom:'1px solid var(--border)', whiteSpace:'nowrap' }}>
                      {col.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.sizeChart.map((row, i) => {
                  const isRec = row.size === result.recommendedSize
                  return (
                    <tr key={i} style={{ background: isRec ? 'rgba(200,255,0,0.08)' : 'transparent' }}>
                      {Object.entries(row).map(([col, val]) => (
                        <td key={col} style={{ padding:'9px 10px', borderBottom:'1px solid var(--border)', color: col==='size' && isRec ? 'var(--accent)' : 'var(--text)', fontWeight: col==='size' && isRec ? 700 : 400, whiteSpace:'nowrap' }}>
                          {col === 'size' && isRec ? `${val} ←` : val}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CTA */}
      <a href={originalUrl} target="_blank" rel="noopener noreferrer"
        style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'15px', borderRadius:'var(--radius-sm)', background:'var(--accent)', color:'#000', fontWeight:700, fontSize:16, textDecoration:'none', fontFamily:'var(--font-head)' }}>
        Πήγαινε στη σελίδα αγοράς →
      </a>
    </div>
  )
}

function LoadingState() {
  return (
    <div style={{ textAlign:'center', padding:'48px 0' }}>
      <div style={{ fontSize:40, marginBottom:16 }}>🔍</div>
      <div style={{ fontFamily:'var(--font-head)', fontSize:18, fontWeight:700 }}>Ανάλυση σελίδας...</div>
      <div style={{ color:'var(--text2)', fontSize:13, marginTop:8 }}>Διαβάζω πίνακα μεγεθών · Υπολογίζω το νούμερο σου</div>
      <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:20 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:'var(--accent)', animation:'pulse 1s ease-in-out infinite', animationDelay:`${i*.25}s` }} />
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.2;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )
}

function HowTo() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:8 }}>
      <div style={{ fontSize:12, color:'var(--text2)', fontWeight:700, letterSpacing:1, marginBottom:4 }}>ΠΩΣ ΛΕΙΤΟΥΡΓΕΙ</div>
      {[
        ['1','Βρίσκεις ρούχο στο Shein, Zara, H&M, κλπ.'],
        ['2','Κάνεις Share → SizeMe  ή  επικολλάς το link εδώ'],
        ['3','Το SizeMe διαβάζει τον πίνακα μεγεθών της σελίδας'],
        ['4','Βλέπεις το νούμερο σου + heatmap εφαρμογής στο avatar'],
      ].map(([n,t]) => (
        <div key={n} style={{ display:'flex', gap:14, alignItems:'flex-start', padding:'12px 14px', background:'var(--bg2)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)' }}>
          <div style={{ width:24, height:24, borderRadius:'50%', background:'var(--accent)', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0 }}>{n}</div>
          <div style={{ fontSize:14, lineHeight:1.4, paddingTop:2 }}>{t}</div>
        </div>
      ))}
    </div>
  )
}

function BackBtn() {
  const navigate = useNavigate()
  return <div onClick={() => navigate('/home')} style={{ color:'var(--text2)', marginBottom:16, cursor:'pointer', fontSize:14 }}>← Πίσω</div>
}
