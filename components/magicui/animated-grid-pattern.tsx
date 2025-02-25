"use client";

import { motion } from "framer-motion";
import {
  type ComponentPropsWithoutRef,
  useEffect,
  useId,
  useRef,
  useState,
  useCallback,
} from "react";

import { cn } from "@/lib/utils";

export interface AnimatedGridPatternProps
  extends ComponentPropsWithoutRef<"svg"> {
  width?: number;
  height?: number;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
  gridColor?: string;
  gridOpacity?: number;
  squareColor?: string;
  squareOpacity?: number;
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  numSquares = 50,
  className,
  maxOpacity = 1,
  duration = 4,
  repeatDelay = 0.5,
  gridColor = "rgb(132 204 22)", // Tailwind's slate-400
  gridOpacity = 0.1,
  squareColor = "rgb(163 230 53)", // Tailwind's slate-200
  squareOpacity = 0.1,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState<
    Array<{ id: number; pos: [number, number] }>
  >([]);

  const getPos = useCallback(() => {
    return [
      Math.floor(Math.random() * (dimensions.width / width)),
      Math.floor(Math.random() * (dimensions.height / height)),
    ] as [number, number];
  }, [dimensions, width, height]);

  const generateSquares = useCallback(
    (count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        pos: getPos(),
      }));
    },
    [getPos]
  );

  const updateSquarePosition = useCallback(
    (id: number) => {
      setSquares((currentSquares) =>
        currentSquares.map((sq) =>
          sq.id === id
            ? {
                ...sq,
                pos: getPos(),
              }
            : sq
        )
      );
    },
    [getPos]
  );

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares));
    }
  }, [dimensions, numSquares, generateSquares]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M${width} 0H0V${height}`}
            fill="none"
            stroke={gridColor}
            strokeOpacity={gridOpacity}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg className="overflow-visible">
        {squares.map(({ pos: [x, y], id }, index) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity * squareOpacity }}
            transition={{
              duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.1,
              repeatType: "reverse",
              repeatDelay,
            }}
            onAnimationComplete={() => updateSquarePosition(id)}
            key={`${x}-${y}-${index}`}
            width={width - 1}
            height={height - 1}
            x={x * width + 1}
            y={y * height + 1}
            fill={squareColor}
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  );
}
