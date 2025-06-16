import { NumberTicker } from "./magicui/number-ticker";
import { HandWrittenTitle } from "./ui/hand-writing-text";
import Lottie from "lottie-react";
import UserFeedback from "@/public/feedback.json";

const items = [
  {
    number: 3500,
    prefix: "+",
    tagline: "Hours of content",
  },
  {
    number: 99.9,
    prefix: "%",
    tagline: "User satisfaction",
  },
  {
    number: 20,
    prefix: "+",
    tagline: "Daily active students",
  },
  {
    number: 4,
    tagline: "Subjects offered",
  },
];

export default function RoundedGrid() {
  return (
    <div>
      <div className="w-full flex items-center flex-col">
        <HandWrittenTitle
          title="Built by Learners"
          subtitle="who actually care"
        />
        <p className="text-sm text-center p-3 sm:text-base lg:text-lg text-muted-foreground">
          We know what you need; because we needed it too.
        </p>
      </div>
      <div className="grid grid-cols-1 p-4 sm:grid-cols-2 gap-1 md:grid-cols-4 overflow-hidden">
        {items.map((item, index) => {
          const base =
            "p-6 min-h-[180px] flex items-center justify-center flex-col";
          const bg =
            index === 0 || index === items.length - 1 ? "bg-muted" : "bg-muted";
          const roundedMobile = "rounded-xl";
          const roundedDesktop =
            index === 0
              ? "md:rounded-none md:rounded-tl-xl md:rounded-bl-xl"
              : index === items.length - 1
                ? "md:rounded-none md:rounded-tr-xl md:rounded-br-xl"
                : "md:rounded-none";

          return (
            <div
              key={index}
              className={`${base} ${bg} relative ${roundedMobile} ${roundedDesktop}`}
            >
              {" "}
              {item.tagline === "User satisfaction" && (
                <Lottie animationData={UserFeedback} className="absolute" />
              )}
              <div className="text-3xl backdrop-blur-[1px] z-20 font-bold tracking-tight">
                <NumberTicker value={item.number} />
                {item.prefix}
              </div>
              <p className="text-muted-foreground backdrop-blur-[1px] z-20 font-semibold">
                {item.tagline}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
