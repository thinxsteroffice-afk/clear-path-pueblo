# ClearPath Junk Removal — Pueblo / Pueblo West

Optimized static site for **ClearPath Junk Removal LLC** (5.0★ × 115 Google reviews · Pueblo West, CO).

- 1 homepage with GHL form embed
- 6 service pages (`/services/<slug>`)
- 4 areas-served pages (`/areas/<slug>`)
- 5 SEO blog articles (`/blog/<slug>`)
- FAQ with FAQPage schema
- LocalBusiness (`MovingCompany`) JSON-LD with geo, services catalog, aggregateRating, openingHours
- `vercel.json` with `cleanUrls: true` + `/review`, `/reviews`, `/quote` redirects
- `sitemap.xml` (20 URLs) + `robots.txt`
- IndexNow key file for push-indexing (Bing/Yandex)

## Deploy
1. Connect this repo to Vercel (framework preset: **Other** — pure static)
2. Build command: none. Output: `public/`
3. Vercel auto-detects `vercel.json`

## Live URLs (once deployed)
- Production: `https://<vercel-project>.vercel.app` (or your custom domain)
- Free quote: `/#quote` (LeadConnector form embed → drops contact in GHL)
- Reviews: `/review` → redirects to Google Maps listing

## Local automation (separate dirs in `~/clear-path-*`)
- `~/clear-path-content/` — weekly Claude content engine
- `~/clear-path-watcher/` — daily rating/review monitor + AI reply drafter + sitemap pinger + competitor scrape
- `~/clear-path-citations/` — NAP citation submission queue + GHL workflow setup guide

## Owner notes
- GBP: 5.0★ × 115 reviews (Jun 2026) · Place: ClearPath Junk Removal LLC
- NAP: 291 W Northampton Dr, Pueblo West, CO 81007 · (719) 334-4581
- Email: Pmann_1@me.com
- Geo: 38.298325, -104.754343
