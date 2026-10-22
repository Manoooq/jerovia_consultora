## 2024-10-22 - Icon-Only Button Accessibility in Modals
**Learning:** Found multiple icon-only close buttons (using Lucide icons) across various modal and notification components that were missing `aria-label`, `aria-hidden` on the icon, and keyboard focus states.
**Action:** Next time, ensure all interactive icon-only elements (like close buttons using `<X />`) always receive `aria-label`, have the child icon marked with `aria-hidden="true"`, and explicitly define `focus-visible:ring-2` using the correct design system colors to improve keyboard and screen reader accessibility.
