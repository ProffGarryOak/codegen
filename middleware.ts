// middleware.ts
import { auth } from "./auth";

export async function middleware(request: any) {
    const session = await auth();
    const { pathname } = request.nextUrl;
    
    const isLoggedIn = !!session?.user;
    
    // Protected routes - redirect to register if not logged in
    const protectedRoutes = ["/", "/history", "/profile"];
    const isProtected = protectedRoutes.some(route => 
        pathname === route || pathname.startsWith(route + "/")
    );
    
    if (isProtected && !isLoggedIn) {
        const url = request.nextUrl.clone();
        url.pathname = "/register";
        return Response.redirect(url);
    }
    
    // Redirect logged-in users away from auth pages
    if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return Response.redirect(url);
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)",
    ],
};
