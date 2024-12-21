"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, selectProducts } from "@/store/slices/productsSlice";
import ArtsCard from "@/components/arts/ArtsCard";
import { AppDispatch } from "@/store";
import { RiLoader3Fill } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import { IoFilter } from "react-icons/io5";
import { RxCaretSort } from "react-icons/rx";

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
    <div>
      <div className="flex flex-col md:flex-row w-full justify-between items-center p-4">
        <div className="relative w-full">
          <IoSearch size={20} color="gray" className="absolute ml-2 mt-2" />
          <input
            className="focus:ring-2 w-full md:w-[300px] mb-4 md:mb-0 focus:ring-gray-500 focus:outline-none appearance-none text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
            type="text"
            aria-label="Filter arts"
            placeholder="Filter arts..."
          />
        </div>
        <div className="flex w-full justify-end">
          <button className="flex items-center md:w-[100px] justify-center w-full px-5 bg-gray-600 text-white text-sm font-medium py-2 rounded-lg shadow-sm mr-4">
            <RxCaretSort size={20} color="white" className="mr-2" />
            Sort
          </button>
          <button className="flex items-center md:w-[100px] justify-center w-full px-5 bg-gray-600 text-white text-sm font-medium py-2 rounded-lg shadow-sm">
            <IoFilter size={20} color="white" className="mr-2" />
            Filter
          </button>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ArtsCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}