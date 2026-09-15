# Kashmir landing page

Route: `/kashmir` (featured on `/trendingdomesticdestination`, available through the desktop and mobile Holidays menu).

## Generated imagery

Mode: built-in `image_gen` tool. Originals are preserved here; compressed web assets are in `goimomifrontend/public/images/kashmir/`.

- `dal-lake-original.png` → `dal-lake-hero.webp` (hero) and `dal-lake-social.jpg` (sharing preview).
- `pahalgam-original.png` → `pahalgam-valley.webp` (itinerary).

The imagery is AI-generated destination inspiration, not documentary photography or a representation of a booked hotel.

## Final prompts

### Dal Lake

Use case: photorealistic-natural. Asset type: premium Kashmir travel website panoramic hero photograph. Primary request: breathtaking Dal Lake Srinagar Kashmir at sunrise with an elegant traditional yellow and red wooden shikara boat floating in the right foreground, authentic distant wooden houseboats along the bank, layered Himalayan mountains with lightly snow covered peaks in the distance, still reflective water and delicate morning haze. Composition: wide landscape 16:9, boat on the right third, left half mostly tranquil lake and soft mountains with clean negative space for large white website headline added in code. Natural editorial travel photography, rich forest green and teal water, warm golden highlights, realistic fine textures, refined cinematic atmosphere, not oversaturated. No text, no logos, no watermark, no borders. Save the image as a local asset and return its file path.

### Pahalgam

Use case: photorealistic-natural. Asset type: premium Kashmir travel website supporting photograph. A stunning authentic Pahalgam Kashmir valley in summer, crystal turquoise Lidder river winding through lush green meadows, tall Himalayan cedar and pine forest on the banks, layered rugged mountains with snow on distant peaks, tiny rustic wooden huts very far away. Wide landscape 16:9 framing, river curving from bottom center to middle left and mountain panorama, soft late afternoon sunlight. High-end editorial travel photography, lifelike water and grass textures, inviting peaceful atmosphere, natural colors, no text no logos no watermarks, no collage. Return local file path.

## Content decisions

- Used 4 nights consistently, matching the 4N/5D heading and five-day itinerary; the source twice says 5 nights.
- Preserved all supplied private rates and supplements, including the 04-star Premium child-without-bed supplement of INR 10,500.
- Specified the INR 9,034 starting-rate basis: 03-star Basic, Tempo Traveller, minimum 12 guests, twin sharing.
- Shikara inclusion is unspecified in the brief; charges and arrangements are marked for confirmation in the quote.
- Enquiry requests use the existing `/api/holiday-form/` endpoint. A successful server response is required before displaying success. Submission is an enquiry, not a confirmed booking.
