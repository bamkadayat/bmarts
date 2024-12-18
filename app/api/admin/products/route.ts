import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST - Add a new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        imageUrl: body.imageUrl,
        publicId: body.publicId,
        stock: body.stock,
        category: body.category,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}


