import Image from "next/image";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 flex flex-col items-center">
        <Image src="/assets/unauthorized.svg" alt="403" width={200} height={200} className="mb-4" />
        <h1 className="text-4xl font-bold text-red-800 mb-2 text-center">
          Access Denied
        </h1>
        <p className="text-lg text-gray-700 text-center">
          You are not authorized to view this page.
        </p>
        <Link href={"/"}>
        <button className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-gray-600">
          Go Back
        </button>
        </Link>
      </div>
    </div>
  );
}