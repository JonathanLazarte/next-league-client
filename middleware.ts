import { NextResponse } from "next/server";

export function middleware(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
  const path = request.nextUrl.pathname;
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  // Evitar loguear llamadas a archivos estáticos o internos
    if (path.includes('/_next') || path.includes('/favicon.ico')) {
      return NextResponse.next();
    }

  try {
      fetch(`${API_URL}api/v1/connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, path }),
      }).catch(() => {});
    } catch (e) {
        // Manejo de errores silencioso
  }

  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");
  //const isRootPage = request.nextUrl.pathname === "/";

  // Si no hay token y está intentando acceder al dashboard
  if (!token && isDashboardPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si hay token y está en páginas de auth
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Si está en la página raíz, redirigir según autenticación
  /*if (isRootPage) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }*/

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/login",
    "/register",
    //'/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
