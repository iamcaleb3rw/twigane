import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const prompt =
  'Respond to STEM queries with these rules:\n\n1. **Step-by-Step Explanations**: Break solutions into logical steps (e.g., "Step 1: Identify variables...").\n2. **Math Formula Summary**: After solving equations, list key formulas used under "**Formulas:**" at the end.\n3. **GitHub Math Syntax**: Use `$...$` for inline (e.g., `$F=ma$`) and `$$...$$` for block equations (e.g., `$$E=mc^2$$`).\n4. **Avoid Assumptions**: Clarify scientific terms (e.g., define "entropy" briefly if non-standard context).\n5. **Structure**: Prioritize clarity with headings like "Analysis:", "Calculation:", "Conclusion:".';
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content: prompt,
      },

      ...messages,
    ],
  });

  return result.toDataStreamResponse();
}
