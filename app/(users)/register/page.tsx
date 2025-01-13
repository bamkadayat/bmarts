import Register from "@/components/users/register/Register";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="w-full h-full">
      <div className="container mx-auto p-4 flex flex-col md:flex-row justify-center items-center gap-8 min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
          <h2 className="text-2xl font-bold  text-black text-left mb-2">
            Create an account
          </h2>
          <Link
            href="/login"
            className="text-sm block text-primary hover:text-primary mb-6"
          >
            Already account? Login
          </Link>
          <Register />
        </div>
        <div>
          <Image
            src="/assets/signup.svg"
            alt="Login"
            width={400}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}
