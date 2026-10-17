import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { enforceRateLimit, parseSafeJson } from "@/lib/apiSecurity";

const API_KEY = process.env.GEMINI_API_KEY || "";

/**
 * Recibe una foto de Michelle y utiliza Nano Banana (gemini-2.5-flash-image)
 * para generar un retrato ejecutivo de estudio en traje corporativo,
 * guardándolo en public/michelle-corporate.png.
 */
export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, "ai-nano-banana", 10, 60_000);
  if (rateErr) return rateErr;

  const { data: body, errorResponse } = await parseSafeJson<{
    imageBase64?: string;
    mimeType?: string;
  }>(req, 6_000_000);
  if (errorResponse) return errorResponse;

  const rawBase64 = body?.imageBase64 || "";
  const mimeType = body?.mimeType || "image/jpeg";
  if (!rawBase64) {
    return NextResponse.json({ error: "Imagen requerida." }, { status: 400 });
  }

  const cleanBase64 = rawBase64.includes(",")
    ? rawBase64.split(",")[1]
    : rawBase64;

  const publicDir = path.join(process.cwd(), "public");
  const outPath = path.join(publicDir, "michelle-corporate.png");

  // Si hay GEMINI_API_KEY configurada, invocar Nano Banana (gemini-2.5-flash-image)
  if (API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inlineData: {
                      mimeType,
                      data: cleanBase64,
                    },
                  },
                  {
                    text: "Generate a high-end corporate executive studio portrait of this exact woman (preserving her facial features, warm expression, and hair) wearing a tailored navy blue business blazer over a crisp white shirt, inside a modern sunlit corporate glass office, editorial photography, 85mm lens, shallow depth of field.",
                  },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ["IMAGE", "TEXT"],
            },
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const parts = result?.candidates?.[0]?.content?.parts || [];
        const imgPart = parts.find(
          (p: { inlineData?: { data?: string } }) => p.inlineData?.data
        );

        if (imgPart?.inlineData?.data) {
          const genBase64 = imgPart.inlineData.data;
          const dataUrl = `data:image/png;base64,${genBase64}`;
          try {
            await fs.promises.mkdir(publicDir, { recursive: true });
            await fs.promises.writeFile(
              outPath,
              Buffer.from(genBase64, "base64")
            );
          } catch {}
          return NextResponse.json({
            generated: true,
            model: "gemini-2.5-flash-image",
            imageUrl: dataUrl,
          });
        }
      }
    } catch (err) {
      console.error("[Nano Banana error]:", err);
    }
  }

  // Fallback inmediato: guardar la imagen optimizada para usarla en el perfil ejecutivo
  const fallbackDataUrl = `data:${mimeType};base64,${cleanBase64}`;
  try {
    await fs.promises.mkdir(publicDir, { recursive: true });
    await fs.promises.writeFile(outPath, Buffer.from(cleanBase64, "base64"));
  } catch {}

  return NextResponse.json({
    generated: false,
    imageUrl: fallbackDataUrl,
    notice: API_KEY
      ? "Imagen aplicada al perfil ejecutivo."
      : "Imagen aplicada. Configure GEMINI_API_KEY en .env.local para activar la transformación en estudio con Nano Banana.",
  });
}
