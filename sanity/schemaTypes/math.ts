import { defineType, defineField } from "sanity";

export const math = defineType({
  name: "math",
  title: "Math Block",
  type: "object",
  fields: [
    defineField({
      name: "latex",
      title: "LaTeX",
      type: "text",
      description: "Enter a LaTeX expression to render math",
    }),
  ],
  preview: {
    select: {
      latex: "latex",
    },
    prepare({ latex }) {
      return {
        title: "🧮 Math Block",
        subtitle: latex,
      };
    },
  },
});
