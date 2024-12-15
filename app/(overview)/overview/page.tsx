import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function OverviewPage() {
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

  return <div className="mt-[200px]">
    <h1 className="text-center"> Welcome, {user.email}</h1>
   </div>;
}
