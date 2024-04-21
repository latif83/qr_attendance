// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

// POST API to start an attendance session
export async function POST(req) {
  try {
    // Check if the user is authorized
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to start an attendance session, please login to continue.",
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

    // Parse the request body
    const { courseId, attendanceCode, password } = await req.json();

    // Retrieve the instructor's password from the database
    const instructor = await prisma.instructors.findUnique({
      where: {
        id: user.userId, // Assuming user.userId is the instructor's unique identifier
      },
      select: {
        password: true,
      },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }

    // Check if password matches
    if (password !== instructor.password) {
      return NextResponse.json(
        { error: "Password does not match" },
        { status: 400 }
      );
    }

    // Generate the current date and time for startDateTime
    const startDateTime = new Date();

    // Check if course exists
    const existingCourse = await prisma.courses.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    // Create the attendance session
    const newAttendanceSession = await prisma.attendanceSessions.create({
      data: {
        startDateTime,
        attendanceCode,
        courseId,
      },
    });

    return NextResponse.json(
      { message: "Attendance session started successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error starting attendance session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET API to check if there's an active session for a particular course
export async function GET(req) {
  try {
    // Check if the user is authorized
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to check for active sessions, please login to continue.",
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

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    //   console.log("course Id" , courseId)

    // Check if course exists
    const existingCourse = await prisma.courses.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    // Get active attendance session for the course
    const activeSession = await prisma.attendanceSessions.findFirst({
      where: {
        courseId: courseId,
        startDateTime: { lte: new Date() }, // Check if startDateTime is less than or equal to current date and time
        OR: [
          { endDateTime: { gte: new Date() } }, // Check if endDateTime is greater than or equal to current date and time
          {
            endDateTime: null,
            // Ensure that startDateTime is on the same date as the current date if endDateTime is null
            startDateTime: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of current date
              lt: new Date(new Date().setHours(24, 0, 0, 0)), // End of current date
            },
          },
        ],
      },
    });

      // console.log(activeSession)

    if (activeSession) {
      return NextResponse.json(
        {
          message: "Active session found for the course",
          activeSession,
          active: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No active session found for the course", active: false },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error checking for active session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT API to stop an active session
export async function PUT(req) {
  try {
    // Check if the user is authorized
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to stop an active session, please login to continue.",
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

    // Parse request body
    const { sessionId } = await req.json();

    // Get the active session
    const activeSession = await prisma.attendanceSessions.findFirst({
      where: {
        id: sessionId,
        endDateTime: null, // Ensure the session is active
      },
    });

    if (!activeSession) {
      return NextResponse.json(
        { error: "No active session found with the provided session ID" },
        { status: 404 }
      );
    }

    // Update the endDateTime to current date and time to stop the session
    const updatedSession = await prisma.attendanceSessions.update({
      where: { id: sessionId },
      data: { endDateTime: new Date() },
    });

    return NextResponse.json(
      { message: "Session stopped successfully", updatedSession },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error stopping session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
