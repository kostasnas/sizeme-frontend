/**
 * Extract body measurements from MediaPipe Pose landmarks.
 * Landmarks are normalized [0,1]. We need the user's height in cm
 * to convert pixel ratios to real-world cm.
 *
 * Key landmark indices (MediaPipe BlazePose):
 * 11: left shoulder, 12: right shoulder
 * 23: left hip, 24: right hip
 * 25: left knee, 26: right knee
 * 27: left ankle, 28: right ankle
 */

export function extractMeasurements(frontLandmarks, sideLandmarks, heightCm) {
  if (!frontLandmarks || !heightCm) return null

  // Pixel height of person in normalized coords
  // Use shoulder-to-ankle as proxy for "visible body height"
  const leftShoulder  = frontLandmarks[11]
  const rightShoulder = frontLandmarks[12]
  const leftHip       = frontLandmarks[23]
  const rightHip      = frontLandmarks[24]
  const leftAnkle     = frontLandmarks[27]
  const rightAnkle    = frontLandmarks[28]

  // Average left/right for symmetry
  const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2
  const ankleMidY    = (leftAnkle.y + rightAnkle.y) / 2
  const visibleHeightNorm = Math.abs(ankleMidY - shoulderMidY)

  // Scale factor: how many cm per normalized unit
  // Shoulders to ankle ≈ 82% of total height
  const SHOULDER_TO_ANKLE_RATIO = 0.82
  const cmPerUnit = (heightCm * SHOULDER_TO_ANKLE_RATIO) / visibleHeightNorm

  // Shoulder width
  const shoulderWidthNorm = Math.abs(rightShoulder.x - leftShoulder.x)
  const shoulderWidthCm = shoulderWidthNorm * cmPerUnit

  // Hip width → estimate hips circumference
  const hipWidthNorm = Math.abs(rightHip.x - leftHip.x)
  const hipWidthCm = hipWidthNorm * cmPerUnit
  // Circumference ≈ width * π * 0.85 (body isn't a perfect circle)
  const hipsCm = hipWidthCm * Math.PI * 0.85

  // Bust: estimated from shoulder width
  // Average bust ≈ shoulder width * 1.15 for women, * 1.05 for men
  const bustCm = shoulderWidthCm * 1.15

  // Waist: midpoint between shoulder and hip
  const waistMidY = (shoulderMidY + (leftHip.y + rightHip.y) / 2) / 2
  // Waist width from landmarks (approximate — torso narrows ~15% at waist)
  const waistCm = hipsCm * 0.78

  // Inseam: hip to ankle
  const hipMidY   = (leftHip.y + rightHip.y) / 2
  const inseamNorm = Math.abs(ankleMidY - hipMidY)
  const inseamCm  = inseamNorm * cmPerUnit

  return {
    bust_cm:            Math.round(bustCm),
    waist_cm:           Math.round(waistCm),
    hips_cm:            Math.round(hipsCm),
    shoulder_width_cm:  Math.round(shoulderWidthCm),
    inseam_cm:          Math.round(inseamCm),
  }
}

/**
 * Foot measurement from photo with A4 paper reference.
 * A4 = 210mm × 297mm. We detect the paper corners to get px/mm ratio.
 */
export function extractFootMeasurements(footContour, paperCorners) {
  if (!footContour || !paperCorners) return null

  // Calculate px per mm from paper
  const paperWidthPx  = dist(paperCorners.topLeft, paperCorners.topRight)
  const paperHeightPx = dist(paperCorners.topLeft, paperCorners.bottomLeft)
  const pxPerMm = (paperWidthPx / 210 + paperHeightPx / 297) / 2

  // Foot bounding box
  const xs = footContour.map(p => p.x)
  const ys = footContour.map(p => p.y)
  const footWidthPx  = Math.max(...xs) - Math.min(...xs)
  const footLengthPx = Math.max(...ys) - Math.min(...ys)

  const footLengthMm = footLengthPx / pxPerMm
  const footWidthMm  = footWidthPx  / pxPerMm

  // Wide foot: width/length ratio > 0.42
  const widthRatio = footWidthMm / footLengthMm
  const isWide = widthRatio > 0.42
  const isNarrow = widthRatio < 0.36

  // EU shoe size: (foot length mm + 15) / 6.67 × 2 / 3 — simplified Mondopoint
  const euSize = Math.ceil((footLengthMm + 15) / 6.67)

  return {
    foot_length_mm: Math.round(footLengthMm),
    foot_width_mm:  Math.round(footWidthMm),
    eu_size:        euSize,
    is_wide:        isWide,
    is_narrow:      isNarrow,
    width_category: isWide ? 'wide' : isNarrow ? 'narrow' : 'standard',
  }
}

function dist(a, b) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)
}
