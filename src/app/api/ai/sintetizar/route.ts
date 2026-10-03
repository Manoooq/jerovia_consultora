import { NextRequest, NextResponse } from "next/server";
import { generarSintesis } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "localhost";
    const rateCheck = checkRateLimit(`ai_sintesis_${ip}`, 25, 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Límite de solicitudes alcanzado. Reintente en ${rateCheck.retryAfterSec} segundos.` },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSec) } }
      );
    }

    const datos = await req.json();
    const sintesis = await generarSintesis(datos);
    return NextResponse.json({ sintesis });
  } catch (err) {
    console.error("[/api/ai/sintetizar]", err);
    return NextResponse.json({ error: "Error al generar síntesis" }, { status: 500 });
  }
}
