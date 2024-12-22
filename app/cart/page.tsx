"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  CartItem,
} from "@/store/slices/cartSlice";
import Image from "next/image";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart.items);

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto mt-[100px] min-h-screen">
        <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
        <p className="text-center text-gray-500">Your cart is empty.</p>
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
                  min={1}
                  onChange={(e) =>
                    handleQuantityChange(item.id, Number(e.target.value))
                  }
                  className="w-16 border rounded px-2 py-1 focus:outline-primary"
                  aria-label={`Update quantity for ${item.title}`}
                />
              </td>
              <td className="p-4">${(item.price * item.quantity).toFixed(2)}</td>
              <td className="p-4">
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-500 hover:underline focus:outline-none"
                  aria-label={`Remove ${item.title} from cart`}
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
          onClick={handleClearCart}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
          aria-label="Clear cart"
        >
          Clear Cart
        </button>
        {totalAmount > 0 && (
          <p className="text-lg font-semibold">
            Total: ${totalAmount.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}
