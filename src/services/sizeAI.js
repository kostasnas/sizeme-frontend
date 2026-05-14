// Size lookup via backend (Groq + Tavily)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export async function getSizeRecommendations({ measurements, scanType, brands }) {
  const res = await fetch(`${BACKEND_URL}/api/size-lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ measurements, scanType, brands })
  })
  if (!res.ok) throw new Error('Size lookup failed')
  return res.json()
}

// Affiliate URL builders
export function buildAffiliateUrl(brand, query) {
  const affiliateMap = {
    shein:     (q) => `https://www.shein.com/search?q=${encodeURIComponent(q)}&ref=SIZEME_AFFILIATE_TAG`,
    temu:      (q) => `https://www.temu.com/search?q=${encodeURIComponent(q)}&refer=SIZEME_AFFILIATE_TAG`,
    aliexpress:(q) => `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(q)}&aff_id=SIZEME_AFF_ID`,
    zara:      (q) => `https://www.zara.com/search?searchTerm=${encodeURIComponent(q)}`,
    hm:        (q) => `https://www2.hm.com/el_gr/search-results.html?q=${encodeURIComponent(q)}`,
  }
  const builder = affiliateMap[brand.toLowerCase()]
  return builder ? builder(query) : null
}
