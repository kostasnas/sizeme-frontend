/**
 * BodyAvatar v4 — Realistic human silhouette SVG
 * - Smooth bezier curves για ανθρώπινο σχήμα
 * - Ανεξάρτητο scaling ανά body zone (bust/waist/hips)
 * - Heatmap overlay: κόκκινο=στενό, πράσινο=ιδανικό, κίτρινο=χαλαρό
 * - Outfit image overlay clipped στο σώμα
 */

export default function BodyAvatar({
  measurements,           // { bust_cm, waist_cm, hips_cm, shoulder_width_cm, inseam_cm }
  gender = 'female',
  outfit = null,          // { imageUrl } — virtual try-on
  fitAnalysis = null,     // { bust: 'tight'|'perfect'|'loose', waist: ..., hips: ... }
  size = 400,
}) {
  if (!measurements) return null

  const isFemale = gender !== 'male'

  // Canvas dimensions
  const H = size
  const W = size * 0.54

  // Reference proportions (average body)
  const REF = isFemale
    ? { bust: 90, waist: 70, hips: 97, shoulder: 38 }
    : { bust: 98, waist: 84, hips: 96, shoulder: 44 }

  // Scale factors — clamped to avoid extreme distortion
  const bS  = clamp((measurements.bust_cm           || REF.bust)     / REF.bust,     0.75, 1.35)
  const wS  = clamp((measurements.waist_cm          || REF.waist)    / REF.waist,    0.75, 1.35)
  const hS  = clamp((measurements.hips_cm           || REF.hips)     / REF.hips,     0.75, 1.35)
  const shS = clamp((measurements.shoulder_width_cm || REF.shoulder) / REF.shoulder, 0.75, 1.35)

  const cx = W / 2

  // ── Vertical layout ─────────────────────────────────────────
  const headR    = W * 0.135
  const headCY   = H * 0.076

  const neckW    = W * 0.055
  const neckT    = headCY + headR * 0.85
  const neckB    = headCY + headR * 1.78

  const shouldY  = neckB   + H * 0.009
  const shouldW  = W * 0.385 * shS

  const bustY    = shouldY + H * 0.075
  const bustW    = W * 0.305 * bS

  const ubY      = bustY   + H * 0.052   // under-bust
  const ubW      = bustW   * 0.875

  const waistY   = shouldY + H * 0.185
  const waistW   = W * 0.228 * wS

  const htY      = waistY  + H * 0.044   // hip top
  const htW      = W * 0.282 * hS

  const hipsY    = waistY  + H * 0.115
  const hipsW    = W * 0.340 * hS

  const crotchY  = shouldY + H * 0.400
  const kneeY    = crotchY + H * 0.185
  const calfY    = crotchY + H * 0.270
  const ankleY   = crotchY + H * 0.345
  const toeY     = ankleY  + H * 0.028

  const thighW   = hipsW  * 0.372
  const kneeW    = thighW * 0.700
  const calfW    = thighW * 0.730
  const ankleW   = thighW * 0.430

  const armW     = W * 0.082
  const armLen   = H * 0.248
  const lAX      = cx - shouldW - W * 0.006
  const rAX      = cx + shouldW + W * 0.006

  // Outfit clip divider
  const divY = waistY + H * 0.016

  // ── Heatmap colors ──────────────────────────────────────────
  const HM = {
    tight:   'rgba(255, 60, 60,  0.52)',
    perfect: 'rgba(80, 220, 100, 0.42)',
    loose:   'rgba(255, 200, 0,  0.38)',
    none:    'transparent',
  }

  const bustHeat  = fitAnalysis?.bust  ? HM[fitAnalysis.bust]  : HM.none
  const waistHeat = fitAnalysis?.waist ? HM[fitAnalysis.waist] : HM.none
  const hipsHeat  = fitAnalysis?.hips  ? HM[fitAnalysis.hips]  : HM.none

  // ── Torso path ───────────────────────────────────────────────
  const torso = `
    M ${cx - neckW} ${neckB}
    C ${cx - neckW*2}   ${shouldY - H*.004},
      ${cx - shouldW*.9} ${shouldY - H*.004},
      ${cx - shouldW}   ${shouldY}
    C ${cx - bustW*1.08} ${bustY - H*.008},
      ${cx - bustW}     ${bustY},
      ${cx - ubW}       ${ubY}
    C ${cx - waistW*1.1} ${waistY - H*.018},
      ${cx - waistW}    ${waistY},
      ${cx - htW}       ${htY}
    C ${cx - hipsW*1.02} ${hipsY - H*.008},
      ${cx - hipsW}     ${hipsY},
      ${cx - hipsW*.57} ${crotchY}
    Q ${cx} ${crotchY + H*.013} ${cx + hipsW*.57} ${crotchY}
    C ${cx + hipsW}     ${hipsY},
      ${cx + hipsW*1.02} ${hipsY - H*.008},
      ${cx + htW}       ${htY}
    C ${cx + waistW}    ${waistY},
      ${cx + waistW*1.1} ${waistY - H*.018},
      ${cx + ubW}       ${ubY}
    C ${cx + bustW}     ${bustY},
      ${cx + bustW*1.08} ${bustY - H*.008},
      ${cx + shouldW}   ${shouldY}
    C ${cx + shouldW*.9} ${shouldY - H*.004},
      ${cx + neckW*2}   ${shouldY - H*.004},
      ${cx + neckW}     ${neckB}
    Z`

  // ── Leg paths ────────────────────────────────────────────────
  function legPath(side) {
    const s = side === 'left' ? -1 : 1
    return `
      M ${cx + s*hipsW*.57} ${crotchY}
      C ${cx + s*thighW*1.04} ${crotchY + H*.038},
        ${cx + s*thighW}      ${kneeY - H*.048},
        ${cx + s*kneeW}       ${kneeY}
      C ${cx + s*calfW*1.02}  ${calfY - H*.008},
        ${cx + s*calfW}       ${calfY},
        ${cx + s*ankleW}      ${ankleY}
      L ${cx + s*ankleW*1.07} ${toeY}
      L ${cx + s*ankleW*.04}  ${toeY}
      L ${cx - s*ankleW*.1}   ${ankleY}
      C ${cx - s*ankleW*.55}  ${calfY},
        ${cx - s*ankleW*.6}   ${kneeY},
        ${cx - s*kneeW*.04}   ${kneeY}
      C ${cx + s*thighW*.08}  ${crotchY + H*.038},
        ${cx + s*hipsW*.06}   ${crotchY + H*.008},
        ${cx}                 ${crotchY}
      Z`
  }

  // ── Arm paths ────────────────────────────────────────────────
  function armPath(side) {
    const s  = side === 'left' ? -1 : 1
    const ax = side === 'left' ? lAX : rAX
    return `
      M ${cx + s*(shouldW - armW*.4)} ${shouldY}
      C ${ax + s*armW*.35} ${shouldY + H*.018},
        ${ax + s*armW*.88} ${shouldY + armLen - H*.055},
        ${ax + s*armW*.72} ${shouldY + armLen}
      C ${ax + s*armW*.18} ${shouldY + armLen + H*.01},
        ${ax - s*armW*.6}  ${shouldY + H*.028},
        ${cx + s*(shouldW - armW*1.1)} ${shouldY + H*.004}
      Z`
  }

  // ── Colors ───────────────────────────────────────────────────
  const skinTone  = isFemale ? '#d4956a' : '#c07a4f'
  const clothTop  = isFemale ? '#9b72cf' : '#5b7fc4'
  const clothBot  = isFemale ? '#5a4a9e' : '#3a5180'
  const shoeCol   = '#2a2035'
  const hairCol   = '#2c1810'

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W * (size / H)}
      height={size}
      style={{ display:'block', margin:'0 auto', filter:'drop-shadow(0 12px 36px rgba(0,0,0,0.5))' }}
    >
      <defs>
        {/* Skin gradient */}
        <linearGradient id="av-skin" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"   stopColor="#a05830" />
          <stop offset="22%"  stopColor={skinTone} />
          <stop offset="50%"  stopColor="#e8b080" />
          <stop offset="78%"  stopColor={skinTone} />
          <stop offset="100%" stopColor="#a05830" />
        </linearGradient>
        {/* Cloth top gradient */}
        <linearGradient id="av-ctop" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"   stopColor={shade(clothTop, -30)} />
          <stop offset="35%"  stopColor={clothTop} />
          <stop offset="65%"  stopColor={clothTop} />
          <stop offset="100%" stopColor={shade(clothTop, -30)} />
        </linearGradient>
        {/* Cloth bottom gradient */}
        <linearGradient id="av-cbot" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"   stopColor={shade(clothBot, -25)} />
          <stop offset="40%"  stopColor={clothBot} />
          <stop offset="60%"  stopColor={clothBot} />
          <stop offset="100%" stopColor={shade(clothBot, -25)} />
        </linearGradient>
        {/* Sheen overlay */}
        <linearGradient id="av-sheen" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.15)" />
          <stop offset="50%"  stopColor="rgba(255,255,255,0.03)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
        </linearGradient>
        {/* Drop shadow for outfit */}
        <filter id="av-oshadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" />
        </filter>
        {/* Clip paths */}
        <clipPath id="av-torso-clip"><path d={torso} /></clipPath>
        <clipPath id="av-top-clip">
          <rect x={0} y={0} width={W} height={divY} />
        </clipPath>
        <clipPath id="av-bot-clip">
          <rect x={0} y={divY} width={W} height={H - divY} />
        </clipPath>
        <clipPath id="av-bust-zone">
          <rect x={cx - bustW*1.1} y={shouldY} width={bustW*2.2} height={ubY - shouldY + H*.02} />
        </clipPath>
        <clipPath id="av-waist-zone">
          <rect x={cx - waistW*1.2} y={ubY} width={waistW*2.4} height={htY - ubY + H*.01} />
        </clipPath>
        <clipPath id="av-hips-zone">
          <rect x={cx - hipsW*1.1} y={htY} width={hipsW*2.2} height={crotchY - htY + H*.01} />
        </clipPath>
      </defs>

      {/* ── LEGS ── */}
      <path d={legPath('left')}  fill="url(#av-cbot)" />
      <path d={legPath('right')} fill="url(#av-cbot)" />
      <path d={legPath('left')}  fill="url(#av-sheen)" opacity={0.4} />
      <path d={legPath('right')} fill="url(#av-sheen)" opacity={0.4} />

      {/* Knee highlights */}
      <ellipse cx={cx - kneeW*.5} cy={kneeY} rx={kneeW*.24} ry={kneeW*.15} fill="rgba(255,255,255,0.12)" />
      <ellipse cx={cx + kneeW*.5} cy={kneeY} rx={kneeW*.24} ry={kneeW*.15} fill="rgba(255,255,255,0.12)" />

      {/* Shoes */}
      <ellipse cx={cx - ankleW*.57} cy={toeY + H*.007} rx={ankleW*1.08} ry={H*.013} fill={shoeCol} />
      <ellipse cx={cx + ankleW*.57} cy={toeY + H*.007} rx={ankleW*1.08} ry={H*.013} fill={shoeCol} />

      {/* ── ARMS (skin — behind torso) ── */}
      <path d={armPath('left')}  fill="url(#av-skin)" />
      <path d={armPath('right')} fill="url(#av-skin)" />
      {/* Sleeve top (cloth overlay on upper arm) */}
      <path d={armPath('left')}  fill="url(#av-ctop)" opacity={0.7}
        clipPath={`inset(0 0 ${H - shouldY - H*.1}px 0 round 0)`} />
      <path d={armPath('right')} fill="url(#av-ctop)" opacity={0.7}
        clipPath={`inset(0 0 ${H - shouldY - H*.1}px 0 round 0)`} />

      {/* ── TORSO bottom ── */}
      <g clipPath="url(#av-bot-clip)">
        <path d={torso} fill="url(#av-cbot)" />
        <path d={torso} fill="url(#av-sheen)" />
      </g>

      {/* ── TORSO top ── */}
      <g clipPath="url(#av-top-clip)">
        <path d={torso} fill="url(#av-ctop)" />
        <path d={torso} fill="url(#av-sheen)" />
      </g>

      {/* ── HEATMAP ZONES (fit analysis) ── */}
      {fitAnalysis && (
        <>
          {/* Bust zone */}
          <g clipPath="url(#av-bust-zone)">
            <path d={torso} fill={bustHeat} />
          </g>
          {/* Waist zone */}
          <g clipPath="url(#av-waist-zone)">
            <path d={torso} fill={waistHeat} />
          </g>
          {/* Hips zone */}
          <g clipPath="url(#av-hips-zone)">
            <path d={torso} fill={hipsHeat} />
          </g>
        </>
      )}

      {/* ── OUTFIT image overlay ── */}
      {outfit?.imageUrl && (
        <>
          <image
            href={outfit.imageUrl}
            x={cx - shouldW}
            y={shouldY}
            width={shouldW * 2}
            height={divY - shouldY + H * 0.01}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#av-torso-clip)"
            filter="url(#av-oshadow)"
            opacity={0.88}
          />
          <path d={torso} fill="rgba(255,255,255,0.06)" />
        </>
      )}

      {/* Female bust detail */}
      {isFemale && !outfit && (
        <>
          <ellipse cx={cx - bustW*.27} cy={bustY + H*.016}
            rx={bustW*.185} ry={bustW*.135} fill="rgba(0,0,0,0.09)"
            clipPath="url(#av-top-clip)" />
          <ellipse cx={cx + bustW*.27} cy={bustY + H*.016}
            rx={bustW*.185} ry={bustW*.135} fill="rgba(0,0,0,0.09)"
            clipPath="url(#av-top-clip)" />
        </>
      )}

      {/* Waistband */}
      <path d={`M ${cx - waistW*.9} ${divY} Q ${cx} ${divY + H*.004} ${cx + waistW*.9} ${divY}`}
        fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={H*.007} strokeLinecap="round"
        clipPath="url(#av-torso-clip)" />

      {/* ── NECK ── */}
      <path d={`M ${cx-neckW} ${neckT} L ${cx-neckW*.9} ${neckB} L ${cx+neckW*.9} ${neckB} L ${cx+neckW} ${neckT} Z`}
        fill="url(#av-skin)" />

      {/* ── HEAD ── */}
      {/* Hair back */}
      {isFemale && (
        <ellipse cx={cx} cy={headCY + headR*.15} rx={headR*1.06} ry={headR*1.28} fill={hairCol} />
      )}

      {/* Face */}
      <ellipse cx={cx} cy={headCY} rx={headR} ry={headR*1.1} fill="url(#av-skin)" />

      {/* Hair top */}
      {isFemale ? (
        <>
          <ellipse cx={cx} cy={headCY - headR*.7} rx={headR*1.02} ry={headR*.55} fill={hairCol} />
          {/* Side hair */}
          {[-1,1].map(s => (
            <path key={s} d={`
              M ${cx + s*headR*1.02} ${headCY - headR*.12}
              C ${cx + s*headR*1.18} ${headCY + headR*.7},
                ${cx + s*headR*1.1}  ${headCY + headR*1.5},
                ${cx + s*headR*.9}   ${headCY + headR*2.0}
              C ${cx + s*headR*.78}  ${headCY + headR*2.2},
                ${cx + s*headR*.66}  ${headCY + headR*2.0},
                ${cx + s*headR*.7}   ${headCY + headR*1.82}
              C ${cx + s*headR*.78}  ${headCY + headR*1.2},
                ${cx + s*headR*.86}  ${headCY + headR*.5},
                ${cx + s*headR*.82}  ${headCY - headR*.1}
              Z`}
              fill={hairCol} />
          ))}
        </>
      ) : (
        <ellipse cx={cx} cy={headCY - headR*.65} rx={headR*1.0} ry={headR*.5} fill={hairCol} />
      )}

      {/* ── FACE DETAILS ── */}
      {/* Eyebrows */}
      {[-1,1].map(s => (
        <path key={s}
          d={`M ${cx+s*headR*.44} ${headCY-headR*.28} Q ${cx+s*headR*.27} ${headCY-headR*.35} ${cx+s*headR*.1} ${headCY-headR*.28}`}
          fill="none" stroke={hairCol} strokeWidth={headR*.062} strokeLinecap="round" />
      ))}

      {/* Eyes — almond shape */}
      {[-1,1].map(s => (
        <g key={s}>
          <path d={`M ${cx+s*headR*.44} ${headCY-headR*.1}
            Q ${cx+s*headR*.27} ${headCY-headR*.2} ${cx+s*headR*.1} ${headCY-headR*.1}
            Q ${cx+s*headR*.27} ${headCY-headR*.01} ${cx+s*headR*.44} ${headCY-headR*.1} Z`}
            fill="white" />
          <circle cx={cx+s*headR*.27} cy={headCY-headR*.1} r={headR*.09} fill="#1a0e06" />
          <circle cx={cx+s*headR*.23} cy={headCY-headR*.13} r={headR*.027} fill="white" opacity={0.9} />
          <path d={`M ${cx+s*headR*.44} ${headCY-headR*.1}
            Q ${cx+s*headR*.27} ${headCY-headR*.21} ${cx+s*headR*.1} ${headCY-headR*.1}`}
            fill="none" stroke="#1a0e06" strokeWidth={headR*.038} strokeLinecap="round" />
        </g>
      ))}

      {/* Nose */}
      <path d={`M ${cx-headR*.06} ${headCY+headR*.04} Q ${cx} ${headCY+headR*.17} ${cx+headR*.06} ${headCY+headR*.04}`}
        fill="none" stroke="rgba(100,60,20,0.45)" strokeWidth={headR*.052} strokeLinecap="round" />
      <path d={`M ${cx-headR*.12} ${headCY+headR*.18} Q ${cx-headR*.07} ${headCY+headR*.22} ${cx} ${headCY+headR*.2}`}
        fill="none" stroke="rgba(100,60,20,0.4)" strokeWidth={headR*.038} strokeLinecap="round" />
      <path d={`M ${cx+headR*.12} ${headCY+headR*.18} Q ${cx+headR*.07} ${headCY+headR*.22} ${cx} ${headCY+headR*.2}`}
        fill="none" stroke="rgba(100,60,20,0.4)" strokeWidth={headR*.038} strokeLinecap="round" />

      {/* Lips */}
      <path d={`M ${cx-headR*.21} ${headCY+headR*.34}
        Q ${cx} ${headCY+headR*.27} ${cx+headR*.21} ${headCY+headR*.34}`}
        fill="none" stroke="#b05050" strokeWidth={headR*.042} strokeLinecap="round" />
      <path d={`M ${cx-headR*.21} ${headCY+headR*.34}
        Q ${cx-headR*.09} ${headCY+headR*.42} ${cx} ${headCY+headR*.41}
        Q ${cx+headR*.09} ${headCY+headR*.42} ${cx+headR*.21} ${headCY+headR*.34}`}
        fill="#c06060" opacity={0.82} />

      {/* Cheek blush (female) */}
      {isFemale && [-1,1].map(s => (
        <ellipse key={s} cx={cx+s*headR*.57} cy={headCY+headR*.14}
          rx={headR*.17} ry={headR*.09} fill="#e07070" opacity={0.2} />
      ))}

      {/* ── MEASUREMENT LINES (only without outfit) ── */}
      {!outfit && !fitAnalysis && (
        <>
          {measurements.bust_cm && (
            <line x1={cx-bustW*.88} y1={bustY+H*.01} x2={cx+bustW*.88} y2={bustY+H*.01}
              stroke="rgba(200,255,0,0.28)" strokeWidth={1} strokeDasharray="3,3" />
          )}
          {measurements.waist_cm && (
            <line x1={cx-waistW*.88} y1={waistY} x2={cx+waistW*.88} y2={waistY}
              stroke="rgba(200,255,0,0.2)" strokeWidth={1} strokeDasharray="3,3" />
          )}
          {measurements.hips_cm && (
            <line x1={cx-hipsW*.88} y1={hipsY} x2={cx+hipsW*.88} y2={hipsY}
              stroke="rgba(200,255,0,0.2)" strokeWidth={1} strokeDasharray="3,3" />
          )}
        </>
      )}

      {/* ── HEATMAP LEGEND ── */}
      {fitAnalysis && (
        <g transform={`translate(${W - 14}, ${H*.32})`}>
          {[
            ['#ff3c3c', 'Στενό'],
            ['#50dc64', 'Ιδανικό'],
            ['#ffc800', 'Χαλαρό'],
          ].map(([color, label], i) => (
            <g key={label} transform={`translate(0, ${i * 18})`}>
              <rect x={-8} y={-7} width={8} height={8} rx={2} fill={color} opacity={0.85} />
            </g>
          ))}
        </g>
      )}
    </svg>
  )
}

function clamp(v, mn, mx) { return Math.min(Math.max(v, mn), mx) }

// Darken a hex color by amt (0-255)
function shade(hex, amt) {
  const n = parseInt(hex.replace('#',''), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt))
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt))
  return `rgb(${r},${g},${b})`
}
