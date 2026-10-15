import { NextRequest, NextResponse } from "next/server";
import { removeSession, getSession } from "@/lib/auth";
import { registrarEventoAuditoria } from "@/lib/audit";
import { getClientIp } from "@/lib/apiSecurity";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (session) {
    registrarEventoAuditoria({
      userId: session.userId,
      userName: session.name,
      userRole: session.role,
      action: "LOGOUT",
      detail: `Cierre de sesión (@${session.username}).`,
      ip: getClientIp(req),
    });
  }
  await removeSession();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      userId: session.userId,
      username: session.username,
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
}
