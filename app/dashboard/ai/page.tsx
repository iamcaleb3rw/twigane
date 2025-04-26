"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import MarkdownWithMath from "@/components/MarkdownWithMath";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

const AI = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleSubmit();
    } catch (error) {
      console.error("Error submitting message:", error);
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
      <div className="bg-accent border ring-8 ring-orange-400 border-white rounded-[20px_20px_0_0] w-full max-w-[770px] min-h-[110px] p-3 fixed bottom-0 mx-auto">
        <form onSubmit={handleFormSubmit} className="flex gap-2 w-full">
          <Input
            placeholder="Ask something..?"
            className="flex-1 border-none focus-visible:ring-offset-0 bg-accent focus-visible:ring-0"
            value={input}
            onChange={handleInputChange}
          />
          <Button variant="ghost" size="icon" type="button">
            <Paperclip className="w-5 h-5" />
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
