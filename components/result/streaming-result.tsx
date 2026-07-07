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
  const [display, setDisplay] = useState(instant ? text : "");

  useEffect(() => {
    if (instant) {
      setDisplay(text);
      onComplete?.();
      return;
    }

    setDisplay("");
    let i = 0;

    const interval = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));

      if (i >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, instant]);

  return (
    <span className="prose prose-invert prose-sm max-w-none align-baseline leading-7 text-slate-300">
      <ReactMarkdown components={{ p: ({ children }) => <span>{children}</span> }}>
        {display}
      </ReactMarkdown>
      {!instant && display.length < text.length && (
        <span className="text-cyan-400 animate-pulse">█</span>
      )}
    </span>
  );
}