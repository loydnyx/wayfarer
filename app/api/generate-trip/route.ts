import OpenAI from "openai";
import { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

type TripInput = {
  destination: string;
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
      Math.round(Number(input.budget) / dayCount),

    heroImageQuery: `${input.destination} skyline`,

    galleryQueries: [
      `${input.destination} tourist spots`,
      `${input.destination} food`,
      `${input.destination} attractions`,
      `${input.destination} culture`,
    ],

    itinerary: Array.from(
      { length: dayCount },
      (_, i) =>
        `Day ${i + 1}: Explore ${input.destination} with curated experiences, local food, hidden gems and attractions.`
    ),

    tips: [
      "Travel early to avoid crowds.",
      "Bring enough cash for local markets.",
      "Use public transportation whenever possible.",
      "Always stay hydrated.",
    ],
  };
}

async function callGemini(openai: OpenAI, prompt: string) {
  const completion =
    await openai.chat.completions.create({
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
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers
      .get("x-forwarded-for")
      ?.split(",")[0]
      .trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const {
    allowed,
    remaining,
    resetAt,
  } = checkRateLimit(ip);

  if (!allowed) {
    const seconds = Math.ceil(
      (resetAt - Date.now()) / 1000
    );

    return Response.json(
      {
        error: `Too many requests. Please wait ${Math.ceil(
          seconds / 60
        )} minute(s).`,
      },
      {
        status: 429,
      }
    );
  }

  const input: TripInput = await req.json();

  if (USE_MOCK) {
    return Response.json(generateMockTrip(input), {
      headers: {
        "X-Mock-Data": "true",
        "X-RateLimit-Remaining":
          String(remaining),
      },
    });
  }

  const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL:
      "https://generativelanguage.googleapis.com/v1beta/openai/",
  });

const prompt = `
Return ONLY valid JSON.

No markdown.

No explanation.

No code block.

CURRENCY RULE:
The budget below is given in a specific currency (e.g. "PHP", "USD"). When assessing whether the budget is realistic, mentally account for real-world prices at the destination (which may use a different local currency) and its cost of living relative to the traveler's budget currency — this affects how tight or generous the budget actually is. However, in your written output (summary, itinerary, tips, estimatedDailyBudget), express ALL monetary values using ONLY the traveler's given currency and its symbol. Never write, mention, or reference any other currency code or symbol (e.g. do not write "EUR", "€", "USD", "$") anywhere in your response, even as a comparison or approximation.

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
"heroImageQuery":"",
"galleryQueries":["","","",""],
"itinerary":[""],
"tips":[""]
}

Destination:
${input.destination}

Budget:
${input.budget}

Days:
${input.days}
`;

  try {
    let text = await callGemini(
      openai,
      prompt
    );

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(text);

    return Response.json(parsed, {
      headers: {
        "X-Mock-Data": "false",
        "X-RateLimit-Remaining":
          String(remaining),
      },
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      generateMockTrip(input),
      {
        headers: {
          "X-Mock-Data": "true",
        },
      }
    );
  }
}