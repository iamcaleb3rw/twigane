import { defineField, defineType } from "sanity";

export const bundleType = defineType({
  name: "bundle",
  title: "Course Bundle",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Bundle Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Bundle Price (RWF)",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "courses",
      title: "Courses Included",
      type: "array",
      of: [{ type: "reference", to: { type: "course" } }],
    }),
  ],
});
