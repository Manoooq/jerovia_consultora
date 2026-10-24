## 2026-10-24 - ARIA labels for icon-only close buttons
**Learning:** Found multiple instances of icon-only buttons using just `<X />` inside modals and notifications without an `aria-label` or an explicit `type="button"`. This makes them invisible to screen readers and potentially unsafe in forms.
**Action:** Consistently added Spanish `aria-label` (e.g. "Cerrar modal") and `type="button"` to all close buttons across the app components.
