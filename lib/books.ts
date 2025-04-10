export type Book = {
  title: string;
  grade:
    | "Senior 1"
    | "Senior 2"
    | "Senior 3"
    | "Senior 4"
    | "Senior 5"
    | "Senior 6";
  subject: Subject;
  url: string;
};

export type Subject =
  | "Mathematics"
  | "Physics"
  | "Biology"
  | "Chemistry"
  | "English";

export const books: Book[] = [
  {
    title: "Mathematics Senior 1",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Maths%20S1%20SB.pdf",
    subject: "Mathematics",
    grade: "Senior 1",
  },
  {
    title: "Mathematics Senior 2",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Maths%20S2%20SB.pdf",
    subject: "Mathematics",
    grade: "Senior 2",
  },
  {
    title: "Mathematics Senior 3",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Mathematics%20Senior%203.pdf",
    subject: "Mathematics",
    grade: "Senior 3",
  },
  {
    title: "Mathematics Senior 4",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Core%20Math%20S4%20SB.pdf",
    subject: "Mathematics",
    grade: "Senior 4",
  },
  {
    title: "Mathematics Senior 5",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/MATH%20S5%20SB%20Core.pdf",
    subject: "Mathematics",
    grade: "Senior 5",
  },
  {
    title: "Mathematics Senior 6",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Mathematics",
    grade: "Senior 6",
  },
  {
    title: "Mathematics Senior 6",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Mathematics",
    grade: "Senior 6",
  },
  {
    title: "Mathematics Senior 6",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Mathematics",
    grade: "Senior 6",
  },
  {
    title: "Mathematics Senior 6",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Mathematics",
    grade: "Senior 6",
  },
  {
    title: "Mathematics Senior 6",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Mathematics",
    grade: "Senior 6",
  },
  {
    title: "Mathematics Senior 6",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Mathematics",
    grade: "Senior 6",
  },
  {
    title: "Physics Senior 6",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Physics",
    grade: "Senior 6",
  },
];
