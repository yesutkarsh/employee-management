import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function middleware(request) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // Example of protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/profile', '/settings'];
    const path = request.nextUrl.pathname;
    
    // If accessing a protected route without being logged in
    if (!user && protectedRoutes.some(route => path.startsWith(route))) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    // If accessing authentication pages while already logged in
    if (user && (path === '/login' || path === '/signup')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // For all other cases, allow the request to proceed
    return NextResponse.next();
}

// Apply middleware to all pages
export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};