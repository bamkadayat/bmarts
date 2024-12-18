"use client";

import { useSearchParams } from "next/navigation";
import ArtsEditForm from "@/components/_admin/arts/editForm/ArtsEditForm";

export default function EditArtPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  if (!productId) {
    return <p className="text-red-500">Product ID is missing!</p>;
  }

  return (
    <div>
      <ArtsEditForm productId={productId} />
    </div>
  );
}
