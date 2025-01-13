"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOrders } from "@/store/slices/orderSlice";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState 
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { RiLoader3Fill } from "react-icons/ri";
import debounce from "lodash.debounce";

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

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (orderStatus === "idle") {
      dispatch(fetchOrders());
    }
  }, [orderStatus, dispatch]);

  const columns: ColumnDef<Order>[] = useMemo(() => [
    {
      accessorKey: "id",
      header: "Order ID",
    },
    {
      accessorKey: "user.name",
      header: "User",
      cell: ({ row }) => row.original.user.name,
    },
    {
      accessorKey: "orderItems",
      header: "Products",
      cell: ({ row }) => (
        <div>
          {row.original.orderItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Image
                src={item.product.imageUrl}
                width={40}
                height={30}
                alt={item.product.title}
                className="rounded"
              />
              <span>{item.product.title}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) =>
        row.original.orderItems.reduce(
          (total: number, item: OrderItem) => total + item.quantity,
          0
        ),
    },
    {
      accessorKey: "totalAmount",
      header: "Total Price",
      cell: ({ row }) => `$${row.original.totalAmount.toLocaleString()}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
            row.original.status === "PAID"
              ? "bg-green-100 text-green-800"
              : row.original.status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
  ], []);

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-left text-primary my-4 text-white">
        Orders
      </h1>
      <div className="flex items-center mb-4">
        <Input
          placeholder="Search by user name"
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm border border-slate-700 text-white"
        />
      </div>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border border-slate-700">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="text-white border border-slate-700">
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <div className="flex items-center justify-center py-4">
                    <RiLoader3Fill
                      size={20}
                      color="gray"
                      className="animate-spin mr-2"
                    />
                    <span>Loading orders...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border border-slate-700">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}