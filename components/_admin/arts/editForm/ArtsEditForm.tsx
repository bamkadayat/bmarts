"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { editProduct } from "@/store/slices/artsSlice";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";

// Validation Schema
const artSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  price: z
    .number()
    .min(0.01, "Price must be greater than 0")
    .refine((value) => value <= 100000, { message: "Price is too high" }),
  imageUrl: z.string().url("Image URL must be a valid URL"),
  stock: z.number().min(0, "Stock cannot be negative"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
});

type ArtFormData = z.infer<typeof artSchema>;

interface ArtsEditFormProps {
  productId: string;
}

export default function ArtsEditForm({ productId }: ArtsEditFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { products } = useSelector((state: RootState) => state.arts);
  const product = products.find((p) => p.id === productId);

  const [imageUrl, setImageUrl] = useState<string | null>(
    product?.imageUrl || null
  );
  const [uploading, setUploading] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ArtFormData>({
    resolver: zodResolver(artSchema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || 0,
      imageUrl: product?.imageUrl || "",
      stock: product?.stock || 0,
      category: product?.category || "",
    },
  });

  // Remove Existing Image
  const removeImage = async () => {
    if (!imageUrl) return;

    setDeletingImage(true);
    try {
      const response = await fetch("/api/admin/products/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setImageUrl(null);
        setValue("imageUrl", "");
      } else {
        console.error("Image deletion failed:", data.message);
        alert("Failed to delete the image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("An error occurred while deleting the image.");
    } finally {
      setDeletingImage(false);
    }
  };

  // Upload New Image
  const uploadImage = async (file: File) => {
    setUploading(true);

    // Delete the old image first, if any
    if (imageUrl) {
      await removeImage();
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setImageUrl(data.data.secure_url);
        setValue("imageUrl", data.data.secure_url);
      } else {
        console.error("Image upload failed:", data.message);
        alert("Image upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    } finally {
      setUploading(false);
    }
  };

  // Submit the Updated Product
  const onSubmit = async (data: ArtFormData) => {
    if (!imageUrl) {
      alert("Please upload an image.");
      return;
    }

    await dispatch(editProduct({ id: productId, product: data }));
    router.push("/dashboard/arts");
  };

  const handleCancel = () => {
    router.push("/dashboard/arts");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white shadow-md rounded-lg max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Edit Art</h2>

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
        <label className="block text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          rows={6}
          id="description"
          {...register("description")}
          aria-invalid={!!errors.description}
          className={`w-full px-3 py-2 border rounded ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium" htmlFor="price">
          Price
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          aria-invalid={!!errors.price}
          className={`w-full px-3 py-2 border rounded ${
            errors.price ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>

      {/* Image Management */}
      <div>
        <label>Image</label>
        {imageUrl ? (
          <div className="mt-2">
            <Image
              src={imageUrl}
              alt="Uploaded"
              width={300}
              height={200}
              className="rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              disabled={deletingImage}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {deletingImage ? "Removing..." : "Remove Image"}
            </button>
          </div>
        ) : (
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0])
                uploadImage(e.target.files[0]);
            }}
            className="w-full px-3 py-2 border rounded"
            disabled={uploading}
          />
        )}
        {uploading && <p className="text-gray-500 mt-1">Uploading...</p>}
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="stock">
          Stock
        </label>
        <input
          id="stock"
          type="number"
          {...register("stock", { valueAsNumber: true })}
          aria-invalid={!!errors.stock}
          className={`w-full px-3 py-2 border rounded ${
            errors.stock ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.stock && (
          <p className="text-red-500 text-sm">{errors.stock.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium" htmlFor="category">
          Category
        </label>
        <input
          id="category"
          type="text"
          {...register("category")}
          aria-invalid={!!errors.category}
          className={`w-full px-3 py-2 border rounded ${
            errors.category ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
