import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Las rutas de entrevista (/entrevista/* y /api/entrevista/[token]) son públicas para que el postulante pueda rellenar sus datos
  if (
    pathname.startsWith("/entrevista") ||
    pathname.startsWith("/api/entrevista/") ||
    pathname.startsWith("/api/exportar/") ||
    pathname.startsWith("/api/ai/")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get(AUTH_COOKIE)?.value;
    const session = token ? await verifyAuthToken(token) : null;

    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (
      (pathname.startsWith("/dashboard/nueva") ||
        pathname.startsWith("/dashboard/usuarios")) &&
      session.role !== "admin"
    ) {
      return NextResponse.redirect(
        new URL("/dashboard?error=unauthorized_role", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
