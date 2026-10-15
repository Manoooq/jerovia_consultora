## 2024-10-15 - Add ARIA label to Command Palette close button
**Learning:** The CommandPalette uses a Lucide React `<X />` icon within a `<button>` without any accessible text, which makes it opaque to screen readers. We need to be careful with these icon-only buttons as they are a common accessibility anti-pattern.
**Action:** When inspecting components, proactively look for `<button>` elements that only contain an SVG or an Icon component and lack an `aria-label` or visually hidden text, and fix them.
