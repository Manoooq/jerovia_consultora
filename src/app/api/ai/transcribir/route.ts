import { NextRequest, NextResponse } from "next/server";
import { transcribirAudio } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { audio, mimeType } = await req.json();
    if (!audio) return NextResponse.json({ error: "Audio requerido" }, { status: 400 });

    const data = await transcribirAudio(audio, mimeType || "audio/webm");
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/ai/transcribir]", err);
    return NextResponse.json({ error: "Error al procesar audio" }, { status: 500 });
  }
}
