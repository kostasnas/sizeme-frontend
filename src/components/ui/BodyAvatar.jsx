/**
 * BodyAvatar — SVG avatar που αλλάζει αναλογίες βάσει μετρήσεων.
 * Props:
 *   measurements: { bust_cm, waist_cm, hips_cm, shoulder_width_cm, inseam_cm }
 *   gender: 'female' | 'male' | 'unisex'
 *   outfit: null | { imageUrl, category } — virtual try-on overlay
 *   size: number (default 280, το width του SVG)
 */
export default function BodyAvatar({ measurements, gender = 'female', outfit = null, size = 280 }) {
  if (!measurements) return null

  const isFemale = gender !== 'male'
  const h = size
  const w = size * 0.6

  // Normalize measurements to SVG units
  // Reference: average female bust=90, waist=72, hips=98
  const REF = isFemale
    ? { bust: 90, waist: 72, hips: 98, shoulder: 38 }
    : { bust: 98, waist: 84, hips: 96, shoulder: 44 }

  const bustScale      = clamp((measurements.bust_cm      || REF.bust)      / REF.bust,      0.75, 1.35)
  const waistScale     = clamp((measurements.waist_cm     || REF.waist)     / REF.waist,     0.75, 1.35)
  const hipsScale      = clamp((measurements.hips_cm      || REF.hips)      / REF.hips,      0.75, 1.35)
  const shoulderScale  = clamp((measurements.shoulder_width_cm || REF.shoulder) / REF.shoulder, 0.75, 1.35)

  // SVG coordinate system — body occupies center column
  const cx = w / 2
  const headR  = w * 0.13
  const headCY = h * 0.10

  // Neck
  const neckTop    = headCY + headR
  const neckBottom = headCY + headR * 2.2
  const neckW      = w * 0.06

  // Shoulders
  const shoulderY  = neckBottom
  const shoulderW  = w * 0.38 * shoulderScale

  // Bust (widest point of chest)
  const bustY = shoulderY + h * 0.10
  const bustW = w * 0.30 * bustScale

  // Waist
  const waistY = shoulderY + h * 0.22
  const waistW = w * 0.22 * waistScale

  // Hips
  const hipsY = shoulderY + h * 0.33
  const hipsW = w * 0.33 * hipsScale

  // Crotch
  const crotchY = shoulderY + h * 0.42

  // Knees
  const kneeY = crotchY + h * 0.18

  // Ankles
  const ankleY = crotchY + h * 0.36

  // Arms
  const armTopY    = shoulderY
  const armBottomY = waistY + h * 0.12
  const armOutX    = cx + shoulderW + w * 0.06

  // Skin & outfit colors
  const skinColor    = '#e8c9a8'
  const skinDark     = '#d4a97a'
  const hairColor    = '#3d2b1f'
  const outfitTop    = outfit ? 'url(#outfitTopPattern)' : (isFemale ? '#c8a2c8' : '#6b8cba')
  const outfitBottom = outfit ? 'url(#outfitBottomPattern)' : (isFemale ? '#7b68ee' : '#4a5568')
  const shoeColor    = '#2d3748'

  // Body torso path (smooth bezier)
  const torsoPath = [
    `M ${cx - neckW} ${neckBottom}`,
    // left shoulder sweep
    `C ${cx - neckW * 2} ${shoulderY}, ${cx - shoulderW} ${shoulderY}, ${cx - shoulderW} ${shoulderY}`,
    // left side: shoulder → bust → waist → hips → crotch
    `C ${cx - bustW * 1.1} ${bustY}, ${cx - waistW} ${waistY}, ${cx - waistW} ${waistY}`,
    `C ${cx - hipsW * 0.9} ${waistY + (hipsY - waistY) * 0.5}, ${cx - hipsW} ${hipsY}, ${cx - hipsW} ${hipsY}`,
    `L ${cx - hipsW * 0.6} ${crotchY}`,
    // crotch curve
    `Q ${cx} ${crotchY + h * 0.02} ${cx + hipsW * 0.6} ${crotchY}`,
    // right side (mirror)
    `L ${cx + hipsW} ${hipsY}`,
    `C ${cx + hipsW * 0.9} ${hipsY}, ${cx + waistW} ${waistY + (hipsY - waistY) * 0.5}, ${cx + waistW} ${waistY}`,
    `C ${cx + waistW} ${waistY}, ${cx + bustW * 1.1} ${bustY}, ${cx + shoulderW} ${shoulderY}`,
    `C ${cx + shoulderW} ${shoulderY}, ${cx + neckW * 2} ${shoulderY}, ${cx + neckW} ${neckBottom}`,
    'Z'
  ].join(' ')

  // Waist line (divides top/bottom outfit)
  const outfitDivideY = waistY + (hipsY - waistY) * 0.15

  // Left leg path
  const leftLegPath = [
    `M ${cx - hipsW * 0.6} ${crotchY}`,
    `C ${cx - hipsW * 0.5} ${crotchY + h * 0.05}, ${cx - hipsW * 0.38} ${kneeY - h * 0.04}, ${cx - hipsW * 0.32} ${kneeY}`,
    `C ${cx - hipsW * 0.28} ${kneeY + h * 0.04}, ${cx - hipsW * 0.24} ${ankleY - h * 0.04}, ${cx - hipsW * 0.2} ${ankleY}`,
    `L ${cx - hipsW * 0.32} ${ankleY}`,
    `C ${cx - hipsW * 0.36} ${ankleY - h * 0.04}, ${cx - hipsW * 0.4} ${kneeY + h * 0.04}, ${cx - hipsW * 0.44} ${kneeY}`,
    `C ${cx - hipsW * 0.5} ${kneeY - h * 0.04}, ${cx - hipsW * 0.62} ${crotchY + h * 0.05}, ${cx - hipsW * 0.6} ${crotchY}`,
    'Z'
  ].join(' ')

  // Right leg path (mirror)
  const rightLegPath = [
    `M ${cx + hipsW * 0.6} ${crotchY}`,
    `C ${cx + hipsW * 0.5} ${crotchY + h * 0.05}, ${cx + hipsW * 0.38} ${kneeY - h * 0.04}, ${cx + hipsW * 0.32} ${kneeY}`,
    `C ${cx + hipsW * 0.28} ${kneeY + h * 0.04}, ${cx + hipsW * 0.24} ${ankleY - h * 0.04}, ${cx + hipsW * 0.2} ${ankleY}`,
    `L ${cx + hipsW * 0.32} ${ankleY}`,
    `C ${cx + hipsW * 0.36} ${ankleY - h * 0.04}, ${cx + hipsW * 0.4} ${kneeY + h * 0.04}, ${cx + hipsW * 0.44} ${kneeY}`,
    `C ${cx + hipsW * 0.5} ${kneeY - h * 0.04}, ${cx + hipsW * 0.62} ${crotchY + h * 0.05}, ${cx + hipsW * 0.6} ${crotchY}`,
    'Z'
  ].join(' ')

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size * 0.6}
      height={size}
      style={{ display: 'block', margin: '0 auto', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }}
    >
      <defs>
        {/* Clip paths for outfit sections */}
        <clipPath id="topClip">
          <rect x={0} y={0} width={w} height={outfitDivideY} />
        </clipPath>
        <clipPath id="bottomClip">
          <rect x={0} y={outfitDivideY} width={w} height={h - outfitDivideY} />
        </clipPath>

        {/* Outfit image pattern — used when try-on is active */}
        {outfit?.imageUrl && (
          <pattern id="outfitTopPattern" patternUnits="userSpaceOnUse"
            x={cx - shoulderW} y={shoulderY}
            width={shoulderW * 2} height={outfitDivideY - shoulderY}>
            <image href={outfit.imageUrl} x={0} y={0}
              width={shoulderW * 2} height={outfitDivideY - shoulderY}
              preserveAspectRatio="xMidYMid slice" />
          </pattern>
        )}

        {/* Subtle body gradient */}
        <linearGradient id="skinGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"   stopColor={skinDark} />
          <stop offset="40%"  stopColor={skinColor} />
          <stop offset="60%"  stopColor={skinColor} />
          <stop offset="100%" stopColor={skinDark} />
        </linearGradient>
        <linearGradient id="topGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.15)" />
          <stop offset="40%"  stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
        </linearGradient>
      </defs>

      {/* ── LEGS ── */}
      <path d={leftLegPath}  fill={outfitBottom} />
      <path d={rightLegPath} fill={outfitBottom} />

      {/* Knee highlights */}
      <ellipse cx={cx - hipsW * 0.38} cy={kneeY} rx={w * 0.04} ry={w * 0.03} fill="rgba(255,255,255,0.08)" />
      <ellipse cx={cx + hipsW * 0.38} cy={kneeY} rx={w * 0.04} ry={w * 0.03} fill="rgba(255,255,255,0.08)" />

      {/* Shoes */}
      <ellipse cx={cx - hipsW * 0.26} cy={ankleY + h * 0.015} rx={w * 0.11} ry={w * 0.04} fill={shoeColor} />
      <ellipse cx={cx + hipsW * 0.26} cy={ankleY + h * 0.015} rx={w * 0.11} ry={w * 0.04} fill={shoeColor} />

      {/* ── ARMS ── */}
      {/* Left arm */}
      <path d={`
        M ${cx - shoulderW} ${armTopY}
        C ${cx - armOutX * 0.7} ${armTopY + h * 0.04},
          ${cx - armOutX * 0.75} ${armBottomY - h * 0.04},
          ${cx - armOutX * 0.6} ${armBottomY}
        C ${cx - armOutX * 0.55} ${armBottomY + h * 0.02},
          ${cx - shoulderW * 0.8} ${armTopY + h * 0.08},
          ${cx - shoulderW} ${armTopY}
        Z
      `} fill="url(#skinGrad)" />
      {/* Right arm */}
      <path d={`
        M ${cx + shoulderW} ${armTopY}
        C ${cx + armOutX * 0.7} ${armTopY + h * 0.04},
          ${cx + armOutX * 0.75} ${armBottomY - h * 0.04},
          ${cx + armOutX * 0.6} ${armBottomY}
        C ${cx + armOutX * 0.55} ${armBottomY + h * 0.02},
          ${cx + shoulderW * 0.8} ${armTopY + h * 0.08},
          ${cx + shoulderW} ${armTopY}
        Z
      `} fill="url(#skinGrad)" />

      {/* ── TORSO (bottom half — outfit) ── */}
      <g clipPath="url(#bottomClip)">
        <path d={torsoPath} fill={outfitBottom} />
      </g>

      {/* ── TORSO (top half — outfit) ── */}
      <g clipPath="url(#topClip)">
        <path d={torsoPath} fill={outfitTop} />
        {/* Outfit shading overlay */}
        <path d={torsoPath} fill="url(#topGrad)" />
      </g>

      {/* Female chest detail */}
      {isFemale && !outfit && (
        <>
          <ellipse cx={cx - bustW * 0.3} cy={bustY + h * 0.02} rx={bustW * 0.22} ry={bustW * 0.16}
            fill="rgba(0,0,0,0.08)" />
          <ellipse cx={cx + bustW * 0.3} cy={bustY + h * 0.02} rx={bustW * 0.22} ry={bustW * 0.16}
            fill="rgba(0,0,0,0.08)" />
        </>
      )}

      {/* Outfit division line (subtle) */}
      <line x1={cx - hipsW * 0.5} y1={outfitDivideY} x2={cx + hipsW * 0.5} y2={outfitDivideY}
        stroke="rgba(0,0,0,0.15)" strokeWidth={1} />

      {/* ── NECK ── */}
      <rect x={cx - neckW} y={neckTop} width={neckW * 2} height={neckBottom - neckTop + 2}
        fill="url(#skinGrad)" rx={neckW} />

      {/* ── HEAD ── */}
      <ellipse cx={cx} cy={headCY} rx={headR} ry={headR * 1.15} fill="url(#skinGrad)" />

      {/* Hair */}
      {isFemale ? (
        // Long hair
        <>
          <ellipse cx={cx} cy={headCY - headR * 0.6} rx={headR * 1.05} ry={headR * 0.7} fill={hairColor} />
          <path d={`
            M ${cx - headR * 1.05} ${headCY - headR * 0.1}
            Q ${cx - headR * 1.2} ${headCY + headR * 0.8} ${cx - headR * 0.9} ${headCY + headR * 1.8}
            L ${cx - headR * 0.7} ${headCY + headR * 1.8}
            Q ${cx - headR * 0.9} ${headCY + headR * 0.8} ${cx - headR * 0.85} ${headCY - headR * 0.1}
            Z
          `} fill={hairColor} />
          <path d={`
            M ${cx + headR * 1.05} ${headCY - headR * 0.1}
            Q ${cx + headR * 1.2} ${headCY + headR * 0.8} ${cx + headR * 0.9} ${headCY + headR * 1.8}
            L ${cx + headR * 0.7} ${headCY + headR * 1.8}
            Q ${cx + headR * 0.9} ${headCY + headR * 0.8} ${cx + headR * 0.85} ${headCY - headR * 0.1}
            Z
          `} fill={hairColor} />
        </>
      ) : (
        // Short hair
        <ellipse cx={cx} cy={headCY - headR * 0.55} rx={headR * 1.02} ry={headR * 0.65} fill={hairColor} />
      )}

      {/* Face details */}
      {/* Eyes */}
      <ellipse cx={cx - headR * 0.32} cy={headCY - headR * 0.05} rx={headR * 0.1} ry={headR * 0.07} fill="#2d1b0e" />
      <ellipse cx={cx + headR * 0.32} cy={headCY - headR * 0.05} rx={headR * 0.1} ry={headR * 0.07} fill="#2d1b0e" />
      {/* Eye shine */}
      <circle cx={cx - headR * 0.28} cy={headCY - headR * 0.08} r={headR * 0.025} fill="white" />
      <circle cx={cx + headR * 0.36} cy={headCY - headR * 0.08} r={headR * 0.025} fill="white" />
      {/* Smile */}
      <path d={`M ${cx - headR * 0.22} ${headCY + headR * 0.2} Q ${cx} ${headCY + headR * 0.38} ${cx + headR * 0.22} ${headCY + headR * 0.2}`}
        fill="none" stroke="#a0522d" strokeWidth={headR * 0.07} strokeLinecap="round" />
      {/* Nose */}
      <path d={`M ${cx} ${headCY - headR * 0.05} Q ${cx + headR * 0.08} ${headCY + headR * 0.1} ${cx} ${headCY + headR * 0.12}`}
        fill="none" stroke={skinDark} strokeWidth={headR * 0.06} strokeLinecap="round" />

      {/* Measurement indicators (subtle) */}
      {measurements.bust_cm && (
        <line x1={cx - bustW} y1={bustY} x2={cx + bustW} y2={bustY}
          stroke="rgba(200,255,0,0.3)" strokeWidth={1} strokeDasharray="3,3" />
      )}
      {measurements.waist_cm && (
        <line x1={cx - waistW} y1={waistY} x2={cx + waistW} y2={waistY}
          stroke="rgba(200,255,0,0.2)" strokeWidth={1} strokeDasharray="3,3" />
      )}
      {measurements.hips_cm && (
        <line x1={cx - hipsW} y1={hipsY} x2={cx + hipsW} y2={hipsY}
          stroke="rgba(200,255,0,0.2)" strokeWidth={1} strokeDasharray="3,3" />
      )}
    </svg>
  )
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}
