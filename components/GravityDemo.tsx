import { useEffect, useRef, useState } from "react";
import Gravity, { MatterBody } from "@/fancy/components/physics/gravity";

export default function Preview() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full z-30  flex flex-col relative font-azeret-mono bg-transparent">
      <p className="p-3 text-muted-foreground">
        <span className="font-semibold text-foreground">Level up</span> in all
        the key subjects for your national exams. Learn smart, stress less, and
        show up ready to crush it.
      </p>

      <div ref={ref} className="min-h-[300px]">
        {isInView && (
          <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full">
            <MatterBody
              matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
              x="30%"
              y="10%"
            >
              <div className="text-xl sm:text-2xl md:text-3xl bg-[#0015ff] text-white rounded-full hover:cursor-pointer px-8 py-4">
                physics
              </div>
            </MatterBody>
            <MatterBody
              matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
              x="30%"
              y="30%"
            >
              <div className="text-xl sm:text-2xl md:text-3xl bg-[#e794da] text-white rounded-full hover:cursor-grab px-8 py-4 ">
                mathematics
              </div>
            </MatterBody>
            <MatterBody
              matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
              x="40%"
              y="20%"
              angle={10}
            >
              <div className="text-xl sm:text-2xl md:text-3xl bg-[#1f464d] text-white rounded-full hover:cursor-grab px-8 py-4 ">
                chemistry
              </div>
            </MatterBody>
            <MatterBody
              matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
              x="75%"
              y="10%"
            >
              <div className="text-xl sm:text-2xl md:text-3xl bg-[#ff5941] text-white rounded-full hover:cursor-grab px-8 py-4 ">
                computer science
              </div>
            </MatterBody>
            <MatterBody
              matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
              x="80%"
              y="20%"
            >
              <div className="text-xl sm:text-2xl md:text-3xl bg-[#f97316] text-white rounded-full hover:cursor-grab px-8 py-4 ">
                biology
              </div>
            </MatterBody>
            <MatterBody
              matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
              x="50%"
              y="10%"
            >
              <div className="text-xl sm:text-2xl md:text-3xl bg-[#ffd726] text-white rounded-full hover:cursor-grab px-8 py-4 ">
                Entrepreneurship
              </div>
            </MatterBody>
          </Gravity>
        )}
      </div>
    </div>
  );
}
