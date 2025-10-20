# Mobile Implementation Guide

## ✅ What's Been Created

### Core Infrastructure
1. **`/hooks/useMediaQuery.ts`** - Viewport detection hook
   - `useIsMobile()` - Returns true if <= 768px
   - `useIsTablet()` - Returns true if 769px-1024px  
   - `useIsDesktop()` - Returns true if >= 1025px

### Mobile Components Created
2. **`/components/headerMobile.tsx`** - Mobile header with hamburger menu
3. **`/components/headerWrapper.tsx`** - Conditionally renders desktop/mobile header
4. **`/components/footerMobile.tsx`** - Mobile footer (simplified)
5. **`/components/footerWrapper.tsx`** - Conditionally renders desktop/mobile footer
6. **`/components/heroMobile.tsx`** - Mobile home page
7. **`/components/creativePageLayoutMobile.tsx`** - Mobile creative pages layout

### Updated Files
8. **`/app/layout.tsx`** - Now uses HeaderWrapper and FooterWrapper
9. **`/app/page.tsx`** - Now conditionally renders HeroMobile

---

## 🎯 How to Apply to Other Pages

### Example 1: Architecture Page

**Current file**: `/app/architecture/page.tsx`

**Add this at the top:**
```tsx
"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import CreativePageLayoutMobile from "@/components/creativePageLayoutMobile";
// ... your other imports
```

**Modify your component:**
```tsx
export default function ArchitecturePage() {
  const isMobile = useIsMobile();
  const [expandedProject, setExpandedProject] = useState(null);
  
  // Mobile version
  if (isMobile) {
    return (
      <CreativePageLayoutMobile
        heroImage={<YourHeroComponent />}
        projectList={<YourProjectsList />}
        expandedProject={expandedProject}
        setExpandedProject={setExpandedProject}
        categoryColor="#92a982"
      />
    );
  }
  
  // Desktop version (your original code)
  return (
    <CreativePageLayout
      // ... your existing props
    />
  );
}
```

### Example 2: Store Page

**Current file**: `/app/store/Store.tsx`

You'll need to create:
- `/components/storeMobile.tsx` - Simplified mobile store layout

**Pattern:**
```tsx
"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import StoreMobile from "@/components/storeMobile";

export default function Store() {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <StoreMobile />;
  }
  
  // Your existing desktop store code
  return (
    <div>
      {/* Desktop store layout */}
    </div>
  );
}
```

### Example 3: Simple Pages (About, Admin, etc.)

For simpler pages, you can use responsive utilities OR create mobile versions:

**Option A - Responsive utilities (quick):**
```tsx
export default function AboutPage() {
  return (
    <div className="px-4 md:px-8 pt-20 md:pt-32">
      <h1 className="text-2xl md:text-4xl">About</h1>
      {/* Rest of content */}
    </div>
  );
}
```

**Option B - Separate mobile component (better UX):**
```tsx
"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import AboutMobile from "@/components/aboutMobile";

export default function AboutPage() {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <AboutMobile />;
  }
  
  return (
    // Desktop version
  );
}
```

---

## 📋 Pages That Need Mobile Versions

### High Priority (Complex animations/layouts)
- [ ] `/app/architecture/page.tsx` - Use `CreativePageLayoutMobile`
- [ ] `/app/productdesign/page.tsx` - Use `CreativePageLayoutMobile`
- [ ] `/app/film/page.tsx` - Use `CreativePageLayoutMobile`
- [ ] `/app/art/page.tsx` - Use `CreativePageLayoutMobile`
- [ ] `/app/store/Store.tsx` - Create `storeMobile.tsx`

### Medium Priority
- [ ] `/app/admin/page.tsx` - Create `adminMobile.tsx` or use responsive utilities
- [ ] `/app/about/page.tsx` - Create `aboutMobile.tsx`
- [ ] `/app/store/[id]/page.tsx` - Create product detail mobile version
- [ ] `/app/store/checkout/page.tsx` - Create checkout mobile version

### Low Priority (Simple layouts)
- [ ] `/app/blog/page.tsx` - Likely responsive utilities are enough
- [ ] `/app/blog/[id]/page.tsx` - Likely responsive utilities are enough
- [ ] `/app/testimonials/page.tsx` - Likely responsive utilities are enough

---

## 🎨 Design Guidelines for Mobile Components

### Typography
- Desktop headings: `text-xl` → Mobile: `text-lg`
- Desktop body: `text-base` → Mobile: `text-sm`
- More line height on mobile: `leading-relaxed` or `leading-loose`

### Spacing
- Desktop padding: `px-8` → Mobile: `px-4`
- Desktop gaps: `gap-8` → Mobile: `gap-4`
- Larger touch targets: Minimum `py-3` or `py-4` for buttons

### Navigation
- Hide complex navigation, use hamburger menu
- Stack items vertically
- Larger tap targets (48x48px minimum)

### Animations
- Simplify or remove complex animations on mobile
- Use simpler transitions
- Consider performance on mobile devices

### Images
- Use `aspect-ratio` utilities for consistent sizing
- Consider lazy loading for image galleries
- Mobile: Show 1 column, Desktop: Show grid

---

## 🚀 Quick Start Checklist

For each page you want to make mobile-friendly:

1. [ ] Decide: Separate mobile component or responsive utilities?
2. [ ] If separate: Create `[componentName]Mobile.tsx`
3. [ ] Import `useIsMobile` hook
4. [ ] Add conditional rendering
5. [ ] Test on mobile viewport (Chrome DevTools)
6. [ ] Adjust spacing/typography as needed
7. [ ] Test touch interactions

---

## 🔧 Testing

### Chrome DevTools
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device (e.g., iPhone 12 Pro)
4. Test interactions

### Common Mobile Sizes
- iPhone SE: 375x667
- iPhone 12/13: 390x844
- iPhone 14 Pro Max: 430x932
- Samsung Galaxy S21: 360x800
- iPad: 768x1024

---

## 💡 Tips

1. **Always test on real devices** when possible
2. **Touch targets** should be at least 44x44px (Apple) or 48x48px (Material Design)
3. **Text readability** - minimum 16px (text-base) for body text
4. **Navigation** - Keep mobile nav simple and obvious
5. **Forms** - Stack form fields vertically on mobile
6. **Tables** - Convert to cards on mobile
7. **Modals** - Consider full-screen on mobile

---

## 📞 Questions?

Refer to `MOBILE_PATTERN.md` for the complete pattern explanation.

