import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true, 
});

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "Image URL is required" },
        { status: 400 }
      );
    }

    // Extract public ID from the full Cloudinary URL
    const regex = /\/upload\/(?:v\d+\/)?(.*?)(\.[a-zA-Z]+)$/;
    const match = imageUrl.match(regex);

    if (!match || !match[1]) {
      console.error("Invalid image URL:", imageUrl);
      return NextResponse.json(
        { success: false, message: "Invalid image URL format" },
        { status: 400 }
      );
    }

    const publicId = match[1]; // Extracted public ID without file extension
    console.log("Public ID to delete:", publicId);

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    console.log("Cloudinary delete result:", result);

    if (result.result === "not found") {
      return NextResponse.json(
        { success: false, message: "Image not found on Cloudinary" },
        { status: 404 }
      );
    } else if (result.result !== "ok") {
      return NextResponse.json(
        { success: false, message: "Failed to delete the image" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { success: false, message: "Server error while deleting image" },
      { status: 500 }
    );
  }
}
