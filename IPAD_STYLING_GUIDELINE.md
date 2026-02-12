# iPad styling guideline

**Rule:** I shall not affect mobile or desktop implementations—they're already perfect. **Only iPad.**

When improving layout, breakpoints, or components for tablet/iPad:

- **Do not** change mobile-specific code, media queries, or components.
- **Do not** change desktop-specific code, media queries, or components.
- **Only** add or adjust styles and behavior that apply to iPad/tablet viewports (e.g. `min-width`/`max-width` ranges that sit between mobile and desktop).
- iPad should get its own coherent experience, not a mix of mobile and desktop rules.

Scope: iPad only.
