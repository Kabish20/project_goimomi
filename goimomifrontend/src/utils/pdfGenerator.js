import jsPDF from "jspdf";
import goimomilogo from "../assets/goimomilogo.png";

// PDF Static Assets
import pdfImg1 from "../assets/pdf/BALI - awesome waterfalls near UBUD.jpeg";
import pdfImg2 from "../assets/pdf/Egypt.jpeg";
import pdfImg3 from "../assets/pdf/FAMILY FUN IN VIETNAM _ Tailor-made tour - Exotic Voyages.jpeg";
import pdfImg4 from "../assets/pdf/16 of the Best Places to Visit in Italy.jpeg";
import pdfImg5 from "../assets/pdf/Petra (Jordan).jpeg";
import pdfImg6 from "../assets/pdf/The Colosseum, Rome.jpeg";
import pdfImg7 from "../assets/pdf/Matera_ The City of Stones.jpeg";
import pdfImg8 from "../assets/pdf/20 Best City Breaks in the World - Travel Den.jpeg";
import pdfImg9 from "../assets/pdf/A guide to the Azores.jpeg";
import pdfImg10 from "../assets/pdf/5 Day Phuket Thailand Itinerary - Guide To Things To Do.jpeg";
import pdfImg11 from "../assets/pdf/10 Top Cities In India To Visit - Hand Luggage Only - Travel, Food And Photography Blog.jpeg";
import pdfImg12 from "../assets/pdf/Navigating Japanese Culture_ 20 Essential Etiquette Tips for Travelers.jpeg";
import pdfImg13 from "../assets/pdf/amazing places in the world to travel.jpeg";
import pdfImg14 from "../assets/pdf/The ultimate travel Guide to Cappadocia, Turkey - Jyo Shankar.jpeg";
import pdfImg15 from "../assets/pdf/100 Most Beautiful UNESCO World Heritage Sites - Road Affair.jpeg";
import pdfImg16 from "../assets/pdf/15 Best Places In Turkey To Visit - Hand Luggage Only - Travel, Food And Photography Blog.jpeg";

const baseImgs = [pdfImg1, pdfImg2, pdfImg3, pdfImg4, pdfImg5, pdfImg6, pdfImg7, pdfImg8, pdfImg9, pdfImg10, pdfImg11, pdfImg12, pdfImg13, pdfImg14, pdfImg15, pdfImg16];

export const downloadPackagePDF = async (pkg) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const sidebarWidth = 50;
  const padding = 15;

  // Helper functions
  const addHeader = (doc, title) => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.addImage(goimomilogo, 'PNG', padding, 4, 42, 14);
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(8);
    doc.text(title, pageWidth - padding, 12, { align: "right" });
    doc.setDrawColor(243, 244, 246);
    doc.line(padding, 20, pageWidth - padding, 20);
  };

  const addFooter = (doc, pageNum, totalPages) => {
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(8);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - padding, pageHeight - 10, { align: "right" });
    doc.text("© goimomi.com | +91 8110082222 | hello@goimomi.com", padding, pageHeight - 10);
  };

  // PAGE 1: COVER
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, sidebarWidth, pageHeight, 'F');

  const imgSize = 24;
  const colW = sidebarWidth / 2;
  let sidebarY = 0;
  let imgIndex = 0;
  while (sidebarY + imgSize <= pageHeight) {
    try {
      doc.addImage(baseImgs[imgIndex % baseImgs.length], 'JPEG', 0, sidebarY, colW, imgSize, undefined, 'FAST');
      doc.addImage(baseImgs[(imgIndex + 1) % baseImgs.length], 'JPEG', colW, sidebarY, colW, imgSize, undefined, 'FAST');
    } catch {
      // Continue creating the PDF if an optional sidebar image cannot be drawn.
    }
    sidebarY += imgSize;
    imgIndex += 2;
  }

  let centerX = sidebarWidth + (pageWidth - sidebarWidth) / 2;
  try {
    doc.addImage(goimomilogo, 'PNG', centerX - 35, 25, 70, 25);
  } catch {
    // Continue creating the PDF if the logo cannot be drawn.
  }

  doc.setTextColor(31, 41, 55);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const titleLines = doc.splitTextToSize(pkg.title.toUpperCase(), pageWidth - sidebarWidth - 30);
  doc.text(titleLines, centerX, 90, { align: "center" });

  doc.setTextColor(107, 114, 128);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`${pkg.starting_city} (${pkg.nights || pkg.days - 1}N)`, centerX, 110, { align: "center" });

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(pkg.category || "India", centerX, 122, { align: "center" });

  // PAGE 2: OVERVIEW
  doc.addPage();
  addHeader(doc, pkg.title);
  let y = 35;
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(pkg.title, padding, y);
  y += 12;

  doc.setFontSize(14);
  doc.text("Trip Overview", padding, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99);
  if (pkg.description) {
    const descLines = doc.splitTextToSize(pkg.description, pageWidth - (padding * 2));
    doc.text(descLines, padding, y);
    y += (descLines.length * 5) + 15;
  }

  if (pkg.highlights && pkg.highlights.length > 0) {
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Trip Highlights", padding, y);
    y += 10;
    pkg.highlights.forEach(h => {
      const splitText = doc.splitTextToSize(h.text, pageWidth - (padding * 2) - 10);
      doc.setFillColor(20, 83, 45);
      doc.circle(padding + 2, y - 1, 1, 'F');
      doc.setTextColor(75, 85, 99);
      doc.setFontSize(10);
      doc.text(splitText, padding + 7, y);
      y += (splitText.length * 5) + 2;
      if (y > pageHeight - 30) {
        addFooter(doc, 2, 4);
        doc.addPage();
        addHeader(doc, pkg.title);
        y = 35;
      }
    });
  }
  addFooter(doc, 2, 4);

  // PAGE 3: ITINERARY
  doc.addPage();
  addHeader(doc, "Day Wise Itinerary");
  y = 35;
  if (pkg.itinerary && pkg.itinerary.length > 0) {
    pkg.itinerary.forEach((day, index) => {
      if (y > pageHeight - 50) {
        addFooter(doc, 3, 4);
        doc.addPage();
        addHeader(doc, "Day Wise Itinerary (Contd.)");
        y = 35;
      }
      doc.setFillColor(243, 244, 246);
      doc.rect(padding, y, pageWidth - (padding * 2), 10, 'F');
      doc.setTextColor(20, 83, 45);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`DAY ${day.day_number}: ${day.title}`, padding + 5, y + 7);
      y += 15;
      if (day.description) {
        doc.setTextColor(75, 85, 99);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const splitDesc = doc.splitTextToSize(day.description, pageWidth - (padding * 2) - 10);
        doc.text(splitDesc, padding + 5, y);
        y += (splitDesc.length * 4.5) + 12;
      }
    });
  }
  addFooter(doc, 3, 4);

  // PAGE 4: INCLUSIONS/EXCLUSIONS
  doc.addPage();
  addHeader(doc, "Package Details & Policies");
  y = 35;
  if (pkg.inclusions && pkg.inclusions.length > 0) {
    doc.setTextColor(20, 83, 45);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("What's Included", padding, y);
    y += 10;
    pkg.inclusions.forEach(inc => {
      const splitInc = doc.splitTextToSize(`• ${inc.text}`, pageWidth - (padding * 2) - 10);
      doc.setTextColor(75, 85, 99);
      doc.setFontSize(10);
      doc.text(splitInc, padding + 5, y);
      y += (splitInc.length * 5) + 2;
      if (y > pageHeight - 30) {
        addFooter(doc, 4, 4);
        doc.addPage();
        addHeader(doc, "Package Details (Contd.)");
        y = 35;
      }
    });
    y += 15;
  }
  if (pkg.exclusions && pkg.exclusions.length > 0) {
    doc.setTextColor(220, 38, 38);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("What's Excluded", padding, y);
    y += 10;
    pkg.exclusions.forEach(exc => {
      const splitExc = doc.splitTextToSize(`• ${exc.text}`, pageWidth - (padding * 2) - 10);
      doc.setTextColor(75, 85, 99);
      doc.setFontSize(10);
      doc.text(splitExc, padding + 5, y);
      y += (splitExc.length * 5) + 2;
      if (y > pageHeight - 30) {
        addFooter(doc, 4, 4);
        doc.addPage();
        addHeader(doc, "Package Details (Contd.)");
        y = 35;
      }
    });
  }
  addFooter(doc, 4, 4);
  doc.save(`GoImomi_${pkg.title.replace(/\s+/g, '_')}.pdf`);
};
