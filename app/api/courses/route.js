// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = 'force-dynamic';

// POST API to create a new course
export async function POST(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to create a course, please login to continue.",
        },
        { status: 400 }
      );
    }

    if (hasCookies) {
      const cookie = cookies().get("access-token");

      if (cookie?.value) {
        const verificationResult = await verifyToken(cookie.value);

        if (verificationResult.status) {
          user = verificationResult.decodedToken;
          // Now you have the user details, you can use them as needed
          //   console.log("User details:", user);
        } else {
          // Handle invalid token
          return NextResponse.json(
            { error: "Your session is expired, please login" },
            { status: 400 }
          );
        }
      }
    }

    // Parse the request body
    let { title, code, instructorId } = await req.json();

    title = title.trim();
    code = code.trim();
    instructorId = instructorId.trim();

    // Check if course title is unique
    const existingCourse = await prisma.courses.findFirst({
      where: {
        title: {
          equals: title,
          mode: "insensitive", // Case-insensitive comparison
        },
      },
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: "Course already exists." },
        { status: 400 }
      );
    }

    // Check if course code is unique
    const existingCourseCode = await prisma.courses.findFirst({
      where: {
        code: {
          equals: code,
          mode: "insensitive", // Case-insensitive comparison
        },
      },
    });

    if (existingCourseCode) {
      return NextResponse.json(
        { error: "Course Code already exists." },
        { status: 400 }
      );
    }

    // Check if instructor exists
    const existingInstructor = await prisma.instructors.findUnique({
      where: {
        id: instructorId,
      },
    });

    if (!existingInstructor) {
      return NextResponse.json(
        { error: "Instructor not found." },
        { status: 404 }
      );
    }

    const newCourse = await prisma.courses.create({
      data: {
        title,
        code,
        instructor: { connect: { id: instructorId } }, // Link the course to the instructor
      },
    });

    return NextResponse.json(
      { message: "Course added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT API to edit an existing course
export async function PUT(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to edit a course, please login to continue.",
        },
        { status: 400 }
      );
    }

    if (hasCookies) {
      const cookie = cookies().get("access-token");

      if (cookie?.value) {
        const verificationResult = await verifyToken(cookie.value);

        if (verificationResult.status) {
          user = verificationResult.decodedToken;
          // Now you have the user details, you can use them as needed
          //   console.log("User details:", user);
        } else {
          // Handle invalid token
          return NextResponse.json(
            { error: "Your session is expired, please login" },
            { status: 400 }
          );
        }
      }
    }

    // Parse the request body
    let { id, title, code, instructorId } = await req.json();

    id = id.trim(); // Assuming you're passing the ID of the course to be edited
    title = title.trim();
    code = code.trim();
    instructorId = instructorId.trim();

    // Check if the course exists
    const existingCourse = await prisma.courses.findUnique({
      where: {
        id,
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    // Check if the instructor exists
    const existingInstructor = await prisma.instructors.findUnique({
      where: {
        id: instructorId,
      },
    });

    if (!existingInstructor) {
      return NextResponse.json(
        { error: "Instructor not found." },
        { status: 404 }
      );
    }

    // Update the course details
    const updatedCourse = await prisma.courses.update({
      where: {
        id,
      },
      data: {
        title,
        code,
        instructor: { connect: { id: instructorId } }, // Link the course to the instructor
      },
    });

    return NextResponse.json(
      { message: "Course updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function GET(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to access instructors data, please login to continue.",
        },
        { status: 400 }
      );
    }

    if (hasCookies) {
      const cookie = cookies().get("access-token");

      if (cookie?.value) {
        const verificationResult = await verifyToken(cookie.value);

        if (verificationResult.status) {
          user = verificationResult.decodedToken;
          // Now you have the user details, you can use them as needed
          // console.log("User details:", user);
        } else {
          // Handle invalid token
          return NextResponse.json(
            { error: "Your session is expired, please login" },
            { status: 400 }
          );
        }
      }
    }

    // Fetch all Courses from the database
    const Courses = await prisma.courses.findMany({
      select: {
        id: true,
        title: true,
        code: true,
        instructor: {
          select : {
            id: true,
          fname: true,
          lname: true,
          }
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });

    return NextResponse.json({ Courses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
