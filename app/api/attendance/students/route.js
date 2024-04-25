// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = 'force-dynamic';

// GET API to retrieve the count of students registered for a particular course
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

        // Parse query parameters
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");

        // Check if course exists
        const existingCourse = await prisma.courses.findUnique({
            where: {
                id: courseId,
            },
        });

        if (!existingCourse) {
            return NextResponse.json({ error: "Course not found." }, { status: 404 });
        }
        
        // Query database for the count of students registered for the course
        const studentsCount = await prisma.studentCourses.count({
            where: {
                courseId: courseId,
            },
        });

        // console.log(studentsCount)

        return NextResponse.json({ studentsCount }, { status: 200 });
    } catch (error) {
        console.error("Error fetching student count for the course:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
