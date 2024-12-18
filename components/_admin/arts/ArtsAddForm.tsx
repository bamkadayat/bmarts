"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { addProduct } from "@/store/slices/artsSlice";
import { useRouter } from "next/navigation";
import Upload from "@/components/CldImage";

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const handleUploadSuccess = (url: string) => {
    setImageUrl(url);
  };

  const onSubmit = async (data: ProductFormData) => {
    console.log("Submitting Data:", { ...data, imageUrl }); // Debug submitted data
    await dispatch(addProduct({ ...data, imageUrl: imageUrl || "" }));
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
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
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
          <Upload onUploadSuccess={handleUploadSuccess} />
          {imageUrl && (
            <div>
              <input type="hidden" value={imageUrl} {...register("imageUrl")} />
            </div>
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
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label>Stock</label>
          <input
            type="number"
            {...register("stock", { valueAsNumber: true })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.stock && (
            <p className="text-red-500">{errors.stock.message}</p>
          )}
        </div>

        <div>
          <label>Category</label>
          <select
            {...register("category")}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select a category</option>
            <option value="PAINTING">Painting</option>
            <option value="SCULPTURE">Sculpture</option>
            <option value="DIGITAL_ART">Digital Art</option>
          </select>
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
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
