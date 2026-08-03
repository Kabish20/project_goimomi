import { createWorker } from 'tesseract.js';

// ISO 3166-1 alpha-3 code mapping to full country names
const ISO3_TO_COUNTRY = {
    IND: "India",
    USA: "United States",
    GBR: "United Kingdom",
    ARE: "United Arab Emirates",
    SAU: "Saudi Arabia",
    CAN: "Canada",
    AUS: "Australia",
    DEU: "Germany",
    FRA: "France",
    ITA: "Italy",
    ESP: "Spain",
    NLD: "Netherlands",
    CHE: "Switzerland",
    SGP: "Singapore",
    MYS: "Malaysia",
    THA: "Thailand",
    VNM: "Vietnam",
    IDN: "Indonesia",
    PHL: "Philippines",
    LKA: "Sri Lanka",
    BGD: "Bangladesh",
    NPL: "Nepal",
    PAK: "Pakistan",
    CHN: "China",
    JPN: "Japan",
    KOR: "South Korea",
    RUS: "Russia",
    TUR: "Turkey",
    EGY: "Egypt",
    ZAF: "South Africa",
    QAT: "Qatar",
    KWT: "Kuwait",
    OMN: "Oman",
    BHR: "Bahrain",
    JOR: "Jordan",
    NZL: "New Zealand",
    BRA: "Brazil",
    ARG: "Argentina",
    MEX: "Mexico"
};

const NATIONALITY_TEXT_MAP = {
    INDIAN: "India",
    AMERICAN: "United States",
    BRITISH: "United Kingdom",
    CANADIAN: "Canada",
    AUSTRALIAN: "Australia",
    EMIRATI: "United Arab Emirates",
    SAUDI: "Saudi Arabia",
    GERMAN: "Germany",
    FRENCH: "France",
    ITALIAN: "Italy",
    SPANISH: "Spain",
    DUTCH: "Netherlands",
    SWISS: "Switzerland",
    SINGAPOREAN: "Singapore",
    MALAYSIAN: "Malaysia",
    THAI: "Thailand",
    VIETNAMESE: "Vietnam",
    INDONESIAN: "Indonesia",
    FILIPINO: "Philippines",
    "SRI LANKAN": "Sri Lanka",
    BANGLADESHI: "Bangladesh",
    NEPALESE: "Nepal",
    PAKISTANI: "Pakistan",
    CHINESE: "China",
    JAPANESE: "Japan",
    KOREAN: "South Korea",
    RUSSIAN: "Russia"
};

// Format YYMMDD into YYYY-MM-DD
const parseYYMMDD = (yymmddStr, isBirthDate = false) => {
    if (!yymmddStr || yymmddStr.length !== 6) return "";
    const yy = parseInt(yymmddStr.slice(0, 2), 10);
    const mm = yymmddStr.slice(2, 4);
    const dd = yymmddStr.slice(4, 6);

    if (isNaN(yy)) return "";

    const currentYY = parseInt(String(new Date().getFullYear()).slice(-2), 10);
    let fullYear;

    if (isBirthDate) {
        fullYear = (yy > currentYY ? 1900 : 2000) + yy;
    } else {
        fullYear = (yy > 50 ? 1900 : 2000) + yy;
    }

    return `${fullYear}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
};

// Format DD/MM/YYYY or DD-MM-YYYY into YYYY-MM-DD
const parseStandardDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split(/[\/\.-]/);
    if (parts.length === 3) {
        if (parts[2].length === 4) {
            // DD/MM/YYYY
            const dd = parts[0].padStart(2, '0');
            const mm = parts[1].padStart(2, '0');
            const yyyy = parts[2];
            return `${yyyy}-${mm}-${dd}`;
        } else if (parts[0].length === 4) {
            // YYYY/MM/DD
            const yyyy = parts[0];
            const mm = parts[1].padStart(2, '0');
            const dd = parts[2].padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
    }
    return "";
};

/**
 * Parses raw text from OCR to extract MRZ and passport details.
 */
export const parsePassportText = (rawText) => {
    const result = {
        first_name: "",
        last_name: "",
        passport_number: "",
        nationality: "",
        sex: "",
        dob: "",
        place_of_birth: "",
        place_of_issue: "",
        date_of_issue: "",
        date_of_expiry: ""
    };

    if (!rawText) return result;

    const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean);

    // ─── 1. MRZ PARSING ──────────────────────────────────────────────────────────
    const normalizedLines = lines.map(line => {
        return line.replace(/[«‹\(\)\{\}\]\[]/g, '<');
    });

    let mrzLine1 = null;
    let mrzLine2 = null;

    for (let i = 0; i < normalizedLines.length; i++) {
        const line = normalizedLines[i].replace(/\s+/g, '');
        if (/^P[A-Z0-9<]{30,}/i.test(line) || (line.startsWith('P<') && line.includes('<<'))) {
            mrzLine1 = line;
            if (i + 1 < normalizedLines.length) {
                const nextLine = normalizedLines[i + 1].replace(/\s+/g, '');
                if (nextLine.length >= 30) {
                    mrzLine2 = nextLine;
                }
            }
            break;
        }
    }

    if (mrzLine1) {
        const cleanedLine1 = mrzLine1.replace(/^P[A-Z0-9<]/i, '').replace(/^</, '');
        const countryCode = cleanedLine1.substring(0, 3).toUpperCase();
        if (ISO3_TO_COUNTRY[countryCode]) {
            result.nationality = ISO3_TO_COUNTRY[countryCode];
        }

        const namePart = cleanedLine1.substring(3).replace(/<+$/, '');
        const nameSplit = namePart.split('<<');
        if (nameSplit.length >= 2) {
            result.last_name = nameSplit[0].replace(/</g, ' ').trim();
            result.first_name = nameSplit[1].replace(/</g, ' ').trim();
        } else if (nameSplit.length === 1) {
            result.first_name = nameSplit[0].replace(/</g, ' ').trim();
        }
    }

    if (mrzLine2) {
        const line2 = mrzLine2.toUpperCase();
        
        const rawPassNum = line2.substring(0, 9).replace(/</g, '').trim();
        if (/^[A-Z0-9]{6,10}$/.test(rawPassNum)) {
            result.passport_number = rawPassNum;
        }

        const natCode = line2.substring(10, 13);
        if (!result.nationality && ISO3_TO_COUNTRY[natCode]) {
            result.nationality = ISO3_TO_COUNTRY[natCode];
        }

        const dobDigits = line2.substring(13, 19);
        if (/^\d{6}$/.test(dobDigits)) {
            result.dob = parseYYMMDD(dobDigits, true);
        }

        const sexChar = line2.charAt(20);
        if (sexChar === 'M') result.sex = "Male";
        else if (sexChar === 'F') result.sex = "Female";

        const expDigits = line2.substring(21, 27);
        if (/^\d{6}$/.test(expDigits)) {
            result.date_of_expiry = parseYYMMDD(expDigits, false);
        }
    }

    // ─── 2. REGEX VISUAL ZONE FALLBACK / ENHANCEMENT ────────────────────────────

    if (!result.passport_number) {
        const passMatch = rawText.match(/(?:Passport\s*(?:No|Number|\.)?|Pass\s*No)?\s*:?\s*([A-Z][0-9]{7,8})\b/i);
        if (passMatch) {
            result.passport_number = passMatch[1].toUpperCase();
        }
    }

    const dateMatches = [...rawText.matchAll(/(\d{2}[\/\.-]\d{2}[\/\.-]\d{4})/g)].map(m => m[1]);

    if (!result.dob) {
        const dobMatch = rawText.match(/(?:Date\s*of\s*Birth|DOB|Birth\s*Date)\s*[:\.\-]?\s*(\d{2}[\/\.-]\d{2}[\/\.-]\d{4})/i);
        if (dobMatch) {
            result.dob = parseStandardDate(dobMatch[1]);
        }
    }

    if (!result.date_of_issue) {
        const doiMatch = rawText.match(/(?:Date\s*of\s*Issue|Issue\s*Date)\s*[:\.\-]?\s*(\d{2}[\/\.-]\d{2}[\/\.-]\d{4})/i);
        if (doiMatch) {
            result.date_of_issue = parseStandardDate(doiMatch[1]);
        }
    }

    if (!result.date_of_expiry) {
        const doeMatch = rawText.match(/(?:Date\s*of\s*Expiry|Expiry\s*Date|Valid\s*Until)\s*[:\.\-]?\s*(\d{2}[\/\.-]\d{2}[\/\.-]\d{4})/i);
        if (doeMatch) {
            result.date_of_expiry = parseStandardDate(doeMatch[1]);
        }
    }

    if (dateMatches.length >= 2) {
        const parsedDates = dateMatches.map(d => parseStandardDate(d)).filter(Boolean).sort();
        if (parsedDates.length >= 2) {
            if (!result.dob && parsedDates[0] < "2010-01-01") {
                result.dob = parsedDates[0];
            }
            if (!result.date_of_issue) {
                const issueDate = parsedDates.find(d => d >= "2010-01-01" && d <= new Date().toISOString().split('T')[0]);
                if (issueDate) result.date_of_issue = issueDate;
            }
            if (!result.date_of_expiry) {
                const expDate = parsedDates.find(d => d > new Date().toISOString().split('T')[0]);
                if (expDate) result.date_of_expiry = expDate;
            }
        }
    }

    if (!result.sex) {
        if (/\b(FEMALE|F)\b/i.test(rawText) && !/\b(MALE)\b/i.test(rawText)) {
            result.sex = "Female";
        } else if (/\b(MALE|M)\b/i.test(rawText)) {
            result.sex = "Male";
        }
    }

    if (!result.nationality) {
        for (const [key, val] of Object.entries(NATIONALITY_TEXT_MAP)) {
            if (new RegExp(`\\b${key}\\b`, 'i').test(rawText)) {
                result.nationality = val;
                break;
            }
        }
    }

    const pobMatch = rawText.match(/(?:Place\s*of\s*Birth|Birth\s*Place)\s*[:\.\-]?\s*([A-Z\s,]{3,30})/i);
    if (pobMatch) {
        const pob = pobMatch[1].trim().replace(/\n.*/, '');
        if (pob && !pob.toLowerCase().includes("date") && !pob.toLowerCase().includes("sex")) {
            result.place_of_birth = pob;
        }
    }

    const poiMatch = rawText.match(/(?:Place\s*of\s*Issue|Issue\s*Place)\s*[:\.\-]?\s*([A-Z\s,]{3,30})/i);
    if (poiMatch) {
        const poi = poiMatch[1].trim().replace(/\n.*/, '');
        if (poi && !poi.toLowerCase().includes("date") && !poi.toLowerCase().includes("expiry")) {
            result.place_of_issue = poi;
        }
    }

    return result;
};

/**
 * Perform OCR using Tesseract.js on an image file or preview URL
 */
export const parsePassportImage = async (fileOrUrl) => {
    let worker = null;
    try {
        worker = await createWorker('eng');
        const { data: { text } } = await worker.recognize(fileOrUrl);
        await worker.terminate();
        return parsePassportText(text);
    } catch (err) {
        console.error("Passport OCR Error:", err);
        if (worker) {
            try { await worker.terminate(); } catch (e) {}
        }
        return parsePassportText("");
    }
};
