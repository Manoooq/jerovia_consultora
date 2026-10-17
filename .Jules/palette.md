## 2024-05-18 - [ARIA Labels for Command Palette]
**Learning:** Found several interactive elements (buttons, inputs) in the `CommandPalette` component without `aria-label` attributes, making them inaccessible to screen readers, particularly the close `<X>` icon-only button and the search `<input>` field.
**Action:** Always verify icon-only buttons and standalone input fields have appropriate descriptive `aria-label` attributes to ensure screen reader compatibility.
