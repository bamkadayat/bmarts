"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { editProduct } from "@/store/slices/artsSlice";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Upload from "@/components/CldImage";
import { Product } from "@/types/arts/artType";
import crypto from "crypto";
import TiptapEditor from "@/components/tiptap/TipTapEditor";

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
  publicId: z.string().optional(),
});

type ArtFormData = z.infer<typeof artSchema>;

interface ArtsEditFormProps {
  productId: string;
}

export default function ArtsEditForm({ productId }: ArtsEditFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { products } = useSelector((state: RootState) => state.arts);
  const product: Product | undefined = products.find((p) => p.id === productId);

  const [imageUrl, setImageUrl] = useState<string | null>(
    product?.imageUrl || null
  );
  const [publicId, setPublicId] = useState<string | null>(
    product?.publicId || null
  );
  const [deletingImage, setDeletingImage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    
  } = useForm<ArtFormData>({
    resolver: zodResolver(artSchema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || 0,
      imageUrl: product?.imageUrl || "",
      stock: product?.stock || 0,
      category: product?.category || "",
      publicId: product?.publicId || "",
    },
  });

  useEffect(() => {
    if (product) {
      setValue("title", product.title);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("imageUrl", product.imageUrl);
      setValue("stock", product.stock);
      setValue("category", product.category);
      setValue("publicId", product.publicId || "");
    }
  }, [product, setValue]);

  const destroyImage = async (publicId: string) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const signature = crypto
      .createHash("sha256")
      .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          public_id: publicId,
          timestamp: timestamp.toString(),
          api_key: apiKey || "",
          signature,
        }),
      }
    );

    return response.json();
  };

  const removeImage = async () => {
    if (!publicId) return;

    setDeletingImage(true);
    try {
      const response = await destroyImage(publicId);

      if (response.result === "ok") {
        setImageUrl(null);
        setPublicId(null);
        setValue("imageUrl", "");
        setValue("publicId", "");
      } else {
        console.error("Image deletion failed:", response.error);
        alert("Failed to delete the image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("An error occurred while deleting the image.");
    } finally {
      setDeletingImage(false);
    }
  };

  const handleUploadSuccess = (url: string, newPublicId: string) => {
    setImageUrl(url);
    setPublicId(newPublicId);
    setValue("imageUrl", url);
    setValue("publicId", newPublicId);
  };

  const onSubmit = async (data: ArtFormData) => {
    if (!imageUrl || !publicId) {
      alert("Please upload an image before saving.");
      return;
    }

    const updatedProduct: Product = {
      ...data,
      id: productId,
      imageUrl: imageUrl || "",
      publicId: publicId || "",
    };

    await dispatch(editProduct({ id: productId, product: updatedProduct }));
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
        <label>Description</label>
        <TiptapEditor
          initialContent={product?.description || ""}
          onChange={(content: string) => {
            setValue("description", content);
          }}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label>Price</label>
        <input
          type="number"
          {...register("price", { valueAsNumber: true })}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>

      {/* Image Upload */}
      <div>
        <label>Image</label>
        <Upload onUploadSuccess={handleUploadSuccess} />
        {imageUrl && (
          <div className="mt-4">
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
        )}
      </div>

      {/* Stock */}
      <div>
        <label>Stock</label>
        <input
          type="number"
          {...register("stock", { valueAsNumber: true })}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
      </div>

      {/* Category */}
      <div>
        <label>Category</label>
        <input
          type="text"
          {...register("category")}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.category && (
          <p className="text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
