"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, selectProducts } from "@/store/slices/productsSlice";
import ArtsCard from "@/components/arts/ArtsCard";
import { AppDispatch } from "@/store";
import { RiLoader3Fill } from "react-icons/ri";

export default function ArtsList() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, error } = useSelector(selectProducts);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProducts()).finally(() => setInitialLoading(false));
    } else {
      setInitialLoading(false);
    }
  }, [dispatch, products.length]);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center bg-white py-4">
        <RiLoader3Fill size={20} color="gray" className="animate-spin mr-2" />
        <span>Loading arts...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!products.length) {
    return <p className="text-center text-gray-500">No arts found.</p>;
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ArtsCard key={product.id} product={product} />
      ))}
    </div>
  );
}
