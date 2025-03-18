import { NextResponse } from "next/server";

const Flutterwave = require("flutterwave-node-v3");

// Initialize Flutterwave with your API keys
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY!, // Your public key
  process.env.FLW_SECRET_KEY! // Your secret key
);

// Simulating a database update
async function updatePaymentStatus(
  txRef: string,
  status: "successful" | "failed"
) {
  console.log(`📢 Updating payment status: ${txRef} → ${status}`);
  // TODO: Replace with actual database update logic
}

// Verify the payment with Flutterwave's API using the transaction ID
async function verifyPayment(transactionId: string) {
  try {
    const response = await flw.Transaction.verify({ id: transactionId });
    console.log("🔎 Payment verification response:", response);

    if (
      response.status === "success" &&
      response.data.status === "successful"
    ) {
      return true; // Payment was successfully verified
    } else {
      console.log("❌ Payment verification failed.");
      return false; // Payment verification failed
    }
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🔔 Webhook received:", body);

    if (body?.event !== "charge.completed") {
      console.warn("⚠️ Ignored webhook event:", body?.event);
      return NextResponse.json({ message: "Ignored" }, { status: 200 });
    }

    const { data } = body;
    const { tx_ref, id, status } = data;

    if (!tx_ref || !id) {
      console.error(
        "❌ Missing tx_ref or transaction id in webhook data:",
        data
      );
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Step 1: Verify payment with the transaction ID
    const paymentVerified = await verifyPayment(id);

    if (!paymentVerified) {
      console.log("❌ Payment verification failed. Marking payment as failed.");
      await updatePaymentStatus(tx_ref, "failed");
      return NextResponse.json(
        { message: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Step 2: Update payment status based on verification
    const paymentStatus = status === "successful" ? "successful" : "failed";
    await updatePaymentStatus(tx_ref, paymentStatus);

    console.log(`✅ Payment ${paymentStatus}:`, data);

    return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
