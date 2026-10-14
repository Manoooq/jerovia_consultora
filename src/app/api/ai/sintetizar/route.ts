import { NextRequest, NextResponse } from "next/server";
import { generarSintesis } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rateLimit";
import { ipAddress } from "@vercel/functions";

export async function POST(req: NextRequest) {
  try {
    const ip = ipAddress(req) ?? "127.0.0.1";
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
