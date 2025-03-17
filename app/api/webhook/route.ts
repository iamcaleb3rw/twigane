import { NextResponse } from "next/server";

// Simulating a database update
async function updatePaymentStatus(txRef: string, status: string) {
  console.log(`📢 Updating payment ${txRef} to status: ${status}`);
}

export async function POST(req: Request) {
  const body = await req.json();
  console.log("🔔 Webhook received:", body);

  if (body.event === "charge.completed") {
    const data = body.data;

    if (data.status === "successful") {
      console.log("✅ Payment verified:", data);
      await updatePaymentStatus(data.tx_ref, "successful");
    } else {
      console.log("❌ Payment failed:", data);
      await updatePaymentStatus(data.tx_ref, "failed");
    }
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
