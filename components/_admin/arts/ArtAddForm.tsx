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
import TiptapEditor from "@/components/tiptap/TipTapEditor";

/** Validation Schema */ 
const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().min(0, "Stock cannot be negative"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  imageUrl: z.string().url("Image upload is required."),
  publicId: z.string().min(1, "Public ID is required for Cloudinary."),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ArtsAddForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const handleUploadSuccess = (url: string, publicId: string) => {
    setImageUrl(url);
    setPublicId(publicId);
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!imageUrl || !publicId) {
      alert("Please upload an image before submitting.");
      return;
    }

    try {
      const productData = { ...data, imageUrl, publicId };
      console.log("Submitting Data:", productData); // Debug submitted data
      await dispatch(addProduct(productData));
      reset();
      router.push("/dashboard/arts");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/arts");
  };

  return (
    <div className="space-y-6 p-6 bg-bg-dashboardLight max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4 text-white">Add New Art</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-white">Title</label>
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
          <label className="text-white">Description</label>
          <TiptapEditor
            initialContent={""}
            onChange={(content: string) => {
              setValue("description", content);
            }}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-white">Image</label>
          <Upload onUploadSuccess={handleUploadSuccess} />
          {imageUrl && publicId && (
            <div>
              <input type="hidden" value={imageUrl} {...register("imageUrl")} />
              <input type="hidden" value={publicId} {...register("publicId")} />
            </div>
          )}
        </div>

        {/* Other Fields */}
        <div>
          <label className="text-white">Price</label>
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
          <label className="text-white">Stock</label>
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
          <label className="text-white">Category</label>
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
            className="px-4 py-2 border rounded text-gray-200 hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
