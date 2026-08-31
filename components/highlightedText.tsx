import React from "react";

/**
 * Renders copy where *words between asterisks* are picked out in the accent colour.
 */
export default function HighlightedText({
  text,
  highlightClassName,
}: {
  text: string;
  highlightClassName: string;
}) {
  const parts = text.split(/(\*[^*]+\*)/g);

  return (
    <>
      {parts.map((part, index) =>
        part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
          <span key={index} className={highlightClassName}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </>
  );
}
