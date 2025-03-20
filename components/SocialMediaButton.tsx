import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { IconType } from "react-icons/lib";

interface SocialMediaButtonProps {
  color: string;
  title: string;
  icon: React.ReactNode | IconType | LucideIcon;
  url: string;
}
const SocialMediaButton = ({
  color,
  title,
  icon: Icon,
  url,
}: SocialMediaButtonProps) => {
  return (
    <div>
      <Link href={url} target="_blank">
        <div
          style={{ backgroundColor: color }}
          className="p-3 rounded-full w-fit text-white"
        >
          {React.isValidElement(Icon)
            ? Icon
            : typeof Icon === "function" && <Icon size={24} />}
        </div>
      </Link>
    </div>
  );
};

export default SocialMediaButton;
