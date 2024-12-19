"use client";

import { useState } from "react";
import { CldUploadWidget, CldImage, CloudinaryUploadWidgetResults } from "next-cloudinary";

interface UploadProps {
  onUploadSuccess: (url: string, publicId: string) => void;
}

export default function Upload({ onUploadSuccess }: UploadProps) {
  const [imageData, setImageData] = useState<{ url: string; publicId: string } | null>(null);

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.event === "success" && typeof result.info !== 'string' && result.info) {
      const { secure_url, public_id } = result.info;
      setImageData({ url: secure_url, publicId: public_id });
      onUploadSuccess(secure_url, public_id); // Pass secure_url and public_id to the parent component
    }
  };

  return (
    <div className="mt-2 p-6 bg-gray-100 rounded-lg shadow-lg">
      {/* Upload Widget */}
      <CldUploadWidget
        uploadPreset="bmarts"
        onSuccess={handleUploadSuccess}
        options={{
          folder: "gallery",
          maxFiles: 1,
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
        }}
      >
        {({ open }) => (
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => open()}
          >
            Upload Image
          </button>
        )}
      </CldUploadWidget>

      {/* Display Uploaded Image */}
      <div className="mt-4">
        {imageData ? (
          <CldImage
            width={200}
            height={200}
            src={imageData.url}
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