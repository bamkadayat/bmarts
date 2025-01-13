
import { $Enums } from "@prisma/client";

export type Category = $Enums.Category; 

export interface Product {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  publicId: string | null;
  stock: number;
  category: Category; 
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  orderItems: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
}
