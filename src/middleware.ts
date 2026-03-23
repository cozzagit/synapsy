import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for route protection
 * Better Auth handles session validation via cookies
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check for Better Auth session cookie
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith("/register")
  );

  if (isAuthRoute) {
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value;

    if (sessionToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register/:path*"],
};
