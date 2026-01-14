import katex from "katex";
import "katex/dist/katex.min.css";

const MathRenderer = ({ math }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(math, {
          throwOnError: false,
          displayMode: true,
        }),
      }}
    />
  );
};

export default MathRenderer;
