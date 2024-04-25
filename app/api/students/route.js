// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = 'force-dynamic';

// POST API to create a new student
export async function POST(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to create a department, please login to continue.",
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
    let { fname, lname, email, contact, student_id, address, level } =
      await req.json();

    fname = fname.trim();
    lname = lname.trim();
    email = email.trim();
    contact = contact.trim();
    student_id = student_id.trim();
    address = address.trim();

    // Check if email is unique
    const existingEmail = await prisma.students.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive", // Case-insensitive comparison
        },
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 400 }
      );
    }

    // Check if student ID is unique
    const existingstudent_id = await prisma.students.findFirst({
      where: {
        studid: {
          equals: student_id,
          mode: "insensitive", // Case-insensitive comparison
        },
      },
    });

    if (existingstudent_id) {
      return NextResponse.json(
        { error: "Student ID already exists." },
        { status: 400 }
      );
    }

    const newStudent = await prisma.students.create({
      data: {
        fname,
        lname,
        email,
        address,
        contact,
        level,
        studid: student_id,
        password: "password@123",
      },
    });

    return NextResponse.json(
      { message: "Student added successfully" },
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


// PUT API to edit student details
export async function PUT(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to edit a student's details, please login to continue.",
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
    const {
      id,
      fname,
      lname,
      email,
      contact,
      student_id,
      address,
      level,
    } = await req.json();

    // Check if the student exists
    const existingStudent = await prisma.students.findUnique({
      where: {
        id,
      },
    });

    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    // Check if email is unique and not taken by another student
    if (
      email &&
      email !== existingStudent.email &&
      (await prisma.students.findFirst({
        where: {
          email: {
            equals: email,
            mode: "insensitive", // Case-insensitive comparison
          },
        },
      }))
    ) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 400 }
      );
    }

    // Check if student ID is unique and not taken by another student
    if (
      student_id &&
      student_id !== existingStudent.studid &&
      (await prisma.students.findFirst({
        where: {
          studid: {
            equals: student_id,
            mode: "insensitive", // Case-insensitive comparison
          },
        },
      }))
    ) {
      return NextResponse.json(
        { error: "Student ID already exists." },
        { status: 400 }
      );
    }

    // Update the student details
    const updatedStudent = await prisma.students.update({
      where: {
        id,
      },
      data: {
        fname,
        lname,
        email,
        address,
        contact,
        level,
        studid: student_id,
      },
    });

    return NextResponse.json(
      { message: "Student details updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating student details:", error);
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
            "You're unauthorized to access students data, please login to continue.",
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

    // Fetch all students from the database
    const students = await prisma.students.findMany({
      orderBy: [
        {
          createdAt: 'desc'
        }
      ]
    });

    

    return NextResponse.json({students}, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
