import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/api/admin", "/api/users", "/orders", "/dashboard", "/profile"];
const adminOnlyRoutes = ["/api/admin", "/dashboard"];
const publicRoutes = ["/login", "/register", "/verify"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  const isAdminOnlyRoute = adminOnlyRoutes.some((route) =>
    path.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // Retrieve the authToken cookie
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

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect non-admin users away from admin-only routes
  if (isAdminOnlyRoute && user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Redirect authenticated users away from public routes
  if (isPublicRoute && user) {
    return NextResponse.redirect(new URL("/orders", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/admin/:path*",
    "/api/users/:path*",
    "/orders/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/verify",
  ],
};