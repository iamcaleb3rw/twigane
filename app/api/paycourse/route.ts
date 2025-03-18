import { NextResponse } from "next/server";

const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

export async function POST(req: Request) {
  try {
    const tx_ref = `tx-${Date.now()}`;
    const { amount, currency, email, phoneNumber } = await req.json();
    console.log(phoneNumber);
    const payload = {
      order_id: "12345",
      phone_number: phoneNumber,
      amount: amount,
      currency: "RWF",
      email: email,
      tx_ref,
      redirect_url:
        "https://twigane.vercel.app/dashboard/courses/unit-6-limits-of-a-functions",
    };

    const response = await flw.MobileMoney.rwanda(payload);
    console.log(response);
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return new NextResponse("Error processing payment", { status: 500 });
  }
}
