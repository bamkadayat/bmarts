import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

// Validation schema for user creation by admin
const adminCreateUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
  emailVerified: z.boolean().default(false),
});

type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;

// POST - Admin creates a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Parse and validate the request body
    const { name, email, password, role, emailVerified }: AdminCreateUserInput =
      adminCreateUserSchema.parse(body);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerified,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "User created successfully", data: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);

    if ((error as { code?: string }).code === "P2002") {
      // Unique constraint violation (e.g., email already exists)
      return NextResponse.json(
        { success: false, error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    if (error instanceof z.ZodError) {
      // Validation errors
      return NextResponse.json(
        {
          success: false,
          error: error.errors.map((err: z.ZodIssue) => err.message).join(", "),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET - Fetch all users (admin only)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { success: true, data: users },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
