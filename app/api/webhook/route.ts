import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
// Assuming you have this function
import { NextResponse } from "next/server";

const Flutterwave = require("flutterwave-node-v3");

// Initialize Flutterwave with your API keys
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY!, // Your public key
  process.env.FLW_SECRET_KEY! // Your secret key
);

// Verify the payment with Flutterwave's API using the transaction ID
async function verifyPayment(transactionId: string) {
  try {
    const response = await flw.Transaction.verify({ id: transactionId });
    console.log("🔎 Payment verification response:", response);

    if (
      response.status === "success" &&
      response.data.status === "successful"
    ) {
      return {
        success: true,
        courseSlug: response.data.meta.course_slug, // Course slug from metadata
        userId: response.data.meta.userId, // Clerk user ID from metadata
        paymentId: response.data.id, // Transaction ID
        amount: response.data.charged_amount, // Charged amount
      };
    } else {
      console.log("❌ Payment verification failed.");
      return { success: false };
    }
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    return { success: false };
  }
}

export async function POST(req: Request) {
  try {
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers.get("verif-hash");

    console.log("SIGNATURE FROM HEADERS", signature, typeof signature);
    console.log("HASH FROM ENV FILE", secretHash, typeof secretHash);

    if (!signature || signature !== secretHash) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    console.log("🔔 Webhook received:", body);

    // Ensure the webhook event is for a completed charge
    if (body?.event !== "charge.completed") {
      console.warn("⚠️ Ignored webhook event:", body?.event);
      return NextResponse.json({ message: "Ignored" }, { status: 200 });
    }

    const { data } = body;
    const { id: transactionId } = data;

    if (!transactionId) {
      console.error("❌ Missing transaction id in webhook data:", data);
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Step 1: Verify payment with the transaction ID
    const { success, courseSlug, userId, paymentId, amount } =
      await verifyPayment(transactionId);

    if (!success) {
      console.log("❌ Payment verification failed.");
      return NextResponse.json(
        { message: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Step 2: Fetch the student using the Clerk user ID
    const student = await getStudentByClerkId(userId);

    if (!student.data) {
      console.error("❌ Student not found for Clerk ID:", userId);
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Step 3: Fetch the course using the course slug
    const course = await getCourseBySlug(courseSlug);

    if (!course) {
      console.error("❌ Course not found for slug:", courseSlug);
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Step 4: Create enrollment
    await createEnrollment({
      studentId: student.data._id, // Student ID from Sanity
      courseId: course._id, // Course ID from Sanity
      amount, // Amount from payment
      paymentId: paymentId, // Transaction ID from payment
    });

    console.log("✅ Enrollment created successfully");

    return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
