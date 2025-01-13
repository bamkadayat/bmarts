import Login from "@/components/users/login/Login";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className=" w-full h-full">
      <div className="container mx-auto p-4 flex flex-col md:flex-row justify-center items-center gap-8 min-h-screen">
        <div className="p-8 rounded-lg shadow-sm w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-black text-left">
            Login
          </h2>
          <Login />
        </div>
        <div>
          <Image src="/assets/login.svg" alt="Login" width={400} height={400} />
        </div>
      </div>
    </div>
  );
}
