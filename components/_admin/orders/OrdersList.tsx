"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOrders } from "@/store/slices/orderSlice";
import Image from "next/image";
import { RiLoader3Fill } from "react-icons/ri";

interface Product {
  id: number;
  title: string;
  imageUrl: string;
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Order {
  id: number;
  user: User;
  orderItems: OrderItem[];
  totalAmount: number;
  status: "PAID" | "PENDING" | "CANCELLED";
}

export default function OrdersList() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders) as unknown as Order[];
  const orderStatus = useAppSelector((state) => state.orders.status);
  const loading = useAppSelector((state) => state.orders.loading);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Order | "user.name" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (orderStatus === "idle") {
      dispatch(fetchOrders());
    }
  }, [orderStatus, dispatch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (field: keyof Order | "user.name") => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const filteredOrders = orders.filter((order) =>
    order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOrders = filteredOrders.sort((a, b) => {
    if (!sortField) return 0;
    let aValue, bValue;
    if (sortField === "user.name") {
      aValue = a.user.name.toLowerCase();
      bValue = b.user.name.toLowerCase();
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-left text-primary my-4">
        Orders
      </h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by user name"
          value={searchTerm}
          onChange={handleSearch}
          className="w-[280px] p-2 border rounded text-primary"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th
                className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("id")}
              >
                Order ID
              </th>
              <th
                className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("user.name")}
              >
                User
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Products
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Quantity
              </th>
              <th
                className="px-4 py-2 border-b-2 border-gray-200 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("totalAmount")}
              >
                Total Price
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  <div className="flex items-center justify-center">
                    <RiLoader3Fill
                      size={20}
                      color="gray"
                      className="animate-spin mr-2"
                    />
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : sortedOrders.length > 0 ? (
              sortedOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={
                    index % 2 === 0 ? "bg-gray-50" : "bg-white hover:bg-gray-100"
                  }
                >
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                    {order.id}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                    {order.user.name}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <Image
                          src={item.product.imageUrl}
                          width={50}
                          height={30}
                          alt={item.product.title}
                        />
                        {item.product.title}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700 text-right">
                    {order.orderItems.reduce(
                      (total: number, item: OrderItem) => total + item.quantity,
                      0
                    )}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700 font-semibold text-right">
                    ${order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-right">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "PAID"
                          ? "bg-green-100 text-green-800"
                          : order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
                  No orders available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}