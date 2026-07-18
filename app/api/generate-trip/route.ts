import OpenAI from "openai";
import { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

type TripInput = {
  destination: string;
  origin?: string;
  budget: string;
  days: string;
};

const USE_MOCK =
  process.env.USE_MOCK_AI === "true" || !process.env.GEMINI_API_KEY;

function generateMockTrip(input: TripInput) {
  const dayCount = parseInt(input.days) || 3;

  return {
    title: `${dayCount}-Day ${input.destination} Adventure`,
    summary: `A ${dayCount}-day itinerary for ${input.destination} designed around a ${input.budget} budget.`,

    country: "Philippines",
    city: input.destination,

    coordinates: {
      lat: 10.7202,
      lng: 122.5621,
    },

    bestSeason: "December to May",

    estimatedDailyBudget:
      Math.round(Number(input.budget) / dayCount) || 0,

    budgetFeasible: true,
    budgetNote: "",
    recommendedBudget: "",

    flightEstimate: input.origin
      ? `Estimated round-trip flights from ${input.origin} to ${input.destination} range moderately depending on season and booking time.`
      : "",

    heroImageQuery: `${input.destination} skyline`,

    galleryQueries: [
      `${input.destination} tourist spots`,
      `${input.destination} food`,
      `${input.destination} attractions`,
      `${input.destination} culture`,
    ],

    itinerary: Array.from({ length: dayCount }, (_, i) => ({
      day: `Day ${i + 1}: Visit a local landmark (entrance ~₱200), enjoy lunch at a nearby eatery (~₱250), and explore a market or nearby attraction in the afternoon (~₱150).`,
      userCost: "₱600",
      localCost: "₱600",
    })),

    tips: [
      "Travel early to avoid crowds, especially at popular landmarks.",
      "Bring enough cash for local markets, as many small vendors don't accept cards.",
      "Use public transportation whenever possible to save on costs.",
      "Always stay hydrated, especially if walking between attractions.",
    ],
  };
}

async function callGemini(openai: OpenAI, prompt: string, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are Atlas AI. Return ONLY valid JSON. Never wrap the response inside markdown or ```json blocks.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      return completion.choices?.[0]?.message?.content ?? "";
    } catch (err: any) {
      const isRetryable = err?.status === 503 || err?.status === 429;
      if (isRetryable && attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  return "";
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { allowed, remaining, resetAt } = checkRateLimit(ip);

  if (!allowed) {
    const seconds = Math.ceil((resetAt - Date.now()) / 1000);
    return Response.json(
      { error: `Too many requests. Please wait ${Math.ceil(seconds / 60)} minute(s).` },
      { status: 429 }
    );
  }

  const input: TripInput = await req.json();

  if (USE_MOCK) {
    return Response.json(generateMockTrip(input), {
      headers: {
        "X-Mock-Data": "true",
        "X-RateLimit-Remaining": String(remaining),
      },
    });
  }

  const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });

  const prompt = `
Return ONLY valid JSON.

No markdown.

No explanation.

No code block.

CURRENCY RULE:
The budget below is given in a specific currency (e.g. "PHP", "USD") — this is the traveler's currency. When assessing whether the budget is realistic, account for real-world prices at the destination in its own local currency, and its cost of living relative to the traveler's budget currency.

For "summary", "budgetNote", "recommendedBudget", "flightEstimate", "estimatedDailyBudget": express amounts ONLY in the traveler's currency and its symbol. Never mention any other currency there.

ITINERARY DETAIL REQUIREMENTS:
Each "day" entry must be a detailed, concrete plan — not generic filler. For each day:
- Name SPECIFIC real places (landmarks, restaurants, neighborhoods, markets, activities) appropriate to the destination — never write vague phrases like "explore attractions" or "enjoy local food" without naming what/where.
- For EACH distinct activity or meal mentioned within that day's text, include its approximate individual cost inline, in the traveler's currency (e.g. "Visit Fushimi Inari Shrine (free entry), lunch at a local ramen shop (~₱350), then explore Nishiki Market (~₱200 for snacks)").
- Structure each day as a short flowing paragraph covering morning, afternoon, and evening where relevant.
- The "userCost" field for that day must equal the SUM of all individual costs mentioned in that day's text (the day's total).
- "localCost" is the same day total converted to the destination's own local currency and symbol. If the traveler's currency IS the local currency, set "localCost" equal to "userCost".

TIPS REQUIREMENTS:
Provide 4-6 practical, specific tips relevant to this exact destination and trip — covering things like local transport options, cultural etiquette, money-saving advice, safety notes, or seasonal considerations. Avoid generic advice that could apply to any destination (e.g. do not just say "stay hydrated" or "bring cash" without specifics relevant to this destination).

BUDGET FEASIBILITY CHECK:
Realistically assess whether the given budget is sufficient to cover the destination, trip duration, and (if provided) flights from the origin — accounting for typical costs of accommodation, food, local transport, and activities at that destination.
- If the budget is NOT realistically sufficient, set "budgetFeasible" to false. In "budgetNote", briefly explain why in 1-2 sentences (do not repeat the number here). In "recommendedBudget", give ONLY a realistic minimum total budget for the full trip duration.

  CRITICAL: "recommendedBudget" MUST use the exact same currency as the traveler's original budget (the one given below). Do NOT convert it to the destination's local currency or any other currency. For example, if the traveler's budget is in USD, "recommendedBudget" must also be in USD (e.g. "$650"). Double-check this before responding — this is a common mistake, do not make it.

  This field is required whenever budgetFeasible is false — never leave it empty in that case, and it must always be a larger number than the traveler's original budget.
- If the budget is sufficient or generous, set "budgetFeasible" to true, and leave "budgetNote" and "recommendedBudget" as empty strings.
- Still generate a complete, best-effort itinerary regardless of feasibility.

FLIGHT ESTIMATE:
${input.origin ? `The traveler is flying from "${input.origin}". In "flightEstimate", give a brief 1-2 sentence realistic estimate of round-trip flight cost range and typical flight duration from ${input.origin} to ${input.destination}, in the traveler's currency.` : `No origin was provided. Leave "flightEstimate" as an empty string.`}

{
"title":"",
"summary":"",
"country":"",
"city":"",
"coordinates":{
"lat":0,
"lng":0
},
"bestSeason":"",
"estimatedDailyBudget":0,
"budgetFeasible":true,
"budgetNote":"",
"recommendedBudget":"",
"flightEstimate":"",
"heroImageQuery":"",
"galleryQueries":["","","",""],
"itinerary":[
  {"day":"", "userCost":"", "localCost":""}
],
"tips":[""]
}

Origin:
${input.origin || "Not specified"}

Destination:
${input.destination}

Budget:
${input.budget}

Days:
${input.days}
`;

  try {
    let text = await callGemini(openai, prompt);

    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(text);

    return Response.json(parsed, {
      headers: {
        "X-Mock-Data": "false",
        "X-RateLimit-Remaining": String(remaining),
      },
    });
  } catch (err) {
    console.error(err);

    return Response.json(generateMockTrip(input), {
      headers: {
        "X-Mock-Data": "true",
      },
    });
  }
}