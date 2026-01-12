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
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Obtener el usuario desde la base de datos para verificar el rol
    // Por ahora verificamos desde el token si existe el email
    if (token.email) {
      try {
        console.log("[MIDDLEWARE] Checking admin access for:", token.email);
        const response = await fetch(
          `${request.nextUrl.origin}/api/user?email=${token.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        console.log("[MIDDLEWARE] API response status:", response.status);

        if (response.ok) {
          const user = await response.json();
          console.log("[MIDDLEWARE] User role:", user.role);

          // Si el usuario no es admin, redirigir a profile
          if (user.role !== "admin") {
            console.log("[MIDDLEWARE] Access denied - not admin");
            return NextResponse.redirect(new URL("/profile", request.url));
          }
          console.log("[MIDDLEWARE] Access granted - is admin");
        } else {
          // Si no se encuentra el usuario, redirigir a home
          console.log("[MIDDLEWARE] User not found in database");
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (error) {
        console.error("[MIDDLEWARE] Error fetching user:", error);
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
