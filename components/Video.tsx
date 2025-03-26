"use client";
import React from "react";
import ReactPlayer from "react-player/lazy";
interface VideoProps {
  src?: string;
}

const Video = ({ src }: VideoProps) => {
  return (
    <div>
      <p>Yoooo</p>
      <ReactPlayer src={src} />
    </div>
  );
};

export default Video;
