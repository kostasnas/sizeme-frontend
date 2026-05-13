# SizeMe 📏

Το σωστό νούμερο, πάντα.

## Stack
- **Frontend:** React + Vite + Capacitor (Android)
- **Backend:** Node.js + Express on Render
- **DB/Auth:** Supabase
- **AI:** Groq (llama-3.3-70b) + Tavily
- **Payments:** RevenueCat (Google Play Billing)

## Setup

### Frontend
```bash
cd sizeme
npm install
cp .env.example .env  # fill in your keys
npm run dev
```

### Backend
```bash
cd sizeme-backend
npm install
cp .env.example .env  # fill in your keys
npm run dev
```

### Supabase
Run `supabase_schema.sql` in your Supabase SQL editor.

## Features
- 👕 Body Scan (MediaPipe BlazePose) → Size σε Zara, H&M, Shein, Temu, AliExpress
- 👟 Foot Scan (A4 paper reference) → Νούμερο + Wide fit σε Nike, Adidas
- 🆓 Freemium: 3 scans/μήνα δωρεάν
- ✦ Pro: €2.99/μήνα unlimited
- 🔗 Affiliate links: Shein, Temu, AliExpress

## Roadmap
- [ ] MediaPipe BlazePose integration (αντί για simulation)
- [ ] OpenCV.js foot contour detection
- [ ] RevenueCat Google Play Billing
- [ ] More brands: Mango, Bershka, Pull&Bear, Reserved
- [ ] Push notifications: "Νέα σεζόν — δες αν άλλαξαν τα sizes σου"
