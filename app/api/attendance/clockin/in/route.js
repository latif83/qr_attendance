// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

// POST API to mark attendance
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
    const { attendanceSessionCode } = await req.json();

    const studentId = user.userId;

    // Check if the student exists
    const existingStudent = await prisma.students.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!existingStudent) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 }
      );
    }

    // Check if the student is registered for the course
    const courseId = await prisma.studentCourses.findFirst({
      where: {
        studentId
      }
    });

    if (!courseId) {
      return NextResponse.json(
        { error: "Student is not registered for the course." },
        { status: 400 }
      );
    }

    // Check if the attendance session exists
    const existingAttendanceSession = await prisma.attendanceSessions.findFirst(
      {
        where: {
          attendanceCode: attendanceSessionCode,
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
        select: {
          id: true,
          course: {
            select: {
              id: true,
            },
          },
        },
      }
    );

    if (!existingAttendanceSession) {
      return NextResponse.json(
        { error: "Attendance session is either expired or incorrect." },
        { status: 404 }
      );
    }

    // Check if attendance record already exists for the student in the session
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId,
        AttendanceSessionId: existingAttendanceSession.id,
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        { error: "Attendance has already been marked for this student." },
        { status: 400 }
      );
    }

    // Create the attendance record
    const newAttendance = await prisma.attendance.create({
      data: {
        studentId,
        courseId: existingAttendanceSession.course.id,
        AttendanceSessionId: existingAttendanceSession.id,
        clockIn: new Date(), // Mark the current time as the clock-in time
      },
    });

    return NextResponse.json(
      { message: "Attendance marked successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



// GET API to retrieve attendance of a particular student for a specific course
export async function GET(req) {
  try {
    // Check if the user is authorized
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to access attendance data, please login to continue.",
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

    const studentId = user.userId;

    // Retrieve attendance records for the student and course
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        clockIn: true,
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    console.log(attendanceRecords);

    return NextResponse.json({ attendanceRecords }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
