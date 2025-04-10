import {
  BookOpen,
  FlaskConical,
  Calculator,
  Brain,
  Code,
  MessageSquareText,
} from "lucide-react";

export const subjectMap: Record<
  string,
  { icon: React.ElementType; color: string }
> = {
  Mathematics: {
    icon: Calculator,
    color: "text-purple-600",
  },
  Physics: {
    icon: FlaskConical,
    color: "text-cyan-600",
  },
  Biology: {
    icon: Brain,
    color: "text-green-600",
  },
  Chemistry: {
    icon: FlaskConical,
    color: "text-orange-600",
  },
  English: {
    icon: MessageSquareText,
    color: "text-pink-600",
  },
  "Computer Science": {
    icon: Code,
    color: "text-blue-600",
  },
  Literature: {
    icon: BookOpen,
    color: "text-yellow-600",
  },
};
