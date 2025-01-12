import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const totalUsers = await prisma.user.count();

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching summary data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch summary data" },
      { status: 500 }
    );
  }
}