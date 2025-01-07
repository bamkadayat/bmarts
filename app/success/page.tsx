"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function OrderSuccess() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("cart");
    setTimeout(() => {
      router.push("/orders"); 
    }, 3000);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-2xl font-semibold text-primary mb-4">
        Thank you for your purchase!
      </h1>
      <p className="text-gray-700">We have received your order successfully.</p>
      <p className="text-gray-500 mt-2">Redirecting to your orders page...</p>
    </div>
  );
}
