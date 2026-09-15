# Trending destination landing pages

- `trendingdomesticdestination.jsx` → `/trendingdomesticdestination`
- `trendingInternationaldestination.jsx` → `/trendinginternationaldestination`
- `TrendingDestinationPage.jsx` contains the shared layout, search, region filters and destination cards.
- `trendingDestinations.css` contains styles scoped to these landing pages.

Domestic destinations: Manali, Kashmir and Kerala. International destinations: Azerbaijan, Bangkok, Bali, UAE, Singapore and Paris. These are curated collections, not live popularity rankings. Prices come from the supplied Manali, Kashmir and Azerbaijan briefs; other destinations link to the holiday listing without an invented price.

Manali's page is `../Manali/Manali.jsx`, with its data and stylesheet beside it. Route: `/manali`. The 26–29 November 2026 package offers Value, Comfort and Premium stays for two adults, with 5% GST shown separately and included in the enquiry total. Web images live in `public/images/manali/`; originals and prompts are in `design/manali/`. Regenerated QA output is saved in the workspace `output/design/` directory.

Azerbaijan's full package is in `../Azerbaijan/azerbaijan.jsx`, alongside its data and stylesheet. The `/azerbaijan` route offers Metro City Hotel 3-star at INR 52,430 and Parkside Hotel 4-star at INR 63,700, each a total for two adults. Its destination card uses `priceLabel` to distinguish this from Kashmir's per-person pricing. Generated web images are in `public/images/azerbaijan/`, with originals and generation notes in `design/azerbaijan/`.

Kashmir's full package is in `../Kashmir/Kashmir.jsx`, with `Kashmir.css` and `kashmirData.js` beside it. Its route remains `/kashmir`. Web images are in `public/images/kashmir/` within the frontend. Image originals and generation notes are archived in `design/kashmir/` within the frontend.

Other destination cards open the existing holiday listing with the appropriate category and destination filter. Both menus and the homepage link to these landing pages.
