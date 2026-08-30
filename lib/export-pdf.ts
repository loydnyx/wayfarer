import jsPDF from "jspdf";
import type { TripResult, TripInput } from "@/types/trip";

function normalizeItinerary(
  itinerary: TripResult["itinerary"]
): { day: string; userCost: string; localCost: string }[] {
  return itinerary.map((item) => {
    if (typeof item === "string") {
      return { day: item, userCost: "", localCost: "" };
    }
    return item;
  });
}

function sanitizeCurrencyText(text: string): string {
  if (!text) return text;
  return text
    .replace(/₱/g, "PHP ")
    .replace(/¥/g, "JPY ")
    .replace(/€/g, "EUR ")
    .replace(/£/g, "GBP ")
    .replace(/₩/g, "KRW ")
    .replace(/₹/g, "INR ")
    .replace(/S\$/g, "SGD ")
    .replace(/A\$/g, "AUD ")
    .replace(/C\$/g, "CAD ")
    .replace(/HK\$/g, "HKD ")
    .replace(/\s+/g, " ")
    .trim();
}

async function loadImageAsDataUrl(url: string): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          resolve({
            dataUrl: reader.result as string,
            width: img.width,
            height: img.height,
          });
        };
        img.onerror = () => resolve(null);
        img.src = reader.result as string;
      };
      reader.onerror = () => reject(null);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("Failed to load image for PDF:", err);
    return null;
  }
}

export async function exportTripToPDF(trip: TripResult, input: TripInput) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;
  const maxWidth = pageWidth - margin * 2;
  let y = 40;

  const addSpace = (amount: number) => {
    y += amount;
    if (y > 760) {
      doc.addPage();
      y = 60;
    }
  };

  if (trip.heroImage?.url) {
    const imageData = await loadImageAsDataUrl(trip.heroImage.url);

    if (imageData) {
      const imgHeight = 180;
      const imgWidth = maxWidth;
      const aspectRatio = imageData.width / imageData.height;
      const displayWidth = imgWidth;
      const displayHeight = imgWidth / aspectRatio > imgHeight ? imgHeight : imgWidth / aspectRatio;

      try {
        doc.addImage(imageData.dataUrl, "JPEG", margin, y, displayWidth, displayHeight);
        addSpace(displayHeight + 10);

        if (trip.heroImage.credit) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(7.5);
          doc.setTextColor(150, 150, 150);
          doc.text(`Photo: ${sanitizeCurrencyText(trip.heroImage.credit)}`, margin, y);
          addSpace(16);
        }
      } catch (err) {
        console.error("Failed to add image to PDF:", err);
      }
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20, 20, 20);
  const titleLines = doc.splitTextToSize(sanitizeCurrencyText(trip.title), maxWidth);
  doc.text(titleLines, margin, y);
  addSpace(titleLines.length * 24 + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Personalized itinerary for ${input.destination}`, margin, y);
  addSpace(30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20, 150, 170);
  doc.text("Summary", margin, y);
  addSpace(20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(60, 60, 60);
  const cleanSummary = sanitizeCurrencyText(trip.summary.replace(/\*\*/g, ""));
  const summaryLines = doc.splitTextToSize(cleanSummary, maxWidth);
  doc.text(summaryLines, margin, y);
  addSpace(summaryLines.length * 14 + 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(20, 20, 20);
  doc.text(`Budget: ${sanitizeCurrencyText(input.budget)}`, margin, y);
  doc.text(`Duration: ${input.days} Days`, margin + 180, y);
  if (trip.country) doc.text(`Country: ${trip.country}`, margin + 340, y);
  addSpace(30);

  if (!trip.budgetFeasible && trip.budgetNote) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(180, 120, 20);
    const noteLines = doc.splitTextToSize(
      `Budget Note: ${sanitizeCurrencyText(trip.budgetNote)}`,
      maxWidth
    );
    doc.text(noteLines, margin, y);
    addSpace(noteLines.length * 14 + 16);
  }

  if (trip.flightEstimate) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(60, 60, 60);
    const flightLines = doc.splitTextToSize(
      `Flight Estimate: ${sanitizeCurrencyText(trip.flightEstimate)}`,
      maxWidth
    );
    doc.text(flightLines, margin, y);
    addSpace(flightLines.length * 14 + 16);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20, 150, 170);
  doc.text("Itinerary", margin, y);
  addSpace(20);

  const normalizedItinerary = normalizeItinerary(trip.itinerary);

  normalizedItinerary.forEach((dayItem, i) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(20, 20, 20);
    const cleanDay = sanitizeCurrencyText(dayItem.day.replace(/\*\*/g, ""));
    const dayLines = doc.splitTextToSize(`${i + 1}. ${cleanDay}`, maxWidth);
    doc.text(dayLines, margin, y);
    addSpace(dayLines.length * 14 + 4);

    if (dayItem.userCost) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(0, 150, 170);
      const userCost = sanitizeCurrencyText(dayItem.userCost);
      const localCost = sanitizeCurrencyText(dayItem.localCost);
      const costLine =
        dayItem.localCost && dayItem.localCost !== dayItem.userCost
          ? `Est. cost: ${userCost} (${localCost})`
          : `Est. cost: ${userCost}`;
      doc.text(costLine, margin + 14, y);
      addSpace(16);
    } else {
      addSpace(8);
    }
  });

  if (trip.tips?.length) {
    addSpace(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(20, 150, 170);
    doc.text("Insights & Tips", margin, y);
    addSpace(20);

    trip.tips.forEach((tip) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(60, 60, 60);
      const cleanTip = sanitizeCurrencyText(tip.replace(/\*\*/g, ""));
      const tipLines = doc.splitTextToSize(`• ${cleanTip}`, maxWidth);
      doc.text(tipLines, margin, y);
      addSpace(tipLines.length * 14 + 8);
    });
  }

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("Generated by Wayfarer, powered by Atlas AI", margin, 800);

  const fileName = `${input.destination.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-itinerary.pdf`;
  doc.save(fileName);
}