import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/orders", "/dashboard", "/profile"];
const publicRoutes = ["/login", "/register", "/verify"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  const cookie = req.cookies.get("authToken")?.value;

  let user = null;

  if (cookie) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(cookie, secret);
      user = payload;
    } catch (error) {
      console.error("Invalid or expired token:", error);
    }
  }

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isPublicRoute && user) {
    return NextResponse.redirect(new URL("/orders", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/orders/:path*", "/dashboard/:path*", "/profile/:path*", "/login", "/register", "/verify"],
};
