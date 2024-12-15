import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/overview", "/api", "/dashboard"];
const publicRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

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

  /** Redirect unauthenticated users from protected routes */ 
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  /** Redirect authenticated users away from public routes */ 
  if (isPublicRoute && user) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/overview", "/api", "/dashboard", "/login", "/register"],
};
