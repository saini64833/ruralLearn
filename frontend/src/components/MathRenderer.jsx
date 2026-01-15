import katex from "katex";
import "katex/dist/katex.min.css";

const MATH_REGEX =
  /(\$\$[\s\S]+?\$\$|\$[^$]+\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\\begin\{[\s\S]+?\}[\s\S]+?\\end\{[\s\S]+?\})/g;

const MathRenderer = ({ text = "" }) => {
  const parts = text.split(MATH_REGEX).filter(Boolean);

  return (
    <div style={{ lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
      {parts.map((part, i) => {
        const isEnvironment = part.startsWith("\\begin");
        const isBlock =
          part.startsWith("$$") ||
          part.startsWith("\\[") ||
          isEnvironment;

        const isMath =
          isEnvironment ||
          part.startsWith("$") ||
          part.startsWith("\\(") ||
          part.startsWith("\\[") ||
          part.startsWith("$$");

        if (!isMath) return <span key={i}>{part}</span>;

        // Strip delimiters (NOT environments)
        let math = part;

        if (!isEnvironment) {
          math = math
            .replace(/^\$\$|\$\$$/g, "")
            .replace(/^\$|\$$/g, "")
            .replace(/^\\\[|\\\]$/g, "")
            .replace(/^\\\(|\\\)$/g, "");
        }

        return (
          <span
            key={i}
            style={{ display: isBlock ? "block" : "inline-block" }}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(math, {
                displayMode: isBlock,
                throwOnError: false,
              }),
            }}
          />
        );
      })}
    </div>
  );
};

export default MathRenderer;
