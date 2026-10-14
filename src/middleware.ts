import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, AUTH_COOKIE } from "@/lib/auth";

function isSafeRedirectPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get(AUTH_COOKIE)?.value;

  if (pathname.startsWith("/api/usuarios") || pathname.startsWith("/api/audit")) {
    if (!sessionCookie) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }
    const session = await verifyAuthToken(sessionCookie);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Acceso denegado: se requieren privilegios de administrador." },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    const safeRedirect = isSafeRedirectPath(pathname) ? pathname : "/dashboard";

    if (!sessionCookie) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", safeRedirect);
      return NextResponse.redirect(loginUrl);
    }

    const session = await verifyAuthToken(sessionCookie);
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", safeRedirect);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete(AUTH_COOKIE);
      return res;
    }

    const esAdmin = session.role === "admin";
    if (
      (pathname.startsWith("/dashboard/nueva") || pathname.startsWith("/dashboard/usuarios")) &&
      !esAdmin
    ) {
      const dashboardUrl = new URL("/dashboard", req.url);
      dashboardUrl.searchParams.set("error", "unauthorized_role");
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/usuarios/:path*", "/api/audit/:path*"],
};
