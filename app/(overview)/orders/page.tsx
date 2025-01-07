import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

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
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Unauthorized
        </h2>
        <p className="text-gray-500 mb-6">Please log in to view your orders.</p>
        <Link
          href="/login"
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  // Fetch user orders from the database
  let orders = [];
  try {
    orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        orderItems: {
          include: {
            product: true, // Include product details
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Error Fetching Orders
        </h2>
        <p className="text-gray-500 mb-6">
          We encountered an error while fetching your orders. Please try again
          later.
        </p>
      </div>
    );
  }

  // Check if the user has any orders
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          No Orders Found
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven’t made any purchases yet.
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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full container md:mx-auto p-6 mx-4 bg-white border border-gray-100 rounded-sm shadow-lg">
        <h1 className="text-2xl font-semibold text-left text-primary my-4">
          Orders
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className={
                    index % 2 === 0
                      ? "bg-gray-50"
                      : "bg-white hover:bg-gray-100"
                  }
                >
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                    {order.id}
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
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                    {order.orderItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700 font-semibold">
                    ${order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
