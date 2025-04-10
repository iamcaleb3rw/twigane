import { subjectMap } from "../lib/subjectMap";

type BookProps = {
  title: string;
  subject: string;
  grade: string;
};

const BookCard = ({ title, subject, grade }: BookProps) => {
  const Icon = subjectMap[subject]?.icon;
  const color = subjectMap[subject]?.color;

  return (
    <div className="border rounded-lg p-4 flex items-start gap-4">
      {Icon && <Icon className={`w-5 h-5 ${color}`} />}
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {subject} • Grade {grade}
        </p>
      </div>
    </div>
  );
};
