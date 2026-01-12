import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Rutas que requieren rol admin
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si la ruta actual es una ruta protegida de admin
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Si no hay token, redirigir a home
    if (!token) {
      console.log("[MIDDLEWARE] No token found - redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log("[MIDDLEWARE] Checking admin access for:", token.email);
    console.log("[MIDDLEWARE] User role from token:", token.role);

    // Verificar el rol directamente desde el token
    if (token.role !== "admin") {
      console.log("[MIDDLEWARE] Access denied - not admin");
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log("[MIDDLEWARE] Access granted - is admin");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
