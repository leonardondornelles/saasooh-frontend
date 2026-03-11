import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('saas_token')?.value;

    const currentRoute = request.nextUrl.pathname;

    
    if(currentRoute.startsWith('/dashboard') && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if(currentRoute == '/' && token){
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/'],
};