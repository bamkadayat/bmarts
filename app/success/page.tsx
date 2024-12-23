import Link from 'next/link';

export default function SuccessPage() {
    return (
      <div className="text-center mt-[100px]">
        <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
        <p className="mt-4">Thank you for your purchase.</p>
        <Link href="/arts" className="text-primary hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }
  