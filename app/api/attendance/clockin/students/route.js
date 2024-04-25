// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = 'force-dynamic';

// GET API to retrieve all students clocked in for a particular course
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
        const fromDate = searchParams.get("fromDate");
        const toDate = searchParams.get("toDate");

        // Check if course exists
        const existingCourse = await prisma.courses.findUnique({
            where: {
                id: courseId,
            },
        });

        if (!existingCourse) {
            return NextResponse.json({ error: "Course not found." }, { status: 404 });
        }

        // Construct filter object based on query parameters
        const filter = {
            courseId,
        };

        if (fromDate && toDate) {
            // Parse dates from string to Date objects
            const fromDateTime = new Date(fromDate);
            const toDateTime = new Date(toDate);
        
            // Increment the toDateTime by 1 day to include the end date
            toDateTime.setDate(toDateTime.getDate() + 1);
        
            filter.clockIn = {
                gte: fromDateTime,
                lt: toDateTime,
            };
        } else if (fromDate) {
            filter.clockIn = {
                gte: new Date(fromDate),
            };
        } else if (toDate) {
            // Increment the toDate by 1 day to include the end date
            const toDateTime = new Date(toDate);
            toDateTime.setDate(toDateTime.getDate() + 1);
        
            filter.clockIn = {
                lt: toDateTime,
            };
        }        

        // Retrieve attendance records for the course with optional date filtering
        const attendanceRecords = await prisma.attendance.findMany({
            where: filter,
            select: {
                id: true,
                clockIn: true,
                student: {
                    select: {
                        id: true,
                        fname: true,
                        lname: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                clockIn: "desc",
            },
        });

        return NextResponse.json({ attendanceRecords }, { status: 200 });
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
