import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error retrieving product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve product" },
      { status: 500 }
    );
  }
}

// PUT - Update a specific product
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();

    // Validate required fields
    if (
      !body.title ||
      !body.description ||
      !body.price ||
      !body.imageUrl ||
      !body.publicId ||
      typeof body.stock !== "number" ||
      !body.category
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        price: parseFloat(body.price),
        imageUrl: body.imageUrl || null,
        publicId: body.publicId || null,
        stock: parseInt(body.stock),
        category: body.category,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

/** DELETE - Delete a specific product */ 
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Delete related OrderItem records first
    await prisma.orderItem.deleteMany({
      where: { productId: id },
    });

    // Delete the product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
