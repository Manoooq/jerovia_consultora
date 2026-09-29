const fs = require('fs');
const path = 'src/components/wizard/Paso4_Psicosocial.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/<VoiceCapture[\s\S]*?\/>\n*/g, '');

const voiceCaptureNew = `<VoiceCapture onExtracted={(data) => {
          if (typeof data.aspectosPositivos === "string") setValue("aspectosPositivos", data.aspectosPositivos);
          if (typeof data.aspectosMejorar === "string") setValue("aspectosMejorar", data.aspectosMejorar);
          if (typeof data.visionLargoPlazo === "string") setValue("visionLargoPlazo", data.visionLargoPlazo);
          if (typeof data.expectativasEntidad === "string") setValue("expectativasEntidad", data.expectativasEntidad);
        }} />\n\n`;

content = content.replace('<div className="flex items-center gap-2 mb-2">', voiceCaptureNew + '        <div className="flex items-center gap-2 mb-2">');

fs.writeFileSync(path, content);
