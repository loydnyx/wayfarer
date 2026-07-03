type Callback = (section: string, content: string) => void;

export function parseAIStream() {
  let buffer = "";

  let currentSection = "summary";

  const sectionKeywords = [
    "Day 1",
    "Day 2",
    "Day 3",
    "Tips",
    "Insights",
  ];

  function processChunk(chunk: string, onUpdate: Callback) {
    buffer += chunk;

    // detect section switches
    for (const key of sectionKeywords) {
      if (buffer.includes(key)) {
        currentSection = key.toLowerCase().replace(" ", "");
      }
    }

    onUpdate(currentSection, buffer);
  }

  return {
    processChunk,
  };
}