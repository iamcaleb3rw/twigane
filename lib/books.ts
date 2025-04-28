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
  | "Computer Science"
  | "Biology"
  | "Chemistry";

export const books: Book[] = [
  // Mathematics
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

  // Physics
  {
    title: "Physics Senior 1",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Physics/S1%20Physics%20SB.pdf",
    subject: "Physics",
    grade: "Senior 1",
  },
  {
    title: "Physics Senior 2",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Physics/Physics%20Learners%20book%20S2.pdf",
    subject: "Physics",
    grade: "Senior 2",
  },
  {
    title: "Physics Senior 3",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Physics/Physics%20S3%20SB.pdf",
    subject: "Physics",
    grade: "Senior 3",
  },
  {
    title: "Physics Senior 4",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Physics/Physics%20S4%20SB.pdf",
    subject: "Physics",
    grade: "Senior 4",
  },
  {
    title: "Physics Senior 5",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Physics/PHYSICS%20S5%20SB.pdf",
    subject: "Physics",
    grade: "Senior 5",
  },
  {
    title: "Physics Senior 6",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Physics/S6%20Physics%20%20SB%20%20(5).pdf",
    subject: "Physics",
    grade: "Senior 6",
  },

  // Computer Science
  {
    title: "Computer Science Senior 4",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Computer Science",
    grade: "Senior 4",
  },
  {
    title: "Computer Science Senior 5",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Computer Science",
    grade: "Senior 5",
  },
  {
    title: "Computer Science Senior 6",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Computer Science",
    grade: "Senior 6",
  },

  // Biology
  {
    title: "Biology Senior 1",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Biology",
    grade: "Senior 1",
  },
  {
    title: "Biology Senior 2",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Biology",
    grade: "Senior 2",
  },
  {
    title: "Biology Senior 3",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Biology",
    grade: "Senior 3",
  },
  {
    title: "Biology Senior 4",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Biology",
    grade: "Senior 4",
  },
  {
    title: "Biology Senior 5",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Biology",
    grade: "Senior 5",
  },
  {
    title: "Biology Senior 6",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Biology",
    grade: "Senior 6",
  },

  // Chemistry
  {
    title: "Chemistry Senior 1",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Chemistry",
    grade: "Senior 1",
  },
  {
    title: "Chemistry Senior 2",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Chemistry",
    grade: "Senior 2",
  },
  {
    title: "Chemistry Senior 3",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Chemistry",
    grade: "Senior 3",
  },
  {
    title: "Chemistry Senior 4",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Chemistry",
    grade: "Senior 4",
  },
  {
    title: "Chemistry Senior 5",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Chemistry",
    grade: "Senior 5",
  },
  {
    title: "Chemistry Senior 6",
    url: "https://iamcaleb3rw.github.io/studytime/BOOKS/Maths/Advanced%20Mathematics%20S6%20SB%20(1).pdf",
    subject: "Chemistry",
    grade: "Senior 6",
  },
];
