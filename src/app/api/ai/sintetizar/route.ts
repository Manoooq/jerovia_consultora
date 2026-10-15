import { NextRequest, NextResponse } from "next/server";
import { generarSintesis } from "@/lib/gemini";
import { enforceRateLimit, parseSafeJson } from "@/lib/apiSecurity";

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, "ai-sintesis", 25, 60_000);
  if (rateErr) return rateErr;

  const { data: datos, errorResponse } = await parseSafeJson<
    Record<string, unknown>
  >(req, 500_000);
  if (errorResponse) return errorResponse;

  try {
    const sintesis = await generarSintesis(datos || {});
    return NextResponse.json({ sintesis });
  } catch (err) {
    console.error("[/api/ai/sintetizar]", err);
    return NextResponse.json(
      { error: "Error al generar síntesis." },
      { status: 500 }
    );
  }
}
