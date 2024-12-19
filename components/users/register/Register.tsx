"use client";

import { useState } from "react";
import RegisterForm from "./RegisterForm";
import { useRouter } from "next/navigation";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (formData: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const url = process.env.NEXT_PUBLIC_APP_URL || ""; // Fallback for safety
      if (!url) throw new Error("API URL is not defined");

      const response = await fetch(`${url}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      // Show success message and redirect
      setSuccessMessage(
        "Registration successful! Please check your email for the verification code and proceed to the verification page."
      );

      setTimeout(() => {
        router.push("/verify"); // Redirect after 2 seconds
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "An unexpected error occurred");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>
      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-900 text-white p-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500 text-white p-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Registration Form */}
      <RegisterForm onSubmit={handleRegister} loading={loading} />
    </div>
  );
}
