import api from "../api";

// Helper: load PDF.js from CDN dynamically
const loadPdfJS = () => {
    return new Promise((resolve, reject) => {
        if (window.pdfjsLib) {
            resolve(window.pdfjsLib);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            resolve(window.pdfjsLib);
        };
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
    });
};

// Clean common spelling variations/wrapping in travel locations
const cleanExtractedText = (text) => {
    if (!text) return "";
    return text
        .replace(/Madina\s+h/gi, "Madinah")
        .replace(/Ter\s+minal/gi, "Terminal")
        .replace(/Mazar\s+at/gi, "Mazarat")
        .replace(/Mazar\s+ta/gi, "Mazarat")
        .replace(/Mazar\s+ats/gi, "Mazarats")
        .replace(/Mazar\s+tas/gi, "Mazarats")
        .replace(/Maza\s+rat/gi, "Mazarat")
        .replace(/Maza\s+rats/gi, "Mazarats")
        .replace(/Johra\s+na/gi, "Johrana")
        .replace(/Mee\s+qat/gi, "Meeqat")
        .replace(/Stati\s+on/gi, "Station")
        .replace(/Maza\s+rata/gi, "Mazarat")
        .replace(/Mazar\s+ata/gi, "Mazarat")
        .replace(/MAZARTA/gi, "Mazarat")
        .replace(/M\s+AZARAT/gi, "Mazarat")
        .replace(/M\s+AZARATS/gi, "Mazarats")
        .replace(/WADI\s+E\s+JIN/gi, "Wadi E Jin")
        .replace(/WADI\s+E\s+JINN/gi, "Wadi E Jin")
        .replace(/WADI\s+E\s+JNI/gi, "Wadi E Jin")
        .replace(/BARAR\s+M\s+AZARATS/gi, "Barar Mazarats")
        .replace(/BARAR\s+Mazarats/gi, "Barar Mazarats")
        .replace(/BARAR\s+Mazarat/gi, "Barar Mazarat")
        .replace(/SONA\s+TA/gi, "Sonata")
        .replace(/T\s+AURUS/gi, "Taurus")
        .replace(/HYUNDA\s+I/gi, "Hyundai")
        .replace(/GMC\s+Y\s+UKON/gi, "GMC Yukon")
        .replace(/HIAC\s+E/gi, "Hiace")
        .replace(/COASTE\s+R/gi, "Coaster");
};

// Match vehicle headers to known database vehicle master records
const matchVehicle = (headerToken, vehicleMasters) => {
    if (!headerToken) return "";
    const cleanHeader = headerToken.toLowerCase().replace(/[^a-z0-9]/g, '');
    let bestMatch = null;
    let bestScore = 0;
    
    vehicleMasters.forEach(v => {
        const vName = v.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanHeader.includes(vName) || vName.includes(cleanHeader)) {
            const score = Math.min(cleanHeader.length, vName.length) / Math.max(cleanHeader.length, vName.length);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = v.name;
            }
        }
    });

    if (!bestMatch) {
        const keywords = ["camry", "sonata", "taurus", "staria", "yukon", "hiace", "coaster", "h1", "sedan"];
        const foundKey = keywords.find(k => cleanHeader.includes(k));
        if (foundKey) {
            const matched = vehicleMasters.find(v => v.name.toLowerCase().includes(foundKey));
            if (matched) bestMatch = matched.name;
        }
    }
    
    return bestMatch || headerToken;
};

// Match parsed pickup point with database pickup points using exact/alphanumeric/substring fuzzy logic
const matchPickupPoint = (pointRaw, cityName, pickupPoints) => {
    if (!pointRaw) return "CITY";
    const cleanRaw = pointRaw.trim().toLowerCase().replace(/\s+/g, " ");
    const cleanRawAlpha = cleanRaw.replace(/[^a-z0-9]/g, "");
    
    // Filter points for this city
    const cityPoints = pickupPoints.filter(p => p.city_name?.toLowerCase() === cityName.toLowerCase());
    if (cityPoints.length === 0) return pointRaw;
    
    // 1. Exact match
    let bestMatch = cityPoints.find(p => p.name?.trim().toLowerCase().replace(/\s+/g, " ") === cleanRaw);
    if (bestMatch) return bestMatch.name;
    
    // 2. Alphanumeric match
    bestMatch = cityPoints.find(p => p.name?.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanRawAlpha);
    if (bestMatch) return bestMatch.name;
    
    // 3. Substring match (database contains raw, or raw contains database)
    bestMatch = cityPoints.find(p => {
        const pNameClean = p.name?.toLowerCase().replace(/\s+/g, " ") || "";
        return pNameClean.includes(cleanRaw) || cleanRaw.includes(pNameClean);
    });
    if (bestMatch) return bestMatch.name;
    
    return pointRaw;
};

// Parse Route (Start/Drop Cities and Points) from route text cells using city boundary splitting
const parseRouteFromTextCells = (textCells, cityList) => {
    // Join text cells with space
    const fullText = textCells.filter(c => c !== undefined && c !== null).join(" ").replace(/\s+/g, " ").trim();
    
    // Find all occurrences of known cities in fullText
    // Sort cities by length descending to match longer ones first (e.g. "Port Blair" before "Port")
    const sortedCities = [...cityList].sort((a, b) => b.length - a.length);
    
    const matches = [];
    
    sortedCities.forEach(city => {
        let pos = fullText.toLowerCase().indexOf(city.toLowerCase());
        while (pos !== -1) {
            matches.push({ city: city, index: pos });
            pos = fullText.toLowerCase().indexOf(city.toLowerCase(), pos + 1);
        }
    });
    
    // Sort matches by their index in the string
    matches.sort((a, b) => a.index - b.index);
    
    // Filter out overlapping matches (e.g. if we matched "Madinah" and "Madin" at the same index)
    const uniqueMatches = [];
    matches.forEach(m => {
        const isOverlap = uniqueMatches.some(um => 
            m.index >= um.index && m.index < um.index + um.city.length
        );
        if (!isOverlap) {
            uniqueMatches.push(m);
        }
    });
    
    // Now we expect at least 2 city matches (Start City and Drop City)
    if (uniqueMatches.length >= 2) {
        const firstMatch = uniqueMatches[0];
        const secondMatch = uniqueMatches[1];
        
        const startLocText = fullText.substring(firstMatch.index, secondMatch.index).trim();
        const dropLocText = fullText.substring(secondMatch.index).trim();
        
        const startCity = cityList.find(c => c.toLowerCase() === firstMatch.city.toLowerCase()) || firstMatch.city;
        const startPointRaw = startLocText.substring(firstMatch.city.length).trim();
        
        const dropCity = cityList.find(c => c.toLowerCase() === secondMatch.city.toLowerCase()) || secondMatch.city;
        const dropPointRaw = dropLocText.substring(secondMatch.city.length).trim();
        
        return { startCity, startPointRaw, dropCity, dropPointRaw };
    }
    
    // Fallback if we don't find at least 2 cities:
    // Split the textCells in half
    let startCity = "";
    let startPointRaw = "";
    let dropCity = "";
    let dropPointRaw = "";
    
    const nonBlockedCells = textCells.filter(Boolean);
    if (nonBlockedCells.length >= 4) {
        startCity = cityList.find(c => c.toLowerCase() === nonBlockedCells[0].toLowerCase()) || nonBlockedCells[0];
        startPointRaw = nonBlockedCells[1];
        dropCity = cityList.find(c => c.toLowerCase() === nonBlockedCells[2].toLowerCase()) || nonBlockedCells[2];
        dropPointRaw = nonBlockedCells[3];
    } else if (nonBlockedCells.length === 2) {
        const startLoc = nonBlockedCells[0];
        const dropLoc = nonBlockedCells[1];
        
        const matchedStart = cityList.find(c => startLoc.toLowerCase().startsWith(c.toLowerCase()));
        startCity = matchedStart || startLoc.split(/\s+/)[0];
        startPointRaw = matchedStart ? startLoc.substring(matchedStart.length).trim() : startLoc;
        
        const matchedDrop = cityList.find(c => dropLoc.toLowerCase().startsWith(c.toLowerCase()));
        dropCity = matchedDrop || dropLoc.split(/\s+/)[0];
        dropPointRaw = matchedDrop ? dropLoc.substring(matchedDrop.length).trim() : dropLoc;
    } else {
        // 3 cells
        startCity = cityList.find(c => c.toLowerCase() === nonBlockedCells[0].toLowerCase()) || nonBlockedCells[0];
        startPointRaw = nonBlockedCells[1] || "";
        dropCity = cityList.find(c => c.toLowerCase() === nonBlockedCells[2]?.toLowerCase()) || nonBlockedCells[2] || "";
        dropPointRaw = nonBlockedCells[2] || "";
    }
    
    return { startCity, startPointRaw, dropCity, dropPointRaw };
};

// Parse PDF File using dynamic column clustering
export const parsePdfRateCard = async (file, cityList, pickupPoints, vehicleMasters) => {
    const pdfjsLib = await loadPdfJS();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let allPageItems = [];
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        allPageItems.push(...textContent.items);
    }
    
    if (allPageItems.length === 0) return null;
    
    // 1. Group items by y-coordinate (vertical rows)
    const rowsMap = {};
    const yThreshold = 6; // 6px vertical tolerance
    
    allPageItems.forEach(item => {
        const y = item.transform[5];
        const foundY = Object.keys(rowsMap).find(groupY => Math.abs(parseFloat(groupY) - y) < yThreshold);
        if (foundY) {
            rowsMap[foundY].push(item);
        } else {
            rowsMap[y] = [item];
        }
    });
    
    // Sort rows from top to bottom
    const sortedY = Object.keys(rowsMap).sort((a, b) => parseFloat(b) - parseFloat(a));
    
    // 2. Identify column boundaries by clustering x-coordinates
    const xCoords = [];
    allPageItems.forEach(item => {
        if (item.str.trim()) {
            xCoords.push(item.transform[4]);
        }
    });
    xCoords.sort((a, b) => a - b);
    
    const colStarts = [];
    const colWidthThreshold = 25; // columns must be at least 25px apart
    
    xCoords.forEach(x => {
        const existingCol = colStarts.find(c => Math.abs(c - x) < colWidthThreshold);
        if (!existingCol) {
            colStarts.push(x);
        }
    });
    colStarts.sort((a, b) => a - b);
    
    // 3. Reconstruct the 2D grid table
    const rawGrid = [];
    sortedY.forEach(y => {
        const rowItems = rowsMap[y];
        const rowCells = Array(colStarts.length).fill("");
        
        rowItems.forEach(item => {
            const x = item.transform[4];
            let closestColIdx = 0;
            let minDistance = Infinity;
            colStarts.forEach((colX, idx) => {
                const dist = Math.abs(colX - x);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestColIdx = idx;
                }
            });
            
            if (rowCells[closestColIdx]) {
                rowCells[closestColIdx] += " " + item.str;
            } else {
                rowCells[closestColIdx] = item.str;
            }
        });
        
        const cleanedCells = rowCells.map(c => cleanExtractedText(c.trim()));
        if (cleanedCells.some(c => c !== "")) {
            rawGrid.push(cleanedCells);
        }
    });
    
    // 4. Reconstruct headers from the top of the grid (Page 1 headers)
    let firstDataRowIdx = rawGrid.findIndex(row => {
        let numCount = 0;
        row.forEach(cell => {
            const val = cell.trim().replace(/,/g, '');
            if (val !== "" && !isNaN(val)) {
                numCount++;
            }
        });
        return numCount > 0;
    });
    
    if (firstDataRowIdx === -1) firstDataRowIdx = rawGrid.length;
    
    // Merge header rows vertically
    const columnHeaders = Array(colStarts.length).fill("");
    for (let r = 0; r < firstDataRowIdx; r++) {
        for (let c = 0; c < colStarts.length; c++) {
            if (rawGrid[r] && rawGrid[r][c]) {
                columnHeaders[c] += " " + rawGrid[r][c];
            }
        }
    }
    
    // Clean column headers
    const cleanedHeaders = columnHeaders.map(h => cleanExtractedText(h.trim().replace(/\s+/g, " ")));
    
    // Extract vehicle headers from column index 4 onwards
    let detectedVehicles = [];
    cleanedHeaders.forEach((header, idx) => {
        if (idx >= 4 && header.trim()) {
            const matchedName = matchVehicle(header.trim(), vehicleMasters);
            detectedVehicles.push(matchedName);
        }
    });
    
    // Define helper to identify header/metadata rows to skip
    const isHeaderOrMetadataRow = (row) => {
        let hasRates = false;
        row.forEach(cell => {
            const val = cell.trim().replace(/,/g, '');
            if (val !== "" && !isNaN(val)) {
                hasRates = true;
            }
        });
        if (hasRates) return false;
        
        const rowText = row.join(" ").toLowerCase();
        const headerKeywords = [
            "start", "city", "point", "drop", "validity", "season", "page",
            "sedan", "camry", "sonata", "taurus", "staria", "yukon", "hiace", "coaster", "h1", "driver"
        ];
        return headerKeywords.some(k => rowText.includes(k));
    };
    
    // 5. Merge wrapped cells across rows
    const mergedGrid = [];
    let textBuffer = Array(colStarts.length).fill("");
    
    rawGrid.forEach((row, idx) => {
        // Skip header rows (we already extracted headers from Page 1)
        if (isHeaderOrMetadataRow(row) || idx < firstDataRowIdx) {
            return;
        }
        
        // Check if row contains pricing data (has numbers)
        let numCount = 0;
        row.forEach(cell => {
            const val = cell.trim().replace(/,/g, '');
            if (val !== "" && !isNaN(val)) {
                numCount++;
            }
        });
        
        const hasRates = numCount > 0;
        
        if (hasRates) {
            const mergedRow = [...row];
            for (let i = 0; i < row.length; i++) {
                const isRate = row[i].trim() !== "" && !isNaN(row[i].trim().replace(/,/g, ''));
                if (!isRate && textBuffer[i]) {
                    mergedRow[i] = (textBuffer[i] + " " + row[i]).trim();
                }
            }
            mergedGrid.push(mergedRow);
            textBuffer = Array(colStarts.length).fill("");
        } else {
            row.forEach((cell, idx) => {
                if (cell.trim()) {
                    textBuffer[idx] = (textBuffer[idx] + " " + cell).trim();
                }
            });
        }
    });
    
    // 5. Parse paths and rates from the merged rows
    const parsedRoutes = [];
    
    mergedGrid.forEach(row => {
        // Separate route text cells and rate cells
        const textCells = [];
        const rateCells = [];
        let foundRate = false;
        
        row.forEach(cell => {
            const val = cell.trim().replace(/,/g, '');
            const isNumeric = val !== "" && !isNaN(val);
            if (isNumeric || foundRate) {
                if (val !== "") {
                    rateCells.push(val);
                }
                foundRate = true;
            } else {
                textCells.push(cell);
            }
        });
        
        // We need at least some text cells and 1 rate
        if (textCells.some(c => c.trim()) && rateCells.length > 0) {
            const { startCity, startPointRaw, dropCity, dropPointRaw } = parseRouteFromTextCells(textCells, cityList);
            
            // Standardize Start Point
            const startPoint = matchPickupPoint(startPointRaw, startCity, pickupPoints);
            
            // Standardize Drop Point
            const dropPoint = matchPickupPoint(dropPointRaw, dropCity, pickupPoints);
            
            parsedRoutes.push({
                start_city: startCity,
                start_from: startPoint,
                drop_city: dropCity,
                drop_to: dropPoint,
                rates: rateCells
            });
        }
    });
    
    // Auto-detect maximum vehicle rates count
    const maxRatesCount = parsedRoutes.length > 0 ? Math.max(...parsedRoutes.map(r => r.rates.length)) : 4;
    const finalCount = Math.max(4, detectedVehicles.length, maxRatesCount);
    
    // Fill vehicle column headers
    if (detectedVehicles.length === 0) {
        detectedVehicles = vehicleMasters.slice(0, finalCount).map(v => v.name);
    }
    
    // Structure routes for matrix state
    const finalRoutes = parsedRoutes.map(r => {
        const vRates = Array(finalCount).fill("");
        r.rates.forEach((rate, i) => {
            if (i < vRates.length) vRates[i] = rate;
        });
        return {
            start_city: r.start_city,
            start_from: r.start_from,
            drop_city: r.drop_city,
            drop_to: r.drop_to,
            vehicles: vRates
        };
    });
    
    return {
        routes: finalRoutes,
        columnVehicles: detectedVehicles,
        vehicleCount: finalCount
    };
};

// Parse CSV File (Generic implementation that auto-detects columns)
export const parseCsvRateCard = (fileContent, vehicleMasters) => {
    const lines = fileContent.split('\n').filter(line => line.trim() !== "");
    if (lines.length < 2) return null;
    
    const parseLine = (line) => {
        const res = []; let cur = ''; let q = false;
        for (let c of line) {
            if (c === '"') q = !q;
            else if (c === ',' && !q) { res.push(cur.trim()); cur = ''; }
            else cur += c;
        }
        res.push(cur.trim()); return res;
    };
    
    // Check header row
    const headerRow = parseLine(lines[0]);
    let detectedVehicles = [];
    
    headerRow.forEach((cell, idx) => {
        if (idx >= 4 && cell.trim()) {
            const matchedName = matchVehicle(cell.trim(), vehicleMasters);
            detectedVehicles.push(matchedName);
        }
    });
    
    const routes = [];
    lines.slice(1).forEach(line => {
        const cols = parseLine(line);
        if (cols.length < 2) return;
        
        let startCity = cols[0] || "";
        let startFrom = cols[1] || "";
        let dropCity = cols[2] || "";
        let dropTo = cols[3] || "";
        
        const rates = cols.slice(4).map(r => r.trim().replace(/,/g, ''));
        
        routes.push({
            start_city: startCity,
            start_from: startFrom,
            drop_city: dropCity,
            drop_to: dropTo,
            rates: rates
        });
    });
    
    const maxRatesCount = routes.length > 0 ? Math.max(...routes.map(r => r.rates.length)) : 4;
    const finalCount = Math.max(4, detectedVehicles.length, maxRatesCount);
    
    if (detectedVehicles.length === 0) {
        detectedVehicles = vehicleMasters.slice(0, finalCount).map(v => v.name);
    }
    
    const finalRoutes = routes.map(r => {
        const vRates = Array(finalCount).fill("");
        r.rates.forEach((rate, i) => {
            if (i < vRates.length) vRates[i] = rate;
        });
        return {
            start_city: r.start_city,
            start_from: r.start_from,
            drop_city: r.drop_city,
            drop_to: r.drop_to,
            vehicles: vRates
        };
    });
    
    return {
        routes: finalRoutes,
        columnVehicles: detectedVehicles,
        vehicleCount: finalCount
    };
};
