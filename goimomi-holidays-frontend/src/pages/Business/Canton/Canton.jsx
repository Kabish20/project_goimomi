import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, MapPin, ChevronDown, ChevronUp, ChevronRight, CheckCircle, Clock,
  Users, ShieldCheck, Globe, Phone, Mail, Instagram, Facebook,
  Check, X, ArrowRight, Shield, Plane, Cpu, Settings, Shirt, Layers,
  Lightbulb, Stethoscope, Building, Utensils, Wrench, Hammer, Car, Tv,
  ShoppingBag, Gamepad, Factory, Sparkles, Handshake, Languages,
  UserCheck, Hotel, FileText, TrendingUp, Layout, Building2, Star
} from "lucide-react";
import usePageSEO from "../../../hooks/usePageSEO";


import cantonHero from "@/assets/images/canton-hero.png";
import cantonExpo from "@/assets/images/canton-expo.png";
import sourcingImg from "@/assets/images/sourcing.png";
import cantonNetworking from "@/assets/images/canton-networking.png";
import cantonFactory from "@/assets/images/canton-factory.png";
import guangzhouAttractions from "@/assets/images/guangzhou-attractions.png";
import foshanAttractions from "@/assets/images/foshan-attractions.png";
import cantonIntroThumb from "@/assets/images/canton_fair_intro_thumb.png";
import cantonExhibitorThumb from "@/assets/images/canton_fair_exhibitor_thumb.png";
import cantonBuyerThumb from "@/assets/images/canton_fair_buyer_thumb.png";
import cantonActivityReview from "@/assets/images/canton-activity-review.png";

/* ─────────────────────────────── Countdown ─────────────────────────────── */
const CountdownTimer = ({ targetDate }) => {
  const calc = () => {
    const diff = +new Date(targetDate) - +new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);

  if (t.expired) return <p className="font-bold text-red-600 text-center">Early Bird Offer Expired</p>;

  return (
    <div className="flex justify-center gap-3 flex-wrap">
      {[["Days", t.days], ["Hours", t.hours], ["Mins", t.minutes], ["Secs", t.seconds]].map(([l, v]) => (
        <div key={l} className="bg-white border-2 border-amber-400 rounded-2xl px-5 py-3 text-center min-w-[72px] shadow-lg">
          <div className="text-3xl font-black text-amber-600 font-mono leading-none">{String(v).padStart(2,"0")}</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{l}</div>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────── Main Page ─────────────────────────────── */
const Canton = () => {
  usePageSEO(
    "140th China Canton Fair 2026 Business Delegation | Goimomi Holidays",
    "Join Goimomi Holidays for the 140th China Canton Fair 2026 Business Delegation. Hotel, Visa, Transfers, Networking, Factory Visits & More.",
    cantonHero,
    "Canton Fair 2026, Canton Fair Business Delegation, Guangzhou Business Tour, China Trade Fair, Canton Fair Package, China Business Visa, Factory Visit China, Business Delegation, Goimomi Holidays"
  );

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [hotelTab, setHotelTab] = useState("4star");
  const [activeVideo, setActiveVideo] = useState(null); // click-to-play: null = poster shown
  const [activityActiveTab, setActivityActiveTab] = useState("138th");

  // ── FAQ structured data
  useEffect(() => {
    const faq = document.createElement("script");
    faq.type = "application/ld+json"; faq.id = "faq-ld";
    faq.text = JSON.stringify({ "@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {q:"Do I need a China Visa?",a:"Yes. We assist with the visa process and documentation."},
      {q:"Can I visit factories?",a:"Yes. Private factory visits can be arranged on request."}
    ].map(({q,a})=>({
      "@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}
    }))});
    document.head.appendChild(faq);
    return () => { const el = document.getElementById("faq-ld"); if(el) el.remove(); };
  }, []);

  // ── Zoho Form Lightbox setup
  useEffect(() => {
    if (document.getElementById("formsLightBox_51620")) return; // already injected

    function constructDiv_51620() {
      const iframeDiv = document.createElement("div");
      iframeDiv.setAttribute("id", "1wgT6SGrRTJktf1BoOPcSx8XzW-50CjHFIQ9jaLJsjQ_51620");
      iframeDiv.setAttribute("class", "zf_main_id_51620");

      const closeFormDiv = document.createElement("div");
      closeFormDiv.setAttribute("id", "deleteform_51620");
      closeFormDiv.setAttribute("class", "zf_lb_closeform_51620");
      closeFormDiv.setAttribute("tabindex", 0);

      const containerDiv = document.createElement("div");
      containerDiv.setAttribute("id", "containerDiv_51620");
      containerDiv.setAttribute("class", "zf_lB_Container_51620");
      containerDiv.appendChild(iframeDiv);
      containerDiv.appendChild(closeFormDiv);

      const wrapperDiv = document.createElement("div");
      wrapperDiv.setAttribute("class", "zf_lB_Wrapper_51620");
      wrapperDiv.appendChild(containerDiv);

      const dimmerDiv = document.createElement("div");
      dimmerDiv.setAttribute("class", "zf_lB_Dimmer_51620");
      dimmerDiv.setAttribute("elname", "popup_box");

      const mainDiv = document.createElement("div");
      mainDiv.setAttribute("id", "formsLightBox_51620");
      mainDiv.style.display = "none";
      mainDiv.appendChild(wrapperDiv);
      mainDiv.appendChild(dimmerDiv);

      document.body.appendChild(mainDiv);
    }

    function getsrcurlZForm_51620(zf_src) {
      try {
        if (!((new RegExp("[?&]referrername=")).test(zf_src))) {
          let rfr = window.location.href;
          try {
            rfr = window.self !== window.top ? window.top.location.href :
              (/^https?:\/\/[\w.-]+\.[a-zA-Z]{2,}/i.test(rfr) ? rfr : "");
          } catch (e) {}
          if (rfr && rfr !== "") {
            if (rfr.length > 1800) {
              const qi = rfr.indexOf("?");
              if (qi > -1) rfr = rfr.substring(0, qi);
              if (rfr.length > 1800) rfr = rfr.substring(0, 1800);
            }
            zf_src += ((zf_src.indexOf("?") > 0) ? "&" : "?") + "referrername=" + encodeURIComponent(rfr);
          }
        }
      } catch (e) {}
      return zf_src;
    }

    function loadZForm_51620() {
      const iframeContainer = document.getElementById("1wgT6SGrRTJktf1BoOPcSx8XzW-50CjHFIQ9jaLJsjQ_51620");
      if (!iframeContainer) return;
      let iframe = iframeContainer.getElementsByTagName("iframe")[0];
      if (iframe == null) {
        const f = document.createElement("iframe");
        f.src = getsrcurlZForm_51620("https://forms.zohopublic.in/GoimomiHolidays/form/EventRegistrationForm/formperma/1wgT6SGrRTJktf1BoOPcSx8XzW-50CjHFIQ9jaLJsjQ?zf_rszfm=1");
        f.style.border = "none";
        f.style.minWidth = "100%";
        f.style.overflow = "hidden";
        iframeContainer.appendChild(f);

        const deleteForm = document.getElementById("deleteform_51620");
        deleteForm.onclick = deleteZForm_51620;
        deleteForm.addEventListener("keydown", (event) => {
          if (["Enter", " "].includes(event.key) || [13, 32].includes(event.keyCode)) {
            event.preventDefault();
            deleteZForm_51620();
          }
        });

        window.addEventListener("message", (event) => {
          const evntData = event.data;
          if (evntData && evntData.constructor === String) {
            const zf_ifrm_data = evntData.split("|");
            if (zf_ifrm_data.length === 2 || zf_ifrm_data.length === 3) {
              const zf_perma = zf_ifrm_data[0];
              const zf_ifrm_ht_nw = (parseInt(zf_ifrm_data[1], 10) + 15) + "px";
              const iframeCur = document.getElementById("1wgT6SGrRTJktf1BoOPcSx8XzW-50CjHFIQ9jaLJsjQ_51620").getElementsByTagName("iframe")[0];
              if (iframeCur && iframeCur.src.indexOf("formperma") > 0 && iframeCur.src.indexOf(zf_perma) > 0) {
                const prevHt = iframeCur.style.height;
                const zf_tout = zf_ifrm_data.length === 3;
                if (zf_tout) iframeCur.scrollIntoView();
                if (prevHt !== zf_ifrm_ht_nw) {
                  if (zf_tout) {
                    setTimeout(() => {
                      iframeCur.style.minHeight = zf_ifrm_ht_nw;
                      document.getElementById("containerDiv_51620").style.height = zf_ifrm_ht_nw;
                    }, 500);
                  } else {
                    iframeCur.style.minHeight = zf_ifrm_ht_nw;
                    document.getElementById("containerDiv_51620").style.height = zf_ifrm_ht_nw;
                  }
                }
              }
            }
          }
        }, false);
      }
    }

    function deleteZForm_51620() {
      const divCont = document.getElementById("formsLightBox_51620");
      if (divCont) divCont.style.display = "none";
      document.body.style.overflow = "";
      const container = document.getElementById("1wgT6SGrRTJktf1BoOPcSx8XzW-50CjHFIQ9jaLJsjQ_51620");
      if (container) {
        const iframeCur = container.getElementsByTagName("iframe")[0];
        if (iframeCur) iframeCur.remove();
      }
    }

    function showZForm_51620() {
      const iframeContainer = document.getElementById("1wgT6SGrRTJktf1BoOPcSx8XzW-50CjHFIQ9jaLJsjQ_51620");
      if (!iframeContainer) return;
      const iframe = iframeContainer.getElementsByTagName("iframe")[0];
      if (!iframe) loadZForm_51620();
      document.getElementById("formsLightBox_51620").style.display = "block";
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        const containerDiv = document.getElementById("containerDiv_51620");
        if (containerDiv) { containerDiv.setAttribute("tabindex", "-1"); containerDiv.focus(); }
      }, 100);
    }

    constructDiv_51620();
    // Expose globally so buttons can call it
    window.showZForm_51620 = showZForm_51620;

    return () => {
      const el = document.getElementById("formsLightBox_51620");
      if (el) el.remove();
      delete window.showZForm_51620;
      document.body.style.overflow = "";
    };
  }, []);

  const categories = [
    {name:"Electronics",icon:<Cpu className="w-5 h-5"/>},{name:"Furniture",icon:<Layout className="w-5 h-5"/>},
    {name:"Machinery",icon:<Settings className="w-5 h-5"/>},{name:"Garments",icon:<Shirt className="w-5 h-5"/>},
    {name:"Textiles",icon:<Layers className="w-5 h-5"/>},{name:"Lighting",icon:<Lightbulb className="w-5 h-5"/>},
    {name:"Medical",icon:<Stethoscope className="w-5 h-5"/>},{name:"Building Materials",icon:<Building className="w-5 h-5"/>},
    {name:"Kitchen",icon:<Utensils className="w-5 h-5"/>},{name:"Tools",icon:<Wrench className="w-5 h-5"/>},
    {name:"Hardware",icon:<Hammer className="w-5 h-5"/>},{name:"Automobile Parts",icon:<Car className="w-5 h-5"/>},
    {name:"Home Appliances",icon:<Tv className="w-5 h-5"/>},{name:"Fashion",icon:<ShoppingBag className="w-5 h-5"/>},
    {name:"Toys",icon:<Gamepad className="w-5 h-5"/>},{name:"Industrial Equipment",icon:<Factory className="w-5 h-5"/>}
  ];

  const whyAttend = [
    {title:"Airport Assistance",icon:<Plane className="w-6 h-6"/>,desc:"VIP airport meet & greet and seamless transport on arrival."},
    {title:"Visa Experts",icon:<FileText className="w-6 h-6"/>,desc:"End-to-end guidance for faster China Business Visa approval."},
    {title:"Hotel Accommodation",icon:<Hotel className="w-6 h-6"/>,desc:"4-star and 5-star hotel options near key commercial centers."},
    {title:"Meet & Greet",icon:<Handshake className="w-6 h-6"/>,desc:"Dedicated reception team to welcome and assist you at every step."},
    {title:"Chinese Interpreter",icon:<Languages className="w-6 h-6"/>,desc:"Professional translators to support manufacturer negotiations."},
    {title:"Networking Dinner",icon:<Utensils className="w-6 h-6"/>,desc:"Exchange sourcing insights with 50+ elite Indian delegates."},
    {title:"Business Matching",icon:<TrendingUp className="w-6 h-6"/>,desc:"Strategic matchmaking to connect you with top-tier suppliers."},
    {title:"Travel Insurance",icon:<Shield className="w-6 h-6"/>,desc:"Comprehensive overseas medical & travel coverage included."},
    {title:"Factory Visits",icon:<Factory className="w-6 h-6"/>,desc:"Curated trips to manufacturing hubs in Foshan & Guangzhou."},
    {title:"Dedicated Tour Manager",icon:<UserCheck className="w-6 h-6"/>,desc:"On-ground coordinators ensuring all schedules run smoothly."},
    {title:"24/7 Support",icon:<Clock className="w-6 h-6"/>,desc:"Round-the-clock emergency support for visa, health, or travel."},
    {title:"Private Transfers",icon:<Car className="w-6 h-6"/>,desc:"Daily luxury shuttle to and from the Canton Fair Pazhou Complex."}
  ];

  const itinerary = [
    {day:"Day 1",title:"Arrival & Welcome Dinner",details:"Arrival in Guangzhou/Foshan. Airport meet & greet, hotel transfer, check-in, rest, and an elegant Welcome Dinner with fellow delegates."},
    {day:"Day 2",title:"City Tour & Briefing",details:"Morning business briefing on sourcing strategies. Afternoon Foshan city tour showcasing the local industrial landscape and cultural sites."},
    {day:"Day 3",title:"Canton Fair – Day 1",details:"Full-day entry to Canton Fair. Product exploration, B2B supplier interactions, and initial manufacturer networking."},
    {day:"Day 4",title:"Canton Fair – Day 2",details:"Deep sourcing session with factory representatives. Negotiation sessions and strategic matchmaking with global suppliers."},
    {day:"Day 5",title:"Factory Visits & Networking Dinner",details:"Guided private factory inspections in Guangzhou or Foshan, followed by a corporate Networking Dinner with fellow delegates."},
    {day:"Day 6",title:"Canton Fair Half-Day + Sightseeing",details:"Final sourcing wrap-up, then Guangzhou sightseeing: Canton Tower, Shamian Island, and Beijing Road shopping street."},
    {day:"Day 7",title:"Departure",details:"Breakfast, checkout, private transfer to Guangzhou Baiyun Airport, flight home with memories and business contacts."}
  ];

  const faqs = [
    {q:"Do I need a China Visa?",a:"Yes. We assist with full visa documentation, processing, and submission to ensure a high approval rate for business visas."},
    {q:"Can I visit factories?",a:"Yes. Private factory visits in Guangzhou and Foshan can be arranged upon request at no extra cost."},
    {q:"Can I extend my stay?",a:"Yes. Pre or post tour hotel and visa extension is available. Let us know when enquiring."},
    {q:"Will I get an interpreter?",a:"Yes. Professional English-to-Chinese translators are available to support all business meetings and negotiations."},
    {q:"Is travel insurance included?",a:"Yes, comprehensive overseas travel and medical insurance is fully included in all selected packages."},
    {q:"Can I carry product samples?",a:"Yes. You can carry product samples back within airline baggage allowances. We can guide customs documentation too."}
  ];

  const allTestimonials = [
    {
      initials: "KR",
      name: "Khaled Ramzy",
      role: "Overseas Export Director",
      company: "Fresh Electric Company",
      countryBadge: "Egypt 🇪🇬",
      colorBg: "bg-amber-100 text-amber-800",
      colorText: "text-amber-600",
      quote: "Participating in Canton Fair improves our company’s development obviously. We participate not only as the exhibitor, to promote our brands and enhance market popularity, but also we will send our procurement team to make trades and cooperate with Chinese accessory suppliers."
    },
    {
      initials: "WX",
      name: "Wang Xinglei",
      role: "Sales Manager in Asia Region",
      company: "SIMFER IC VE DIS.TIC.A.S",
      countryBadge: "Turkey 🇹🇷",
      colorBg: "bg-green-100 text-green-800",
      colorText: "text-green-600",
      quote: "We has participated in Canton Fair for ten consecutive years and expanded international markets in Africa, Southeast Asia, etc. Now our company is in transformation period from ‘Buying accessories from China’ to ‘Selling products to China’. Canton Fair is such an important platform for our successful transformation."
    },
    {
      initials: "LY",
      name: "Li Yuan",
      role: "Person in Charge",
      company: "LITANS INTERNATIONAL CORP.",
      countryBadge: "Canada 🇨🇦",
      colorBg: "bg-blue-100 text-blue-800",
      colorText: "text-blue-600",
      quote: "It has been a habit for our company to participate in Canton Fair International Pavilion. The form of Global Food & Drink Show this time is very original, which is a good try for Canton Fair to enrich its promotional methods. We hope that this kind of activity continues to be held, which can enhance the mutual understanding between exhibitors and buyers so as to help more overseas enterprises get on board the fast train of China’s development and share global development opportunities."
    },
    {
      initials: "YG",
      name: "Yohanes Gunawan",
      role: "Manager of Export Dept",
      company: "PT. SINAR ANTJOL",
      countryBadge: "Indonesia 🇮🇩",
      colorBg: "bg-red-100 text-red-800",
      colorText: "text-red-600",
      quote: "Through participating in Canton Fair for more than ten consecutive years, our company has successfully expanded China markets. Canton Fair, as a globally renowned comprehensive exhibition, is the indispensable platform for enterprises. Since the first participation in Canton Fair, our company has never been absent and also will not in the future."
    },
    {
      initials: "XH",
      name: "Xi Hongshi",
      role: "Person in Charge",
      company: "NISHIFUKUSEICHA CO.,LTD.",
      countryBadge: "Japan 🇯🇵",
      colorBg: "bg-purple-100 text-purple-800",
      colorText: "text-purple-600",
      quote: "In Canton Fair, many buyers know about our company through tasting our products, and finally the door to cooperation is opened. We want to sell our products to global markets through Canton Fair, of course, most of all is to cooperate with Chinese enterprises and then expand China markets."
    },
    {
      initials: "GY",
      name: "Guo Yiqun",
      role: "President of Food Chamber GZ",
      company: "Guangzhou Qunwang Trading",
      countryBadge: "China 🇨🇳",
      colorBg: "bg-amber-100 text-amber-800",
      colorText: "text-amber-600",
      quote: "Nowadays, the influence of global economic recession has also spread to food industry. Under this circumstance, it’s right time for Canton Fair International Pavilion to hold the Global Food & Drink Show, through which the buyers can get overseas products information in a short time and get in touch with the suppliers directly through face to face communication."
    },
    {
      initials: "WQ",
      name: "Wang Qingbin",
      role: "Manager",
      company: "Guangzhou Longlu Trading Co.",
      countryBadge: "China 🇨🇳",
      colorBg: "bg-green-100 text-green-800",
      colorText: "text-green-600",
      quote: "I come here every year and I have been to Canton Fair for a dozen of times. As far as I am concerned, Canton Fair is the biggest platform for import and export trade, which provides good communication opportunities for enterprises and overseas buyers. I think the effect of Canton Fair is excellent. There are a large number of exhibitors, including those from Europe, Asia, Africa, South America, which guarantee the variety of products."
    },
    {
      initials: "HK",
      name: "Hong Kong Buyer",
      role: "International Sourcing",
      company: "Hong Kong SAR",
      countryBadge: "Hong Kong SAR 🇭🇰",
      colorBg: "bg-blue-100 text-blue-800",
      colorText: "text-blue-600",
      quote: "Actually, this is my first time to visit Canton fair International Pavilion. This place is an eye-opener. Because you can find all the products from different countries here, unlike the previous Canton fair which only had goods from mainland China. I also learn a lot here, which increase my knowledge, and help to promote my company's products to overseas customers."
    },
    {
      initials: "V",
      name: "Sourcing Veteran",
      role: "Fair Attendee since 1950s",
      company: "Global Sourcing",
      countryBadge: "Global Sourcing 🌟",
      colorBg: "bg-red-100 text-red-800",
      colorText: "text-red-600",
      quote: "I came here to attend Canton fair in the 1950s. Now it has developed better than before, with many new categories and attracted many people."
    },
    {
      initials: "CF",
      name: "Carrefour",
      role: "Sourcing Department",
      company: "Carrefour China",
      countryBadge: "Carrefour China 🇨🇳",
      colorBg: "bg-purple-100 text-purple-800",
      colorText: "text-purple-600",
      quote: "The International Pavilion has gathered quality products from all over the world, to build communication channels between suppliers and buyers. It is very convenient for us to buy what we want."
    }
  ];

  const activityReviewData = [
    {
      session: "138th",
      year: "2025",
      events: [
        {
          name: "2025 Food and Agricultural Products Import Promotion Matchmaking Conference",
          bullets: [
            "Customized business matchmaking activities were organized for exhibitors, enabling them to find more opportunities for targeted cooperation.",
            "A large number of buyers as well as 30 international companies from Russia, Malaysia, Macao SAR, South Korea and other countries and regions participated in the event."
          ]
        },
        {
          name: "Russian Pavilion Opening Ceremony",
          bullets: [
            "On the first day of Phase 3, the Russian Pavilion held an opening ceremony. 38 companies from the Russian Pavilion made a remarkable appearance.",
            "Mr. Mitypov Vladimir, acting Consul General of the Consulate General of Russia in Guangzhou, attended the ceremony and delivered a speech."
          ]
        }
      ]
    },
    {
      session: "137th",
      year: "2025",
      events: [
        {
          name: "Global Food & Drink Show",
          bullets: [
            "The Canton Fair Customized business matchmaking activities for exhibitors in food industry, and provide opportunities for precise cooperation.",
            "30 international companies from Australia, Japan, Korea, Malaysia, etc. and over 60 Chinese buyers participated including Grandbuy, Friendship Group, Meituan, Miniso, Shengjia Supermarket, etc.",
            "Diversified formats were integrated, including promotion by consulate general, product runway showcases, on-site buyer matchmaking, exhibition booth tour, etc to facilitate transactions between exhibitors and buyers."
          ]
        },
        {
          name: "Thai Pavilion Opening Ceremony of the 137th Canton Fair International Pavilion",
          bullets: [
            "14 Thai companies participated in the 137th Canton Fair International Pavilion in Phase 2. The opening ceremony of the Thai Pavilion was held on the first day of Phase 2.",
            "Distinguished guests including Mr. Kajtiti Wiwatwanont, Consul-General of the Royal Thai Consulate-General in Guangzhou; Ms. Oranuch Wannapinyo, the Commercial Consul of the Royal Thai Consulate-General in Guangzhou and Representative of the SMEs Proactive Project, Ministry of Commerce, Thailand attended the ceremony."
          ]
        },
        {
          name: "Discover Canton Fair with Honey and Bee",
          bullets: [
            "Promote exhibitors and products to overseas professional buyers through live streams on major overseas social media platforms such as Facebook, TikTok, YouTube, Instagram, and Xiaohongshu.",
            "The online viewership of this event exceeded 5.5 million, facilitating the promotion of exhibitors' products."
          ]
        }
      ]
    },
    {
      session: "136th",
      year: "2024",
      events: [
        {
          name: "2024 Food and Agricultural Products Import Promotion Matchmaking Conference",
          bullets: [
            "Organized by Trade Development Bureau of the Ministry of Commerce and supported by China Foreign Trade Centre, the 2024 Food and Agricultural Products Import Promotion Matchmaking Conference was attended by Embassy in China and consulates in Guangzhou of African and Latin American countries, industry associations and companies’ representatives.",
            "Over 100 hundred buyers participated in the matchmaking.",
            "30 companies from Australia, Japan, Korea, Malaysia, Peru, Russia, Tanzania, Vietnam, Uganda, etc promote special products onsite."
          ]
        },
        {
          name: "Russian Pavilion Opening Ceremony of the 136th Canton Fair",
          bullets: [
            "30 companies from 13 regions in Russia participated in the 136th Canton Fair. The Russian Pavilion Opening Ceremony was grandly held on the first day of Phase 3, jointly hosted by the Russian International Communications Agency Co., Ltd. and export promotion centers from different regions of the Russian Federation.",
            "The ceremony was attended by important guests, including Wang Junwen, former Counselor for Economic and Commercial Affairs at the Chinese Embassy in Russia; Xu Jiansheng, Operations Director of China Foreign Trade Centre Group Co., Ltd., Palkin Siumer, Trade Representative of the Russian Consulate General in Shanghai and representatives from different regions Trade Promotion Center of Russia, representatives of Russian exhibitors, etc.",
            "Renowned media including China News Service and Youcheng Evening News, conducted interviews and reports. Multiple cooperation agreements were signed on-site to promote Russian high-quality products entering the Chinese market."
          ]
        }
      ]
    },
    {
      session: "135th",
      year: "2024",
      events: [
        {
          name: "The Household Items Matchmaking Event of the 135th Canton Fair International Pavilion",
          bullets: [
            "The Canton Fair International Pavilion held a trade matchmaking event in Phase 2 for the first time.",
            "10 exhibitors from different countries such as Germany, Italy, Japan, South Korea, and Egypt were invited to showcase their products, with 85 Chinese domestic buyers from Guangzhou Friendship Group, Beijing Hualian Guangzhou Procurement Center, 7-Eleven, and Miniso participated in.",
            "An International Pavilion visiting group, composed of Chinese domestic VIP buyers, visited the exhibitors' booths on-site to view the products and conduct negotiations."
          ]
        },
        {
          name: "Malaysia Pavilion Opening Ceremony",
          bullets: [
            "A delegation of 63 Malaysian companies participated in the 135th Canton Fair International Pavilion. Malaysia External Trade Development Corporation held a grand opening ceremony for the Malaysia Pavilion on the first day of Phase 3.",
            "Important guests attending the event included the Malaysian Member of Parliament (Malaysian former Special Envoy to China) Mr. Tan Kok Wai, the Consul General of Malaysia in Guangzhou Mrs. Suraya and the Vice President of the China Foreign Trade Centre Group Mr. Shanqing Zhou."
          ]
        }
      ]
    },
    {
      session: "134th",
      year: "2023",
      events: [
        {
          name: "2023 Food and Agricultural Products Import Promotion Matching Conference",
          bullets: [
            "Co-hosted by Trade Development Bureau of the Ministry of Commerce and China Foreign Trade Centre.",
            "Representatives from relevant departments of the Ministry of Commerce of China, some African and Latin American countries' consulates in Guangzhou, industry associations, and representatives from related companies attended.",
            "Over 30 suppliers and more than 60 buyers conducted negotiations and secured orders."
          ]
        },
        {
          name: "Malaysia Pavilion Opening Ceremony",
          bullets: [
            "Malaysian Pavilion brought 35 companies participated in the 134th Canton Fair International Pavilion. The Malaysia External Trade Development Corporation (MATRADE) held the opening ceremony of the Malaysian Pavilion on the first day of Phase 3.",
            "Important guests including Malaysian Members of Parliament (Malaysian former Special Envoy to China) Mr. Tan Kok Wai, Consul General of the Malaysian Consulate in Guangzhou Mrs. Suraya and Vice President of China Foreign Trade Centre Group Mr. Sihong Zhang attended the event."
          ]
        }
      ]
    },
    {
      session: "133rd",
      year: "2023",
      events: [
        {
          name: "Exchange forum on import exhibits entitled for favorable taxation policy during the 2023 Canton Fair",
          bullets: [
            "With the approval from the State of Council, a tax cut policy for exhibits of the 133rd China Import and Export Fair International Pavilion were issued, which articulated that the import exhibits within specified limit sold during the exhibition period of Canton Fair in 2023 are exempted from import duties, import value-added taxes and consumption taxes. To help domestic and foreign enterprises understand and enjoy the favorable policy, the 133rd Canton Fair held an exchange forum on import exhibits entitled for favorable taxation policy.",
            "The event was attended by overseas partner organizations, representatives of international exhibitors, domestic importers' associations, importers and media reporters.",
            "Guangzhou Customs experts interpreted the favorable taxation policy and responded to questions from international exhibitors."
          ]
        },
        {
          name: "Opening Ceremony of Malaysia Pavilion",
          bullets: [
            "37 companies formed the Malaysian national pavilion to participate in the 133rd Canton Fair. Malaysia External Trade Development Corporation held a grand opening ceremony of Malaysia pavilion on the first day in Phase 3.",
            "Attended by the Consul General of Malaysia in Guangzhou Mrs Suraya Binti Ahmad Pauzi, Vice President of China Foreign Trade Centre Group Mr Zhang Sihong and other distinguished guests."
          ]
        }
      ]
    },
    {
      session: "132nd",
      year: "2022",
      events: [
        {
          name: "Canton Fair dual circulation promotion events- Online match-making event of food industry",
          bullets: [
            "Representative domestic retail supermarkets and well-known imported food procurement platforms, including Vanguard, Meiyijia, etc, participated in the events.",
            "With a total of over 100 well-known brands promoted products online, including Australia's largest food retailer Woolworths, supermarket giant Coles, oat brand Clare Valley and other well-known overseas companies.",
            "Precise pre-matching according to the requirements of suppliers and purchasers, a number of 'one-to-one' promotional meetings were held online. The events promoted the effectiveness of trade."
          ]
        }
      ]
    },
    {
      session: "131st",
      year: "2022",
      events: [
        {
          name: "Canton Fair dual circulation promotion events",
          bullets: [
            "Invited the representative domestic retailers and famous cross-border e-commerce platforms such as Yonghui Superstores, Yuguo Cross-border, Shein Cross-border to release their purchasing demands.",
            "Attracted nearly 18,000 online viewers to participate, contributes to the trade and financial matching with about 530 companies.",
            "Strongly promote the integrated development of domestic and foreign trade, helping enterprises to grasp the new opportunities of the dual cycle and create new competitive advantages."
          ]
        }
      ]
    },
    {
      session: "130th",
      year: "2021",
      events: [
        {
          name: "Domestic and international dual cycle, domestic and foreign trade launch together——Canton Fair dual-cycle promotion events",
          bullets: [
            "Invite leading purchasing groups including China Resources Vanguard, Suning, Miniso, Netease Selected, Banggu Technology, XinYouzhi Yanxiang, Xing’an Supermarket, Shengjia Supermarket, Aozhixing Trade Development Company, and Cloud Goods Youxiang to participate in the matching events.",
            "helping export exhibitors to establish cooperation with domestic procurement leaders, and finally about 110 exhibitors from 31 provinces and cities attended the event.",
            "Expand the breadth and depth of the dual cycle of services, and strive to contribute to the construction of a new development pattern of Canton Fair."
          ]
        }
      ]
    },
    {
      session: "129th",
      year: "2021",
      events: [
        {
          name: "Domestic Market Match-making",
          bullets: [
            "200+ exhibitors & 1000+ professional domestic buyers.",
            "Industrial knowledge sharing made by distinguished guests.",
            "Remarkable and effective trade match-making results.",
            "Support from industrial and commercial bank of China (ICBC)."
          ]
        }
      ]
    },
    {
      session: "128th",
      year: "2020",
      events: [
        {
          name: "Domestic Market Matching-making",
          bullets: [
            "Setting up 3 theme areas on site: 'Guangdong • life', 'Guangdong • delicious' and 'Guangdong • health';",
            "Organizing direct negotiation between 40+ exhibitors and 100+ representatives from large supermarkets, chain stores, social e-commerce platforms and professional business associations;",
            "Effectively promoting the foreign trade enterprises to connect with the domestic market, strengthen their brands, and facilitate the optimization and upgrading of trade structure."
          ]
        }
      ]
    },
    {
      session: "127th",
      year: "2020",
      events: [
        {
          name: "Sourcing Briefing",
          bullets: [
            "Cooperating with JD.COM, Suning.com and Lifease - 3 Chinese leading e-commerce platforms.",
            "Interpreting consumption trends, introducing the platform and releasing sourcing requests.",
            "Helping enterprises to better understand the consumption trends and terminal market demand."
          ]
        },
        {
          name: "Customs Service",
          bullets: [
            "Scene 1: Interpretation of customs cross-border trade facilitation measures.",
            "Scene 2: Customs clearance policies and technical services of import and export food.",
            "Scene 3: Customs import and export supervision and technical services of hot commodities."
          ]
        }
      ]
    },
    {
      session: "126th",
      year: "2019",
      events: [
        {
          name: "Global Food & Drink Show of 126th Canton Fair International Pavilion",
          bullets: [
            "Exhibitors: 36 quality food enterprises from 10 countries.",
            "Main buyers: Local organizations and professional buyers from nearly 200 enterprises.",
            "Building a high-quality communication platform for the food industry, helping to deepen understanding, strengthen interaction and share global development opportunities."
          ]
        },
        {
          name: "The Opening Ceremony of Fukuoka Pavilion",
          bullets: [
            "On the occasion of the 40th anniversary of the establishment of an international sister city between Guangzhou and Fukuoka, Japan, Fukuoka organized a delegation to exhibit in the Canton fair for the first time.",
            "Invitees: Officials of the Fukuoka municipal government of Japan, Japanese consul general in Guangzhou, Guests of the visiting delegation.",
            "Expanding Japanese enterprises’ influence in the Chinese and global cooperation network."
          ]
        }
      ]
    },
    {
      session: "125th",
      year: "2019",
      events: [
        {
          name: "“Meet the world in the Greater Bay Area” Global Cooperation Meeting of Canton Fair",
          bullets: [
            "Together with the Department of Commerce of Guangdong Province.",
            "Over 100 representatives from commercial departments of 9 cities alongside the Greater Bay Area, from business associations delegation of Hong Kong SAR, from consulates and trade promotion agencies in Guangzhou.",
            "Promoting the exchange of business resources in the Greater Bay Area and beyond, and facilitating the extensive connection and cooperation between domestic and overseas enterprises."
          ]
        }
      ]
    },
    {
      session: "124th",
      year: "2018",
      events: [
        {
          name: "The 124th Canton Fair VIP Buyers Communication Meeting",
          bullets: [
            "Over 50 representatives from Guangzhou municipal commission of commerce, professional associations, cross-border E-commerce platforms and local supermarkets.",
            "Introduction of qualified exhibit products in 124th International Pavilion and experience sharing among attendees."
          ]
        },
        {
          name: "The 124th Canton Fair International Pavilion Global Cooperation Meeting",
          bullets: [
            "Over 50 representatives from Consulates in Guangzhou, trade promotion organizations, recruitment partners and prestigious exhibitors.",
            "Combining the high-end wine party with guest sharing and business negotiations, exchanging market trends and industry experience."
          ]
        }
      ]
    },
    {
      session: "123rd",
      year: "2018",
      events: [
        {
          name: "The 123rd Business Meetings with Members of Chambers & Associations",
          bullets: [
            "Hosts: China Foreign Trade Centre, Consulate General of Malaysia in Guangzhou MATRADE.",
            "Invite professional food importers and household importers.",
            "Face-to-face negotiation.",
            "Authoritative trouble shooting about customs clearance."
          ]
        },
        {
          name: "The 123rd A Night Of Glory - Awards Ceremony And Reception For Prestigious Partners",
          bullets: [
            "Over 200 guests from over 20 countries and regions, including some national and regional trade promotion agencies, diplomatic and consular representatives in Guangzhou, partners of International Pavilion, overseas exhibitors, domestic buyers and so on.",
            "Recognizing the representatives with strong professional strength, outstanding brand image, and in the leading position of the market.",
            "A high-end business communication platform with novel forms."
          ]
        }
      ]
    },
    {
      session: "122nd",
      year: "2017",
      events: [
        {
          name: "The 122nd Trade Matching Event: Q-Baby Salon",
          bullets: [
            "To build a ‘One-Stop’ platform for overseas exhibitors and domestic buyers, ‘Q-Baby Salon’ was hosted during Phase 3 of 122nd exhibition.",
            "Over 20 Companies achieved cooperation agreement on-site, Over 80 Trade representatives from local associations of importers and retailers, Over 300 Headcounts of passenger flow."
          ]
        }
      ]
    },
    {
      session: "121st",
      year: "2017",
      events: [
        {
          name: "The 121st Business Matching Meeting of Fujian Province, Malaysia and India",
          bullets: [
            "Together with Department of Commerce of Fujian Province, Consulate General of Malaysia in Guangzhou and Consulate General of India in Guangzhou.",
            "About 20 Indian Exhibitors and Malaysian Exhibitors, Over 50 Professional Buyers from Fujian, Over 10 Companies signed the cooperation agreement on the event.",
            "Helping overseas companies and domestic buyers understand the latest market trends and current political hot spots."
          ]
        }
      ]
    },
    {
      session: "120th",
      year: "2016",
      events: [
        {
          name: "The 120th Australian Products & Cross-Border E-commerce Conference",
          bullets: [
            "Helping overseas enterprises and domestic buyers better grasp the policy bonus after the signature of Agreement of Free Trade between China and Australia.",
            "Offering convenience for Australian exhibitors to explore Chinese market and find ideal partners."
          ]
        },
        {
          name: "The 120th Business Matching Conference of Liaoning Province and Canton Fair International Pavilion",
          bullets: [
            "Integrating excellent overseas resources of International Pavilion and new development dynamics of Liaoning import market.",
            "Creating a communication platform for Liaoning import trade companies and abundant qualified overseas exhibitors."
          ]
        }
      ]
    },
    {
      session: "119th",
      year: "2016",
      events: [
        {
          name: "The 119th Canton Fair International Pavilion Global Food and Drink Promotional Event",
          bullets: [
            "Face to face communication for qualified foreign food enterprises and purchasing companies in southern China.",
            "More characteristic food and drink of excellent quality are introduced to market in southern China.",
            "Helping enterprises achieve a better understanding of relevant policies and trade process regarding imported food."
          ]
        }
      ]
    },
    {
      session: "118th",
      year: "2015",
      events: [
        {
          name: "The 118th Argentine Beef and Wine Tasting Event",
          bullets: [
            "Together with Consulate General of Argentina Republic in Guangzhou and Fundación Exportar.",
            "Combining the trade matching platform with Argentine experiencing activities."
          ]
        },
        {
          name: "The 118th The Development Forum of China-Australia Free Trade Agreement & Business Matching Event",
          bullets: [
            "Focusing on the Free Trade Agreement signed between China and Australia.",
            "Together with Guangzhou municipal commission of commerce and Australian Trade Commission.",
            "Participants gather to seek new opportunities for business cooperation."
          ]
        }
      ]
    },
    {
      session: "117th",
      year: "2015",
      events: [
        {
          name: "The 117th Global Wine Tasting",
          bullets: [
            "Together with delegations from Estonia, Germany and Canada.",
            "Promoting the publicity of overseas enterprises."
          ]
        },
        {
          name: "The 117th Match-making Conference for Canton Fair International Pavilion and China (Guangdong) Pilot Free Trade Zone",
          bullets: [
            "Interpreting new opportunities provided by the Pilot Free Trade Zone for overseas companies to explore Chinese market.",
            "Offering a chance of face to face communication for overseas exhibitors and enterprises in the Zone, to jointly build a superior import platform in China."
          ]
        }
      ]
    },
    {
      session: "116th",
      year: "2014",
      events: [
        {
          name: "The 116th Initiative Ceremony of Global Strategic Partnership of Canton Fair International Pavilion",
          bullets: [
            "Over 100 representatives from Consulates in Guangzhou, Trade Organizations in China, Overseas Exhibition Institutions, Departments of Commerce of Provinces and Business Associations are invited, 14 organization cooperation memos or agreements are signed, showing the theme of 'Toward global vision and make progress together'.",
            "About 50 media websites reported."
          ]
        }
      ]
    }
  ];

  return (
    <div className="bg-white text-gray-800 font-sans overflow-x-hidden">
      {/* Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .marquee-track { animation: marquee 30s linear infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* ── URGENT TICKER ── */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 overflow-hidden whitespace-nowrap">
        <div className="inline-flex marquee-track gap-0">
          {[1,2].map(i=>(
            <span key={i} className="inline-block px-8 text-xs font-bold tracking-wide uppercase">
              🔥 Early Bird Offer Ends 31 August 2026 &nbsp;•&nbsp; Phase 1: Oct 15–19 (Electronics, Machinery &amp; Industrial) &nbsp;•&nbsp; Phase 2: Oct 23–27 (Consumer Goods, Gifts, Fashion &amp; Textiles) &nbsp;•&nbsp; Phase 3: Oct 31–Nov 4 (Office, Healthcare, Food &amp; Leisure) &nbsp;•&nbsp; Limited Seats — Register Now &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={cantonHero} alt="Canton Fair 2026" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 w-full">
          <div className="max-w-3xl space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-400 text-black px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg float">
              <Sparkles className="w-3.5 h-3.5" /> Guangzhou, China • Oct 15 – Nov 4, 2026
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight">
                140<sup className="text-3xl">th</sup> China<br />
                <span className="text-amber-400">Canton Fair</span>
              </h1>
              <p className="text-2xl sm:text-3xl font-bold text-white/90">Business Delegation 2026</p>
            </div>

            <p className="text-lg text-white/80 font-medium leading-relaxed max-w-xl">
              The World's Largest Trade Fair. Source directly from manufacturers, build global partnerships, and grow your business.
            </p>

            {/* Quick bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["4★ & 5★ Hotels","Visa Assistance","Airport Transfers","Canton Fair Entry","Networking Dinner","Factory Visits"].map((item,i)=>(
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 rounded-xl">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-white text-xs font-semibold">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => window.showZForm_51620?.()}
                className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-xl text-sm uppercase tracking-wide shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Book Your Seat <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="tel:+918110082222"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold rounded-xl text-sm uppercase tracking-wide border border-white/30 flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4" /> Call an Expert
              </a>
            </div>

            {/* Trusted by */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20">
              <span className="text-white/50 text-xs font-semibold mr-2 mt-1">Trusted by:</span>
              {["Importers","Exporters","Manufacturers","Retailers","Wholesalers","Entrepreneurs"].map((t,i)=>(
                <span key={i} className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full border border-white/20">✔ {t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50">
          <span className="text-[10px] uppercase tracking-widest">Scroll Down</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-amber-400 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[["50,000+","Global Exhibitors"],["200+","Countries Represented"],["7 Days","Delegation Programme"],["10,000+","Indian Buyers Visit Annually"]].map(([v,l],i)=>(
            <div key={i}>
              <div className="text-3xl font-black text-black">{v}</div>
              <div className="text-xs font-bold text-black/70 uppercase tracking-wide mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CANTON FAIR VIDEOS ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Heading */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <Globe className="w-3.5 h-3.5" /> Official Canton Fair Media
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              See the <span className="text-amber-500">Canton Fair</span> in Action
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Watch the official introduction video to discover why the Canton Fair is the world's premier trade destination.
            </p>
          </div>

          {/* Centered video container */}
          <div className="max-w-2xl mx-auto">

            {/* Card 1 — Introduction */}
            <div className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
              {/* Click-to-play area */}
              <div className="relative w-full bg-gray-900" style={{ paddingBottom: "56.25%" }}>
                {activeVideo === 0 ? (
                  <video
                    src="https://cmsfile.cantonfair.org.cn/fileserver/cms/video/20261/20261715135793.mp4"
                    className="absolute inset-0 w-full h-full object-cover"
                    controls
                    autoPlay
                    playsInline
                    referrerPolicy="no-referrer"
                    controlsList="nodownload"
                    disablePictureInPicture
                  />
                ) : (
                  <button
                    onClick={() => setActiveVideo(0)}
                    className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 bg-gray-900 group/play cursor-pointer overflow-hidden"
                    aria-label="Play: Welcome to the Canton Fair International Pavilion"
                  >
                    {/* Thumbnail Image */}
                    <img src={cantonIntroThumb} alt="Welcome to the Canton Fair International Pavilion Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/play:scale-105 transition-transform duration-500" />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/80" />

                    {/* Canton Fair logo bar */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      <div className="bg-amber-400 rounded px-2 py-0.5 text-[9px] font-black text-black uppercase tracking-widest">Canton Fair</div>
                      <div className="bg-white/10 rounded px-2 py-0.5 text-[9px] font-semibold text-white/70 uppercase tracking-widest">Official</div>
                    </div>
                    {/* Play button */}
                    <div className="relative z-10">
                      <div className="absolute inset-0 bg-amber-400/30 rounded-full animate-ping" />
                      <div className="relative w-16 h-16 bg-amber-400 hover:bg-amber-300 rounded-full flex items-center justify-center shadow-2xl group-hover/play:scale-110 transition-transform duration-200">
                        <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                    <p className="text-white/90 text-xs font-semibold uppercase tracking-widest z-10">Click to Play</p>
                  </button>
                )}
              </div>
              {/* Info */}
              <div className="p-5 flex flex-col gap-2 flex-1">
                <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest w-fit">
                  <Globe className="w-3 h-3" /> Official Introduction
                </span>
                <p className="font-bold text-gray-900 text-sm leading-snug">
                  Welcome to the Canton Fair International Pavilion
                </p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  The world's largest trade exhibition — 50,000+ exhibitors, 200+ countries, one destination.
                </p>
              </div>
            </div>

          </div>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.showZForm_51620?.()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-xl text-sm uppercase tracking-wide shadow-xl hover:scale-105 transition-all"
            >
              <ArrowRight className="w-4 h-4" /> Register for the Delegation
            </button>
            <a
              href="tel:+918110082222"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-sm uppercase tracking-wide shadow-xl hover:scale-105 transition-all"
            >
              <Phone className="w-4 h-4" /> Call an Expert
            </a>
          </div>
        </div>
      </section>

      {/* ── ABOUT CANTON FAIR ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              World's Largest Trade Exhibition
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">What is<br /><span className="text-amber-500">Canton Fair?</span></h2>
            <p className="text-gray-600 text-base leading-relaxed">
              The Canton Fair (China Import & Export Fair) is the <strong>largest international trade exhibition in the world</strong>, held twice annually in Guangzhou. It brings together over 50,000 exhibitors from every industry imaginable.
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              For Indian businesses, this is the ultimate opportunity to <strong>source directly from Chinese manufacturers</strong>, cutting out middlemen and negotiating factory-direct pricing.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {["Find Verified Suppliers","Meet Factory Owners Directly","Build Long-Term Partnerships","Import at Factory Prices","Expand International Business"].map((item,i)=>(
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -right-4 w-full h-full bg-amber-200 rounded-3xl rotate-2" />
            <img src={cantonExpo} alt="Canton Fair Exhibition" className="relative rounded-3xl w-full object-cover shadow-2xl hover:scale-[1.02] transition-transform duration-500" />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">140th China Canton Fair 2026</p>
                  <p className="text-xs text-gray-500">Pazhou Complex, Guangzhou • Oct 15 – Nov 4, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CANTON FAIR DATES & PHASES ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-5xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" /> Autumn Edition 2026
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white">140th Canton Fair <span className="text-amber-400">Dates & Phases</span></h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">The 140th Autumn Edition runs across three phases — each covering distinct industries. Choose the phase that matches your sourcing needs.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                phase: "Phase 1",
                title: "Electronics, Machinery & Industrial Products",
                dates: "Oct 15 – 19, 2026",
                color: "from-blue-500 to-indigo-600",
                borderColor: "border-blue-500/40",
                badgeColor: "bg-blue-500/20 text-blue-300",
                icon: <Cpu className="w-6 h-6" />,
                items: [
                  "Consumer Electronics",
                  "Household Electrical Appliances",
                  "Electronic & Electrical Products",
                  "Lighting Equipment",
                  "Hardware & Tools",
                  "Machinery & Industrial Equipment",
                  "Construction Machinery",
                  "Agricultural Machinery",
                  "Industrial Automation & Smart Manufacturing",
                  "Power & Electrical Equipment",
                  "Building Materials",
                  "New Energy Resources",
                  "New Energy Vehicles & Spare Parts",
                  "Motorcycles & Bicycles",
                  "Chemical Products",
                  "General Machinery Components"
                ]
              },
              {
                phase: "Phase 2",
                title: "Consumer Goods, Gifts, Fashion & Textiles",
                dates: "Oct 23 – 27, 2026",
                color: "from-amber-500 to-orange-500",
                borderColor: "border-amber-500/40",
                badgeColor: "bg-amber-500/20 text-amber-300",
                icon: <Building className="w-6 h-6" />,
                items: [
                  "Consumer Goods",
                  "Gifts & Premiums",
                  "Festival Products",
                  "Home Decorations",
                  "Furniture",
                  "Kitchen & Tableware",
                  "Daily-use Ceramics",
                  "Glass Artware",
                  "Fashion Accessories",
                  "Men’s & Women’s Clothing",
                  "Sports & Casual Wear",
                  "Shoes & Bags",
                  "Home Textiles",
                  "Textile Fabrics & Raw Materials",
                  "Watches & Optical Products",
                  "Gardening Products"
                ]
              },
              {
                phase: "Phase 3",
                title: "Office, Healthcare, Food & Leisure Products",
                dates: "Oct 31 – Nov 4, 2026",
                color: "from-emerald-500 to-teal-600",
                borderColor: "border-emerald-500/40",
                badgeColor: "bg-emerald-500/20 text-emerald-300",
                icon: <Shirt className="w-6 h-6" />,
                items: [
                  "Office Supplies",
                  "Sports & Recreation Products",
                  "Travel Products",
                  "Healthcare & Medical Devices",
                  "Personal Care Products",
                  "Medicines & Health Products",
                  "Food & Beverages",
                  "Pet Products",
                  "Baby & Maternity Products",
                  "Toys",
                  "Toiletries",
                  "Leisure & Lifestyle Products"
                ]
              }
            ].map((phase, i) => (
              <div key={i} className={`relative bg-white/5 backdrop-blur-sm border-2 ${phase.borderColor} rounded-3xl p-6 sm:p-7 space-y-6 hover:bg-white/10 transition-all duration-300 group flex flex-col justify-between`}>
                <div className="space-y-5">
                  {/* Phase badge & Icon */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 ${phase.badgeColor} text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest`}>
                      {phase.phase}
                    </span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      {phase.icon}
                    </div>
                  </div>

                  {/* Title & Dates */}
                  <div>
                    <h3 className="text-base font-extrabold text-white leading-snug mb-1">{phase.title}</h3>
                    <div className={`text-xl font-black bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}>{phase.dates}</div>
                    <div className="text-gray-500 text-[11px] mt-1 uppercase tracking-wider">Pazhou Complex, Guangzhou</div>
                  </div>

                  {/* Sub-categories List */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      <span>Exhibition Sectors</span>
                      <span className="text-amber-400 font-extrabold">{phase.items.length} Categories</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 max-h-[260px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-white/20">
                      {phase.items.map((item, j) => (
                        <div key={j} className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 transition-colors">
                          <CheckCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span className="font-medium leading-tight text-[11px]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => window.showZForm_51620?.()}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wide bg-gradient-to-r ${phase.color} text-white hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg mt-4`}
                >
                  Register for {phase.phase} →
                </button>
              </div>
            ))}
          </div>

          {/* Timeline bar */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-bold text-sm">Fair Timeline — October to November 2026</p>
              <span className="text-gray-500 text-xs">All phases at Pazhou Complex, Guangzhou</span>
            </div>
            <div className="relative flex items-center h-10">
              <div className="absolute inset-0 flex rounded-xl overflow-hidden text-[10px] font-black uppercase tracking-wide">
                <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white" style={{width:"33%"}}>Phase 1 · Oct 15–19</div>
                <div className="flex items-center justify-center bg-gray-700 text-gray-500" style={{width:"8%"}}></div>
                <div className="flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white" style={{width:"33%"}}>Phase 2 · Oct 23–27</div>
                <div className="flex items-center justify-center bg-gray-700 text-gray-500" style={{width:"7%"}}></div>
                <div className="flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white" style={{width:"34%"}}>Phase 3 · Oct 31–Nov 4</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY GOIMOMI ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" /> Your Trusted Delegation Partner
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Why Attend Through<br /><span className="text-amber-500">Goimomi Holidays?</span></h2>
            <p className="text-gray-500 text-sm leading-relaxed">We handle all logistics — visa, hotel, transfers, translation — so you can focus 100% on sourcing and negotiations.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyAttend.map((item,i) => (
              <div key={i} className="group bg-white border-2 border-gray-100 hover:border-amber-300 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-amber-50 group-hover:bg-amber-400 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
                  <span className="text-amber-500 group-hover:text-black transition-colors">{item.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE SECTION (Image + Text) ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">The <span className="text-amber-500">Delegation Experience</span></h2>
            <p className="text-gray-500 mt-3 text-sm max-w-xl mx-auto">A curated, fully-managed business travel experience from India to Guangzhou and back.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {img: sourcingImg, title:"Live Sourcing at the Fair", desc:"Walk the world's largest exhibition floor and connect directly with 50,000+ manufacturers across 200+ countries."},
              {img: cantonNetworking, title:"Elite Networking Dinner", desc:"Share insights, build connections, and forge partnerships with fellow delegates at our exclusive evening dinners."},
              {img: cantonFactory, title:"Private Factory Visits", desc:"Step behind closed doors and inspect manufacturing units firsthand. Negotiate pricing and quality at the source."}
            ].map((card,i)=>(
              <div key={i} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="relative h-56 overflow-hidden">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-lg text-gray-900">{card.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CANTON FAIR HISTORICAL ACTIVITY REVIEW ── */}
      <section className="py-24 px-6 bg-gray-50 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-14 relative z-10">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" /> Historical Milestones
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
              International Pavilion <br />
              <span className="text-amber-500">Activity Review</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Explore the rich history of successful trade matchmaking, pavilion grand opening ceremonies, and global strategic cooperation events from previous Canton Fair sessions.
            </p>
          </div>

          {/* Core layout grid */}
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Left Scrollable sidebar tabs */}
            <div className="lg:col-span-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Select Canton Fair Session</p>
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[520px] pb-3 lg:pb-0 pr-0 lg:pr-2 scrollbar-thin scrollbar-thumb-amber-200">
                {activityReviewData.map((sessionObj) => {
                  const isActive = activityActiveTab === sessionObj.session;
                  return (
                    <button
                      key={sessionObj.session}
                      onClick={() => setActivityActiveTab(sessionObj.session)}
                      className={`flex-shrink-0 flex items-center justify-between px-5 py-3.5 rounded-2xl text-left transition-all w-full ${
                        isActive
                          ? "bg-amber-400 text-black font-black shadow-md scale-[1.01]"
                          : "bg-white hover:bg-amber-50 text-gray-700 font-semibold border border-gray-100 hover:border-amber-200"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm uppercase tracking-wide">{sessionObj.session} Session</span>
                        <span className={`text-[10px] ${isActive ? "text-black/60" : "text-gray-400"} mt-0.5`}>Year {sessionObj.year}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 hidden lg:block transition-transform ${isActive ? "translate-x-1" : "text-gray-300"}`} />
                    </button>
                  );
                })}
              </div>

              {/* Decorative Banner Card */}
              <div className="hidden lg:block relative rounded-3xl overflow-hidden shadow-lg border border-amber-100/50 mt-6 group">
                <img src={cantonActivityReview} alt="Canton Fair Activity Review Banner" className="w-full object-cover h-48 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-amber-400">Matchmaking Conferences</p>
                  <p className="text-white/80 text-[10px] font-medium leading-relaxed">Fostering face-to-face global cooperation and B2B orders since 2014.</p>
                </div>
              </div>
            </div>

            {/* Right Active Content details card */}
            <div className="lg:col-span-8 bg-white border border-gray-100 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6 min-h-[480px] flex flex-col justify-between">
              <div>
                {/* Active Session Label */}
                {(() => {
                  const activeData = activityReviewData.find(d => d.session === activityActiveTab);
                  if (!activeData) return null;
                  return (
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">Official Record</span>
                          <h3 className="text-2xl font-black text-gray-900 mt-2">The {activeData.session} Canton Fair</h3>
                        </div>
                        <span className="text-sm font-bold text-gray-400 bg-gray-50 border border-gray-100 px-3.5 py-1.5 rounded-xl">Year {activeData.year}</span>
                      </div>

                      {/* Events list */}
                      <div className="space-y-8">
                        {activeData.events.map((event, idx) => (
                          <div key={idx} className="space-y-3">
                            <h4 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                              {event.name}
                            </h4>
                            <ul className="space-y-2.5 pl-5">
                              {event.bullets.map((bullet, bulletIdx) => (
                                <li key={bulletIdx} className="text-xs text-gray-500 leading-relaxed flex items-start gap-2.5">
                                  <Check className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Mobile Banner Card (Only shown on small screens) */}
              <div className="block lg:hidden relative rounded-2xl overflow-hidden border border-amber-100/50 mt-6">
                <img src={cantonActivityReview} alt="Canton Fair Activity Review Banner" className="w-full object-cover h-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Matchmaking Conferences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PACKAGE DETAILS ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Package <span className="text-amber-500">Details</span></h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">Two carefully designed packages for every budget — premium 4-star or ultra-luxury 5-star.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {icon:<Users className="w-6 h-6 text-amber-500"/>,label:"Tour Type",val:"Business Delegation"},
              {icon:<MapPin className="w-6 h-6 text-amber-500"/>,label:"Destination",val:"Guangzhou, China"},
              {icon:<Calendar className="w-6 h-6 text-amber-500"/>,label:"Duration",val:"5N6D / 6N7D"},
              {icon:<Plane className="w-6 h-6 text-amber-500"/>,label:"Travel Month",val:"Oct–Nov 2026"}
            ].map((c,i)=>(
              <div key={i} className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center space-y-3">
                <div className="flex justify-center">{c.icon}</div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{c.label}</p>
                <p className="text-sm font-bold text-gray-900">{c.val}</p>
              </div>
            ))}
          </div>

          {/* Hotel Tabs */}
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1">
                {["4star","5star"].map(tab=>(
                  <button key={tab} onClick={()=>setHotelTab(tab)}
                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${hotelTab===tab?"bg-amber-400 text-black shadow-md":"text-gray-500 hover:text-gray-800"}`}>
                    {tab==="4star" ? "⭐⭐⭐⭐ 4 Star" : "⭐⭐⭐⭐⭐ 5 Star"}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              {hotelTab==="4star" ? (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-8 space-y-6 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-black text-gray-900">Foshan Dongjiang Hotel</h3>
                      <p className="text-gray-500 text-sm mt-1">or Similar • 4 Star Accommodation</p>
                    </div>
                    <span className="bg-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-full">Popular</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[["5 Nights / 6 Days","₹69,499"],["6 Nights / 7 Days","₹74,499"]].map(([dur,price],i)=>(
                      <div key={i} className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{dur}</p>
                        <p className="text-2xl font-black text-amber-600 mt-1">{price}</p>
                        <p className="text-[10px] text-gray-400">per person (twin sharing)</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => window.showZForm_51620?.()} className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-xl transition-all hover:scale-[1.01] text-sm uppercase tracking-wide">
                    Enquire for 4 Star Package →
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-amber-400 rounded-3xl p-8 space-y-6 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white">Intercontinental Foshan</h3>
                      <p className="text-gray-400 text-sm mt-1">or Similar • Luxury 5 Star</p>
                    </div>
                    <span className="bg-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-full">Premium</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[["5 Nights / 6 Days","₹74,499"],["6 Nights / 7 Days","₹84,499"]].map(([dur,price],i)=>(
                      <div key={i} className="bg-white/10 rounded-2xl p-4 border border-white/10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{dur}</p>
                        <p className="text-2xl font-black text-amber-400 mt-1">{price}</p>
                        <p className="text-[10px] text-gray-500">per person (twin sharing)</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => window.showZForm_51620?.()} className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-xl transition-all hover:scale-[1.01] text-sm uppercase tracking-wide">
                    Enquire for 5 Star Package →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── INCLUSIONS ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-gray-900">What's <span className="text-amber-500">Included?</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border-2 border-green-100 shadow-sm space-y-6">
              <h3 className="flex items-center gap-3 text-lg font-black text-green-700">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600"/></span>
                What's Included
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {["Hotel Accommodation","Daily Breakfast","Welcome Dinner","Airport Transfers","Fair Transfers","Visa Assistance","Chinese Group Visa","Travel Insurance","Meet & Greet","Interpreter Services","Tea & Coffee","Water Bottle Daily","Wi-Fi","Driver Allowance","Parking","Mobile App Support"].map((item,i)=>(
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0"/>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 border-2 border-red-50 shadow-sm space-y-6">
              <h3 className="flex items-center gap-3 text-lg font-black text-red-600">
                <span className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center"><X className="w-5 h-5 text-red-500"/></span>
                Not Included
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {["International Flights","GST (18%)","TCS","Sticker Visa Charges","Hotel Deposit","Laundry","Mini Bar","Gratuities / Tips","Personal Shopping","Anything Not Mentioned"].map((item,i)=>(
                  <div key={i} className="flex items-center gap-2.5">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0"/>
                    <span className="text-sm text-gray-500">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EARLY BIRD ALERT BANNER ── */}
      <div className="alert-slide bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-4 py-5">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="ring-pulse flex-shrink-0 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/40">
            <span className="text-2xl select-none">⏰</span>
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="badge-bounce inline-block bg-white text-red-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                🔥 Early Bird Offer
              </span>
              <span className="text-white/80 text-[10px] font-semibold uppercase tracking-wider">Limited Seats Available</span>
            </div>
            <p className="text-white font-black text-base sm:text-lg leading-tight">
              Offer Valid Until{" "}
              <span className="text-flicker underline decoration-wavy decoration-yellow-300">31 August 2026</span>
            </p>
            <p className="text-white/80 text-xs font-medium flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse flex-shrink-0"/>
              ⚠️ Price Subject to Revision After Deadline — Register Now to Lock Your Rate
            </p>
          </div>
          <button
            onClick={() => window.showZForm_51620?.()}
            className="flex-shrink-0 bg-white text-red-600 font-black text-xs uppercase tracking-widest px-5 py-3 rounded-xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all whitespace-nowrap border-2 border-white/80"
          >
            Claim My Seat →
          </button>
        </div>
      </div>

      {/* ── ZOHO FORM LIGHTBOX CSS ── */}
      <style>{`
        .zf_lB_Dimmer_51620{
          position:fixed;top:0;left:0;right:0;bottom:0;
          background:rgb(0,0,0);opacity:0.8;z-index:10000000;
        }
        .zf_lB_Container_51620{
          position:fixed;background-color:white;margin:0;padding:0;
          height:1311px;width:70%;top:50%;left:50%;
          margin-right:-50%;transform:translate(-50%,-50%);
          border:7px solid none;max-height:calc(100% - 60px);
          z-index:999999;transition:height 0.5s ease;outline:none;
        }
        .zf_lB_Wrapper_51620{
          position:fixed;top:50%;left:50%;margin-left:0;
          margin-top:-180px;z-index:10000001;
        }
        .zf_main_id_51620{
          height:calc(100% - 0px);display:flex;
          overflow-y:auto;overflow-x:hidden;
        }
        .zf_lb_closeform_51620{
          position:absolute;right:-20px;background:#2f2e2e;padding:0;
          border-radius:50%;width:34px;height:34px;top:-15px;
          cursor:pointer;border:2px solid #d9d9d9;
        }
        .zf_lb_closeform_51620:before,.zf_lb_closeform_51620:after{
          position:absolute;left:16px;content:' ';height:19px;
          width:2px;top:7px;background-color:#f7f7f7;
        }
        .zf_lb_closeform_51620:before{transform:rotate(45deg);}
        .zf_lb_closeform_51620:after{transform:rotate(-45deg);}
        @media screen and (min-device-width:10px) and (max-device-width:380px){
          .zf_lB_Container_51620{width:270px!important;}
        }
        @media screen and (min-device-width:360px) and (max-device-width:480px){
          .zf_lB_Container_51620{width:350px!important;}
        }
        @media screen and (min-device-width:440px) and (max-device-width:500px){
          .zf_lB_Container_51620{width:380px!important;}
        }
        @media only screen and (min-width:500px) and (max-width:600px){
          .zf_lB_Container_51620{width:450px;}
        }
        @media only screen and (min-width:601px) and (max-width:700px){
          .zf_lB_Container_51620{width:540px;}
        }
        @media only screen and (min-width:700px) and (max-width:800px){
          .zf_lB_Container_51620{width:650px;}
        }
        @media screen and (min-device-width:801px) and (max-device-width:1268px){
          .zf_lB_Container_51620{width:750px!important;}
        }
      `}</style>

      {/* ── REGISTER CTA BANNER (replaces old enquiry form section) ── */}
      <section className="py-16 px-6 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5"/> Free Consultation
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Reserve Your <span className="text-amber-400">Delegation Seat</span></h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">Fill out our quick registration form and our Canton expert will call you within 24 hours.</p>
          <button
            onClick={() => window.showZForm_51620?.()}
            className="inline-flex items-center gap-3 px-10 py-4 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-xl text-sm uppercase tracking-wide shadow-2xl hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Register Now — It's Free
          </button>
          <p className="text-gray-500 text-xs flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3"/> 100% Secure &amp; Private • No Spam
          </p>
        </div>
      </section>

      {/* ── ITINERARY ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5"/> Day-Wise Itinerary
            </div>
            <h2 className="text-4xl font-black text-gray-900">Your <span className="text-amber-500">7-Day Journey</span></h2>
            <p className="text-gray-500 text-sm">Click a day to view the full schedule and planned activities.</p>
          </div>

          <div className="space-y-3">
            {itinerary.map((item,idx)=>{
              const open = activeAccordion === idx;
              return (
                <div key={idx} className={`rounded-2xl border-2 overflow-hidden transition-all ${open?"border-amber-300 shadow-lg":"border-gray-100 shadow-sm"}`}>
                  <button onClick={()=>setActiveAccordion(open?null:idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left bg-white hover:bg-amber-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase ${open?"bg-amber-400 text-black":"bg-amber-50 text-amber-600"}`}>{item.day}</span>
                      <span className="font-bold text-gray-900 text-sm">{item.title}</span>
                    </div>
                    {open ? <ChevronUp className="w-5 h-5 text-amber-500"/> : <ChevronDown className="w-5 h-5 text-gray-400"/>}
                  </button>
                  <AnimatePresence>
                    {open && (
                      <motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} transition={{duration:0.3}} className="overflow-hidden">
                        <div className="px-6 py-4 bg-amber-50 border-t-2 border-amber-100 text-sm text-gray-600 leading-relaxed">{item.details}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRODUCT CATEGORIES ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-gray-900">Explore <span className="text-amber-500">Product Categories</span></h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">The Canton Fair covers 16+ industries. Select your category and we'll tailor your sourcing schedule.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat,i)=>(
              <button key={i} onClick={() => window.showZForm_51620?.()}
                className="group bg-white border-2 border-gray-100 hover:border-amber-300 hover:shadow-lg p-5 rounded-2xl flex items-center gap-3 transition-all text-left">
                <span className="text-amber-500 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCAL ATTRACTIONS ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-gray-900">Explore <span className="text-amber-500">the Region</span></h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">Beyond business, discover the beauty of Guangzhou and Foshan — two of China's most culturally rich cities.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {img:guangzhouAttractions, city:"Guangzhou Attractions", spots:["Canton Tower","Pearl River","Beijing Road","Shamian Island","Temple of Six Banyan Trees"]},
              {img:foshanAttractions, city:"Foshan Attractions", spots:["Foshan Ancestral Temple","Nanfeng Kiln","Ceramic City","Lingnan Architecture","Cultural Heritage Village"]}
            ].map((c,i)=>(
              <div key={i} className="group relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-80">
                <img src={c.img} alt={c.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"/>
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                  <h3 className="font-black text-white text-lg">{c.city}</h3>
                  <div className="flex flex-wrap gap-2">
                    {c.spots.map((s,j)=>(
                      <span key={j} className="bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CANTON FAIR TESTIMONIALS ── */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee-ltr {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0%); }
          }
          .animate-marquee-ltr {
            display: flex;
            width: max-content;
            animation: marquee-ltr 60s linear infinite;
          }
          .animate-marquee-ltr:hover {
            animation-play-state: paused;
          }
        `}} />

        <div className="space-y-12 relative z-10">
          {/* Header */}
          <div className="max-w-7xl mx-auto px-6 text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 fill-amber-700" /> Global Voices
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              What the <span className="text-amber-500">World</span> Says
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Read firsthand feedback from official international exhibitors and global buyers who leverage the Canton Fair for trade.
            </p>
          </div>

          {/* Marquee Track */}
          <div className="flex overflow-hidden w-full relative select-none">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-ltr gap-6 flex">
              {/* Copy 1 */}
              {allTestimonials.map((item, idx) => (
                <div key={`c1-${idx}`} className="w-[360px] shrink-0 flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="text-4xl text-amber-300 font-serif absolute top-3 right-5 pointer-events-none select-none">“</div>
                  <div className="space-y-4">
                    <p className="text-gray-600 text-xs leading-relaxed italic">
                      “{item.quote}”
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-50">
                    <div className={`w-10 h-10 rounded-xl ${item.colorBg} font-bold flex items-center justify-center text-sm flex-shrink-0`}>{item.initials}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-[11px] text-gray-500 font-medium">{item.role}</p>
                      <p className={`text-[10px] ${item.colorText} font-semibold`}>{item.company} • {item.countryBadge}</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Copy 2 */}
              {allTestimonials.map((item, idx) => (
                <div key={`c2-${idx}`} className="w-[360px] shrink-0 flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="text-4xl text-amber-300 font-serif absolute top-3 right-5 pointer-events-none select-none">“</div>
                  <div className="space-y-4">
                    <p className="text-gray-600 text-xs leading-relaxed italic">
                      “{item.quote}”
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-50">
                    <div className={`w-10 h-10 rounded-xl ${item.colorBg} font-bold flex items-center justify-center text-sm flex-shrink-0`}>{item.initials}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-[11px] text-gray-500 font-medium">{item.role}</p>
                      <p className={`text-[10px] ${item.colorText} font-semibold`}>{item.company} • {item.countryBadge}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-gray-900">Frequently Asked <span className="text-amber-500">Questions</span></h2>
            <p className="text-gray-500 text-sm">Quick answers about visas, packages, and the delegation experience.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq,i)=>{
              const open = activeFaq === i;
              return (
                <div key={i} className={`rounded-2xl border-2 overflow-hidden transition-all ${open?"border-amber-300":"border-gray-100"}`}>
                  <button onClick={()=>setActiveFaq(open?null:i)}
                    className="w-full px-6 py-4 flex justify-between items-center text-left bg-white hover:bg-amber-50 transition-colors">
                    <span className="font-bold text-gray-900 text-sm pr-4">{faq.q}</span>
                    {open ? <ChevronUp className="w-5 h-5 text-amber-500 flex-shrink-0"/> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0"/>}
                  </button>
                  <AnimatePresence>
                    {open && (
                      <motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} transition={{duration:0.25}} className="overflow-hidden">
                        <div className="px-6 py-4 bg-amber-50 border-t-2 border-amber-100 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Canton;
