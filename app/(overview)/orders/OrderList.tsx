"use client";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  OnChangeFn
} from "@tanstack/react-table";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; 
import { Input } from "@/components/ui/input"; 
import { useState, useMemo } from "react";

interface Product {
  id: string;
  title: string;
  imageUrl: string;
}

interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  orderItems: OrderItem[];
  totalAmount: number;
  status: "PAID" | "PENDING" | "CANCELLED" | "SHIPPED"; // Include "SHIPPED"
}

interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize filtered orders to avoid recalculating on every render
  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      order.orderItems.some((item) =>
        item.product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [orders, searchTerm]);

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
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
          (total, item) => total + item.quantity,
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
              : row.original.status === "CANCELLED"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800" // For "SHIPPED"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: { sorting },
    onSortingChange: setSorting as OnChangeFn<SortingState>,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="w-full container md:mx-auto p-6 mx-4 border-gray-100">
        <h1 className="text-2xl font-semibold text-left text-primary my-4">
          Orders
        </h1>
        <div className="mb-4">
          <Input
            placeholder="Search by product title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm border border-slate-200 text-black"
          />
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border border-slate-200">
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
          <TableBody className="text-black border border-slate-200">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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