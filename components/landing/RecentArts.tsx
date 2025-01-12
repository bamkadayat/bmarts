"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecentProducts,
  selectRecentProducts,
} from "@/store/slices/productsSlice";
import ArtsCard from "@/components/arts/ArtsCard";
import { AppDispatch, RootState } from "@/store";
import { BsExclamationCircleFill } from "react-icons/bs";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function RecentArtsList() {
  const dispatch = useDispatch<AppDispatch>();
  const recentProducts = useSelector(selectRecentProducts);

  const { loading: isLoading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchRecentProducts());
  }, [dispatch]);

  if (error) {
    return (
      <p className="text-center text-red-500 flex flex-col items-center mt-10">
        <BsExclamationCircleFill size={40} color="red" />
        Error: {error}
      </p>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </div>
      ) : recentProducts.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentProducts.map((product) => (
            <ArtsCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </>
  );
}
