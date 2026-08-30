"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  text: string;
  speed?: number;
  onComplete?: () => void;
  instant?: boolean;
};

export default function StreamingResult({
  text,
  speed = 10,
  onComplete,
  instant = false,
}: Props) {
  const safeText = text ?? ""; // BAGO — guard laban sa undefined/null

  const [display, setDisplay] = useState(instant ? safeText : "");

  useEffect(() => {
    if (instant) {
      setDisplay(safeText);
      onComplete?.();
      return;
    }

    setDisplay("");

    if (!safeText) {
      // BAGO — kung walang text, tapusin agad, walang typing animation
      onComplete?.();
      return;
    }

    let i = 0;

    const interval = setInterval(() => {
      i++;
      setDisplay(safeText.slice(0, i));

      if (i >= safeText.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [safeText, speed, instant]);

  return (
    <span className="prose prose-invert prose-sm max-w-none align-baseline leading-7 text-slate-300">
      <ReactMarkdown components={{ p: ({ children }) => <span>{children}</span> }}>
        {display}
      </ReactMarkdown>
      {!instant && display.length < safeText.length && (
        <span className="text-cyan-400 animate-pulse">█</span>
      )}
    </span>
  );
}