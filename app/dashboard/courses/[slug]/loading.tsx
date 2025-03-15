import { Loader, Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[85vh]">
      <Loader2 className="animate-spin text-primary" size={80} />
    </div>
  );
};

export default Loading;
