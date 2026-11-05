## 2026-11-05 - Missing ARIA Labels on Icon-Only Close Buttons
**Learning:** Found an accessibility pattern across the app where custom modal and palette close buttons using the <X /> icon (e.g., in CommandPalette.tsx, QrCodeModal.tsx) lack aria-labels, making them unannounced to screen readers.
**Action:** Always add descriptive aria-labels (e.g., 'Cerrar modal') and keyboard focus styles (focus-visible:ring-2) to icon-only buttons to ensure they are accessible via keyboard and screen readers.
