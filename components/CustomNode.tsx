// components/CustomNode.tsx
"use client";

import { Handle, Position } from "@xyflow/react";

export function DefaultNode({ data }: any) {
  return (
    <div className="bg-white shadow rounded px-4 py-2 text-sm border border-gray-200">
      {data.label}
      <Handle type="source" position={Position.Right} className="invisible" />
      <Handle type="target" position={Position.Left} className="invisible" />
    </div>
  );
}
