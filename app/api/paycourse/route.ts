import { createEnrollment } from "@/sanity/lib/student/createEnrollment";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
import { NextResponse } from "next/server";
import { createStudentIfNotExists } from "@/sanity/lib/student/createStudentIfNotExists";
import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
const Flutterwave = require("flutterwave-node-v3");

const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY,
  { timeout: 10000 } // 10s timeout
);

export async function POST(req: Request) {
  try {
    const tx_ref = `tx-${Date.now()}`;
    const {
      amount,
      slug,
      email,
      phoneNumber,
      userId,
      firstName,
      lastName,
      imageUrl,
    } = await req.json();

    console.log("➡️ Received payment request for:", slug, "User:", userId);

    // ⏳ Start execution timer
    const start = Date.now();

    // Step 1: Fetch course (async operation)
    const coursePromise = getCourseBySlug(slug);

    // Step 2: Fetch student (async operation)
    let student = await getStudentByClerkId(userId);

    // If student doesn't exist, create a new one
    if (!student.data) {
      console.log("🆕 Student not found, creating...");
      student = await createStudentIfNotExists({
        clerkId: userId,
        email,
        firstName,
        lastName,
        imageUrl,
      });

      if (!student.data) {
        console.error("❌ Failed to create student");
        return new NextResponse("Failed to create student", { status: 500 });
      }
    }

    console.log("✅ Student ID:", student.data._id);

    // Step 3: Wait for the course to load
    const course = await coursePromise;

    if (!course) {
      console.error("❌ Course not found for slug:", slug);
      return new NextResponse("Course not found", { status: 404 });
    }

    console.log("📚 Course found:", course.title);

    // Step 4: Handle free enrollment
    if (amount === 0) {
      console.log("🎓 Creating free enrollment...");

      if (!student.data?._id || !course._id) {
        console.error("❌ Missing student ID or course ID");
        return new NextResponse("Missing student or course ID", {
          status: 400,
        });
      }

      await createEnrollment({
        studentId: student.data._id,
        courseId: course._id,
        amount: 0,
        paymentId: "free",
      });

      console.log("✅ Free enrollment created");
      return NextResponse.json(
        { message: "Free enrollment created" },
        { status: 200 }
      );
    }

    // Step 5: Initiate payment (starts immediately)
    const paymentPayload = {
      order_id: `order-${Date.now()}`,
      phone_number: phoneNumber,
      amount: amount,
      currency: "RWF",
      email: email,
      tx_ref,
      redirect_url: `https://twigane.vercel.app/dashboard/courses/${slug}`,
      meta: {
        course_slug: slug,
        userId: userId,
      },
    };

    console.log("💳 Initiating payment...");
    const paymentResponse = await flw.MobileMoney.rwanda(paymentPayload);
    console.log("✅ Payment initiated successfully:", paymentResponse);

    // ⏱️ Log execution time
    console.log(`🚀 Request completed in ${Date.now() - start}ms`);

    return NextResponse.json(paymentResponse);
  } catch (error) {
    console.error("❌ Error processing request:", error);
    return new NextResponse("Error processing payment", { status: 500 });
  }
}
