"use client"
import { useState } from "react";
import Upload from "@/components/CldImage";
import Image from "next/image";

export default function UploadPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUploadSuccess = (url: string) => {
    setImageUrl(url);
  };

  return (
    <div>
      <Upload onUploadSuccess={handleUploadSuccess} />
      {imageUrl && (
        <div className="mt-6">
          <p>Uploaded Image URL: {imageUrl}</p>
          <Image src={imageUrl} alt="Uploaded" width={200} height={200} />
        </div>
      )}
    </div>
  );
}