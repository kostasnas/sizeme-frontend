import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { getLatestScans } from '../services/scanService'
import { findSize, BRANDS_LIST } from '../lib/sizeCharts'
import PageShell from '../components/ui/PageShell'

export default function History() {
  const { user } = useAppStore()
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    getLatestScans(user.id, 20).then(data => {
      setScans(data || [])
      setLoading(false)
    })
  }, [user])

  function viewResults(scan) {
    // Rebuild results from stored measurements
    if (scan.scan_type === 'body') {
      const measurements = {
        bust_cm:           scan.bust_cm,
        waist_cm:          scan.waist_cm,
        hips_cm:           scan.hips_cm,
        shoulder_width_cm: scan.shoulder_width_cm,
        inseam_cm:         scan.inseam_cm,
      }
      const clothingBrands = BRANDS_LIST.filter(b => !['nike','adidas'].includes(b.key))
      const results = []
      for (const brand of clothingBrands) {
        const top    = findSize(brand.key, 'tops',    measurements)
        const bottom = findSize(brand.key, 'bottoms', measurements)
        if (top)    results.push({ brand: brand.name, brand_key: brand.key, category: 'tops',    ...top })
        if (bottom) results.push({ brand: brand.name, brand_key: brand.key, category: 'bottoms', ...bottom })
      }
      navigate('/results', { state: { results, scanType: 'body', measurements } })
    } else {
      const measurements = {
        left:  { length_mm: scan.foot_length_left  * 10, width_mm: scan.foot_width_left  * 10, is_wide: scan.foot_notes?.includes('πλατύ'), width_category: scan.foot_notes?.includes('πλατύ') ? 'wide' : 'standard' },
        right: { length_mm: scan.foot_length_right * 10, width_mm: scan.foot_width_right * 10, is_wide: false, width_category: 'standard' },
      }
      const dominant = measurements.right.length_mm >= measurements.left.length_mm ? measurements.right : measurements.left
      const results = ['nike','adidas'].map(brandKey => {
        const size = findSize(brandKey, 'shoes', { foot_length_mm: dominant.length_mm, is_wide: dominant.is_wide })
        return size ? { ...size, brand_key: brandKey, category: 'shoes' } : null
      }).filter(Boolean)
      navigate('/results', { state: { results, scanType: 'foot', measurements } })
    }
  }

  return (
    <PageShell>
      <div style={{ padding:'24px 20px 0' }}>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:28, fontWeight:800, marginBottom:24 }}>Ιστορικό</h1>

        {loading ? (
          <div style={{ color:'var(--text2)', textAlign:'center', paddingTop:40 }}>Φόρτωση...</div>
        ) : scans.length === 0 ? (
          <div style={{ textAlign:'center', paddingTop:60 }}>
            <div style={{ fontSize:48 }}>📭</div>
            <p style={{ color:'var(--text2)', marginTop:12 }}>Δεν έχεις κάνει scan ακόμα.</p>
            <button onClick={() => navigate('/home')} style={{ ...btnStyle, marginTop:20, width:'auto', padding:'12px 28px' }}>
              Κάνε το πρώτο Scan
            </button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {scans.map(scan => (
              <ScanHistoryCard
                key={scan.id}
                scan={scan}
                isExpanded={expanded === scan.id}
                onToggle={() => setExpanded(expanded === scan.id ? null : scan.id)}
                onViewResults={() => viewResults(scan)}
              />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}

function ScanHistoryCard({ scan, isExpanded, onToggle, onViewResults }) {
  const isBody = scan.scan_type === 'body'
  const date   = new Date(scan.created_at).toLocaleDateString('el-GR', { day:'numeric', month:'short', year:'numeric' })
  const time   = new Date(scan.created_at).toLocaleTimeString('el-GR', { hour:'2-digit', minute:'2-digit' })

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', overflow: 'hidden',
      transition: 'border-color 0.15s',
    }}>
      {/* Header row — always visible, tappable */}
      <div onClick={onToggle} style={{
        display:'flex', alignItems:'center', gap:14,
        padding:'16px 18px', cursor:'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}>
        <div style={{
          width:44, height:44, borderRadius:12,
          background: isBody ? 'rgba(200,255,0,0.1)' : 'rgba(255,107,53,0.1)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:22, flexShrink:0,
        }}>
          {isBody ? '👕' : '👟'}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:15 }}>
            {isBody ? 'Body Scan' : 'Foot Scan'}
          </div>
          <div style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>
            {date} · {time}
          </div>
        </div>
        <div style={{ color:'var(--text2)', fontSize:18, transition:'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
          ›
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div style={{ padding:'0 18px 18px', borderTop:'1px solid var(--border)' }}>
          <div style={{ paddingTop:16 }}>
            {isBody && (
              <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:16 }}>
                {[
                  ['Στήθος', scan.bust_cm, 'cm'],
                  ['Μέση',   scan.waist_cm, 'cm'],
                  ['Γοφοί',  scan.hips_cm, 'cm'],
                  ['Ώμοι',   scan.shoulder_width_cm, 'cm'],
                ].filter(([,v]) => v).map(([l,v,u]) => (
                  <div key={l} style={{ textAlign:'center', minWidth:60 }}>
                    <div style={{ fontFamily:'var(--font-head)', fontSize:20, fontWeight:800, color:'var(--accent)' }}>{v}</div>
                    <div style={{ fontSize:11, color:'var(--text2)' }}>{l} {u}</div>
                  </div>
                ))}
              </div>
            )}
            {!isBody && (
              <div style={{ display:'flex', gap:20, marginBottom:16 }}>
                {[
                  ['Αριστερό', scan.foot_length_left, scan.foot_width_left],
                  ['Δεξί',     scan.foot_length_right, scan.foot_width_right],
                ].filter(([,l]) => l).map(([label, length, width]) => (
                  <div key={label}>
                    <div style={{ fontSize:12, color:'var(--text2)', marginBottom:4 }}>{label}</div>
                    <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:18, color:'var(--accent2)' }}>
                      {(length * 10).toFixed(0)}mm
                    </div>
                    <div style={{ fontSize:11, color:'var(--text2)' }}>πλάτος {(width * 10).toFixed(0)}mm</div>
                  </div>
                ))}
              </div>
            )}
            {scan.foot_notes && (
              <div style={{ fontSize:13, color:'var(--accent2)', marginBottom:12 }}>⚠️ {scan.foot_notes}</div>
            )}
            <button onClick={onViewResults} style={btnStyle}>
              Δες Νούμερα →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const btnStyle = { background:'var(--accent)', color:'#000', border:'none', borderRadius:'var(--radius-sm)', padding:'13px 20px', fontSize:15, fontWeight:700, fontFamily:'var(--font-head)', cursor:'pointer', width:'100%' }
