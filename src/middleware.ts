import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for route protection.
 * Better Auth handles session validation via cookies.
 * Role-based redirects are handled by the /dashboard page (Server Component)
 * since middleware cannot call auth.api directly.
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

    // Role-based redirect: /dashboard root redirects to role-specific sub-dashboard.
    // The actual role lookup happens in the /dashboard Server Component (getServerSession).
    // Here we only guard against missing auth cookies.
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
      // Let the /dashboard page handle the role-based redirect
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register/:path*"],
};
