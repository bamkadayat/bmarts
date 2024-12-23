import Link from 'next/link';

export default function SuccessPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold text-primary-600 mb-4">Payment Successful!</h1>
          <p className="text-lg mb-6">Thank you for your purchase. Your order has been successfully processed.</p>
          <Link href="/arts" className="text-primary hover:underline text-lg">Continue Shopping
          </Link>
        </div>
      </div>
    );
}