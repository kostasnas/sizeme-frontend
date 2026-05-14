import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import PageShell from '../components/ui/PageShell'

const GENDER_OPTIONS = [
  { value:'female', label:'Γυναίκα',             icon:'♀' },
  { value:'male',   label:'Άντρας',               icon:'♂' },
  { value:'unisex', label:'Non-binary / Unisex',  icon:'◎' },
]

const CHILD_GENDERS = [
  { value:'girl', label:'Κορίτσι', icon:'👧' },
  { value:'boy',  label:'Αγόρι',   icon:'👦' },
]

export default function Profile() {
  const { profile, setProfile, isPro } = useAppStore()
  const { signOut } = useAuth()
  const navigate    = useNavigate()

  const [height, setHeight]   = useState(profile?.height_cm?.toString() || '')
  const [gender, setGender]   = useState(profile?.gender || '')
  const [saving, setSaving]   = useState(false)
  const [saved,  setSaved]    = useState(false)

  // Children profiles (stored in Supabase profiles.children_data JSON)
  const [children, setChildren] = useState(profile?.children_data || [])
  const [showAddChild, setShowAddChild] = useState(false)
  const [newChild, setNewChild] = useState({ name:'', age:'', gender:'girl' })

  const hasChanges =
    height !== (profile?.height_cm?.toString() || '') ||
    gender !== (profile?.gender || '')

  async function saveProfile() {
    if (saving) return
    setSaving(true)
    const updates = {}
    if (height) updates.height_cm = parseInt(height)
    if (gender) updates.gender    = gender
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', profile.id).select().single()
    setSaving(false)
    if (!error && data) { setProfile(data); setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  async function addChild() {
    if (!newChild.name || !newChild.age) return
    const updated = [...children, { ...newChild, id: Date.now() }]
    setChildren(updated)
    setShowAddChild(false)
    setNewChild({ name:'', age:'', gender:'girl' })
    await supabase.from('profiles').update({ children_data: updated }).eq('id', profile.id)
  }

  async function removeChild(id) {
    const updated = children.filter(c => c.id !== id)
    setChildren(updated)
    await supabase.from('profiles').update({ children_data: updated }).eq('id', profile.id)
  }

  async function handleSignOut() {
    await signOut()
    navigate('/auth')
  }

  return (
    <PageShell>
      <div style={{ padding:'24px 20px 0' }}>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:28, fontWeight:800, marginBottom:28 }}>Προφίλ</h1>

        {isPro && (
          <div style={{ background:'linear-gradient(135deg,#c8ff00,#7fff00)', borderRadius:'var(--radius)', padding:'14px 20px', marginBottom:24, display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:24 }}>✦</span>
            <div>
              <div style={{ fontWeight:800, color:'#000', fontFamily:'var(--font-head)' }}>Pro Member</div>
              <div style={{ fontSize:13, color:'#000a' }}>Unlimited scans ενεργά</div>
            </div>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* ── MY PROFILE ── */}
          <SectionLabel>ΤΟ ΠΡΟΦΙΛ ΜΟΥ</SectionLabel>

          <div style={card}>
            <Label>EMAIL</Label>
            <div style={{ color:'var(--text2)', fontSize:15 }}>{profile?.email}</div>
          </div>

          <div style={card}>
            <Label>ΥΨΟΣ</Label>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <input type="number" value={height} min={130} max={220}
                onChange={e => setHeight(e.target.value)}
                style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'10px 14px', color:'var(--text)', fontSize:22, fontWeight:700, fontFamily:'var(--font-head)', width:90, outline:'none', textAlign:'center' }}
              />
              <span style={{ color:'var(--text2)', fontSize:16 }}>cm</span>
            </div>
          </div>

          <div style={card}>
            <Label>ΦΥΛΟ</Label>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:4 }}>
              {GENDER_OPTIONS.map(({ value, label, icon }) => (
                <button key={value} onClick={() => setGender(value)} style={{
                  display:'flex', alignItems:'center', gap:14, padding:'12px 16px',
                  borderRadius:'var(--radius-sm)',
                  border:`1px solid ${gender===value ? 'var(--accent)' : 'var(--border)'}`,
                  background: gender===value ? 'rgba(200,255,0,0.08)' : 'var(--bg3)',
                  color: gender===value ? 'var(--accent)' : 'var(--text)',
                  cursor:'pointer', fontSize:15, fontWeight: gender===value ? 700 : 400,
                  WebkitTapHighlightColor:'transparent',
                }}>
                  <span style={{ fontSize:18, width:24, textAlign:'center' }}>{icon}</span>
                  <span>{label}</span>
                  {gender===value && <span style={{ marginLeft:'auto' }}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <button onClick={saveProfile} disabled={!hasChanges || saving} style={{
            background: hasChanges ? 'var(--accent)' : 'var(--bg3)',
            color: hasChanges ? '#000' : 'var(--text2)',
            border: hasChanges ? 'none' : '1px solid var(--border)',
            borderRadius:'var(--radius-sm)', padding:'15px', fontSize:16,
            fontWeight:700, fontFamily:'var(--font-head)', cursor: hasChanges ? 'pointer' : 'default',
            transition:'all 0.2s',
          }}>
            {saving ? 'Αποθήκευση...' : saved ? '✓ Αποθηκεύτηκε' : 'Αποθήκευση Αλλαγών'}
          </button>

          {/* ── CHILDREN PROFILES ── */}
          <SectionLabel style={{ marginTop:8 }}>ΠΑΙΔΙΚΑ ΠΡΟΦΙΛ</SectionLabel>

          {children.map(child => (
            <div key={child.id} style={{ ...card, display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'var(--bg3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>
                {child.gender === 'girl' ? '👧' : '👦'}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:16 }}>{child.name}</div>
                <div style={{ fontSize:13, color:'var(--text2)', marginTop:2 }}>{child.age} ετών</div>
              </div>
              <button onClick={() => removeChild(child.id)} style={{ background:'none', border:'none', color:'var(--text2)', fontSize:20, cursor:'pointer', padding:'4px 8px' }}>
                ✕
              </button>
            </div>
          ))}

          {showAddChild ? (
            <div style={{ ...card, display:'flex', flexDirection:'column', gap:12 }}>
              <Label>ΝΕΟΣ/ΝΕΑ ΜΙΚΡΟΣ/Η</Label>
              <input placeholder="Όνομα" value={newChild.name}
                onChange={e => setNewChild(p => ({ ...p, name: e.target.value }))}
                style={inputStyle}
              />
              <input type="number" placeholder="Ηλικία" value={newChild.age} min={1} max={17}
                onChange={e => setNewChild(p => ({ ...p, age: e.target.value }))}
                style={inputStyle}
              />
              <div style={{ display:'flex', gap:10 }}>
                {CHILD_GENDERS.map(({ value, label, icon }) => (
                  <button key={value} onClick={() => setNewChild(p => ({ ...p, gender: value }))} style={{
                    flex:1, padding:'10px', borderRadius:'var(--radius-sm)',
                    border:`1px solid ${newChild.gender===value ? 'var(--accent)' : 'var(--border)'}`,
                    background: newChild.gender===value ? 'rgba(200,255,0,0.08)' : 'var(--bg3)',
                    color: newChild.gender===value ? 'var(--accent)' : 'var(--text)',
                    cursor:'pointer', fontSize:15, fontWeight:600,
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  }}>
                    {icon} {label}
                  </button>
                ))}
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setShowAddChild(false)}
                  style={{ flex:1, background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text2)', borderRadius:'var(--radius-sm)', padding:'12px', fontSize:15, cursor:'pointer' }}>
                  Ακύρωση
                </button>
                <button onClick={addChild} disabled={!newChild.name || !newChild.age}
                  style={{ flex:2, background: (newChild.name && newChild.age) ? 'var(--accent)' : 'var(--bg3)', color: (newChild.name && newChild.age) ? '#000' : 'var(--text2)', border:'none', borderRadius:'var(--radius-sm)', padding:'12px', fontSize:15, fontWeight:700, cursor:'pointer' }}>
                  Προσθήκη
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddChild(true)} style={{
              background:'var(--bg2)', border:'1px dashed var(--border)',
              color:'var(--text2)', borderRadius:'var(--radius)', padding:'16px',
              fontSize:15, cursor:'pointer', width:'100%',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            }}>
              <span style={{ fontSize:20 }}>+</span> Προσθήκη Παιδιού
            </button>
          )}

          {/* ── PRO / SIGN OUT ── */}
          {!isPro && (
            <div onClick={() => navigate('/pro')} style={{ ...card, cursor:'pointer', border:'1px solid rgba(200,255,0,0.25)', marginTop:8 }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:700 }}>✦ Αναβάθμιση σε Pro</div>
              <div style={{ color:'var(--text2)', fontSize:13, marginTop:4 }}>Unlimited scans · €2.99/μήνα</div>
            </div>
          )}

          <button onClick={handleSignOut} style={{ background:'transparent', border:'1px solid var(--border)', color:'var(--danger)', borderRadius:'var(--radius-sm)', padding:'14px', fontSize:15, cursor:'pointer', marginTop:8 }}>
            Αποσύνδεση
          </button>

        </div>
      </div>
    </PageShell>
  )
}

function SectionLabel({ children, style }) {
  return <div style={{ fontSize:11, color:'var(--text2)', fontWeight:700, letterSpacing:1, marginTop:4, ...style }}>{children}</div>
}
function Label({ children }) {
  return <div style={{ fontSize:11, color:'var(--text2)', fontWeight:700, letterSpacing:0.8, marginBottom:10 }}>{children}</div>
}

const card       = { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'16px 20px' }
const inputStyle = { background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'12px 14px', color:'var(--text)', fontSize:16, outline:'none', width:'100%' }
