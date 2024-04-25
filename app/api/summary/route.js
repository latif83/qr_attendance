// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = 'force-dynamic';

// GET API to retrieve summary
export async function GET(req) {
    try {
        // Check if the user is authorized
        const hasCookies = cookies().has("access-token");
        let user = {};

        if (!hasCookies) {
            return NextResponse.json(
                {
                    error:
                        "You're unauthorized to access summary data, please login to continue.",
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

        // Query database for summary data
        const studentsCount = await prisma.students.count();
        const adminsCount = await prisma.admins.count();
        const instructorsCount = await prisma.instructors.count();
        const coursesCount = await prisma.courses.count();

        const summary = {
            studentsCount,
            adminsCount,
            instructorsCount,
            coursesCount,
        }

        // console.log(summary)

        // Return summary data
        return NextResponse.json(
            {
                summary
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching summary data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}