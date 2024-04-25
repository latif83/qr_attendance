// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = 'force-dynamic';

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
        where  :{
            instructorId : user.userId
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