// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = 'force-dynamic';


// GET API to retrieve details of one student
export async function GET(req) {
    try {
        // Check if the user is authorized
        const hasCookies = cookies().has("access-token");
        let user = {};

        if (!hasCookies) {
            return NextResponse.json(
                {
                    error:
                        "You're unauthorized to access student data, please login to continue.",
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

        // Extract userId from the decoded token
        const userId = user.userId;

        // Query database to retrieve details of the student
        const student = await prisma.students.findUnique({
            where: {
                id: userId,
            },
        });

        // console.log(student)

        if (!student) {
            return NextResponse.json({ error: "Student not found." }, { status: 404 });
        }

        return NextResponse.json({ student }, { status: 200 });
    } catch (error) {
        console.error("Error fetching student details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

