import React from "react";

import OpenAILogo from "@/public/chatgpt.svg";
import YoutubeLogo from "@/public/youtube.svg";
import WolframLogo from "@/public/wolfram.png";
import UdemyLogo from "@/public/udemy.png";
import Image from "next/image";

const items = [
  { img: OpenAILogo },
  { img: YoutubeLogo },
  { img: WolframLogo },
  { img: UdemyLogo },
];

const Tabs = () => {
  return (
    <div className="flex bg-gray-100 border-b border-gray-300">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`flex items-center px-4 py-2 relative ${
            idx < items.length - 1 ? "border-r border-gray-300" : ""
          }`}
        >
          <Image src={item.img} alt="Logo" width={20} height={20} />
        </div>
      ))}
    </div>
  );
};

export default Tabs;
