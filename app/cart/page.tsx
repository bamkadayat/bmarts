"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  CartItem,
} from "@/store/slices/cartSlice";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckout = async () => {
    const url = process.env.NEXT_PUBLIC_APP_URL || "";
  
    if (!user) {
      router.push("/login");
      return;
    }
  
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe initialization failed");
  
      const response = await fetch(`${url}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          userEmail: user.email,
        }),
      });
  
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Unexpected response format: ${text}`);
      }
  
      const data = await response.json();
      if (data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        console.error("Checkout session creation failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      if (error instanceof Error) {
        alert(`Checkout error: ${error.message}`);
      } else {
        alert("An unknown error occurred during checkout");
      }
    }
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (!isClient) return null; // Prevent rendering on the server

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven’t added anything to your cart yet.
        </p>
        <Link
          href="/arts"
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto mt-[100px] min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 p-4 text-left">Product</th>
            <th className="border border-gray-300 p-4 text-left">Quantity</th>
            <th className="border border-gray-300 p-4 text-left">Price</th>
            <th className="border border-gray-300 p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item: CartItem) => (
            <tr key={item.id} className="border-b">
              <td className="p-4">
                <div className="flex items-center">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded mr-4"
                    width={50}
                    height={50}
                  />
                  <span>{item.title}</span>
                </div>
              </td>
              <td className="p-4">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, Number(e.target.value))
                  }
                  className="w-16 border rounded px-2 py-1"
                />
              </td>
              <td className="p-4">
                ${(item.price * item.quantity).toFixed(2)}
              </td>
              <td className="p-4">
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => dispatch(clearCart())}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Cart
        </button>
        <p className="text-lg font-semibold">
          Total: ${totalAmount.toFixed(2)}
        </p>
        <button
          onClick={handleCheckout}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          {user ? "Proceed to Checkout" : "Login to Checkout"}
        </button>
      </div>
    </div>
  );
}