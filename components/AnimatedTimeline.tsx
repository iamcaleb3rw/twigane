"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Trophy,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

const timelineData = [
  {
    id: 1,
    date: "2020",
    title: "Started Journey",
    description:
      "Began my career in software development with a focus on web technologies.",
    icon: Briefcase,
    color: "bg-blue-500",
  },
  {
    id: 2,
    date: "2021",
    title: "First Major Project",
    description:
      "Led the development of a large-scale e-commerce platform serving thousands of users.",
    icon: Trophy,
    color: "bg-green-500",
  },
  {
    id: 3,
    date: "2022",
    title: "Advanced Certification",
    description:
      "Completed advanced certifications in cloud architecture and modern frameworks.",
    icon: GraduationCap,
    color: "bg-purple-500",
  },
  {
    id: 4,
    date: "2023",
    title: "Team Leadership",
    description:
      "Promoted to senior role, leading a team of 8 developers across multiple projects.",
    icon: MapPin,
    color: "bg-orange-500",
  },
  {
    id: 5,
    date: "2024",
    title: "Innovation Award",
    description:
      "Received company innovation award for developing cutting-edge solutions.",
    icon: Calendar,
    color: "bg-red-500",
  },
];

export default function TimelineComponent() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [displayStep, setDisplayStep] = useState(0); // For seamless animation

  // Create extended timeline for seamless looping
  const extendedTimeline = [
    ...timelineData.slice(-2), // Last 2 items at the beginning
    ...timelineData,
    ...timelineData.slice(0, 2), // First 2 items at the end
  ];

  // Auto-advance through steps
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % timelineData.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Handle seamless looping animation
  useEffect(() => {
    const newDisplayStep = activeStep + 2; // Offset by 2 because we added 2 items at the beginning

    setDisplayStep(newDisplayStep);

    // Reset position for seamless loop
    const timer = setTimeout(() => {
      if (activeStep === 0 && displayStep > timelineData.length + 1) {
        // Just finished the loop, reset without animation
        setDisplayStep(2); // Reset to actual first item position
      }
    }, 800); // After animation completes

    return () => clearTimeout(timer);
  }, [activeStep]);

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % timelineData.length);
  };

  const prevStep = () => {
    setActiveStep(
      (prev) => (prev - 1 + timelineData.length) % timelineData.length
    );
  };

  const goToStep = (index: number) => {
    setActiveStep(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className=" p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="font-bold text-gray-900 mb-4">My Journey</h1>
        </motion.div>

        {/* Controls */}

        {/* Timeline Viewport with Mask */}
        <div className="relative">
          {/* Masked Container */}
          <div
            className="relative h-60 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            }}
          >
            {/* Timeline Container */}
            <motion.div
              className="relative"
              animate={{
                y: -displayStep * 128 + 128, // Center the active item (128px per item)
              }}
              transition={{
                duration: displayStep === 2 && activeStep === 0 ? 0 : 0.8, // No animation when resetting
                ease: "easeInOut",
              }}
            >
              {/* Connecting Line */}
              <div
                className="absolute left-6 top-0 w-0.5 bg-gray-200"
                style={{ height: `${extendedTimeline.length * 128}px` }}
              >
                {/* Continuous gradient line */}
                <div className="w-full h-full bg-gradient-to-b from-blue-500 via-purple-500 via-green-500 via-orange-500 to-red-500 opacity-80" />

                {/* Animated progress overlay */}
                <motion.div
                  className="absolute top-0 w-full bg-gradient-to-b from-blue-400 to-purple-600"
                  animate={{
                    height: `${((activeStep + 1) / timelineData.length) * 100}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </div>

              {/* Timeline Items */}
              {extendedTimeline.map((item, index) => {
                const actualIndex =
                  index >= 2 && index < timelineData.length + 2
                    ? index - 2
                    : index < 2
                      ? timelineData.length - (2 - index)
                      : index - timelineData.length - 2;

                const isActive = index === displayStep;

                return (
                  <motion.div
                    key={`${item.id}-${index}`}
                    className="relative flex items-center h-32"
                    animate={{
                      scale: isActive ? 1.02 : 0.95,
                      opacity: isActive ? 1 : 0.7,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                  >
                    {/* Content */}
                    <motion.div
                      className="flex-1 ml-12 mr-4"
                      animate={{
                        x: isActive ? 8 : 0,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <div
                        className={`rounded-lg p-4 border transition-all duration-500 ${
                          isActive
                            ? "bg-white shadow-xl border-blue-200 ring-2 ring-blue-100"
                            : "bg-white shadow-md border-gray-100"
                        }`}
                      >
                        <h3
                          className={`text-sm font-bold mb-1 transition-colors duration-300 ${
                            isActive ? "text-blue-900" : "text-gray-800"
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p
                          className={`text-xs leading-relaxed transition-colors duration-300 ${
                            isActive ? "text-gray-700" : "text-gray-600"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
