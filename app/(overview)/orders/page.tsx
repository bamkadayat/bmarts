import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const orders = [
  {
    id: 1,
    title: "Afternoon Glow at Six Mile",
    category: "Catherine Cadieux",
    size: "12x12",
    price: 2350,
    status: "Delivered",
  },
  {
    id: 2,
    title: "A Last Kiss For Butterflies",
    category: "Maria Iva",
    size: "30x30",
    price: 4850,
    status: "In Transit",
  },
  {
    id: 3,
    title: "A Last Kiss ",
    category: "Maria Tuva",
    size: "30x30",
    price: 4850,
    status: "Processing",
  },
];

export default async function OrdersPage() {
  const cookie = (await cookies()).get("authToken")?.value;

  let user: { email: string } | null = null;
  if (cookie) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(cookie, secret);
      user = payload as { email: string };
    } catch (error) {
      console.error("Invalid or expired token:", error);
    }
  }

  if (!user) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full container md:mx-auto p-6 mx-4 bg-white border border-gray-100 rounded-sm shadow-lg">
        <h1 className="text-2xl font-semibold text-left text-primary">
         Orders
        </h1>
        <h3 className="my-2">Welcome, <strong>{user.email}</strong> </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Size</th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white hover:bg-gray-100"}>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">{order.id}</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700 font-medium">{order.title}</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">{order.category}</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">{order.size}</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700 font-semibold">${order.price.toLocaleString()}</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "In Transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
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
