import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, role, password } = body;

    const updateData: {
      name?: string;
      email?: string;
      role?: string;
      password?: string;
    } = {
      name,
      email,
      role,
    };

    // If password is provided, hash it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extract the last part of the URL

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Delete all order items associated with the user's orders
    await prisma.orderItem.deleteMany({
      where: {
        order: {
          userId: id,
        },
      },
    });

    // Delete all orders associated with the user
    await prisma.order.deleteMany({
      where: { userId: id },
    });

    // Delete the user with the given ID
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "User and their orders deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user and their orders:", error);

    // Enhanced error logging
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error code:", error.code);
      console.error("Prisma error message:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }

    return NextResponse.json(
      { success: false, error: "Failed to delete user and their orders" },
      { status: 500 }
    );
  }
}
