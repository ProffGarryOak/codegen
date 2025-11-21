// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Check for session cookie (works in Edge Runtime)
    const sessionToken = 
        request.cookies.get("authjs.session-token")?.value ||
        request.cookies.get("__Secure-authjs.session-token")?.value;
    
    const isLoggedIn = !!sessionToken;
    
    // If not logged in and not on auth pages, redirect to register
    if (!isLoggedIn && pathname !== "/login" && pathname !== "/register") {
        return NextResponse.redirect(new URL("/register", request.url));
    }
    
    // Redirect logged-in users away from auth pages
    if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all routes except API routes and static assets
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
