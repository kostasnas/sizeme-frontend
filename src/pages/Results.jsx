import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { buildAffiliateUrl } from '../services/sizeAI'
import { useAppStore } from '../store/useAppStore'
import BodyAvatar from '../components/ui/BodyAvatar'
import PageShell from '../components/ui/PageShell'

export default function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { profile } = useAppStore()
  const { results = [], scanType, measurements } = state || {}
  const [activeTab, setActiveTab] = useState('sizes') // 'sizes' | 'avatar'
  const [tryOnOutfit, setTryOnOutfit] = useState(null)

  if (!results || !results.length) {
    return (
      <PageShell>
        <BackBtn />
        <p style={{ color: 'var(--text2)' }}>Δεν υπάρχουν αποτελέσματα.</p>
      </PageShell>
    )
  }

  // Ομαδοποίηση ανά brand
  const grouped = {}
  for (const r of results) {
    if (!grouped[r.brand]) grouped[r.brand] = { brand: r.brand, brand_key: r.brand_key, items: [] }
    grouped[r.brand].items.push(r)
  }

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setTryOnOutfit(URL.createObjectURL(file))
    }
  }

  const onClearOutfit = () => setTryOnOutfit(null)

  return (
    <PageShell>
      <BackBtn />

      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
        {scanType === 'foot' ? '👟 Νούμερα Παπουτσιών' : '👕 Νούμερα Ρούχων'}
      </h1>
      <p style={{ color: 'var(--text2)', marginBottom: 24 }}>
        Με βάση τις μετρήσεις σου: {measurements?.bust_cm || measurements?.foot_length_left}cm
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'var(--bg2)', padding: 4, borderRadius: 12 }}>
        <button 
          onClick={() => setActiveTab('sizes')}
          style={{ 
            flex: 1, padding: '10px', borderRadius: 8, border: 'none',
            background: activeTab === 'sizes' ? 'var(--bg)' : 'transparent',
            color: activeTab === 'sizes' ? 'var(--text)' : 'var(--text2)',
            fontWeight: 600, cursor: 'pointer'
          }}
        >
          Προτάσεις
        </button>
        <button 
          onClick={() => setActiveTab('avatar')}
          style={{ 
            flex: 1, padding: '10px', borderRadius: 8, border: 'none',
            background: activeTab === 'avatar' ? 'var(--bg)' : 'transparent',
            color: activeTab === 'avatar' ? 'var(--text)' : 'var(--text2)',
            fontWeight: 600, cursor: 'pointer'
          }}
        >
          Virtual Try-On
        </button>
      </div>

      {activeTab === 'sizes' ? (
        <div style={{ display: 'grid', gap: 16 }}>
          {Object.values(grouped).map(group => (
            <div key={group.brand} style={{ background: 'var(--bg2)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h3 style={{ marginBottom: 12, fontSize: 18 }}>{group.brand}</h3>
              {group.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: idx > 0 ? '1px solid var(--border)' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.category}</div>
                    <div style={{ fontSize: 20, color: 'var(--accent)', fontWeight: 800 }}>{item.size_label}</div>
                  </div>
                  <a 
                    href={buildAffiliateUrl(item.brand_key, item.category)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ background: 'var(--text)', color: 'var(--bg)', padding: '6px 12px', borderRadius: 6, fontSize: 12, textDecoration: 'none', fontWeight: 700 }}
                  >
                    ΑΓΟΡΑ →
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <BodyAvatar measurements={measurements} outfit={tryOnOutfit} />
          
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px', borderRadius: 'var(--radius-sm)',
              background: 'var(--accent)', color: '#000',
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
              fontFamily: 'var(--font-head)',
            }}>
              📸 Ανέβασε φωτογραφία ρούχου
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
            </label>

            {tryOnOutfit && (
              <button onClick={onClearOutfit} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)',
                borderRadius: 'var(--radius-sm)', padding: '12px', fontSize: 14, cursor: 'pointer',
              }}>
                ✕ Αφαίρεση ρούχου
              </button>
            )}
          </div>

          <div style={{ marginTop: 16, padding: '12px', background: 'var(--bg2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
            💡 <strong>Tip:</strong> Για καλύτερο αποτέλεσμα, ανέβασε φωτογραφία του ρούχου σε λευκό φόντο.
          </div>
        </div>
      )}
    </PageShell>
  )
}

function BackBtn() {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate('/home')}
      style={{ color: 'var(--text2)', marginBottom: 16, cursor: 'pointer', fontSize: 14 }}>
      ← Πίσω
    </div>
  )
}