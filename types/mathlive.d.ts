import "mathlive";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // @ts-ignore - Allow the math-field custom element
      "math-field": any;
    }
  }
}
