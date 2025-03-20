import { createEnrollment } from "@/sanity/lib/student/createEnrollment";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
// Assuming you have this function
// Assuming you have this function
import { NextResponse } from "next/server";

import { createStudentIfNotExists } from "@/sanity/lib/student/createStudentIfNotExists";
import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
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

    // Step 1: Fetch or create the student
    let student = await getStudentByClerkId(userId);

    if (!student.data) {
      // If the student doesn't exist, create a new one
      console.log("🆕 Student not found, creating a new student...");
      const createStudentResponse = await createStudentIfNotExists({
        clerkId: userId,
        email,
        firstName,
        lastName,
        imageUrl,
      });

      if (!createStudentResponse.data) {
        console.error("❌ Failed to create student");
        return new NextResponse("Failed to create student", { status: 500 });
      }

      // Use the newly created student
      student = createStudentResponse;
    }

    console.log("✅ Student:", student.data);

    // Step 2: Fetch the course using the slug
    const course = await getCourseBySlug(slug);

    if (!course) {
      console.error("❌ Course not found for slug:", slug);
      return new NextResponse("Course not found", { status: 404 });
    }

    // Step 3: Handle free enrollment (amount === 0)
    if (amount === 0) {
      console.log("🎓 Creating free enrollment...");
      if (!student.data?._id || !course._id) {
        console.error("❌ Missing student ID or course ID");
        return new NextResponse("Missing student ID or course ID", {
          status: 400,
        });
      }
      await createEnrollment({
        studentId: student.data?._id,
        courseId: course._id,
        amount: 0,
        paymentId: "free", // Indicates a free enrollment
      });

      console.log("✅ Free enrollment created successfully");
      return NextResponse.json(
        { message: "Free enrollment created" },
        { status: 200 }
      );
    }

    // Step 4: Initiate payment for non-free courses
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
        userId: userId,
      },
    };

    const response = await flw.MobileMoney.rwanda(payload);
    console.log("💳 Payment initiated:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Error processing request:", error);
    return new NextResponse("Error processing payment", { status: 500 });
  }
}
