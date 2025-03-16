import { NextRequest, NextResponse } from "next/server";
import Cors from "cors";
import { buffer } from "micro";

// Initialize CORS middleware
const cors = Cors({
  methods: ["POST", "HEAD"],
});

// Helper function to run CORS middleware
const runCors = (req: NextRequest, res: NextResponse) => {
  return new Promise((resolve, reject) => {
    // Manually adapt NextRequest to work with the cors middleware
    (cors as any)(req as any, res as any, (result: any) => {
      if (result instanceof Error) {
        reject(result);
      }
      resolve(result);
    });
  });
};

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle raw body
  },
};

export async function POST(req: any) {
  try {
    // Apply CORS middleware
    const res = new NextResponse();
    await runCors(req, res);

    // Parse the raw body
    const rawBody = await buffer(req);
    const body = JSON.parse(rawBody.toString());

    // Check if the transaction is successful
    if (body.status === "successful") {
      // Handle the success case (e.g., save transaction data)
      console.log("Transaction successful:", body);

      return NextResponse.json({ message: "Webhook processed successfully" });
    } else {
      return NextResponse.json(
        { message: "Transaction failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
