"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { addProduct } from "@/store/slices/artsSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Validation Schema
const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().min(0, "Stock cannot be negative"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  imageUrl: z.string().url("Image upload is required."),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ArtsAddForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success && result.data.secure_url) {
        setImageUrl(result.data.secure_url);
        setValue("imageUrl", result.data.secure_url); 
      } else {
        throw new Error(result.message || "Image upload failed");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    console.log("Submitting Data:", data); // Debug submitted data
    await dispatch(addProduct(data));
    reset();
    router.push("/dashboard/arts");
  };

  const handleCancel = () => {
    router.push("/dashboard/arts");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add New Art</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label>Title</label>
          <input
            {...register("title")}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
            {...register("description")}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label>Image</label>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                uploadImage(e.target.files[0]);
              }
            }}
            className="w-full px-3 py-2 border rounded"
          />
          {uploading && <p>Uploading...</p>}
          {imageUrl && (
            <Image src={imageUrl} alt="Uploaded Image" width={200} height={200} />
          )}
        </div>

        {/* Other Fields */}
        <div>
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>

        <div>
          <label>Stock</label>
          <input
            type="number"
            {...register("stock", { valueAsNumber: true })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
        </div>

        <div>
          <label>Category</label>
          <input
            {...register("category")}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.category && (
            <p className="text-red-500">{errors.category.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
          <button type="submit" className="bg-gray-600 text-white px-4 py-2 rounded">
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
