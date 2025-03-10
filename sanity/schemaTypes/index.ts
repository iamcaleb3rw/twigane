import { type SchemaTypeDefinition } from "sanity";
import { courseType } from "./courseType";
import { moduleType } from "./moduleType";
import { studentType } from "./studentType";
import { lessonType } from "./lessonType";
import { enrollmentType } from "./enrollmentType";
import { instructorType } from "./instructorType";
import { blockContent } from "./blockContent";
import { categoryType } from "./categoryType";
import { lessonCompletionType } from "./lessonCompletionType";
import { bundleType } from "./bundleType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    courseType,
    moduleType,
    lessonType,
    instructorType,
    blockContent,
    studentType,
    enrollmentType,
    categoryType,
    lessonCompletionType,
    bundleType,
  ],
};

export * from "./courseType";
export * from "./moduleType";
export * from "./lessonType";
export * from "./instructorType";
export * from "./studentType";
export * from "./enrollmentType";
export * from "./categoryType";
export * from "./lessonCompletionType";
