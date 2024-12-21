import React from "react";
import { Product } from "@/store/slices/productsSlice";
import Image from "next/image";
import Link from "next/link";

interface ArtsCardProps {
  product: Product;
}

export default function ArtsCard({ product }: ArtsCardProps) {
  return (
    <div className="border rounded-md p-4 shadow-sm hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <Image
        src={product.imageUrl}
        alt={product.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
        width={300}
        height={200}
        priority
      />

      {/* Product Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
        {product.title}
      </h3>

      {/* Product Price */}
      <p className="text-primary font-bold text-lg">${product.price.toFixed(2)}</p>

      {/* Read More Button */}
      <Link href={`/arts/${product.id}`} passHref>
        <button className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300 w-full">
          Read More
        </button>
      </Link>
    </div>
  );
}
