// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

// POST API to create a new instructor
export async function POST(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to create an instructor, please login to continue.",
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
    let { fname, lname, email, contact, staffid, address } =
      await req.json();

    fname = fname.trim();
    lname = lname.trim();
    email = email.trim();
    contact = contact.trim();
    staffid = staffid.trim();
    address = address.trim();

    // Check if email is unique
    const existingEmail = await prisma.instructors.findFirst({
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

    // Check if staff ID is unique
    const existingInstructor_id = await prisma.instructors.findFirst({
      where: {
        staffid: {
          equals: staffid,
          mode: "insensitive", // Case-insensitive comparison
        },
      },
    });

    if (existingInstructor_id) {
      return NextResponse.json(
        { error: "Staff ID already exists." },
        { status: 400 }
      );
    }

    const newInstructor = await prisma.instructors.create({
      data: {
        fname,
        lname,
        email,
        address,
        contact,
        staffid,
        password: "password@123",
      },
    });

    return NextResponse.json(
      { message: "Instructor added successfully" },
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

    // Fetch all instructors from the database
    const Instructors = await prisma.instructors.findMany({
      orderBy: [
        {
          createdAt: 'desc'
        }
      ]
    });

    

    return NextResponse.json({Instructors}, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
