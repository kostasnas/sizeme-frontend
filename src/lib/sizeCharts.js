/**
 * Size chart database.
 * All measurements in cm.
 * Sources: official brand size guides.
 */

export const SIZE_CHARTS = {
  // ── EU BRANDS ────────────────────────────────────────────────
  zara: {
    name: 'Zara',
    region: 'EU',
    tops: [
      { label: 'XS', bust: [80,84],  waist: [60,64] },
      { label: 'S',  bust: [84,88],  waist: [64,68] },
      { label: 'M',  bust: [88,92],  waist: [68,72] },
      { label: 'L',  bust: [92,98],  waist: [72,78] },
      { label: 'XL', bust: [98,104], waist: [78,84] },
      { label: 'XXL',bust: [104,112],waist: [84,92] },
    ],
    bottoms: [
      { label: 'XS', waist: [60,64], hips: [88,92]  },
      { label: 'S',  waist: [64,68], hips: [92,96]  },
      { label: 'M',  waist: [68,72], hips: [96,100] },
      { label: 'L',  waist: [72,78], hips: [100,106]},
      { label: 'XL', waist: [78,84], hips: [106,112]},
      { label: 'XXL',waist: [84,92], hips: [112,120]},
    ],
    note: 'Το Zara κόβει slim — αν είσαι στο όριο, πάρε το μεγαλύτερο νούμερο.',
  },

  hm: {
    name: 'H&M',
    region: 'EU',
    tops: [
      { label: 'XS', bust: [78,82],  waist: [58,62] },
      { label: 'S',  bust: [82,86],  waist: [62,66] },
      { label: 'M',  bust: [86,90],  waist: [66,70] },
      { label: 'L',  bust: [90,96],  waist: [70,76] },
      { label: 'XL', bust: [96,102], waist: [76,82] },
      { label: '2XL',bust: [102,110],waist: [82,90] },
    ],
    bottoms: [
      { label: 'XS', waist: [58,62], hips: [86,90]  },
      { label: 'S',  waist: [62,66], hips: [90,94]  },
      { label: 'M',  waist: [66,70], hips: [94,98]  },
      { label: 'L',  waist: [70,76], hips: [98,104] },
      { label: 'XL', waist: [76,82], hips: [104,110]},
      { label: '2XL',waist: [82,90], hips: [110,118]},
    ],
    note: 'H&M κόβει slightly more generous από Zara.',
  },

  mango: {
    name: 'Mango',
    region: 'EU',
    tops: [
      { label: 'XS', bust: [80,84],  waist: [62,66] },
      { label: 'S',  bust: [84,88],  waist: [66,70] },
      { label: 'M',  bust: [88,94],  waist: [70,76] },
      { label: 'L',  bust: [94,100], waist: [76,82] },
      { label: 'XL', bust: [100,108],waist: [82,90] },
    ],
    note: 'Mango τρέχει μικρό — ανέβα νούμερο αν είσαι στο μεταίχμιο.',
  },

  // ── CN BRANDS ────────────────────────────────────────────────
  shein: {
    name: 'Shein',
    region: 'CN',
    tops: [
      { label: 'XS',  bust: [76,80],  waist: [58,62], cn: '155/80A' },
      { label: 'S',   bust: [80,84],  waist: [62,66], cn: '160/84A' },
      { label: 'M',   bust: [84,88],  waist: [66,70], cn: '165/88A' },
      { label: 'L',   bust: [88,94],  waist: [70,76], cn: '170/92A' },
      { label: 'XL',  bust: [94,100], waist: [76,82], cn: '175/96A' },
      { label: 'XXL', bust: [100,108],waist: [82,90], cn: '175/100A'},
      { label: '3XL', bust: [108,116],waist: [90,98], cn: '175/108A'},
    ],
    bottoms: [
      { label: 'XS',  waist: [58,62], hips: [84,88]  },
      { label: 'S',   waist: [62,66], hips: [88,92]  },
      { label: 'M',   waist: [66,70], hips: [92,96]  },
      { label: 'L',   waist: [70,76], hips: [96,102] },
      { label: 'XL',  waist: [76,82], hips: [102,108]},
      { label: 'XXL', waist: [82,90], hips: [108,116]},
      { label: '3XL', waist: [90,98], hips: [116,124]},
    ],
    note: '⚠️ Shein sizing τρέχει ΠΟΛΥ μικρό. Συνήθως ανέβα 1-2 νούμερα από EU.',
    warningLevel: 'high',
  },

  temu: {
    name: 'Temu',
    region: 'CN',
    tops: [
      { label: 'S',   bust: [82,86],  waist: [64,68] },
      { label: 'M',   bust: [86,90],  waist: [68,72] },
      { label: 'L',   bust: [90,96],  waist: [72,78] },
      { label: 'XL',  bust: [96,102], waist: [78,84] },
      { label: 'XXL', bust: [102,110],waist: [84,92] },
      { label: '3XL', bust: [110,118],waist: [92,100]},
    ],
    note: '⚠️ Temu: κάθε seller έχει διαφορετικό sizing. Βάσισε στα cm, όχι στα γράμματα.',
    warningLevel: 'high',
  },

  aliexpress: {
    name: 'AliExpress',
    region: 'CN',
    tops: [
      { label: 'S',   bust: [80,84],  waist: [62,66] },
      { label: 'M',   bust: [84,88],  waist: [66,70] },
      { label: 'L',   bust: [88,94],  waist: [70,76] },
      { label: 'XL',  bust: [94,100], waist: [76,82] },
      { label: 'XXL', bust: [100,108],waist: [82,90] },
      { label: '3XL', bust: [108,116],waist: [90,98] },
    ],
    note: '⚠️ AliExpress: πάντα κοίτα το size chart του συγκεκριμένου seller.',
    warningLevel: 'medium',
  },

  // ── SHOES ────────────────────────────────────────────────────
  nike: {
    name: 'Nike',
    region: 'EU',
    shoes: {
      standard: [
        { eu: 36,   length_mm: 225 },
        { eu: 37,   length_mm: 232 },
        { eu: 37.5, length_mm: 235 },
        { eu: 38,   length_mm: 240 },
        { eu: 38.5, length_mm: 243 },
        { eu: 39,   length_mm: 245 },
        { eu: 40,   length_mm: 252 },
        { eu: 40.5, length_mm: 255 },
        { eu: 41,   length_mm: 258 },
        { eu: 42,   length_mm: 265 },
        { eu: 42.5, length_mm: 268 },
        { eu: 43,   length_mm: 270 },
        { eu: 44,   length_mm: 278 },
        { eu: 44.5, length_mm: 282 },
        { eu: 45,   length_mm: 285 },
        { eu: 46,   length_mm: 292 },
      ],
      note: 'Nike τρέχει μισό νούμερο μεγαλύτερο. Αν έχεις πλατύ πόδι, ανέβα ένα νούμερο ή ψάξε "Nike Wide".',
    }
  },

  adidas: {
    name: 'Adidas',
    region: 'EU',
    shoes: {
      standard: [
        { eu: 36,   length_mm: 220 },
        { eu: 37,   length_mm: 228 },
        { eu: 38,   length_mm: 235 },
        { eu: 38.5, length_mm: 240 },
        { eu: 39,   length_mm: 243 },
        { eu: 40,   length_mm: 250 },
        { eu: 40.5, length_mm: 255 },
        { eu: 41,   length_mm: 258 },
        { eu: 42,   length_mm: 265 },
        { eu: 42.5, length_mm: 268 },
        { eu: 43,   length_mm: 272 },
        { eu: 44,   length_mm: 278 },
        { eu: 44.5, length_mm: 282 },
        { eu: 45,   length_mm: 288 },
        { eu: 46,   length_mm: 295 },
      ],
      note: 'Adidas γενικά true-to-size. Ultraboost/NMD τρέχουν λίγο μεγάλα.',
    }
  },
}

/**
 * Find the correct size label for given measurements.
 * category: 'tops' | 'bottoms' | 'shoes'
 */
export function findSize(brandKey, category, measurements) {
  const chart = SIZE_CHARTS[brandKey]
  if (!chart) return null

  if (category === 'shoes') {
    const sizes = chart.shoes?.standard
    if (!sizes || !measurements.foot_length_mm) return null
    const mm = measurements.foot_length_mm
    // Find closest size
    let best = sizes[0]
    let minDiff = Math.abs(sizes[0].length_mm - mm)
    for (const s of sizes) {
      const diff = Math.abs(s.length_mm - mm)
      if (diff < minDiff) { minDiff = diff; best = s }
    }
    return {
      size: best.eu.toString(),
      note: chart.shoes.note,
      isWideRecommendation: measurements.is_wide,
      brand: chart.name,
    }
  }

  const rows = chart[category]
  if (!rows) return null

  for (const row of rows) {
    let match = true
    if (row.bust  && measurements.bust_cm)  match = match && inRange(measurements.bust_cm,  row.bust)
    if (row.waist && measurements.waist_cm) match = match && inRange(measurements.waist_cm, row.waist)
    if (row.hips  && measurements.hips_cm)  match = match && inRange(measurements.hips_cm,  row.hips)
    if (match) return { size: row.label, note: chart.note, warningLevel: chart.warningLevel, brand: chart.name }
  }

  // If above all ranges, return largest
  const largest = rows[rows.length - 1]
  return { size: largest.label + '+', note: chart.note, outOfRange: true, brand: chart.name }
}

function inRange(value, [min, max]) {
  return value >= min && value < max
}

export const BRANDS_LIST = Object.entries(SIZE_CHARTS).map(([key, v]) => ({
  key,
  name: v.name,
  region: v.region,
}))
