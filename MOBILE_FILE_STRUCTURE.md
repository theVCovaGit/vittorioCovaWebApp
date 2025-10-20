# Mobile File Structure

## 📁 Complete File Structure

```
vittoriocova/
│
├── hooks/
│   └── useMediaQuery.ts              ✅ NEW - Viewport detection
│
├── components/
│   ├── header.tsx                    ✓ UNCHANGED - Desktop version
│   ├── headerMobile.tsx              ✅ NEW - Mobile version
│   ├── headerWrapper.tsx             ✅ NEW - Conditional wrapper
│   │
│   ├── footer.tsx                    ✓ UNCHANGED - Desktop version
│   ├── footerMobile.tsx              ✅ NEW - Mobile version
│   ├── footerWrapper.tsx             ✅ NEW - Conditional wrapper
│   │
│   ├── heroMobile.tsx                ✅ NEW - Mobile home page
│   │
│   ├── creativePageLayout.tsx        ✓ UNCHANGED - Desktop creative pages
│   ├── creativePageLayoutMobile.tsx  ✅ NEW - Mobile creative pages
│   │
│   ├── [other components...]         ✓ UNCHANGED
│   └── ...
│
├── app/
│   ├── layout.tsx                    ✏️ MODIFIED - Uses wrappers
│   ├── page.tsx                      ✏️ MODIFIED - Conditional mobile
│   │
│   ├── architecture/
│   │   └── page.tsx                  📝 TODO - Add mobile support
│   │
│   ├── productdesign/
│   │   └── page.tsx                  📝 TODO - Add mobile support
│   │
│   ├── film/
│   │   └── page.tsx                  📝 TODO - Add mobile support
│   │
│   ├── art/
│   │   └── page.tsx                  📝 TODO - Add mobile support
│   │
│   ├── store/
│   │   ├── Store.tsx                 📝 TODO - Add mobile support
│   │   ├── [id]/page.tsx             📝 TODO - Add mobile support
│   │   └── checkout/page.tsx         📝 TODO - Add mobile support
│   │
│   └── [other pages...]              📝 TODO - Add as needed
│
└── Documentation/
    ├── MOBILE_PATTERN.md             ✅ Pattern explanation
    ├── MOBILE_IMPLEMENTATION_GUIDE.md ✅ How-to guide
    └── MOBILE_FILE_STRUCTURE.md      ✅ This file
```

---

## 🔄 The Pattern in Action

### Flow Diagram

```
User visits page on mobile device
           ↓
    useMediaQuery hook detects viewport width
           ↓
    Is viewport <= 768px?
           ↓
    ┌──────┴──────┐
   YES            NO
    ↓              ↓
Mobile Component  Desktop Component
  renders          renders
```

### Example: Header Component

```
User loads any page
        ↓
layout.tsx renders <HeaderWrapper />
        ↓
HeaderWrapper checks useIsMobile()
        ↓
    ┌───┴───┐
Mobile?   Desktop?
    ↓         ↓
<HeaderMobile />  <Header />
(hamburger menu)  (original)
```

---

## 📊 Component Relationships

### Layout Wrapper Pattern

```
┌─────────────────────────────────────┐
│         app/layout.tsx              │
│  (Server Component)                 │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   HeaderWrapper (Client)      │ │
│  │   ↓                           │ │
│  │   useIsMobile()               │ │
│  │   ↓                           │ │
│  │   Mobile? → HeaderMobile      │ │
│  │   Desktop? → Header           │ │
│  └───────────────────────────────┘ │
│                                     │
│  {children}                         │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   FooterWrapper (Client)      │ │
│  │   ↓                           │ │
│  │   useIsMobile()               │ │
│  │   ↓                           │ │
│  │   Mobile? → FooterMobile      │ │
│  │   Desktop? → Footer           │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Page Component Pattern

```
┌──────────────────────────────────────┐
│       app/page.tsx (Hero)            │
│       (Client Component)             │
│                                      │
│   const isMobile = useIsMobile()    │
│                                      │
│   if (isMobile) {                   │
│     return <HeroMobile />           │
│   }                                  │
│                                      │
│   return (                          │
│     // Desktop JSX                  │
│   )                                  │
└──────────────────────────────────────┘
```

### Creative Page Pattern

```
┌────────────────────────────────────────────┐
│    app/architecture/page.tsx               │
│    (Client Component)                      │
│                                            │
│    const isMobile = useIsMobile()         │
│                                            │
│    if (isMobile) {                        │
│      return (                             │
│        <CreativePageLayoutMobile          │
│          heroImage={...}                  │
│          projectList={...}                │
│          expandedProject={...}            │
│        />                                  │
│      )                                     │
│    }                                       │
│                                            │
│    return (                               │
│      <CreativePageLayout                  │
│        heroImage={...}                    │
│        projectList={...}                  │
│        expandedProject={...}              │
│      />                                    │
│    )                                       │
└────────────────────────────────────────────┘
```

---

## 🎯 Naming Conventions

### Pattern
- Desktop: `[Component].tsx` (e.g., `header.tsx`)
- Mobile: `[Component]Mobile.tsx` (e.g., `headerMobile.tsx`)
- Wrapper: `[Component]Wrapper.tsx` (e.g., `headerWrapper.tsx`)

### When to Use Each

**Wrapper** - Use in `layout.tsx` for global components (header, footer)
```tsx
<HeaderWrapper />  // Auto-switches based on viewport
```

**Inline Conditional** - Use in page components
```tsx
const isMobile = useIsMobile();
if (isMobile) return <PageMobile />;
return <PageDesktop />;
```

---

## 📈 Implementation Progress

### ✅ Completed (7/7)
1. ✅ useMediaQuery hook
2. ✅ Header (wrapper + mobile)
3. ✅ Footer (wrapper + mobile)
4. ✅ Hero/Home page (mobile)
5. ✅ Creative page layout (mobile)
6. ✅ Hamburger menu navigation
7. ✅ Layout integration

### 📝 Next Steps
- Architecture page mobile integration
- Product Design page mobile integration
- Film page mobile integration
- Art page mobile integration
- Store pages mobile integration
- Admin page mobile integration

---

## 💾 File Sizes Reference

### Created Files
- `useMediaQuery.ts` - ~1KB
- `headerMobile.tsx` - ~3KB
- `headerWrapper.tsx` - ~0.3KB
- `footerMobile.tsx` - ~2KB
- `footerWrapper.tsx` - ~0.3KB
- `heroMobile.tsx` - ~2KB
- `creativePageLayoutMobile.tsx` - ~5KB

**Total new code: ~14KB**

### Modified Files
- `app/layout.tsx` - Changed 4 lines
- `app/page.tsx` - Added 7 lines

**Minimal changes to existing code!**

---

## 🎓 Key Takeaways

1. **Zero Breaking Changes** - All desktop code remains functional
2. **Progressive Enhancement** - Mobile support added gradually
3. **Performance** - Only one version loads per device
4. **Maintainability** - Clear separation of concerns
5. **Scalability** - Easy to add more mobile components

---

## 🔗 Related Documentation

- **Pattern Explanation**: `MOBILE_PATTERN.md`
- **Implementation Guide**: `MOBILE_IMPLEMENTATION_GUIDE.md`
- **This File**: `MOBILE_FILE_STRUCTURE.md`

