import HighlightedText from "@/components/highlightedText";

/**
 * Renders the About body exactly as it was typed: a blank line starts a new
 * paragraph, single line breaks and spacing are kept, and *asterisks* highlight.
 */
export default function AboutBody({
  body,
  highlightClassName,
}: {
  body: string;
  highlightClassName: string;
}) {
  const blocks = body.split("\n\n");

  return (
    <>
      {blocks.map((block, index) => (
        <p key={index} className="whitespace-pre-wrap">
          {block === "" ? (
            " " /* an extra blank line the admin typed */
          ) : (
            <HighlightedText text={block} highlightClassName={highlightClassName} />
          )}
        </p>
      ))}
    </>
  );
}
