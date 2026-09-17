# Goa holiday page

Page: `src/pages/Holidays/Goa/goa.jsx`, route `/goa`. Listed in the existing Trending Domestic Destinations carousel.

## Source interpretation

The user supplied a 1–4 October, 3-night / 4-day package for 6 adults in 2 triple-sharing rooms. The year was omitted. A clarification was requested; **2026 is assumed** to match the other packages until the user specifies a different year. The date configuration is in `goaData.js`; static SEO metadata is in `scripts/seo-pages.json`.

| Hotel | Per adult, triple sharing | Total for 6 adults |
| --- | ---: | ---: |
| Zone Connect by The Park Parra | INR 9,400 | INR 56,400 |
| Vilmaris Breeze Hotel | INR 9,400 | INR 56,400 |
| Bells Beach Resort | INR 9,700 | INR 58,200 |

Rates require a minimum of 6 adults. Each enquiry preserves the selected hotel, six adults, two rooms containing three adults each, and the complete group total. Taxes are included; no extra tax computation is added. Star ratings and room categories were not supplied and are not invented.

The day-by-day route uses Dabolim Airport, while the inclusions also allow private railway-station pickup/drop. Breakfast is included. Lunch stops are retained in the itinerary but clearly marked as payable separately because the exclusions specify lunch, dinner and all entry tickets. North Goa’s malformed end time is interpreted as 6:00 PM, matching the South Goa schedule. Water sports remain optional with charges requiring confirmation.

## Generated image

Built-in image generation tool. Optimized final asset: `public/images/goa/goa-coast-hero.webp` (1536 × 1024). The coastal scene is Goa-inspired destination imagery, not a photograph of any named hotel.

Final prompt:

Use case: photorealistic-natural. Asset type: landscape Goa holiday website hero and compact destination card. Create a premium natural travel photograph inspired by North Goa's Sinquerim coastline: a broad golden sandy beach curving around a green headland, gentle blue Arabian Sea waves, tall coconut palms and a subtle distant reddish laterite coastal fort wall reminiscent of Aguada. A few small fishing boats offshore, no identifiable people. Warm clear early morning light after monsoon, inviting tropical green and blue colors, realistic natural textures. Wide 3:2 landscape composition with the beach and sea on the right and darker palms at left for a white website headline placed by code. No snowy mountains, no tropical overwater villas, no text, logos, watermark, borders, collage or UI. Destination inspiration, not a documentary photograph or an image of any named hotel.

## Verification

Run `npm run test:browser:goa` with the dev server at `http://127.0.0.1:5174`, or set `VERIFY_BASE_URL`. Covers the domestic card, all three hotel choices, per-adult and group prices, triple-sharing payloads, minimum-six condition, all itinerary stops, meal exclusions, error recovery and responsive layouts. All API requests are mocked. Screenshots and the report are saved under the workspace `output/design/goa/` directory.
