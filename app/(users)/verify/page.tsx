"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    setError(null);

    if (!verificationCode.trim()) {
      setError("Please enter a valid verification code.");
      return;
    }

    setIsVerifying(true);
    const url = process.env.NEXT_PUBLIC_APP_URL || "";

    try {
      const response = await fetch(`${url}/api/users/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationCode }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const contentType = response.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json();
          setError(data.error || "Verification failed. Please try again.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("A network error occurred. Please try again later.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          Email Verification
        </h1>
        <p className="mb-4 text-gray-800">
          Please enter the verification code sent to your email.
        </p>

        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter verification code"
          aria-label="Verification code input"
          className="w-full p-2 text-gray-800 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />

        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className={`w-full py-2 rounded-md text-white transition duration-300 ${
            isVerifying
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
          aria-label="Verify email button"
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </button>

        {error && (
          <p className="mt-4 text-red-800" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 text-green-900" role="alert">
            Congratulations! Your account has been successfully verified. Please{" "}
            <Link href="/login" className="text-gray-600 underline">
              Log in
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
