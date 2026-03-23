import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for route protection.
 * Better Auth handles session validation via cookies.
 * Role-based redirects are handled by the /dashboard page (Server Component)
 * since middleware cannot call auth.api directly.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Better Auth session cookie (supports both standard and secure prefix)
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  // Protected routes that require authentication
  const protectedPaths = ["/dashboard", "/verification"];
  const isProtectedRoute = protectedPaths.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/register/");

  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/verification/:path*",
    "/login",
    "/register",
    "/register/:path*",
  ],
};
