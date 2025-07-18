import { streamText, type CoreMessage } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  // Explicitly type the incoming messages from the client
  const {
    messages: clientMessages,
  }: {
    messages: Array<{ type: "text" | "image" | "user-text"; content: string }>;
  } = await req.json();

  // Transform client-side ChatMessage[] to AI SDK's CoreMessage[]
  const aiSdkMessages: CoreMessage[] = clientMessages
    .map((msg) => {
      if (msg.type === "user-text") {
        // If the user's message is an image data URL, treat it as an image part
        if (msg.content.startsWith("data:image/png;base64,")) {
          return {
            role: "user",
            content: [{ type: "image", image: new URL(msg.content) }],
          };
        } else {
          // Otherwise, it's plain text from the user
          return { role: "user", content: msg.content };
        }
      } else if (msg.type === "image") {
        // This is a screenshot sent by the user (from handleSolveClick)
        // It should be treated as user input for the AI model
        return {
          role: "user", // Images from the user are always 'user' role
          content: [{ type: "image", image: new URL(msg.content) }],
        };
      } else if (msg.type === "text") {
        // This is a previous AI response
        // Remove "AI: " prefix if present to avoid confusing the model
        return { role: "assistant", content: msg.content.replace(/^AI: /, "") };
      }
      return null; // Should not be reached with valid ChatMessage types
    })
    .filter(Boolean) as CoreMessage[]; // Filter out nulls and assert the final type

  try {
    const result = await streamText({
      model: google("models/gemini-pro-vision"),
      messages: aiSdkMessages, // Use the transformed messages
      system:
        "You are an AI assistant specialized in solving problems from past papers. Analyze the provided images and text to offer detailed solutions, explanations, and relevant concepts. If an image is provided, focus on solving the problem presented in the image. If only text is provided, answer the question directly.",
    });

    // Correct method for streaming the AI response to a standard ReadableStream
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in AI stream:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get AI response" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
