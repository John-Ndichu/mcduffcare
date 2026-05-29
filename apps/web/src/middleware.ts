import { type NextRequest, NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/shop/account',
  '/shop/checkout',
  '/prescriptions',
];

// Routes only for guests (redirect if already logged in)
const GUEST_ONLY_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Read the access token from cookies (set by the API on login)
  const token = request.cookies.get('mcduff_access_token')?.value;
  const isAuthenticated = token !== undefined && token !== '';

  // Redirect authenticated users away from guest-only pages
  if (isAuthenticated && GUEST_ONLY_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/shop/account', request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (!isAuthenticated && PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - public folder assets
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js)$).*)',
  ],
};
