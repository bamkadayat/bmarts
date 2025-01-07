import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);

  try {
    const result = await prisma.$queryRaw`SELECT 1;`;
    return NextResponse.json({ message: "Database connection successful", result });
  } catch (error) {
    console.error("Database connection failed:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
