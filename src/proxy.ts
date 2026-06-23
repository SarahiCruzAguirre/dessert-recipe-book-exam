/**
 * SIDE: Server-side
 * Description: Middleware-like routing proxy module using NextAuth authorization check.
 * Secures specific routes based on user role (e.g. admin routes) or authentication status (e.g. favorites routes).
 */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Rutas que requieren autenticación
  const protectedRoutes = ["/favorites"];
  // Rutas que requieren rol admin
  const adminRoutes = ["/admin"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));

  // Redirect users to login if trying to access protected paths while unauthorized
  if (isProtected && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect users back to home if trying to access admin paths without admin role
  if (isAdmin && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/favorites/:path*", "/admin/:path*"],
};

