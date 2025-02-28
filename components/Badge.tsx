import React from "react";

interface BadgeProps {
  text: string;
  color: string; // Color can be used for background or text color, depending on your needs
  icon?: React.ReactNode; // Icon can be any valid React node (SVG, image, etc.)
}

const Badge = ({ text, color, icon }: BadgeProps) => {
  return (
    <div
      className={`flex items-center w-full space-x-2 p-2 border rounded-md ${color}`} // Apply background or border color here
    >
      {icon && <div className="text-black">{icon}</div>}{" "}
      {/* You can apply the color to the icon or let the icon handle it */}
      <span>{text}</span>
    </div>
  );
};

export default Badge;
