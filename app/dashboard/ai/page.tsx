"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Keyboard, Type } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import MarkdownWithMath from "@/components/MarkdownWithMath";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import type { MathfieldElement } from "mathlive";

const AI = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMathMode, setIsMathMode] = useState(false);
  const [isMathLiveLoaded, setIsMathLiveLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mathfieldRef = useRef<MathfieldElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize MathLive
  useEffect(() => {
    let isMounted = true;

    const initializeMathLive = async () => {
      const { MathfieldElement } = await import("mathlive");

      if (isMounted && !customElements.get("math-field")) {
        customElements.define("math-field", MathfieldElement);
        window.MathfieldElement = MathfieldElement;
        setIsMathLiveLoaded(true);
      }
    };

    initializeMathLive();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync input values between modes
  useEffect(() => {
    if (isMathMode && mathfieldRef.current) {
      mathfieldRef.current.value = input;
    }
  }, [input, isMathMode]);

  // Create synthetic change event for math-field
  const handleMathInput = (value: string) => {
    const syntheticEvent = {
      target: {
        value: value,
        name: "input",
        type: "text",
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(syntheticEvent);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Final sync before submission
      if (isMathMode && mathfieldRef.current) {
        handleMathInput(mathfieldRef.current.value);
      }
      await handleSubmit(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-[fit] flex flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto pr-8 p-4 pb-[120px] space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-center"
            )}
          >
            <div
              className={cn(
                "w-full max-w-[760px] rounded-lg p-4",
                message.role === "user" ? "bg-orange-500 w-fit text-white" : ""
              )}
            >
              <div className="prose prose-sm">
                <MarkdownWithMath content={message.content} />
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Fixed Input Container */}
      <div className="bg-accent border ring-8 ring-orange-400 border-white rounded-[20px_20px_0_0] w-full max-w-[770px] min-h-[110px] p-3 fixed bottom-0 left-[var(--sidebar-width)] right-0 mx-auto transition-[left] duration-200">
        <form onSubmit={handleFormSubmit} className="flex gap-2 w-full">
          {isMathMode ? (
            <math-field
              ref={mathfieldRef}
              placeholder="Type math here..."
              class="flex-1 bg-accent rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              onInput={(e) =>
                handleMathInput((e.target as MathfieldElement).value)
              }
              virtual-keyboard-mode="manual"
            ></math-field>
          ) : (
            <input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              className="flex-1 bg-accent rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => {
              setIsMathMode(!isMathMode);
              if (mathfieldRef.current) {
                mathfieldRef.current.value = input;
                if (!isMathMode) {
                  mathfieldRef.current.focus();
                }
              }
            }}
          >
            {isMathMode ? (
              <Type className="w-5 h-5" />
            ) : (
              <Keyboard className="w-5 h-5" />
            )}
          </Button>

          <Button
            size="icon"
            type="submit"
            className="bg-orange-500 text-white shadow-sm hover:bg-orange-600"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AI;
