"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/types/users/userType";
import { RiLoader3Fill } from "react-icons/ri";

interface RegisterFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    repeatPassword: string;
  }) => void;
  loading: boolean;
}

export default function RegisterForm({ onSubmit, loading }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const handleFormSubmit = (data: RegisterInput) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 rounded-lg"
    >
      {/* Name Input */}
      <div>
        <label
          htmlFor="name"
          className="block text-md font-medium text-primary"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={`mt-1 block w-full text-primary border rounded-md p-2 focus:ring-gray-500 focus:border-blue-500 sm:text-md ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your name"
        />
        {errors.name && (
          <p className="text-md text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email Input */}
      <div>
        <label
          htmlFor="email"
          className="block text-md font-medium text-primary"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={`mt-1 block w-full text-primary border rounded-md p-2 focus:ring-gray-500 focus:border-gray-500 sm:text-md ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-md text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label
          htmlFor="password"
          className="block text-md font-medium text-primary"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className={`mt-1 block w-full text-primary border rounded-md p-2 focus:ring-gray-500 focus:border-gray-500 sm:text-md ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-md text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Repeat Password Input */}
      <div>
        <label
          htmlFor="repeatPassword"
          className="block text-md font-medium text-primary"
        >
          Repeat Password
        </label>
        <input
          id="repeatPassword"
          type="password"
          {...register("repeatPassword")}
          className={`mt-1 block text-primary w-full rounded-md border p-2 focus:ring-gray-500 focus:border-gray-500 sm:text-md ${
            errors.repeatPassword ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Repeat your password"
        />
        {errors.repeatPassword && (
          <p className="text-md text-red-600 mt-1">
            {errors.repeatPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center text-md py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <RiLoader3Fill size={20} color="white" className="animate-spin mr-3" />
              Submitting...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </div>
    </form>
  );
}
