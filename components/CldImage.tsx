"use client";

import { useState } from "react";
import { CldUploadWidget, CldImage } from "next-cloudinary";

interface UploadProps {
  onUploadSuccess: (url: string) => void;
}

export default function Upload({ onUploadSuccess }: UploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUploadSuccess = (result: { event?: string; info?: string | { secure_url: string } }) => {
    if (result.event === "success" && result.info && typeof result.info !== 'string') {
      const secureUrl = result.info.secure_url;
      setImageUrl(secureUrl);
      onUploadSuccess(secureUrl); // Pass the URL to the parent component
    }
  };

  return (
    <div className="mt-2 p-6 bg-gray-100 rounded-lg shadow-lg">
      {/* Upload Widget */}
      <CldUploadWidget
        uploadPreset="bmarts" // Ensure this matches your Cloudinary preset
        onSuccess={handleUploadSuccess} // Handle successful upload
        options={{
          folder: "gallery", // Ensure this matches your Cloudinary folder settings
          maxFiles: 1,
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif"], // Allow specific file types
        }}
      >
        {({ open }) => (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => open()}
          >
            Upload Image
          </button>
        )}
      </CldUploadWidget>

      {/* Display Uploaded Image */}
      <div className="mt-4">
        {imageUrl ? (
          <CldImage
            width={200}
            height={200}
            src={imageUrl} // Use the secure URL from Cloudinary response
            sizes="100vw"
            alt="Uploaded Image"
            className="rounded-lg shadow-lg"
          />
        ) : (
          <p className="text-gray-500 text-sm">No image uploaded yet.</p>
        )}
      </div>
    </div>
  );
}