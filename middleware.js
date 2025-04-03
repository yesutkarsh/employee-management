import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function middleware(request) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (user) {
        // Redirect authenticated users to the dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
        // Redirect unauthenticated users to home
        return NextResponse.redirect(new URL('/home', request.url));
    }
}

// Apply middleware to all pages or specific routes
export const config = {
    matcher: '/about/:path*',  // Change this to "/" to apply globally or specific pages
};
