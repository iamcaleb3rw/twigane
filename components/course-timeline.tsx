"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Clock, PlayCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// This would be your actual data structure
interface Lesson {
  _id: string;
  title: string;
  duration: string;
  description?: string;
  status?: "completed" | "in-progress" | "not-started";
}

interface Module {
  _id: string;
  title: string;
  _updatedAt: string;
  _createdAt: string;
  lessons: Lesson[];
}

export default function CourseTimeline() {
  // Sample data based on your structure
  const modules: Module[] = [
    {
      _id: "6512e291-5fbe-4fc5-b353-44f539c5a1c1",
      title: "1. Introduction to the Series",
      _updatedAt: "2025-03-06T17:26:41Z",
      _createdAt: "2025-03-06T17:25:50Z",
      lessons: [
        {
          _id: "lesson-1-1",
          title: "Getting Started",
          duration: "10:15",
          description: "An introduction to the course and what you'll learn",
          status: "completed",
        },
        {
          _id: "lesson-1-2",
          title: "Core Concepts",
          duration: "15:30",
          description: "Understanding the fundamental principles",
          status: "completed",
        },
        {
          _id: "lesson-1-3",
          title: "Setting Up Your Environment",
          duration: "20:45",
          description: "Installing and configuring the necessary tools",
          status: "completed",
        },
      ],
    },
    {
      _id: "6512e292-7abc-4de5-c678-55f639d6b2d2",
      title: "2. Fundamentals & Basic Techniques",
      _updatedAt: "2025-03-10T14:18:22Z",
      _createdAt: "2025-03-08T09:15:30Z",
      lessons: [
        {
          _id: "lesson-2-1",
          title: "Understanding the Basics",
          duration: "18:45",
          description: "Exploring the foundational concepts in detail",
          status: "completed",
        },
        {
          _id: "lesson-2-2",
          title: "Working with Data",
          duration: "22:10",
          description: "How to effectively manage and manipulate data",
          status: "in-progress",
        },
        {
          _id: "lesson-2-3",
          title: "Building Your First Project",
          duration: "35:20",
          description: "Step-by-step guide to creating your first project",
          status: "not-started",
        },
        {
          _id: "lesson-2-4",
          title: "Common Patterns and Best Practices",
          duration: "28:15",
          description: "Learn the industry-standard approaches and techniques",
          status: "not-started",
        },
      ],
    },
    {
      _id: "6512e293-8def-5fg6-h789-66g740e7c3e3",
      title: "3. Advanced Concepts",
      _updatedAt: "2025-03-14T11:42:35Z",
      _createdAt: "2025-03-12T16:30:45Z",
      lessons: [
        {
          _id: "lesson-3-1",
          title: "Advanced Techniques",
          duration: "40:30",
          description:
            "Taking your skills to the next level with advanced methods",
          status: "not-started",
        },
        {
          _id: "lesson-3-2",
          title: "Performance Optimization",
          duration: "32:15",
          description:
            "How to make your applications faster and more efficient",
          status: "not-started",
        },
      ],
    },
    {
      _id: "6512e294-9ghi-6jk7-l890-77h851f8d4f4",
      title: "4. Real-World Applications",
      _updatedAt: "2025-03-18T09:55:18Z",
      _createdAt: "2025-03-16T13:20:10Z",
      lessons: [
        {
          _id: "lesson-4-1",
          title: "Case Study: Enterprise Application",
          duration: "45:20",
          description: "Analyzing a real-world enterprise application",
          status: "not-started",
        },
        {
          _id: "lesson-4-2",
          title: "Building a Full-Stack Solution",
          duration: "55:40",
          description: "Comprehensive guide to creating a complete solution",
          status: "not-started",
        },
        {
          _id: "lesson-4-3",
          title: "Deployment and Scaling",
          duration: "38:25",
          description: "How to deploy your application and scale it for growth",
          status: "not-started",
        },
      ],
    },
    {
      _id: "6512e295-0jkl-7mn8-o901-88i962g9e5g5",
      title: "5. Final Project & Next Steps",
      _updatedAt: "2025-03-20T15:30:42Z",
      _createdAt: "2025-03-19T10:45:30Z",
      lessons: [
        {
          _id: "lesson-5-1",
          title: "Final Project Overview",
          duration: "15:10",
          description: "Introduction to the capstone project",
          status: "not-started",
        },
        {
          _id: "lesson-5-2",
          title: "Building the Final Project",
          duration: "65:30",
          description: "Step-by-step implementation of the capstone project",
          status: "not-started",
        },
        {
          _id: "lesson-5-3",
          title: "Review and Future Learning",
          duration: "25:15",
          description:
            "Course review and recommendations for continued learning",
          status: "not-started",
        },
      ],
    },
  ];

  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >(
    Object.fromEntries(
      modules.map((module, index) => [module._id, index === 0 || index === 1])
    )
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      default:
        return "bg-gray-300";
    }
  };

  // Calculate progress for each module
  const calculateProgress = (lessons: Lesson[]) => {
    if (!lessons.length) return 0;
    const completed = lessons.filter(
      (lesson) => lesson.status === "completed"
    ).length;
    return Math.round((completed / lessons.length) * 100);
  };

  // Calculate overall course progress
  const calculateOverallProgress = () => {
    const totalLessons = modules.reduce(
      (acc, module) => acc + module.lessons.length,
      0
    );
    const completedLessons = modules.reduce(
      (acc, module) =>
        acc +
        module.lessons.filter((lesson) => lesson.status === "completed").length,
      0
    );
    return totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;
  };

  return (
    <Card className="w-full max-w-3xl overflow-hidden">
      <CardHeader className="pb-0 px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Course Curriculum</CardTitle>
        <CardDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>Complete the curriculum to master all concepts</span>
          <span className="text-sm font-medium">
            {calculateOverallProgress()}% complete
          </span>
        </CardDescription>
        <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${calculateOverallProgress()}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 px-4 sm:px-6">
        {modules.map((module, moduleIndex) => (
          <div key={module._id} className="mb-6 last:mb-0">
            <div
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-between bg-card p-3 sm:p-4 rounded-lg border shadow-sm cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleModule(module._id)}
            >
              <div className="flex items-center gap-2 min-w-0">
                {expandedModules[module._id] ? (
                  <ChevronDown size={18} className="shrink-0" />
                ) : (
                  <ChevronRight size={18} className="shrink-0" />
                )}
                <h2 className="text-base sm:text-lg font-semibold truncate">
                  {module.title}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 ml-6 sm:ml-0">
                <Badge variant="outline" className="whitespace-nowrap text-xs">
                  {module.lessons.length}{" "}
                  {module.lessons.length === 1 ? "lesson" : "lessons"}
                </Badge>
                <div className="flex items-center gap-2">
                  <div className="w-16 sm:w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${calculateProgress(module.lessons)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {calculateProgress(module.lessons)}%
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(module._updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {expandedModules[module._id] && (
              <div className="mt-4 relative">
                {/* Timeline line */}
                <div className="absolute left-2 sm:left-4 top-0 bottom-0 border-l-2 border-dashed border-primary/40"></div>

                {module.lessons.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    className="relative mb-4 last:mb-0 pl-6 sm:pl-10"
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute left-0 sm:left-2 top-4 sm:top-1/2 h-4 w-4 rounded-full border-4 border-card bg-primary z-10"
                      style={{ transform: "translateY(-50%)" }}
                    ></div>

                    <Card className="transition-all hover:shadow-md overflow-hidden">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`h-2 w-2 rounded-full shrink-0 ${getStatusColor(lesson.status)}`}
                              ></div>
                              <h3 className="font-medium text-sm sm:text-base truncate">
                                {moduleIndex + 1}.{index + 1} {lesson.title}
                              </h3>
                            </div>

                            {lesson.description && (
                              <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
                                {lesson.description}
                              </p>
                            )}

                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock size={12} className="mr-1 shrink-0" />
                              <span>{lesson.duration}</span>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 shrink-0 h-8 px-2 sm:px-3"
                          >
                            <PlayCircle size={14} className="shrink-0" />
                            <span className="text-xs">Watch</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
