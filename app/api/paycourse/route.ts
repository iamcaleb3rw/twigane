import { NextResponse } from "next/server";

const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

export async function POST() {
  try {
    const tx_ref = `tx-${Date.now()}`;
    const payload = {
      order_id: "12345",
      phone_number: "250788888888",
      amount: 1000,
      currency: "RWF",
      email: "icaleb130@gmail.com",
      tx_ref,
    };

    const response = await flw.MobileMoney.rwanda(payload);
    console.log(response);
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return new NextResponse("Error processing payment", { status: 500 });
  }
}
