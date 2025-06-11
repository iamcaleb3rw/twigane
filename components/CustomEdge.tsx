import { BaseEdge, EdgeProps, getBezierPath } from "@xyflow/react";

export default function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
}: EdgeProps) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: "url(#animated-gradient)",
          strokeWidth: 2,
          strokeDasharray: 8,
          strokeDashoffset: 0,
          animation: "dashFlow 1s linear infinite",
          ...style,
        }}
      />
      <defs>
        <linearGradient
          id="animated-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
    </>
  );
}
