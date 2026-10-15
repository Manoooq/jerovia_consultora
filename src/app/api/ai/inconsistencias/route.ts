import { NextRequest, NextResponse } from "next/server";
import { detectarInconsistencias } from "@/lib/gemini";
import { enforceRateLimit, parseSafeJson } from "@/lib/apiSecurity";

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, "ai-inconsistencias", 45, 60_000);
  if (rateErr) return rateErr;

  const { data: datos, errorResponse } = await parseSafeJson<
    Record<string, unknown>
  >(req, 500_000);
  if (errorResponse) return errorResponse;

  try {
    const alertas = detectarInconsistencias(datos || {});
    return NextResponse.json({ alertas });
  } catch {
    return NextResponse.json({ alertas: [] });
  }
}
