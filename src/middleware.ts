import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, AUTH_COOKIE } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Proteger rutas de administración y gestión
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = req.cookies.get(AUTH_COOKIE)?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const session = await verifyAuthToken(sessionCookie);

    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete(AUTH_COOKIE);
      return res;
    }

    // JERARQUÍA DE ROLES (RBAC):
    // Solo los administradores pueden generar nuevas visitas o administrar usuarios
    const esAdmin = session.role === "admin";
    if ((pathname.startsWith("/dashboard/nueva") || pathname.startsWith("/dashboard/usuarios")) && !esAdmin) {
      const dashboardUrl = new URL("/dashboard", req.url);
      dashboardUrl.searchParams.set("error", "unauthorized_role");
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
