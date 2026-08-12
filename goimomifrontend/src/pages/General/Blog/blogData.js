// Structured blog categories and articles data matching Goimomi Holidays requirements
import kashmirImg from "../../../assets/images/blog_kashmir.png";
import singaporeImg from "../../../assets/images/blog_singapore.png";
import umrahImg from "../../../assets/images/blog_umrah.png";
import manaliImg from "../../../assets/images/blog_manali.png";
import dubaiImg from "../../../assets/images/blog_dubai.png";
import madinahImg from "../../../assets/images/blog_madinah.png";
import flightsImg from "../../../assets/images/blog_flights.png";
import cabImg from "../../../assets/images/blog_cab.png";
import cruiseImg from "../../../assets/images/blog_cruise.png";
import packingImg from "../../../assets/images/blog_packing.png";
import kashmirWinterImg from "../../../assets/images/blog_kashmir_winter.png";
import singaporeVisaImg from "../../../assets/images/blog_singapore_visa.png";
import dubaiVisaImg from "../../../assets/images/blog_dubai_visa.png";
import dubaiVsSingaporeImg from "../../../assets/images/blog_dubai_vs_singapore.png";
import ramadanUmrahImg from "../../../assets/images/blog_ramadan_umrah.png";

export const blogCategories = [
  {
    id: "domestic",
    title: "Domestic Travel Guide",
    description: "Explore the magical land of India - from the snow-capped mountains of Kashmir to the tranquil backwaters of Kerala.",
    icon: "🗺️",
    gradient: "from-amber-500 to-orange-600",
    color: "#d97706"
  },
  {
    id: "international",
    title: "International Travel Guide",
    description: "Plan your dream global getaway. Discover itineraries, budgets, and top things to do across Asia, Europe, Africa, and more.",
    icon: "✈️",
    gradient: "from-blue-500 to-indigo-600",
    color: "#2563eb"
  },
  {
    id: "visa",
    title: "Visa Knowledge Centre",
    description: "Step-by-step visa application processes, fees, checklist guides, and tips to ensure high approval rates for your next travel.",
    icon: "🪪",
    gradient: "from-emerald-500 to-teal-600",
    color: "#059669"
  },
  {
    id: "hajj-umrah",
    title: "Hajj & Umrah Knowledge Centre",
    description: "A comprehensive guide on spiritual pilgrimages, including packing checklists, rituals, rawdah booking, and accommodation tips.",
    icon: "🕋",
    gradient: "from-purple-600 to-violet-700",
    color: "#7c3aed"
  },
  {
    id: "flights",
    title: "Flight Booking Blog",
    description: "Insider secrets to bag cheap flights, baggage allowances, airline comparisons, and airport layover survival guides.",
    icon: "🛩️",
    gradient: "from-cyan-500 to-blue-600",
    color: "#0891b2"
  },
  {
    id: "cabs",
    title: "Cab Services & Landing Pages",
    description: "Local transport guides, airport transfer details, and outstation taxi recommendations for hassle-free travel.",
    icon: "🚕",
    gradient: "from-yellow-400 to-amber-500",
    color: "#ca8a04"
  },
  {
    id: "cruises",
    title: "Cruise Holidays",
    description: "Your ultimate guide to luxury cruising, packing checklists, itineraries, and booking the best family cruises.",
    icon: "🚢",
    gradient: "from-sky-500 to-cyan-600",
    color: "#0284c7"
  },
  {
    id: "tips",
    title: "Travel Tips & Hacks",
    description: "Useful tips on packing checklist, solo travel, traveling with seniors, kids, currency exchange, and travel safety.",
    icon: "💡",
    gradient: "from-pink-500 to-rose-600",
    color: "#e11d48"
  },
  {
    id: "comparison",
    title: "Destination Comparisons",
    description: "Confused between two destinations? Check out our side-by-side comparison on budget, climate, sightseeing, and stays.",
    icon: "⚖️",
    gradient: "from-teal-500 to-emerald-600",
    color: "#0d9488"
  },
  {
    id: "festival",
    title: "Festival Travel Guides",
    description: "Plan your holidays around world-famous celebrations - from Cherry Blossom in Japan to Ramadan Umrah and Christmas in Europe.",
    icon: "🎉",
    gradient: "from-red-500 to-pink-600",
    color: "#dc2626"
  }
];

export const blogPosts = [
  // 1. Domestic Travel Guide
  {
    slug: "best-places-to-visit-kashmir",
    category: "domestic",
    title: "Best Places to Visit in Kashmir: The Ultimate Paradise Guide",
    author: "Fayaz Ahmad",
    date: "July 01, 2026",
    readTime: "6 min read",
    excerpt: "Discover the breathtaking beauty of Kashmir, from the iconic shikaras of Dal Lake to the snowclad ski slopes of Gulmarg.",
    image: kashmirImg,
    content: `
      Kashmir is rightfully called 'Paradise on Earth'. With its crystal-clear lakes, dense pine forests, snow-clad peaks, and sprawling meadows, it offers a visual feast that leaves travelers spellbound. Whether you are planning a family holiday, a romantic honeymoon, or a solo adventure, here is the ultimate guide to the best places to visit in Kashmir.

      ### 1. Srinagar - The Summer Capital
      Srinagar is the gateway to Kashmir. The city is famous for its historic Mughal Gardens (Shalimar Bagh, Nishat Bagh), the scenic Dal Lake, and traditional houseboats.
      * **Top Highlight:** An early morning Shikara ride in Dal Lake to witness the floating vegetable market.

      ### 2. Gulmarg - The Meadow of Flowers
      Located about 50 km from Srinagar, Gulmarg is a premier winter resort and ski destination. It boasts the Gulmarg Gondola, one of the highest cable cars in the world.
      * **Top Highlight:** Take the Phase 2 Gondola ride up to Apharwat Peak (4,200m) for panoramic views of Nanga Parbat.

      ### 3. Pahalgam - The Valley of Shepherds
      Pahalgam is a serene town located along the banks of the ladder-like Lidder River. It serves as the starting point for the annual Amarnath Yatra and is famous for its stunning valleys.
      * **Top Highlight:** Explore Betaab Valley (named after the Bollywood film *Betaab*) and Aru Valley.

      ### 4. Sonamarg - The Meadow of Gold
      Sonamarg is known for its alpine meadows and the Thajiwas Glacier. It offers brilliant opportunities for trekking and river rafting.
      * **Top Highlight:** A pony ride to the Thajiwas Glacier for snow activities.
    `
  },
  {
    slug: "kashmir-winter-vs-summer",
    category: "domestic",
    title: "Kashmir in Winter vs Summer: Which is the Best Time to Visit?",
    author: "Aditi Sharma",
    date: "June 25, 2026",
    readTime: "5 min read",
    excerpt: "Should you experience the frozen magic of winter or the vibrant bloom of summer? Let's compare Kashmir in both seasons.",
    image: kashmirWinterImg,
    content: `
      Choosing between Kashmir in summer and Kashmir in winter is a delightful dilemma. Both seasons paint this paradise in completely different hues. Here is a side-by-side comparison to help you decide.

      ### Summer (April to September): The Golden Bloom
      During summer, Kashmir transitions into a lush green wonderland filled with colorful blossoms. The weather is pleasant, ranging from 15°C to 30°C, making it perfect for sightseeing.
      * **Vibe:** Vibrant, colourful, bustling, and pleasant.
      * **Best Activities:** Houseboat stays, Shikara rides on Dal Lake, visiting Tulip Gardens in Srinagar, white-water rafting in Sonamarg, and trekking in Pahalgam.
      * **Verdict:** Best for families, senior citizens, and people seeking pleasant sightseeing without freezing temperatures.

      ### Winter (October to March): The Snowy Wonderland
      By December, Kashmir transforms into an ethereal snow kingdom. Temperatures often drop below freezing (-5°C to 10°C). Conifers are heavily loaded with snow, and lakes sometimes freeze.
      * **Vibe:** Magical, cozy, adventurous, and quiet.
      * **Best Activities:** Skiing and snowboarding in Gulmarg, snow fights, cozy stays near fireplaces with traditional *Kahwa* tea, and sledging in Pahalgam.
      * **Verdict:** Best for adventure enthusiasts, honeymooners, and anyone who wants to experience snowfall for the first time.
    `
  },
  {
    slug: "complete-guide-to-manali",
    category: "domestic",
    title: "The Complete Guide to Manali: Itinerary & Travel Tips",
    author: "Rahul Verma",
    date: "June 18, 2026",
    readTime: "7 min read",
    excerpt: "From Solang Valley adventure sports to the historic Hadimba Temple and the scenic Atal Tunnel, plan your perfect Manali holiday.",
    image: manaliImg,
    content: `
      Manali is one of India's most popular hill stations. Located in the Kullu Valley of Himachal Pradesh, it blends adventure, spiritual sanctuary, and scenic beauty. Here is your complete guide to planning a memorable trip to Manali.

      ### Top Attractions in Manali
      1. **Solang Valley:** The adventure capital. Try paragliding, zorbing, quad biking in summers, and skiing or snowboarding in winter.
      2. **Atal Tunnel & Sissu:** Travel through the world's longest highway tunnel above 10,000 feet to reach Lahaul Valley. Sissu features a spectacular waterfall.
      3. **Hadimba Temple:** A historic wooden pagoda temple built in 1553, surrounded by dense Dhungri Van Vihar pine forests.
      4. **Old Manali:** Famous for its bohemian cafes, live music, wooden houses, and laid-back vibe.

      ### How to Reach Manali
      * **By Air:** Nearest airport is Bhuntar (Kullu), 50 km away.
      * **By Road:** Overnight luxury Volvo buses run daily from Delhi and Chandigarh (approx. 12-14 hours).
    `
  },

  // 2. International Travel Guide
  {
    slug: "ultimate-singapore-travel-guide",
    category: "international",
    title: "The Ultimate Singapore Travel Guide for First-Timers",
    author: "Jessica Tan",
    date: "June 30, 2026",
    readTime: "8 min read",
    excerpt: "Discover Singapore's futuristic landmarks, Gardens by the Bay, Sentosa Island, shopping strips, and delectable street food scene.",
    image: singaporeImg,
    content: `
      Singapore is a spectacular global hub where colonial heritage meets futuristic architecture. It is clean, safe, incredibly efficient, and perfect for families. Here is how to make the most of your first visit.

      ### Must-Visit Landmarks
      * **Gardens by the Bay:** Witness the iconic Supertree Grove, the Flower Dome, and the Cloud Forest containing a massive indoor waterfall.
      * **Sentosa Island:** Accessible by cable car or monorail. Enjoy Universal Studios Singapore, S.E.A. Aquarium, and sandy beaches.
      * **Marina Bay Sands:** Head to the Skypark Observation Deck for the ultimate view of Singapore's skyline.
      * **Changi Jewel:** Explore the world's tallest indoor waterfall (Rain Vortex) inside the airport complex itself!

      ### Hawker Culture & Culinary Delights
      Don't leave without tasting Michelin-starred street food at Maxwell Food Centre or Chinatown Complex.
      * **Must-try dishes:** Hainanese Chicken Rice, Chilli Crab, Laksa, and Kaya Toast.
    `
  },
  {
    slug: "dubai-in-5-days-itinerary",
    category: "international",
    title: "Dubai in 5 Days: The Perfect Itinerary for Families",
    author: "Zayn Malik",
    date: "June 20, 2026",
    readTime: "6 min read",
    excerpt: "From climbing the Burj Khalifa to taking an exciting desert safari and exploring themed parks, here is a day-by-day itinerary.",
    image: dubaiImg,
    content: `
      Dubai is a glittering oasis that offers endless excitement. To help you plan, we have designed the perfect 5-day itinerary.

      ### Day 1: Modern Icons & Shopping
      * **Morning:** Visit the observation deck at Burj Khalifa (124th & 125th floors).
      * **Afternoon:** Explore Dubai Mall, watch the Dubai Fountain show, and check out the Dubai Aquarium.
      
      ### Day 2: Culture & Old Dubai
      * **Morning:** Walk through Al Fahidi Historical Neighbourhood.
      * **Afternoon:** Take a traditional Abra boat ride across Dubai Creek (costing just 1 AED) to explore the Gold and Spice Souks.

      ### Day 3: Desert Adventure
      * **Afternoon:** Embark on a 4x4 Desert Safari. Experience dune bashing, camel riding, sandboarding, henna painting, and a traditional BBQ dinner under the stars with Tanoura dance performances.

      ### Day 4: Palm Jumeirah & Water Activities
      * **Morning:** Explore Atlantis, The Palm and enjoy Aquaventure Waterpark.
      * **Evening:** Stroll around Dubai Marina or take a Dhow Cruise dinner.

      ### Day 5: Future & Miracles
      * **Morning:** Visit the stunning Museum of the Future.
      * **Afternoon:** Walk through Dubai Miracle Garden (open seasonal from Nov to April) boasting over 150 million flowers.
    `
  },

  // 3. Visa Knowledge Centre (Special Structure with fields)
  {
    slug: "singapore-visa-guide",
    category: "visa",
    title: "Singapore Tourist Visa Guide: How to Apply from India",
    author: "Amit Kapoor",
    date: "July 02, 2026",
    readTime: "7 min read",
    excerpt: "Everything you need to know about applying for a Singapore tourist visa, including forms, documents, processing fees, and tips.",
    image: singaporeVisaImg,
    isVisaGuide: true,
    visaDetails: {
      eligibility: "Indian passport holders intending to visit Singapore for tourism, leisure, or visiting friends/family. Passport must be valid for at least 6 months from the date of entry.",
      documents: [
        "Original passport with at least two blank pages.",
        "Completed Visa Application Form 14A (signed by the applicant).",
        "Two recent passport-sized color photographs (35mm x 45mm, matte finish, white background, taken within last 3 months).",
        "Covering letter stating the purpose of visit and travel dates.",
        "Confirmed return flight tickets.",
        "Hotel booking confirmation.",
        "Bank statements for the last 3 months (duly signed and stamped by the bank)."
      ],
      processingTime: "Typically 3 to 5 working days (excluding submission day, weekends, and public holidays). It is recommended to apply at least 15 days before your travel date.",
      fees: "Visa processing fee is SGD 30. In India, authorized visa agents charge a standard convenience/service fee of approximately ₹650 to ₹1000 INR.",
      process: [
        "Singapore High Commission does not accept direct applications from individuals. You must apply through authorized visa agents (like Goimomi Holidays).",
        "Download and fill Form 14A correctly without scratches or overwriting.",
        "Prepare all required documents and photographs as per specifications.",
        "Hand over the documents to the authorized agent and pay the fee.",
        "The agent will submit your application online through the SAVE system.",
        "Once approved, you will receive an e-Visa in PDF format via email, which you must print out."
      ],
      rejections: [
        "Inconsistent details between the application form and supporting documents.",
        "Unclear or non-compliant photographs (e.g., incorrect dimensions, colored background, scanned photo).",
        "Insufficient funds in bank account or lack of stamp/signature on bank statements.",
        "Previous overstay or visa violations in Singapore or other countries.",
        "Vague purpose of visit in the cover letter."
      ],
      faqs: [
        {
          q: "Can I get a Visa on Arrival (VoA) in Singapore?",
          a: "No. Indian passport holders are not eligible for Visa on Arrival. You must apply for an entry visa before arriving."
        },
        {
          q: "What is the validity of a Singapore tourist visa?",
          a: "It is usually a multiple-entry visa valid for up to 2 years. However, the duration of stay for each entry is determined by Singapore Immigration officers at the checkpoint (typically up to 30 days)."
        }
      ],
      tips: [
        "Ensure your signature on Form 14A exactly matches the signature on your passport.",
        "Maintain a healthy bank balance of at least ₹60,000 per traveler for a smooth approval.",
        "Do not book non-refundable tickets before receiving visa approval."
      ]
    }
  },
  {
    slug: "dubai-visa-from-india",
    category: "visa",
    title: "Dubai Tourist Visa from India: Eligibility, Documents & Fees",
    author: "Vikram Malhotra",
    date: "June 28, 2026",
    readTime: "6 min read",
    excerpt: "Planning a trip to Dubai? Read this comprehensive guide to secure your UAE e-Visa smoothly and avoid rejection.",
    image: dubaiVisaImg,
    isVisaGuide: true,
    visaDetails: {
      eligibility: "Indian passport holders visiting UAE for tourism, transit, or visiting family. Passport must be valid for at least 6 months.",
      documents: [
        "Color scanned copy of passport first and last page.",
        "One recent passport-sized color photograph with white background.",
        "Confirmed return flight tickets (sometimes mandatory before visa submission).",
        "Hotel booking confirmation.",
        "PAN card copy.",
        "For female travelers traveling alone, an NOC from father or husband may be required."
      ],
      processingTime: "Usually 24 to 72 hours. We recommend applying at least 7 days before your departure.",
      fees: "₹7,200 to ₹7,800 INR for a standard 30-day single entry e-Visa (including service charges and COVID insurance if applicable).",
      process: [
        "Send high-quality color scanned copies of your passport and photo to Goimomi Holidays.",
        "Pay the visa fee online.",
        "Our team will submit the e-visa application through the GDRFA or ICP portal.",
        "Keep track of the application status online.",
        "Receive the e-visa PDF via email, print it out, and present it at the immigration desk."
      ],
      rejections: [
        "Blurry or low-resolution passport scans.",
        "Applicants under 22 years traveling alone (sometimes flagged unless accompanied by family).",
        "Handwritten passports.",
        "Name spelling mismatches between documents."
      ],
      faqs: [
        {
          q: "Do Indians with a US Visa get Visa on Arrival in Dubai?",
          a: "Yes, Indian passport holders with a valid US Visitor Visa (B1/B2) or Green Card, or UK/EU Residence Visas valid for at least 6 months, can get a 14-day Visa on Arrival at UAE airports. A fee applies at the airport."
        }
      ],
      tips: [
        "Double-check that the passport scanned copy has no glares or cropped borders.",
        "Make sure to purchase travel insurance that covers international medical emergencies."
      ]
    }
  },

  // 4. Hajj & Umrah Knowledge Centre
  {
    slug: "complete-umrah-guide-rituals",
    category: "hajj-umrah",
    title: "Complete Step-by-Step Umrah Guide for First-Timers",
    author: "Dr. Tariq Mahmood",
    date: "June 29, 2026",
    readTime: "9 min read",
    excerpt: "Learn the four primary pillars of Umrah: Ihram, Tawaf, Sa'i, and Halq/Taqsir. Rituals explained in simple steps.",
    image: umrahImg,
    content: `
      Performing Umrah is a highly sacred spiritual journey. Unlike Hajj, which has specific dates, Umrah can be performed at any time of the year. Here is a step-by-step guide outlining the essential rituals.

      ### 1. Entering State of Ihram
      Before reaching the Miqat (boundary), pilgrims must perform purification acts (Ghusl), wear the Ihram clothing (two white unstitched sheets for men, normal modest clothing for women), and make the Niyyah (intention) for Umrah. Recite the *Talbiyah* continuously:
      > *"Labbayka Allahumma Labbayk..."*

      ### 2. Tawaf (Circumambulation of Kaaba)
      Upon entering Masjid al-Haram in Makkah, proceed to the Kaaba. Complete seven circuits in a counter-clockwise direction, starting and ending at the Hajar al-Aswad (Black Stone).
      * **Rituals:** Touch or point at the Black Stone (Istilam), recite Duas, and offer two Rak'ah prayers behind Maqam Ibrahim. Drink Zamzam water afterwards.

      ### 3. Sa'i (Walking between Safa and Marwa)
      Walk seven times between the two hills of Safa and Marwa, commemorating Hajar's search for water. Start at Safa and end at Marwa.
      * **Tip:** Men should run lightly between the green fluorescent lights.

      ### 4. Halq or Taqsir (Shaving or Cutting Hair)
      * **Men:** Shaving the head completely (Halq) is highly recommended, or cutting hair equally all around (Taqsir).
      * **Women:** Cut a small portion of hair equivalent to a fingertip (about an inch).

      Once this is done, you exit the state of Ihram, and your Umrah is complete!
    `
  },
  {
    slug: "nusuk-registration-rawdah-booking",
    category: "hajj-umrah",
    title: "How to Register on Nusuk App & Book Rawdah Permit",
    author: "Farhan Siddiqui",
    date: "June 15, 2026",
    readTime: "5 min read",
    excerpt: "A simple guide to booking your prayer slot in Riyadhul Jannah (Rawdah) in Madinah using the official Nusuk application.",
    image: madinahImg,
    content: `
      To pray in the sacred Riyadhul Jannah (Rawdah) inside Masjid an-Nabawi in Madinah, all pilgrims must secure a valid permit. The Saudi Ministry of Hajj and Umrah issues these permits electronically via the **Nusuk App**. Here is how to book yours.

      ### Step 1: Download the Nusuk App
      Download the official "Nusuk" application from the Apple App Store or Google Play Store. Be careful to download the official government app.

      ### Step 2: Register/Login
      * Open the app, select your preferred language (Arabic/English).
      * Choose **New User** -> Select **Visitor** status.
      * Fill in your passport number, visa number, date of birth, nationality, email, and phone number.
      * Set a password and enter the OTP sent to your registered email to activate your account.

      ### Step 3: Book the Rawdah Permit
      * On the home screen, select **Prophet's Mosque Services** -> **Praying in the Noble Rawdah**.
      * Choose the applicant name, and click *Continue*.
      * A calendar will show available slots:
        * **Green:** Low crowding.
        * **Yellow:** Medium crowding.
        * **Red:** High crowding.
      * Select a suitable date and time slot. Please note that there are separate slots for Men and Women.
      * Read and accept the instructions, then tap **Issue Permit**.
      
      ### Crucial Tip
      Rawdah slots open weekly, usually on Friday afternoons. Permits are limited to once every 365 days. Save the QR code on your phone to show at the gate.
    `
  },

  // 5. Flight Booking Blog
  {
    slug: "how-to-book-cheap-flights",
    category: "flights",
    title: "8 Proven Hacks to Book Cheap Flights Every Single Time",
    author: "Meera Nair",
    date: "July 03, 2026",
    readTime: "5 min read",
    excerpt: "Learn how incognito searches, mid-week flights, and flexible dates can save you thousands on your next air ticket booking.",
    image: flightsImg,
    content: `
      Airfare is often the most expensive component of travel. However, with the right strategies, you can save significant amounts on your tickets. Here are 8 proven hacks from our travel desk.

      ### 1. Go Incognito
      Flight search engines track your cookies and raise prices when a route is searched repeatedly. Always search for flights in **Incognito or Private Browsing mode** to keep prices base-level.

      ### 2. Fly Mid-Week
      Tuesdays, Wednesdays, and Saturdays are generally cheaper days to fly. Avoid weekends (Friday and Sunday) when business travelers and weekenders inflate demand.

      ### 3. Book 6-8 Weeks in Advance
      For domestic routes, the sweet spot for booking is 3 to 6 weeks before departure. For international flights, try to book at least 2 to 4 months in advance.

      ### 4. Use Google Flights 'Everywhere' Feature
      If you are flexible on destination, type your departure city in Google Flights and search 'Everywhere' to see the cheapest destinations on a map.
    `
  },

  // 6. Cab Services
  {
    slug: "chennai-airport-taxi-guide",
    category: "cabs",
    title: "Chennai Airport Taxi & Cab Booking: Fares & Outstation Trips",
    author: "Karthik Raja",
    date: "June 22, 2026",
    readTime: "4 min read",
    excerpt: "Reliable airport pickups, Trichy outstation cabs, and tempo traveller bookings from Chennai. Read our complete cab booking guide.",
    image: cabImg,
    content: `
      Arriving at Chennai International Airport (MAA) and looking for a reliable, air-conditioned cab? Whether you need a local drop, an airport transfer, or an outstation taxi to Trichy, Madurai, or Pondicherry, Goimomi Cab Services offers transparent pricing and professional drivers.

      ### Available Vehicles & Seating Capacity
      * **Sedans (Swift Dzire/Etios):** Ideal for up to 4 passengers with light luggage.
      * **SUVs (Innova Crysta/Ertiga):** Comfortable for 6-7 passengers, perfect for family travel.
      * **Tempo Travellers (12/14/17 seaters):** Ideal for group tours and weddings.

      ### Outstation Fares & Packages
      We charge on a per-kilometer basis with no hidden driver bata or return toll charges, providing flat rate quotes.
      * **Chennai to Trichy:** ~320 km, starting from ₹5,500 flat.
      * **Chennai to Pondicherry:** ~150 km, starting from ₹2,800 flat.
    `
  },

  // 7. Cruise Holidays
  {
    slug: "singapore-cruise-holiday-guide",
    category: "cruises",
    title: "Singapore Cruise Guide: Royal Caribbean & Genting Dream Cruise",
    author: "Captain John",
    date: "June 27, 2026",
    readTime: "7 min read",
    excerpt: "Set sail from Singapore Marina Bay Cruise Centre. Explore routes, onboard dining, shows, and visa guidelines.",
    image: cruiseImg,
    content: `
      Cruising from Singapore is an ultra-luxurious way to experience Southeast Asia. Ports of call usually include Phuket (Thailand), Penang (Malaysia), and Port Klang (Kuala Lumpur). Here is your guide to choosing and booking a cruise.

      ### Major Cruise Liners from Singapore
      1. **Resorts World Cruises (Genting Dream):** Famous for Halal dining, outdoor waterslides, and high-energy theatrical performances.
      2. **Royal Caribbean (Anthem/Spectrum of the Seas):** Featuring high-tech amenities like the RipCord by iFly skydiving simulator, North Star observation capsule, and Broadway-style musicals.

      ### Visa Requirements for Cruise
      Cruising involves multiple countries. Ensure you hold a **Multiple Entry Singapore Visa** (to re-enter Singapore after the cruise) and a **Malaysia/Thailand Visa** depending on the itinerary.
    `
  },

  // 8. Travel Tips & Hacks
  {
    slug: "ultimate-international-travel-packing-checklist",
    category: "tips",
    title: "The Ultimate International Travel Packing Checklist",
    author: "Sarah Jenkins",
    date: "June 24, 2026",
    readTime: "5 min read",
    excerpt: "Avoid forgetting essential documents, adapters, and medicines. Our comprehensive packing guide covers everything.",
    image: packingImg,
    content: `
      Packing for an international trip can be stressful. To ensure you don't leave anything critical behind, print out this checklists.

      ### 1. Essential Travel Documents (Hand Luggage)
      * Passport (valid for 6 months + physical copies)
      * Printed e-Visas and hotel vouchers
      * Return flight tickets
      * International Travel Insurance policy
      * Foreign currency cash and forex cards

      ### 2. Electronics & Gadgets
      * Universal travel adapter (crucial for charging in different countries)
      * Power bank (under 20,000mAh for carry-on compatibility)
      * Phone charger, headphones, and camera gear

      ### 3. Basic Toiletries & Medicines
      * Prescribed medicines with original doctor prescription
      * Painkillers, motion sickness tablets, Band-aids, and ORS packets
      * Travel-sized toothbrush, toothpaste, and sunblock
    `
  },

  // 9. Destination Comparisons
  {
    slug: "dubai-vs-singapore",
    category: "comparison",
    title: "Dubai vs Singapore: Which Destination is Best for Your Next Trip?",
    author: "Rohan Kapoor",
    date: "June 17, 2026",
    readTime: "6 min read",
    excerpt: "We compare budget, attractions, climate, and food to help you pick between Singapore and Dubai.",
    image: dubaiVsSingaporeImg,
    content: `
      Both Dubai and Singapore are prime modern tourist destinations, but they offer completely different vibes. Let's compare them across key parameters.

      ### 1. Climate and Vibe
      * **Dubai:** A golden desert oasis. Expect hot weather (best visited Nov-March). Known for massive skyscrapers, luxury shopping malls, and adventure.
      * **Singapore:** A tropical, humid city-state. Green, clean, and futuristic. Best visited year-round. Highly pedestrian-friendly and family-oriented.

      ### 2. Main Attractions
      * **Dubai:** Burj Khalifa, Desert Safari, Palm Jumeirah, Dubai Mall.
      * **Singapore:** Gardens by the Bay, Sentosa Island, Universal Studios, Night Safari.

      ### 3. Food Scene
      * **Dubai:** Excellent Middle Eastern cuisines, fine dining, and diverse international foods.
      * **Singapore:** Renowned street food (Hawker Centres) blending Chinese, Malay, Indian, and Peranakan flavors.
    `
  },

  // 10. Festival Travel Guides
  {
    slug: "ramadan-umrah-guide-benefits",
    category: "festival",
    title: "Ramadan Umrah Guide: Spiritual Benefits & Booking Tips",
    author: "Maulana Tariq",
    date: "June 14, 2026",
    readTime: "7 min read",
    excerpt: "Performing Umrah in Ramadan holds immense spiritual reward. Plan your travel, hotel bookings, and daily schedule.",
    image: ramadanUmrahImg,
    content: `
      Performing Umrah during the holy month of Ramadan is an experience of a lifetime. The Prophet Muhammad (peace be upon him) said:
      > *"An Umrah performed in Ramadan is equal to performing Hajj with me."*

      ### Challenges & Crowds
      Because of the immense spiritual rewards, millions of pilgrims gather in Makkah. It is the peak season, leading to:
      * **High hotel tariffs:** Accommodation prices near the Haram can double or triple.
      * **Crowd management:** Tight security, closed roads, and filled prayer halls hours before Salah.

      ### Tips for Ramadan Umrah
      1. **Book 6 Months in Advance:** Secure flight tickets and hotel rooms early.
      2. **Choose Hotels slightly further out:** If on a budget, choose hotels with free shuttle services (e.g. in Kudai or Mahbas Al-Jin).
      3. **Stay Hydrated:** Drink plenty of Zamzam water during Suhoor and Iftar.
    `
  }
];

// Helper to get posts by category
export const getPostsByCategory = (categoryId) => {
  return blogPosts.filter(post => post.category === categoryId);
};

// Helper to get related posts (excluding the current one)
export const getRelatedPosts = (currentSlug, category, limit = 3) => {
  return blogPosts
    .filter(post => post.category === category && post.slug !== currentSlug)
    .slice(0, limit);
};
