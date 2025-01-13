import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";
import Link from "next/link";
import OrderList from "./OrderList";
import { Order } from "@/types/order/order"; 

export default async function OrdersPage() {
  const cookie = (await cookies()).get("authToken")?.value;

  let user: { id: string; email: string; name: string } | null = null;
  if (cookie) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(cookie, secret);
      user = payload as { id: string; email: string; name: string };
    } catch (error) {
      console.error("Invalid or expired token:", error);
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Unauthorized</h2>
        <p className="text-gray-500 mb-6">Please log in to view your orders.</p>
        <Link href="/login" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors">
          Login
        </Link>
      </div>
    );
  }

  /** Fetch user orders from the database */
  let orders: Order[] = [];
  try {
    const fetchedOrders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Transform or filter the fetched orders to match expected types
    orders = fetchedOrders.map((order) => ({
      ...order,
      status: order.status as "PENDING" | "PAID" | "CANCELLED", // Cast to known types if applicable
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Error Fetching Orders</h2>
        <p className="text-gray-500 mb-6">
          We encountered an error while fetching your orders. Please try again later.
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Orders Found</h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven’t made any purchases yet.
        </p>
        <Link href="/arts" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return <OrderList orders={orders} />;
}
