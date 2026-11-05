import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Private routes: require a Better Auth session cookie before rendering.
// Full session verification still happens server-side (auth.api.getSession /
// the Express verifyToken middleware) — this is the fast edge-level guard.

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const hasSessionCookie = request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token");

  if (!hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/add-book/:path*", "/my-borrows/:path*", "/my-books/:path*"],
};
