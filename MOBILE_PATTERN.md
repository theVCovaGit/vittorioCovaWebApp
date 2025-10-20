# Mobile Development Pattern

This document explains the mobile-first strategy used in this project.

## Strategy Overview

We use **separate mobile components** that are conditionally rendered based on viewport size. This keeps desktop code untouched and allows for optimized mobile experiences.

## Key Files

### 1. Hook for Viewport Detection
- **File**: `/hooks/useMediaQuery.ts`
- **Usage**: 
  ```tsx
  import { useIsMobile } from "@/hooks/useMediaQuery";
  
  const isMobile = useIsMobile(); // Returns true if viewport <= 768px
  ```

### 2. Component Pattern

For each desktop component that needs a mobile version:

#### Structure:
```
components/
  ├── header.tsx              // Desktop version (original)
  ├── headerMobile.tsx        // Mobile version
  └── headerWrapper.tsx       // Wrapper that conditionally renders
```

#### Wrapper Component Example:
```tsx
"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import Header from "@/components/header";
import HeaderMobile from "@/components/headerMobile";

export default function HeaderWrapper() {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <HeaderMobile />;
  }
  
  return <Header />;
}
```

## Implemented Components

### ✅ Completed
1. **useMediaQuery Hook** - Detects viewport size
2. **Header** - Desktop (untouched) + Mobile version + Wrapper
3. **Footer** - Desktop (untouched) + Mobile version + Wrapper
4. **Hero (Home Page)** - Desktop (untouched) + Mobile version
5. **CreativePageLayout** - Desktop (untouched) + Mobile version

### 📝 Example Usage in Pages

#### app/page.tsx (Hero Page)
```tsx
"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import HeroMobile from "@/components/heroMobile";

export default function Hero() {
  const isMobile = useIsMobile();

  // Mobile version
  if (isMobile) {
    return <HeroMobile />;
  }

  // Desktop version (original code untouched)
  return (
    <div className="min-h-screen bg-[#5c4b4a]...">
      {/* Original desktop code */}
    </div>
  );
}
```

#### Creative Pages (Architecture, Art, Film, Product Design)
```tsx
"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import CreativePageLayout from "@/components/creativePageLayout";
import CreativePageLayoutMobile from "@/components/creativePageLayoutMobile";

export default function ArchitecturePage() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <CreativePageLayoutMobile
        heroImage={<YourHeroImage />}
        projectList={<ProjectsList />}
        expandedProject={expandedProject}
        setExpandedProject={setExpandedProject}
      />
    );
  }

  return (
    <CreativePageLayout
      heroImage={<YourHeroImage />}
      projectList={<ProjectsList />}
      expandedProject={expandedProject}
      setExpandedProject={setExpandedProject}
    />
  );
}
```

## Benefits of This Approach

1. ✅ **Zero impact on desktop** - Original code stays untouched
2. ✅ **Clean separation** - Mobile and desktop logic separated
3. ✅ **Optimized experiences** - Different UX for mobile vs desktop
4. ✅ **Performance** - Only one version renders at a time
5. ✅ **Maintainable** - Clear pattern to follow

## Next Steps

To add mobile support to any page:

1. Create `[component]Mobile.tsx` version
2. Import `useIsMobile` hook
3. Conditionally render based on viewport
4. Keep desktop code unchanged

## Breakpoints

- **Mobile**: `<= 768px`
- **Tablet**: `769px - 1024px` (can use `useIsTablet()`)
- **Desktop**: `>= 1025px` (can use `useIsDesktop()`)

