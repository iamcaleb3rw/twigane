"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import React, { useState } from "react";
import { getResult } from "@/app/actions/googleAI";

const AI = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="relative h-full">
      <div className="w-[600px] absolute bottom-0 left-[50%] -translate-x-[50%] rounded-[15px_15px_0_0] ring-8 ring-orange-500/20 h-[100px]">
        <form>
          <div className="flex p-1">
            <Input
              placeholder="Ask any question..?"
              className="focus-visible:ring-0 focus-visible:ring-offset-0 border-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} // Update input value
            />
            <div className="flex items-center">
              <Button size={"icon"} variant={"ghost"}>
                <Paperclip className="" />
              </Button>
              <Button
                size="icon"
                className="bg-orange-500 text-white shadow-[1px_1px_0_#c2410c] hover:shadow-[2px_2px_0_#9a3412] active:translate-y-[2px] active:shadow-[1px_1px_0_#7c2d12] transition-all duration-150 ease-in-out border border-orange-700"
                type="submit" // Set button type to submit
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AI;
