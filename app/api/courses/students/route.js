// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = 'force-dynamic';

// POST API to request all students registered for a specific course
export async function POST(req) {
    try {
      const hasCookies = cookies().has("access-token");
      let user = {};
  
      if (!hasCookies) {
        return NextResponse.json(
          {
            error:
              "You're unauthorized to access registered students, please login to continue.",
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
  
      // Parse the course ID from the request parameters
      const { courseId } = await req.json();
  
      // Fetch all students registered for the specific course from the database
      const registeredStudents = await prisma.studentCourses.findMany({
        where: {
          courseId: courseId,
        },
        select: {
          id: true,
          student: {
            select: {
              id: true,
              fname: true,
              lname: true,
              email: true,
              address: true,
              contact: true,
              studid : true
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    //   console.log(registeredStudents)
  
      return NextResponse.json({ registeredStudents }, { status: 200 });
    } catch (error) {
      console.error("Error fetching data:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  