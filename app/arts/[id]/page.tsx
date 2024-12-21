"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Product } from "@/types/arts/artType";
import Image from "next/image";
import Link from "next/link";

const ArtDetail = () => {
  const { id } = useParams();
  const [art, setArt] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch art details.");
        }
        const data = await response.json();
        setArt(data.data);
      } catch (error) {
        console.error("Error fetching art:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArt();
  }, [id]);

  if (loading) {
    return <p>Loading art details...</p>;
  }

  if (!art) {
    return <p className="text-red-500">Art not found.</p>;
  }

  return (
    <div className="container mx-auto min-h-screen p-4 mt-[90px]">
      <nav className="mb-4 text-sm text-gray-600">
        <Link href="/" className="hover:underline">Home</Link> &gt; 
        <Link href="/arts" className="hover:underline"> Arts</Link> &gt; 
        <span> {art.title}</span>
      </nav>
      <button onClick={() => router.back()} className="mb-4 bg-gray-200 p-2 rounded">
        Back
      </button>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <Image src={art.imageUrl} alt={art.title} width={500} height={500} className="rounded" />
        </div>
        <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0">
          <h1 className="text-3xl font-semibold">{art.title}</h1>
          <p className="text-sm text-gray-600">{art.category}</p>
          <p className="text-lg font-bold">${art.price}</p>
          <p className="text-gray-700 mt-4">{art.description}</p>
          <button className="mt-4 bg-primary text-white p-2 rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtDetail;