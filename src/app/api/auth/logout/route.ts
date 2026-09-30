import { NextResponse } from "next/server";
import { removeAdminSession, getAdminSession, DEFAULT_ADMIN } from "@/lib/auth";

export async function POST() {
  await removeAdminSession();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: session.email,
      name: DEFAULT_ADMIN.name,
      role: DEFAULT_ADMIN.role,
    },
  });
}
