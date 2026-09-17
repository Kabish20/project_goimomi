# North East holiday page

Page: `src/pages/Holidays/Sikkim/sikkim.jsx` at `/sikkim`.

The user requested the filename `sikkim.jsx` and confirmed that the visible page and domestic card should use the accurate trip identity: **North East — Assam & Meghalaya**. The supplied itinerary contains no Sikkim stops.

## Package details

- 8–14 November 2026, 6 nights / 7 days, 4 adults sharing 2 rooms.
- Hotel nights: Guwahati 1, Kaziranga 1, Shillong 2, Cherrapunji 2.
- One Innova Crysta for scheduled transport; changes may apply under state regulations.
- Hotel stays specify dinner and breakfast; travel-day meal coverage needs clarification against the supplied exclusions.

| Option | Per adult, twin sharing | Total for 4 adults |
| --- | ---: | ---: |
| Deluxe Package | INR 40,000 | INR 1,60,000 |
| Super Deluxe Package | INR 51,000 | INR 2,04,000 |
| Premium | INR 58,725 | INR 2,34,900 |

Rates are already per adult in the source; do not divide them by two. Enquiry `budget` is the four-adult total. All 12 hotel entries and their quoted room categories are in `sikkimData.js`. Hotel category labels are preserved without assigning star ratings.

## Pending itinerary correction

The original Day 6 repeats the Day 4 Shillong excursion and says overnight Shillong, while the hotel schedule lists Cherrapunji for 12–14 November. Day 7 names Shillong as the departure pickup city. The user chose to supply corrected Days 6–7. Pending those details, the page explicitly marks both days as awaiting confirmation; no corrected route is invented. Enquiry messages also disclose this pending programme.

## Image

Built-in image generation tool, with a generated Meghalaya-inspired river scene. Optimized asset: `public/images/north-east/dawki-hero.webp` (1536 × 1024). It is destination inspiration, not a documentary photograph or a hotel photograph.

Final prompt:

Use case: photorealistic-natural. Asset type: wide landscape hero and compact travel card image for a North East India holiday visiting Assam and Meghalaya. Primary request: Create a Meghalaya-inspired scenic view of the clear emerald Umngot River near Dawki, a small traditional wooden boat on transparent water in the lower right, forested green Khasi hills and natural rocky riverbanks, gentle clear November morning light. Style: premium natural travel photography, realistic terrain and river textures, rich but natural emerald, teal and forest green colors. Composition: wide 3:2 landscape, the river sweeping into the distance, darker wooded bank on the left for white text placed later by code, scenic focal point visible in a wide cropped card. This is destination inspiration, not a verified documentary photo. No snow mountains, no temples, no text, logos, watermark, collage or UI.

## Verification

Run `npm run test:browser:north-east` against the local dev server. Override `VERIFY_BASE_URL` if needed. Checks cover desktop/mobile rendering, compact domestic cards, all three package options, hotel counts, pending itinerary labels, enquiry totals and form validation. All API requests are mocked; no live enquiries are sent. Screenshots and the report are written to the workspace `output/design/north-east/` directory.
