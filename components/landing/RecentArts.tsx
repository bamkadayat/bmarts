"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentProducts, selectRecentProducts } from "@/store/slices/productsSlice";
import ArtsCard from "@/components/arts/ArtsCard";
import { AppDispatch, RootState } from "@/store";
import { RiLoader3Fill } from "react-icons/ri";
import { BsExclamationCircleFill } from "react-icons/bs";

export default function RecentArtsList() {
  const dispatch = useDispatch<AppDispatch>();
  const recentProducts = useSelector(selectRecentProducts);

  // Explicitly type `state` using RootState
  const { loading: isLoading, error } = useSelector((state: RootState) => state.products);

  // Fetch recent products on component mount
  useEffect(() => {
    dispatch(fetchRecentProducts());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-white py-4">
        <RiLoader3Fill size={20} color="gray" className="animate-spin mr-2" />
        <span>Loading recent arts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 flex flex-col items-center mt-10">
        <BsExclamationCircleFill size={40} color="red" />
        Error: {error}
      </p>
    );
  }

  if (!recentProducts.length) {
    return (
      <p className="text-center text-gray-600 flex flex-col items-center mt-10">
        <BsExclamationCircleFill size={40} color="primary" />
        No recent arts found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {recentProducts.map((product) => (
        <ArtsCard key={product.id} product={product} />
      ))}
    </div>
  );
}
