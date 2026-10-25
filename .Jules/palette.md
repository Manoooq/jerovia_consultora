## 2026-10-25 - Icon-only close buttons in modals require context
**Learning:** Screen readers cannot infer the purpose of icon-only close buttons (like the `X` icon in QrCodeModal) without an `aria-label`.
**Action:** Always add `aria-label="Cerrar modal"` or similar descriptive labels in Spanish to icon-only close buttons across the app.
