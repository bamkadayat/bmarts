import React from "react";
import { Product } from "@/store/slices/productsSlice";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

interface ArtsCardProps {
  product: Product;
}

export default function ArtsCard({ product }: ArtsCardProps) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {product.title}
        </h3>
        <IoCartOutline
          onClick={handleAddToCart}
          className="text-black hover:text-gray-400 font-bold cursor-pointer"
          size={22}
          tabIndex={0}
        />
      </div>

      {/* Product Price */}
      <p className="text-primary font-bold text-lg">
        ${product.price.toFixed(2)}
      </p>

      {/* Read More Button */}
      <Link href={`/arts/${product.id}`} passHref>
        <button className="mt-4 border border-gray-200 text-primary px-4 py-2 rounded-md hover:bg-gray-600 hover:text-white transition-colors duration-100 w-full">
          Read More
        </button>
      </Link>
    </div>
  );
}
