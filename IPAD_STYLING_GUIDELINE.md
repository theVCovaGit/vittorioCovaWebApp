# iPad styling guideline

**Rule:** I shall not affect mobile or desktop implementations—they're already perfect. **Only iPad.**

**Where to put iPad-only CSS:** All tablet-band (768–1024px) overrides live in **`app/ipad.css`**. That file is imported after `globals.css` in `app/layout.tsx`. Add or edit iPad styles there so mobile and desktop stay untouched and iPad tweaks stay in one place.

When improving layout, breakpoints, or components for tablet/iPad:

- **Do not** change mobile-specific code, media queries, or components.
- **Do not** change desktop-specific code, media queries, or components.
- **Only** add or adjust styles and behavior that apply to iPad/tablet viewports (e.g. `min-width`/`max-width` ranges that sit between mobile and desktop).
- iPad should get its own coherent experience, not a mix of mobile and desktop rules.

Scope: iPad only.

---

## Making all iPads look the same (like iPad Mini) without affecting mobile or desktop

### 1. Define three bands; only change the middle one

- **Mobile:** &lt; 769px — leave exactly as is. Same breakpoint (e.g. max-width 768px), same code.
- **Tablet:** 769px–1279px — the **only** band we change. All iPads (Mini, Air, Pro) fall here and get the same layout (iPad Mini–like).
- **Desktop:** ≥ 1280px (or 1366px) — leave exactly as is. Same code; we only stop applying it below 1280px so no iPad gets desktop.

Do not change any mobile or desktop styles or components; only change **who gets which layout** by using a higher desktop breakpoint (1280 or 1366) so the tablet band is 769–1279.

### 2. Scope every tablet-only change to the tablet band

- **Component choice (e.g. Footer vs FooterMobile):** Use three branches: ≤768 → mobile layout; 769–1279 → tablet layout (same as iPad Mini, e.g. FooterMobile); ≥1280 → desktop layout. Only the 769–1279 range changes; mobile and desktop logic stay the same.
- **Styles:** Every rule added or changed for tablet must live inside a **tablet-only** media query, e.g.  
  `@media (min-width: 769px) and (max-width: 1279px) { ... }`  
  Never add a rule that applies to all viewports or only `min-width: 769px` with no max—that would affect desktop.

So: &lt; 769px only existing mobile CSS runs (unchanged). ≥ 1280px only existing desktop CSS runs (unchanged). 769–1279px gets the iPad Mini–like layout and only these scoped overrides.

### 3. Why desktop got affected before (and how to avoid it)

Desktop was affected when a change applied at **all** widths or at **min-width: 769px** with no upper bound, so 1280px+ got the new behavior too.

- **Avoid:** Changing a global or desktop style to “fix” tablet (e.g. base label position for everyone).
- **Do:** Keep desktop/mobile defaults; add overrides **only** inside `(min-width: 769px) and (max-width: 1279px)` (or 1280). Prefer a single “tablet band” media query for all iPad-Mini–like overrides.

### 4. Summary

- **Mobile:** Unchanged (same breakpoint and code).
- **Desktop:** Unchanged (same code, but used only for ≥ 1280px so no iPad is treated as desktop).
- **Tablet (769–1279px):** Only band we change: one coherent iPad Mini–like experience; all changes scoped to this band so mobile and desktop are never touched.
