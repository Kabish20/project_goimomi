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
        .replace(/Mazar\s+ata/gi, "Mazarat");
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
    
    // 4. Merge wrapped cells across rows (where text overflows vertically)
    const mergedGrid = [];
    let textBuffer = Array(colStarts.length).fill("");
    let detectedVehicles = [];
    
    rawGrid.forEach(row => {
        // Check if row is a header row
        const rowText = row.join(" ").toLowerCase();
        if (rowText.includes("start city") || rowText.includes("validity") || rowText.includes("start point")) {
            // Extract vehicle columns from header if present
            const vehicleCols = [];
            row.forEach((cell, idx) => {
                if (idx >= 4 && cell.trim()) {
                    const matchedName = matchVehicle(cell.trim(), vehicleMasters);
                    vehicleCols.push({ name: matchedName, index: idx });
                }
            });
            if (vehicleCols.length > 0) {
                detectedVehicles = vehicleCols.map(v => v.name);
            }
            return;
        }
        
        // Check if row contains pricing data (has numbers at the end)
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
        // Split text cells and rate cells
        const textCells = [];
        const rateCells = [];
        
        row.forEach(cell => {
            const val = cell.trim().replace(/,/g, '');
            if (val !== "" && !isNaN(val)) {
                rateCells.push(val);
            } else if (cell.trim()) {
                textCells.push(cell.trim());
            }
        });
        
        // We need at least 2 text columns (for Start City/Point, Drop City/Point) and 1 rate
        if (textCells.length >= 2 && rateCells.length > 0) {
            let startCity = "";
            let startPointRaw = "";
            let dropCity = "";
            let dropPointRaw = "";
            
            if (textCells.length >= 4) {
                // Case A: 4 separate columns (Start City, Start Point, Drop City, Drop Point)
                startCity = cityList.find(c => c.toLowerCase() === textCells[0].toLowerCase()) || textCells[0];
                startPointRaw = textCells[1];
                dropCity = cityList.find(c => c.toLowerCase() === textCells[2].toLowerCase()) || textCells[2];
                dropPointRaw = textCells[3];
            } else if (textCells.length === 2) {
                // Case B: 2 combined columns (Start City+Point, Drop City+Point)
                const startLoc = textCells[0];
                const dropLoc = textCells[1];
                
                const matchedStart = cityList.find(c => startLoc.toLowerCase().startsWith(c.toLowerCase()));
                startCity = matchedStart || startLoc.split(/\s+/)[0];
                startPointRaw = matchedStart ? startLoc.substring(matchedStart.length).trim() : startLoc;
                
                const matchedDrop = cityList.find(c => dropLoc.toLowerCase().startsWith(c.toLowerCase()));
                dropCity = matchedDrop || dropLoc.split(/\s+/)[0];
                dropPointRaw = matchedDrop ? dropLoc.substring(matchedDrop.length).trim() : dropLoc;
            } else {
                // Case C: 3 columns (e.g. Start City, Drop City, Points combined)
                startCity = cityList.find(c => c.toLowerCase() === textCells[0].toLowerCase()) || textCells[0];
                startPointRaw = textCells[1] || "";
                dropCity = cityList.find(c => c.toLowerCase() === textCells[2]?.toLowerCase()) || textCells[2] || "";
                dropPointRaw = textCells[2] || "";
            }
            
            // Standardize Start Point
            const startPointMatch = pickupPoints.find(p => 
                p.city_name?.toLowerCase() === startCity.toLowerCase() &&
                p.name?.toLowerCase().trim() === startPointRaw.toLowerCase()
            );
            const startPoint = startPointMatch ? startPointMatch.name : (startPointRaw || "CITY");
            
            // Standardize Drop Point
            const dropPointMatch = pickupPoints.find(p => 
                p.city_name?.toLowerCase() === dropCity.toLowerCase() &&
                p.name?.toLowerCase().trim() === dropPointRaw.toLowerCase()
            );
            const dropPoint = dropPointMatch ? dropPointMatch.name : (dropPointRaw || "CITY");
            
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
