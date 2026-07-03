"use client";

import ReactMarkdown from "react-markdown";

type Props = {
  text: string;
};

export default function MarkdownText({ text }: Props) {
  return (
    <span className="prose prose-invert prose-sm max-w-none align-baseline leading-7 text-slate-300">
      <ReactMarkdown
        components={{
          p: ({ children }) => <span>{children}</span>,
        }}
      >
        {text}
      </ReactMarkdown>
    </span>
  );
}