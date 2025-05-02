// mathlive.d.ts
import { MathfieldElement } from "mathlive";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement> & {
          ref?: React.Ref<MathfieldElement>;
          value?: string;
          onInput?: (e: Event) => void;
          "virtual-keyboard-mode"?: "manual" | "onfocus";
          class?: string;
        },
        MathfieldElement
      >;
    }
  }

  interface Window {
    MathfieldElement: typeof MathfieldElement;
  }
}

declare module "mathlive" {
  export { MathfieldElement };
}
