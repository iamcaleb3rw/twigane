/// <reference types="react" />

import type { MathfieldElement } from "mathlive";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement> & {
          value?: string;
          "virtual-keyboard-mode"?: string;
        },
        MathfieldElement
      >;
    }
  }

  interface Window {
    MathfieldElement: typeof MathfieldElement;
  }
}

export {};
