// components/RichText.tsx
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

interface RichTextProps {
  value: any;
}

const components: PortableTextComponents = {
  types: {
    // Handle the math block rendering
    math: ({ value }) => {
      // Ensure value.latex is treated as a LaTeX string
      return (
        <div className="my-4 overflow-x-auto border rounded-md bg-accent/30">
          {/* Wrap LaTeX content with $$ for display math */}
          <Latex>{`$$${value.latex}$$`}</Latex>
        </div>
      );
    },
  },
};

export const RichText = ({ value }: RichTextProps) => {
  return <PortableText value={value} components={components} />;
};
