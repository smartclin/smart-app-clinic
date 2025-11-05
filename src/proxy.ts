import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';

import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from './routes';

// Assuming you move routes.ts to a central lib folder
// Since the middleware is at the root of src/, the import path changes slightly.

// Utility function to get the clean path without locale or route groups
const getCleanPathname = (pathname: string) => {
    // Strips any leading route group segment (e.g., (auth), (protected), (public))
    const groupRegex = /^\/\([^)]+\)/;
    return pathname.replace(groupRegex, '');
};

export async function proxy(request: NextRequest) {
    const session = getSessionCookie(request);
    const currentPath = request.nextUrl.pathname;
    const cleanPath = getCleanPathname(currentPath);

    // 1. Check for BetterAuth API routes (must be allowed to proceed)
    const isApiAuth = currentPath.startsWith(apiAuthPrefix);
    if (isApiAuth) {
        return NextResponse.next();
    }

    // 2. Check for public routes (must be allowed to proceed)
    const isPublicRoute = publicRoutes.includes(cleanPath);
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // 3. Check for Auth routes (login/signup)
    const isAuthRoute = authRoutes.some(path => cleanPath === path);

    if (isAuthRoute) {
        if (session) {
            // If user is authenticated, redirect away from login/signup
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
        }
        // If not authenticated, allow access to login/signup pages
        return NextResponse.next();
    }

    // 4. Protection (All remaining routes are protected, including /dashboard)
    if (!session) {
        // Redirect unauthenticated users to the login page
        // Preserve the requested path in a query param for redirection after login
        const searchParams = new URLSearchParams();
        searchParams.set('callbackUrl', currentPath);

        return NextResponse.redirect(new URL(`/login?${searchParams.toString()}`, request.url));
    }

    // 5. Allow access to all other protected routes if authenticated
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for files/static assets.
         * The matcher here is slightly simplified for common patterns.
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
    ]
};
