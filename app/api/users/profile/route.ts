import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    const authToken = req.cookies.get("authToken")?.value;

    if (!authToken) {
      return NextResponse.json({ error: "Authorization token is missing" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(authToken, secret) as { payload: { email: string } };

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { name: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authToken = req.cookies.get("authToken")?.value;

    if (!authToken) {
      return NextResponse.json({ error: "Authorization token is missing" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(authToken, secret) as { payload: { email: string } };

    const body = await req.json();
    const { name, email, password, repeatPassword } = body;

    if (password && password !== repeatPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    const updateData: { name?: string; email?: string; password?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { email: payload.email },
      data: updateData,
      select: { name: true, email: true, role: true },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
