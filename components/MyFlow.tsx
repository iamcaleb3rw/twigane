"use client";

import React from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Globe } from "lucide-react";
import Logo from "@/public/logo.svg";
import AIImage from "@/public/ai.png";
import BookImage from "@/public/books.png";
import CourseImage from "@/public/course.png";
import Image from "next/image";
import GlobeAnimation from "@/public/globe.json";
import Lottie from "lottie-react";
import { BorderBeam } from "./magicui/border-beam";

// Custom node for the Globe icon
const GlobeNode = () => {
  return (
    <div className="flex items-center justify-center relative">
      <div className="border relative h-12 w-12 p-0 rounded-md bg-white">
        <Lottie
          animationData={GlobeAnimation}
          className="h-full w-full scale-[2] absolute z-40 "
        />
        <BorderBeam duration={8} size={100} />
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="bg-gray-600"
        style={{ width: 6, height: 6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        className="bg-gray-600"
        style={{ width: 6, height: 6, top: 8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        className="bg-gray-600"
        style={{ width: 6, height: 6, top: 24 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="c"
        className="bg-gray-600"
        style={{ width: 6, height: 6, top: 40 }}
      />
    </div>
  );
};

// Default node with Tailwind styles
const DefaultNode = ({ data }: any) => (
  <div className="bg-white border text-sm rounded-full min-w-[80px] py-1 px-4 text-center relative">
    <div className="flex items-center gap-2">
      {data.imgSrc && <Image src={data.imgSrc} alt="Icon" width={20} />}
      <p className="text-[10px] text-orange-400">{data.label}</p>
    </div>
    <Handle
      type="target"
      position={Position.Left}
      className="bg-orange-600"
      style={{ width: 6, height: 6 }}
    />
    <Handle
      type="source"
      position={Position.Right}
      className="bg-orange-600"
      style={{ width: 6, height: 6 }}
    />
  </div>
);

const nodeTypes = {
  globeNode: GlobeNode,
  defaultNode: DefaultNode,
};

const initialNodes = [
  {
    id: "1",
    type: "defaultNode",
    data: { label: "Twigane LMS" },
    position: { x: 0, y: 100 },
  },
  {
    id: "2",
    type: "globeNode",
    data: {},
    position: { x: 200, y: 100 },
  },
  {
    id: "3",
    type: "defaultNode",
    data: { label: "AI", imgSrc: AIImage },
    position: { x: 400, y: 20 },
  },
  {
    id: "4",
    type: "defaultNode",
    data: { label: "Books", imgSrc: BookImage },
    position: { x: 400, y: 100 },
  },
  {
    id: "5",
    type: "defaultNode",
    data: { label: "Courses", imgSrc: CourseImage },
    position: { x: 400, y: 180 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", style: { stroke: "#1c64f2" } },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    sourceHandle: "a",
    style: { stroke: "#8b5cf6" },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    sourceHandle: "b",
    style: { stroke: "#d946ef" },
  },
  {
    id: "e2-5",
    source: "2",
    target: "5",
    sourceHandle: "c",
    style: { stroke: "#67e8f9" },
  },
];

export default function MyFlow() {
  return (
    <div className="h-[300px] rounded-none pointer-events-none w-full">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        attributionPosition="bottom-left"
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
