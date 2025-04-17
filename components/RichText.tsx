// components/RichText.tsx
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Latex from "react-latex-next";

interface RichTextProps {
  value: any;
}

const components: PortableTextComponents = {
  types: {
    math: ({ value }) => (
      <div className="my-4 overflow-x-auto">
        <Latex>{`$$${value.latex}$$`}</Latex>
      </div>
    ),
  },
};

export const RichText = ({ value }: RichTextProps) => {
  return <PortableText value={value} components={components} />;
};
