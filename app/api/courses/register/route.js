// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = 'force-dynamic';

// POST API to register a new course
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
    let { course } = await req.json();

    // Check if course has bieng registered
    const existingRegisteredCourse = await prisma.studentCourses.findFirst({
      where: {
        courseId: {
          equals: course,
          mode: "insensitive", // Case-insensitive comparison
        },
        studentId: {
          equals: user.userId,
          mode: "insensitive", // Case-insensitive comparison
        },
      },
    });

    if (existingRegisteredCourse) {
      return NextResponse.json(
        { error: "Course already registered." },
        { status: 400 }
      );
    }

    // Check if course code exists
    const existingCourse = await prisma.courses.findFirst({
      where: {
        id: {
          equals: course,
          mode: "insensitive", // Case-insensitive comparison
        },
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course does not exist." },
        { status: 400 }
      );
    }

    const newCourse = await prisma.studentCourses.create({
      data: {
        studentId: user.userId,
        courseId: course,
      },
    });

    return NextResponse.json(
      { message: "Course registered successfully" },
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

// GET API to get registered courses
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
    const Courses = await prisma.studentCourses.findMany({
        where:{
            studentId : user.userId
        },
      select: {
        id: true,
        course: {
          select: {
            id: true,
            title: true,
            code: true,
            instructor: {
              select: {
                id: true,
                fname: true,
                lname: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });

    // console.log(Courses)

    return NextResponse.json({ Courses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
