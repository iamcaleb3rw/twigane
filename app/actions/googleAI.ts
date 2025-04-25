"use server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

export async function getResult(
  prompt: string,
  onData: (chunk: string) => void
) {
  // Ensure the API key is available
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;

  if (!apiKey) {
    throw new Error("Google Generative AI API key is missing.");
  }

  // Create the Google Generative AI client
  const google = createGoogleGenerativeAI({
    apiKey: apiKey,
  });

  // Generate text using the specified model and prompt
  try {
    const stream = await streamText({
      model: google("gemini-1.5-pro-latest"),
      prompt: prompt,
    });

    for await (const chunk of stream.textStream) {
      onData(chunk); // Call the onData function with each chunk
    }
    return stream;
  } catch (error) {
    console.error("Error generating text:", error);
    throw new Error("Failed to generate text from AI.");
  }
}
