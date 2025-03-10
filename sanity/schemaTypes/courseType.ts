import { defineField, defineType } from "sanity";

export const courseType = defineType({
  name: "course",
  title: "Course",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (RWF)",
      type: "number",
      description: "Price for standalone purchase",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "bundles",
      title: "Included in Bundles",
      type: "array",
      of: [{ type: "reference", to: { type: "bundle" } }],
      description:
        "If this course is part of a bundle, it should be listed here.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "grade",
      title: "Grade",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Course Image",
      type: "image",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "modules",
      title: "Modules",
      type: "array",
      of: [{ type: "reference", to: { type: "module" } }],
    }),
    defineField({
      name: "instructor",
      title: "Instructor",
      type: "reference",
      to: { type: "instructor" },
    }),
  ],
});
