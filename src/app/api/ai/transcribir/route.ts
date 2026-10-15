import { NextRequest, NextResponse } from "next/server";
import { transcribirAudio } from "@/lib/gemini";
import { enforceRateLimit, parseSafeJson } from "@/lib/apiSecurity";

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, "ai-transcribir", 20, 60_000);
  if (rateErr) return rateErr;

  const { data: body, errorResponse } = await parseSafeJson<{
    audio?: string;
    mimeType?: string;
  }>(req, 5_000_000);
  if (errorResponse) return errorResponse;

  if (!body?.audio || typeof body.audio !== "string") {
    return NextResponse.json({ error: "Audio requerido." }, { status: 400 });
  }

  try {
    const data = await transcribirAudio(
      body.audio,
      body.mimeType || "audio/webm"
    );
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/ai/transcribir]", err);
    return NextResponse.json(
      { error: "Error al procesar audio." },
      { status: 500 }
    );
  }
}
