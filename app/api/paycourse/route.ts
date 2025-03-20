import { NextResponse } from "next/server";

const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

export async function POST(req: Request) {
  try {
    const tx_ref = `tx-${Date.now()}`;
    const { amount, slug, email, phoneNumber } = await req.json();
    console.log("Course Amount", amount);
    const payload = {
      order_id: "12345",
      phone_number: phoneNumber,
      amount: amount,
      currency: "RWF",
      email: email,
      tx_ref,
      redirect_url: `https://twigane.vercel.app/dashboard/courses/${slug}`,
      meta: {
        course_slug: slug,
      },
    };

    const response = await flw.MobileMoney.rwanda(payload);
    console.log(response);
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return new NextResponse("Error processing payment", { status: 500 });
  }
}
