// components/GlobeNode.tsx
"use client";

import { Handle, Position } from "@xyflow/react";
import { Globe } from "lucide-react";

export function GlobeNode() {
  return (
    <div className="bg-white shadow rounded p-3 border border-gray-200 flex items-center justify-center">
      <Globe className="text-blue-600 w-5 h-5" />
      <Handle type="target" position={Position.Left} className="invisible" />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        className="invisible"
        style={{ top: 12 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        className="invisible"
        style={{ top: 28 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="c"
        className="invisible"
        style={{ top: 44 }}
      />
    </div>
  );
}
