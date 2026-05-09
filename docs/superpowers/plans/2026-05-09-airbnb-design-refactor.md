# Roomify Airbnb Design Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le design teal par le système Airbnb (Rausch #ff385c, canvas blanc, Inter, photo-first cards) et produire une landing page moderne avec effets scroll Framer Motion.

**Architecture:** Tokens d'abord (globals.css → shadcn overrides), puis composants fondateurs (Navbar, PlaceCard, SearchBar), puis pages (auth, landing). Chaque tâche produit un état cohérent et buildable.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, shadcn/ui (@base-ui/react), Framer Motion, Picsum Photos (CDN seed-based), Inter (next/font/google), SWR, Zustand, iron-session.

**Vérification :** Pas de test framework dans ce projet. Chaque tâche se vérifie avec `npm run build` (0 erreurs TypeScript/build) + inspection visuelle dans `npm run dev`.

---

## File Map

| Fichier | Action | Responsabilité |
|---|---|---|
| `next.config.ts` | Modifier | Ajouter picsum.photos aux remote patterns |
| `package.json` | Modifier | Ajouter framer-motion |
| `app/globals.css` | Réécrire | Tokens Airbnb (palette, radius, shadow, dark mode) |
| `app/layout.tsx` | Modifier | Switcher de Plus Jakarta Sans → Inter |
| `components/ui/button.tsx` | Modifier | Variantes Rausch + radius 8px |
| `components/ui/input.tsx` | Modifier | Style Airbnb (56px height, ink focus 2px) |
| `components/layout/Navbar.tsx` | Réécrire | 80px, tabs centrés rôle-based, account pill, mobile sheet |
| `components/places/PlaceCard.tsx` | Réécrire | Photo-first Picsum, badge type, cœur, meta block |
| `components/places/PlaceFilters.tsx` | Réécrire UI | Pill search bar (Où + Type + orb Rausch), logique filtre préservée |
| `app/(auth)/login/page.tsx` | Réécrire | Layout Airbnb : fond surface-soft, card centrée |
| `app/(auth)/register/page.tsx` | Réécrire | Idem login |
| `components/auth/LoginForm.tsx` | Modifier | Inputs Airbnb style (visuels), logique inchangée |
| `components/auth/RegisterForm.tsx` | Modifier | Idem LoginForm |
| `app/page.tsx` | Réécrire | Compose les sections landing |
| `components/landing/HeroSection.tsx` | Créer | Word reveal + pill search + parallax photo mosaïque |
| `components/landing/StatsSection.tsx` | Créer | Compteurs animés (useSpring + useInView) |
| `components/landing/CategoryStrip.tsx` | Créer | Stagger cascade des 5 types |
| `components/landing/FeaturedPlaces.tsx` | Créer | 4 showcase cards statiques photo-first |
| `components/landing/TrustSection.tsx` | Créer | SVG stroke animation + fade |
| `components/landing/HostCTASection.tsx` | Créer | Split layout, slide + scale au scroll |
| `components/landing/LandingFooter.tsx` | Créer | 3 colonnes + legal band |
| `components/landing/LandingNav.tsx` | Créer | Nav publique (non-auth) |

---

## Task 1 : Dépendances + Configuration Next.js

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`

- [ ] **Step 1 : Installer framer-motion**

```bash
npm install framer-motion
```

Résultat attendu : `added 1 package` (ou similaire), pas d'erreurs.

- [ ] **Step 2 : Mettre à jour next.config.ts**

Remplacer le contenu de `next.config.ts` :

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 3 : Vérifier le build**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully` — 0 erreurs TypeScript.

- [ ] **Step 4 : Commit**

```bash
git add next.config.ts package.json package-lock.json
git commit -m "feat: install framer-motion, add picsum.photos to image domains"
```

---

## Task 2 : Design Tokens — globals.css + Inter font

**Files:**
- Rewrite: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1 : Réécrire globals.css avec les tokens Airbnb**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  /* Airbnb custom tokens */
  --color-rausch: var(--rausch);
  --color-rausch-active: var(--rausch-active);
  --color-rausch-disabled: var(--rausch-disabled);
  --color-ink: var(--ink);
  --color-body-text: var(--body-text);
  --color-muted-text: var(--muted-text);
  --color-surface-soft: var(--surface-soft);
  --color-surface-strong: var(--surface-strong);
  --color-hairline: var(--hairline);
  --color-hairline-soft: var(--hairline-soft);
  --color-border-strong: var(--border-strong);
  /* Radius */
  --radius-sm: calc(var(--radius) * 0.75); /* ~6px */
  --radius-md: calc(var(--radius) * 1.75); /* ~14px cards */
  --radius-lg: var(--radius);               /* 8px */
  --radius-xl: calc(var(--radius) * 4);     /* 32px */
  --radius-2xl: 9999px;                     /* full pill */
}

:root {
  /* ── shadcn/ui mapped variables → Airbnb palette ─── */
  --background: #ffffff;
  --foreground: #222222;
  --card: #ffffff;
  --card-foreground: #222222;
  --popover: #ffffff;
  --popover-foreground: #222222;
  --primary: #ff385c;
  --primary-foreground: #ffffff;
  --secondary: #f7f7f7;
  --secondary-foreground: #222222;
  --muted: #f7f7f7;
  --muted-foreground: #6a6a6a;
  --accent: #f2f2f2;
  --accent-foreground: #222222;
  --destructive: #c13515;
  --border: #dddddd;
  --input: #dddddd;
  --ring: #222222;
  --radius: 0.5rem; /* 8px — base button radius */

  /* ── Airbnb extended tokens ─────────────────────── */
  --rausch: #ff385c;
  --rausch-active: #e00b41;
  --rausch-disabled: #ffd1da;
  --ink: #222222;
  --body-text: #3f3f3f;
  --muted-text: #6a6a6a;
  --muted-soft: #929292;
  --surface-soft: #f7f7f7;
  --surface-strong: #f2f2f2;
  --hairline: #dddddd;
  --hairline-soft: #ebebeb;
  --border-strong: #c1c1c1;

  /* ── Sidebar (admin nav) ────────────────────────── */
  --sidebar: #f7f7f7;
  --sidebar-foreground: #222222;
  --sidebar-primary: #ff385c;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #f2f2f2;
  --sidebar-accent-foreground: #222222;
  --sidebar-border: #dddddd;
  --sidebar-ring: #222222;
}

.dark {
  --background: #1a1a1a;
  --foreground: #f0f0f0;
  --card: #222222;
  --card-foreground: #f0f0f0;
  --popover: #222222;
  --popover-foreground: #f0f0f0;
  --primary: #ff385c;
  --primary-foreground: #ffffff;
  --secondary: #2a2a2a;
  --secondary-foreground: #f0f0f0;
  --muted: #2a2a2a;
  --muted-foreground: #888888;
  --accent: #333333;
  --accent-foreground: #f0f0f0;
  --destructive: #ff6b4a;
  --border: #3a3a3a;
  --input: #3a3a3a;
  --ring: #f0f0f0;

  --rausch: #ff385c;
  --rausch-active: #e00b41;
  --rausch-disabled: #4d1020;
  --ink: #f0f0f0;
  --body-text: #cccccc;
  --muted-text: #888888;
  --muted-soft: #666666;
  --surface-soft: #2a2a2a;
  --surface-strong: #333333;
  --hairline: #3a3a3a;
  --hairline-soft: #2e2e2e;
  --border-strong: #555555;

  --sidebar: #222222;
  --sidebar-foreground: #f0f0f0;
  --sidebar-primary: #ff385c;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #2a2a2a;
  --sidebar-accent-foreground: #f0f0f0;
  --sidebar-border: #3a3a3a;
  --sidebar-ring: #f0f0f0;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}

/* ── Airbnb single shadow tier ───────────────────── */
.shadow-tier {
  box-shadow:
    rgba(0, 0, 0, 0.02) 0 0 0 1px,
    rgba(0, 0, 0, 0.04) 0 2px 6px 0,
    rgba(0, 0, 0, 0.10) 0 4px 8px 0;
}

@layer utilities {
  .no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
}
```

- [ ] **Step 2 : Mettre à jour app/layout.tsx — Inter font**

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Roomify — La marketplace des espaces professionnels",
  description: "Trouvez et réservez des salles de réunion, espaces coworking, studios et espaces événementiels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3 : Vérifier le build**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully`.

- [ ] **Step 4 : Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: replace teal palette with Airbnb tokens, switch to Inter font"
```

---

## Task 3 : shadcn Button Override

**Files:**
- Modify: `components/ui/button.tsx`

- [ ] **Step 1 : Mettre à jour button.tsx**

```typescript
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#ff385c] text-white hover:bg-[#e00b41] active:bg-[#e00b41] rounded-[8px]",
        outline:
          "border-[#222222] bg-white text-[#222222] hover:bg-[#f7f7f7] rounded-[8px] dark:border-[#f0f0f0] dark:bg-transparent dark:text-[#f0f0f0] dark:hover:bg-[#2a2a2a]",
        secondary:
          "bg-[#f7f7f7] text-[#222222] hover:bg-[#f2f2f2] rounded-[8px] dark:bg-[#2a2a2a] dark:text-[#f0f0f0] dark:hover:bg-[#333333]",
        ghost:
          "hover:bg-[#f7f7f7] text-[#222222] rounded-[8px] dark:text-[#f0f0f0] dark:hover:bg-[#2a2a2a]",
        destructive:
          "bg-[#c13515]/10 text-[#c13515] hover:bg-[#c13515]/20 rounded-[8px] dark:text-[#ff6b4a] dark:bg-[#ff6b4a]/10 dark:hover:bg-[#ff6b4a]/20",
        link: "text-[#ff385c] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 gap-2 px-6 text-base font-medium",
        xs: "h-7 gap-1 rounded-[8px] px-3 text-xs",
        sm: "h-9 gap-1.5 rounded-[8px] px-4 text-sm",
        lg: "h-14 gap-2 px-8 text-base font-medium",
        icon: "size-10 rounded-[8px]",
        "icon-xs": "size-7 rounded-[8px]",
        "icon-sm": "size-9 rounded-[8px]",
        "icon-lg": "size-12 rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  nativeButton,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      nativeButton={nativeButton ?? (props.render === undefined)}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

- [ ] **Step 2 : Vérifier le build**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully`.

- [ ] **Step 3 : Commit**

```bash
git add components/ui/button.tsx
git commit -m "feat: update Button with Airbnb variants (Rausch, 8px radius)"
```

---

## Task 4 : shadcn Input Override

**Files:**
- Modify: `components/ui/input.tsx`

- [ ] **Step 1 : Mettre à jour input.tsx**

```typescript
import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Base Airbnb input style
        "h-14 w-full min-w-0 rounded-[8px] border border-[#dddddd] bg-white px-3.5 py-1 text-base text-[#222222] transition-colors outline-none",
        // Placeholder
        "placeholder:text-[#929292]",
        // Focus — 2px ink border, no ring glow (Airbnb style)
        "focus-visible:border-[#222222] focus-visible:border-2 focus-visible:ring-0",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#f7f7f7] disabled:opacity-50",
        // Validation error
        "aria-invalid:border-[#c13515] aria-invalid:border-2",
        // Dark mode
        "dark:bg-[#222222] dark:border-[#3a3a3a] dark:text-[#f0f0f0] dark:placeholder:text-[#666666]",
        "dark:focus-visible:border-[#f0f0f0]",
        "dark:disabled:bg-[#2a2a2a]",
        "dark:aria-invalid:border-[#ff6b4a]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
```

- [ ] **Step 2 : Vérifier le build**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully`.

- [ ] **Step 3 : Commit**

```bash
git add components/ui/input.tsx
git commit -m "feat: update Input with Airbnb style (56px height, ink focus border)"
```

---

## Task 5 : Navbar Airbnb

**Files:**
- Rewrite: `components/layout/Navbar.tsx`

- [ ] **Step 1 : Réécrire Navbar.tsx**

```typescript
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown, Globe } from "lucide-react";

const NAV_LINKS = [
  { href: "/places",       label: "Espaces",           roles: ["USER", "OWNER", "ADMIN", "SUPER_ADMIN"] },
  { href: "/places/new",   label: "Ajouter un espace", roles: ["USER", "OWNER", "ADMIN", "SUPER_ADMIN"] },
  { href: "/owner/places", label: "Mes espaces",        roles: ["OWNER", "ADMIN", "SUPER_ADMIN"] },
  { href: "/admin",        label: "Administration",     roles: ["ADMIN", "SUPER_ADMIN"] },
];

export function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { roles } = useRole();

  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const visibleLinks = NAV_LINKS.filter((l) =>
    l.roles.some((r) => roles.includes(r as never))
  );

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  async function handleLogout() {
    await logout();
    setAccountOpen(false);
    setMobileOpen(false);
    router.push("/login");
  }

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  function isActive(href: string) {
    if (href === "/places") return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[#dddddd] dark:bg-[#1a1a1a] dark:border-[#3a3a3a]">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between gap-8">

          {/* Logo */}
          <Link
            href="/places"
            className="shrink-0 text-[22px] font-semibold text-[#ff385c] tracking-tight select-none"
          >
            Roomify
          </Link>

          {/* Tabs centrés — desktop */}
          <nav className="hidden md:flex items-end gap-8 h-full">
            {visibleLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center h-full pb-0 text-[16px] font-semibold transition-colors duration-150 whitespace-nowrap",
                    active
                      ? "text-[#222222] dark:text-[#f0f0f0]"
                      : "text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0]"
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff385c] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Droite : globe + account pill */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              aria-label="Langue"
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-[#222222] hover:bg-[#f7f7f7] transition-colors duration-150 dark:text-[#f0f0f0] dark:hover:bg-[#2a2a2a]"
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Account pill */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-2 h-10 px-3 rounded-full border border-[#dddddd] transition-all duration-150 cursor-pointer",
                  "hover:shadow-md dark:border-[#3a3a3a]",
                  accountOpen && "shadow-md"
                )}
              >
                <Menu className="w-4 h-4 text-[#222222] dark:text-[#f0f0f0]" />
                <div className="w-8 h-8 rounded-full bg-[#222222] dark:bg-[#f0f0f0] flex items-center justify-center">
                  <span className="text-xs font-semibold text-white dark:text-[#222222]">
                    {initials}
                  </span>
                </div>
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full mt-3 w-52 bg-white dark:bg-[#222222] rounded-[14px] border border-[#dddddd] dark:border-[#3a3a3a] shadow-tier py-2 z-50">
                  {user && (
                    <div className="px-4 py-2.5 border-b border-[#ebebeb] dark:border-[#2e2e2e]">
                      <p className="text-sm font-semibold text-[#222222] dark:text-[#f0f0f0] truncate">{user.name}</p>
                      <p className="text-xs text-[#6a6a6a] truncate">{user.email}</p>
                    </div>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setAccountOpen(false)}
                    className="block px-4 py-2.5 text-sm text-[#222222] dark:text-[#f0f0f0] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a] transition-colors duration-150"
                  >
                    Mon profil
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-[#222222] dark:text-[#f0f0f0] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a] transition-colors duration-150"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-[#222222] hover:bg-[#f7f7f7] dark:text-[#f0f0f0] dark:hover:bg-[#2a2a2a] transition-colors duration-150"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-[#1a1a1a] shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-[#dddddd] dark:border-[#3a3a3a]">
              <span className="text-[22px] font-semibold text-[#ff385c]">Roomify</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a]"
              >
                <X className="w-5 h-5 text-[#222222] dark:text-[#f0f0f0]" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              {visibleLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center px-6 py-3.5 text-[16px] font-medium transition-colors duration-150",
                      active
                        ? "text-[#ff385c] bg-[#fff0f3] dark:bg-[#4d1020]"
                        : "text-[#222222] dark:text-[#f0f0f0] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-[#dddddd] dark:border-[#3a3a3a] p-6 space-y-3">
              {user && (
                <p className="text-sm font-semibold text-[#222222] dark:text-[#f0f0f0] truncate">{user.name}</p>
              )}
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-[#222222] dark:text-[#f0f0f0] hover:text-[#ff385c] transition-colors duration-150"
              >
                Mon profil
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full text-left text-sm text-[#222222] dark:text-[#f0f0f0] hover:text-[#ff385c] transition-colors duration-150"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2 : Vérifier le build**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully`.

- [ ] **Step 3 : Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "feat: redesign Navbar with Airbnb pattern (80px, tabs, account pill, mobile sheet)"
```

---

## Task 6 : PlaceCard Photo-First

**Files:**
- Rewrite: `components/places/PlaceCard.tsx`

- [ ] **Step 1 : Réécrire PlaceCard.tsx**

Picsum seed format : `{placeType.toLowerCase().replace('_', '-')}-{placeId}` — ex: `meeting-room-42`.

```typescript
import Link from "next/link";
import Image from "next/image";
import { Place } from "@/types/place";
import { MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  MEETING_ROOM:    "Salle de réunion",
  COWORKING_SPACE: "Coworking",
  EVENT_SPACE:     "Événementiel",
  PARTY_ROOM:      "Salle de fête",
  STUDIO:          "Studio",
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  PENDING:  { label: "En attente",  className: "bg-amber-500/80  text-white" },
  REJECTED: { label: "Refusé",      className: "bg-[#c13515]/80  text-white" },
};

function buildImageSeed(type: string, id: string | number): string {
  const normalized = type.toLowerCase().replace(/_/g, "-");
  return `${normalized}-${id}`;
}

export function PlaceCard({ place }: { place: Place }) {
  const typeLabel  = TYPE_LABELS[place.type] ?? place.type;
  const statusBadge = STATUS_BADGES[place.status];
  const seed = buildImageSeed(place.type, place.id);

  return (
    <Link
      href={`/places/${place.id}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c] rounded-[14px]"
    >
      {/* Photo */}
      <div className="relative aspect-square rounded-[14px] overflow-hidden bg-[#f7f7f7]">
        <Image
          src={`https://picsum.photos/seed/${seed}/800/800`}
          alt={place.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Type badge — top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-tier">
          <span className="text-[11px] font-semibold text-[#222222] leading-none">
            {typeLabel}
          </span>
        </div>

        {/* Status badge — top center (PENDING / REJECTED only) */}
        {statusBadge && (
          <div className={cn(
            "absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-semibold",
            statusBadge.className
          )}>
            {statusBadge.label}
          </div>
        )}

        {/* Heart — top right */}
        <button
          type="button"
          aria-label="Sauvegarder"
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white/80 hover:bg-white transition-colors duration-150 cursor-pointer"
        >
          <Heart className="w-4 h-4 text-[#222222]" strokeWidth={1.75} />
        </button>
      </div>

      {/* Meta block */}
      <div className="mt-3 space-y-1 px-0.5">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16px] font-semibold text-[#222222] dark:text-[#f0f0f0] leading-snug line-clamp-1 flex-1">
            {place.name}
          </h3>
          {place.pricePerHour != null && (
            <p className="text-[14px] font-semibold text-[#222222] dark:text-[#f0f0f0] shrink-0">
              {place.pricePerHour} €
              <span className="font-normal text-[#6a6a6a]"> /h</span>
            </p>
          )}
        </div>

        {/* Address */}
        {place.address && (
          <p className="flex items-center gap-1 text-[14px] text-[#6a6a6a] line-clamp-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {place.address}
          </p>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2 : Vérifier le build**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully`.

- [ ] **Step 3 : Commit**

```bash
git add components/places/PlaceCard.tsx
git commit -m "feat: redesign PlaceCard with photo-first Airbnb pattern (Picsum, badge, heart)"
```

---

## Task 7 : SearchBar Pill (PlaceFilters)

**Files:**
- Rewrite UI: `components/places/PlaceFilters.tsx`

Toute la logique (state, buildFilters, apply, reset, toggleType, date utils) est **préservée à l'identique**. Seul le rendu JSX change.

- [ ] **Step 1 : Réécrire PlaceFilters.tsx**

```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlaceFilters as Filters, PlaceType } from "@/types/place";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const PLACE_TYPES: { type: PlaceType; label: string; emoji: string }[] = [
  { type: "MEETING_ROOM",    label: "Réunion",   emoji: "🏢" },
  { type: "COWORKING_SPACE", label: "Coworking", emoji: "💻" },
  { type: "EVENT_SPACE",     label: "Événement", emoji: "🎭" },
  { type: "PARTY_ROOM",      label: "Fête",      emoji: "🎉" },
  { type: "STUDIO",          label: "Studio",    emoji: "🎵" },
];

/* ── Date utils (inchangées) ───────────────────────────── */
function todayStr(): string { return new Date().toISOString().slice(0, 10); }

function addDaysStr(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysDiff(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  return Math.round(
    (new Date(ty, tm - 1, td).getTime() - new Date(fy, fm - 1, fd).getTime()) / 86400000
  );
}

function fmtDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function PlaceFilters({ onFilter }: { onFilter: (f: Filters) => void }) {
  const [name,     setName]     = useState("");
  const [types,    setTypes]    = useState<PlaceType[]>([]);
  const [from,     setFrom]     = useState("");
  const [to,       setTo]       = useState("");
  const [capMin,   setCapMin]   = useState("");
  const [capMax,   setCapMax]   = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [advOpen,  setAdvOpen]  = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const advRef  = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (advRef.current  && !advRef.current.contains(e.target as Node))  setAdvOpen(false);
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) setTypeOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const hasAdv       = !!(capMin || capMax || priceMin || priceMax || from || to);
  const advCount     = [capMin, capMax, priceMin, priceMax, from, to].filter(Boolean).length;
  const hasAnyFilter = !!name || types.length > 0 || hasAdv;

  function buildFilters(overrides: Partial<Filters> = {}): Filters {
    const hasDate = !!from && !!to;
    return {
      nameContains:    name     || undefined,
      types:           types.length ? types : undefined,
      availableFrom:   hasDate  ? from : undefined,
      availableTo:     hasDate  ? to   : undefined,
      capacityMin:     capMin   ? Number(capMin)   : undefined,
      capacityMax:     capMax   ? Number(capMax)   : undefined,
      pricePerHourMin: priceMin ? Number(priceMin) : undefined,
      pricePerHourMax: priceMax ? Number(priceMax) : undefined,
      ...overrides,
    };
  }

  function apply(overrides?: Partial<Filters>) { onFilter(buildFilters(overrides)); }

  function reset() {
    setName(""); setTypes([]); setFrom(""); setTo("");
    setCapMin(""); setCapMax(""); setPriceMin(""); setPriceMax("");
    onFilter({});
  }

  function toggleType(type: PlaceType) {
    const next = types.includes(type)
      ? types.filter((t) => t !== type)
      : [...types, type];
    setTypes(next);
    apply({ types: next.length ? next : undefined });
    setTypeOpen(false);
  }

  function handleFromChange(val: string) {
    setFrom(val);
    if (to && (to <= val || daysDiff(val, to) > 30)) setTo("");
  }

  /* ── Type label for pill display ── */
  const typeLabel = types.length === 0
    ? "Type d'espace"
    : types.length === 1
      ? PLACE_TYPES.find((t) => t.type === types[0])?.label ?? "Type"
      : `${types.length} types`;

  return (
    <div className="sticky top-20 z-30 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-[#dddddd] dark:border-[#3a3a3a] py-4 mb-8">
      <div className="space-y-4">

        {/* ── Pill search bar ─────────────────────────────────── */}
        <div className="flex items-center h-16 bg-white dark:bg-[#222222] border border-[#dddddd] dark:border-[#3a3a3a] rounded-full shadow-tier max-w-2xl">

          {/* Segment Où */}
          <div className="flex-1 flex flex-col justify-center px-6 min-w-0">
            <label className="text-[11px] font-semibold text-[#222222] dark:text-[#f0f0f0] uppercase tracking-wider mb-0.5 select-none">
              Où
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              placeholder="Nom ou adresse…"
              className="w-full bg-transparent text-[14px] text-[#222222] dark:text-[#f0f0f0] placeholder:text-[#929292] outline-none border-none"
            />
          </div>

          {/* Hairline */}
          <div className="w-px h-8 bg-[#dddddd] dark:bg-[#3a3a3a] shrink-0" />

          {/* Segment Type */}
          <div className="relative flex-1 min-w-0" ref={typeRef}>
            <button
              type="button"
              onClick={() => { setTypeOpen((v) => !v); setAdvOpen(false); }}
              className="w-full flex flex-col justify-center px-6 h-full py-0 cursor-pointer"
            >
              <span className="text-[11px] font-semibold text-[#222222] dark:text-[#f0f0f0] uppercase tracking-wider mb-0.5 text-left select-none">
                Type
              </span>
              <span className={cn(
                "text-[14px] text-left truncate",
                types.length > 0 ? "text-[#222222] dark:text-[#f0f0f0]" : "text-[#929292]"
              )}>
                {typeLabel}
              </span>
            </button>

            {typeOpen && (
              <div className="absolute top-full left-0 mt-4 w-64 bg-white dark:bg-[#222222] rounded-[14px] border border-[#dddddd] dark:border-[#3a3a3a] shadow-tier py-2 z-50">
                {PLACE_TYPES.map(({ type, label, emoji }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors duration-150 cursor-pointer",
                      types.includes(type)
                        ? "bg-[#fff0f3] text-[#ff385c] dark:bg-[#4d1020]"
                        : "text-[#222222] dark:text-[#f0f0f0] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a]"
                    )}
                  >
                    <span aria-hidden>{emoji}</span>
                    {label}
                    {types.includes(type) && (
                      <span className="ml-auto w-4 h-4 rounded-full bg-[#ff385c] flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">✓</span>
                      </span>
                    )}
                  </button>
                ))}
                {types.length > 0 && (
                  <div className="border-t border-[#ebebeb] dark:border-[#2e2e2e] mt-1 pt-1 px-4 pb-1">
                    <button
                      type="button"
                      onClick={() => { setTypes([]); apply({ types: undefined }); setTypeOpen(false); }}
                      className="text-xs text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] transition-colors duration-150"
                    >
                      Effacer la sélection
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Orb Rausch */}
          <div className="pr-2 shrink-0">
            <button
              type="button"
              onClick={() => apply()}
              aria-label="Rechercher"
              className="w-12 h-12 rounded-full bg-[#ff385c] hover:bg-[#e00b41] active:bg-[#e00b41] flex items-center justify-center transition-colors duration-150 cursor-pointer"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* ── Filtres avancés + reset ──────────────────────────── */}
        <div className="flex items-center gap-3 flex-wrap">

          {/* Bouton filtres avancés */}
          <div className="relative" ref={advRef}>
            <button
              type="button"
              onClick={() => { setAdvOpen((v) => !v); setTypeOpen(false); }}
              className={cn(
                "flex items-center gap-2 h-9 px-4 rounded-full border text-sm font-medium transition-all duration-150 cursor-pointer",
                hasAdv
                  ? "border-[#222222] dark:border-[#f0f0f0] bg-[#222222] dark:bg-[#f0f0f0] text-white dark:text-[#222222]"
                  : "border-[#dddddd] dark:border-[#3a3a3a] text-[#222222] dark:text-[#f0f0f0] hover:border-[#222222] dark:hover:border-[#f0f0f0]"
              )}
            >
              <SlidersHorizontal className="w-4 h-4 shrink-0" />
              Filtres
              {advCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#ff385c] text-white text-[10px] font-bold">
                  {advCount}
                </span>
              )}
              <ChevronDown className={cn("w-4 h-4 shrink-0 transition-transform duration-200", advOpen && "rotate-180")} />
            </button>

            {advOpen && (
              <div className="absolute top-full left-0 mt-3 w-80 bg-white dark:bg-[#222222] rounded-[14px] border border-[#dddddd] dark:border-[#3a3a3a] shadow-tier p-5 space-y-5 z-50">
                {/* Disponibilité */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[#6a6a6a] uppercase tracking-wider">Disponibilité</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#6a6a6a]">Arrivée</label>
                      <input
                        type="date"
                        min={todayStr()}
                        value={from}
                        onChange={(e) => handleFromChange(e.target.value)}
                        className="w-full h-10 rounded-[8px] border border-[#dddddd] dark:border-[#3a3a3a] bg-white dark:bg-[#333333] text-[#222222] dark:text-[#f0f0f0] text-sm px-3 outline-none focus:border-[#222222] dark:focus:border-[#f0f0f0] transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#6a6a6a]">Départ</label>
                      <input
                        type="date"
                        min={from ? addDaysStr(from, 1) : todayStr()}
                        max={from ? addDaysStr(from, 30) : undefined}
                        value={to}
                        disabled={!from}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full h-10 rounded-[8px] border border-[#dddddd] dark:border-[#3a3a3a] bg-white dark:bg-[#333333] text-[#222222] dark:text-[#f0f0f0] text-sm px-3 outline-none focus:border-[#222222] dark:focus:border-[#f0f0f0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  {from && to && (
                    <p className="text-xs text-center text-[#ff385c] font-medium">
                      {daysDiff(from, to)} jour{daysDiff(from, to) > 1 ? "s" : ""} sélectionné{daysDiff(from, to) > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                {/* Capacité */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[#6a6a6a] uppercase tracking-wider">Capacité</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#6a6a6a]">Min. pers.</label>
                      <input type="number" min={1} placeholder="1" value={capMin}
                        onChange={(e) => setCapMin(e.target.value)}
                        className="w-full h-10 rounded-[8px] border border-[#dddddd] dark:border-[#3a3a3a] bg-white dark:bg-[#333333] text-[#222222] dark:text-[#f0f0f0] text-sm px-3 outline-none focus:border-[#222222] dark:focus:border-[#f0f0f0]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#6a6a6a]">Max. pers.</label>
                      <input type="number" min={capMin || 1} placeholder="∞" value={capMax}
                        onChange={(e) => setCapMax(e.target.value)}
                        className="w-full h-10 rounded-[8px] border border-[#dddddd] dark:border-[#3a3a3a] bg-white dark:bg-[#333333] text-[#222222] dark:text-[#f0f0f0] text-sm px-3 outline-none focus:border-[#222222] dark:focus:border-[#f0f0f0]"
                      />
                    </div>
                  </div>
                </div>

                {/* Prix */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[#6a6a6a] uppercase tracking-wider">Prix / heure</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#6a6a6a]">Min. €</label>
                      <input type="number" min={0} placeholder="0" value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="w-full h-10 rounded-[8px] border border-[#dddddd] dark:border-[#3a3a3a] bg-white dark:bg-[#333333] text-[#222222] dark:text-[#f0f0f0] text-sm px-3 outline-none focus:border-[#222222] dark:focus:border-[#f0f0f0]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#6a6a6a]">Max. €</label>
                      <input type="number" min={priceMin || 0} placeholder="∞" value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="w-full h-10 rounded-[8px] border border-[#dddddd] dark:border-[#3a3a3a] bg-white dark:bg-[#333333] text-[#222222] dark:text-[#f0f0f0] text-sm px-3 outline-none focus:border-[#222222] dark:focus:border-[#f0f0f0]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setFrom(""); setTo(""); setCapMin(""); setCapMax(""); setPriceMin(""); setPriceMax(""); }}
                    className="flex-1 h-10 rounded-[8px] border border-[#dddddd] dark:border-[#3a3a3a] text-sm font-medium text-[#222222] dark:text-[#f0f0f0] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                  >
                    Effacer
                  </button>
                  <button
                    type="button"
                    onClick={() => { apply(); setAdvOpen(false); }}
                    className="flex-1 h-10 rounded-[8px] bg-[#222222] dark:bg-[#f0f0f0] text-white dark:text-[#222222] text-sm font-medium hover:bg-[#3a3a3a] dark:hover:bg-[#dddddd] transition-colors cursor-pointer"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset */}
          {hasAnyFilter && (
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 text-sm text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] underline underline-offset-2 transition-colors duration-150 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Tout effacer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2 : Vérifier le build**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully`.

- [ ] **Step 3 : Commit**

```bash
git add components/places/PlaceFilters.tsx
git commit -m "feat: redesign PlaceFilters as Airbnb pill search bar (Où + Type + orb Rausch)"
```

---

## Task 8 : Pages Auth Airbnb

**Files:**
- Rewrite: `app/(auth)/login/page.tsx`
- Rewrite: `app/(auth)/register/page.tsx`
- Modify: `components/auth/LoginForm.tsx` (FieldError color)
- Modify: `components/auth/RegisterForm.tsx` (FieldError color + password rules color)

- [ ] **Step 1 : Réécrire app/(auth)/login/page.tsx**

```typescript
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] dark:bg-[#111111] flex flex-col items-center justify-center px-4 py-16">
      {/* Back link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] transition-colors duration-150"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Accueil
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm bg-white dark:bg-[#1a1a1a] rounded-[14px] shadow-tier px-10 py-12 space-y-8">
        {/* Logo */}
        <div className="text-center">
          <span className="text-[28px] font-bold text-[#ff385c] tracking-tight">Roomify</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-[21px] font-bold text-[#222222] dark:text-[#f0f0f0]">Se connecter</h1>
          <p className="text-[14px] text-[#6a6a6a]">Entrez vos identifiants pour accéder à votre compte</p>
        </div>

        <LoginForm />

        <p className="text-center text-[14px] text-[#6a6a6a]">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="text-[#222222] dark:text-[#f0f0f0] font-semibold underline underline-offset-2 hover:text-[#ff385c] transition-colors duration-150"
          >
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2 : Réécrire app/(auth)/register/page.tsx**

```typescript
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] dark:bg-[#111111] flex flex-col items-center justify-center px-4 py-16">
      {/* Back link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] transition-colors duration-150"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Accueil
      </Link>

      {/* Card */}
      <div className="w-full max-w-lg bg-white dark:bg-[#1a1a1a] rounded-[14px] shadow-tier px-10 py-12 space-y-8">
        {/* Logo */}
        <div className="text-center">
          <span className="text-[28px] font-bold text-[#ff385c] tracking-tight">Roomify</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-[21px] font-bold text-[#222222] dark:text-[#f0f0f0]">Créer un compte</h1>
          <p className="text-[14px] text-[#6a6a6a]">Rejoignez la marketplace des espaces professionnels</p>
        </div>

        <RegisterForm />

        <p className="text-center text-[14px] text-[#6a6a6a]">
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="text-[#222222] dark:text-[#f0f0f0] font-semibold underline underline-offset-2 hover:text-[#ff385c] transition-colors duration-150"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3 : Mettre à jour LoginForm.tsx — couleur erreur Airbnb**

Dans `components/auth/LoginForm.tsx`, remplacer la fonction `FieldError` :

```typescript
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-[#c13515] mt-1.5">{message}</p>;
}
```

Et le bouton submit :

```typescript
<button
  type="submit"
  disabled={loading}
  className="w-full h-12 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] active:bg-[#e00b41] text-white text-base font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
>
  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Connexion…</> : "Se connecter"}
</button>
```

- [ ] **Step 4 : Mettre à jour RegisterForm.tsx — couleur erreur + règles password**

Dans `components/auth/RegisterForm.tsx`, remplacer la fonction `FieldError` :

```typescript
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-[#c13515] mt-1.5">{message}</p>;
}
```

Remplacer les classes de l'item des règles password (ligne `<li key={label} className=...>`) :

```typescript
<li key={label} className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${valid ? "text-[#ff385c]" : "text-[#6a6a6a]"}`}>
```

Et le bouton submit :

```typescript
<button
  type="submit"
  disabled={loading}
  className="w-full h-12 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] active:bg-[#e00b41] text-white text-base font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-1"
>
  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Création…</> : "Créer mon compte"}
</button>
```

Et le bouton secondaire dans l'état success :

```typescript
<button
  type="button"
  onClick={() => router.push("/login")}
  className="w-full h-12 rounded-[8px] border border-[#dddddd] text-[#222222] dark:border-[#3a3a3a] dark:text-[#f0f0f0] text-base font-medium hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer"
>
  Aller à la connexion
</button>
```

- [ ] **Step 5 : Vérifier le build**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully`.

- [ ] **Step 6 : Commit**

```bash
git add app/(auth)/login/page.tsx app/(auth)/register/page.tsx components/auth/LoginForm.tsx components/auth/RegisterForm.tsx
git commit -m "feat: redesign auth pages with Airbnb style (surface-soft bg, centered card)"
```

---

## Task 9 : Landing Page avec Framer Motion

**Files:**
- Create: `components/landing/LandingNav.tsx`
- Create: `components/landing/HeroSection.tsx`
- Create: `components/landing/StatsSection.tsx`
- Create: `components/landing/CategoryStrip.tsx`
- Create: `components/landing/FeaturedPlaces.tsx`
- Create: `components/landing/TrustSection.tsx`
- Create: `components/landing/HostCTASection.tsx`
- Create: `components/landing/LandingFooter.tsx`
- Rewrite: `app/page.tsx`

- [ ] **Step 1 : Créer components/landing/LandingNav.tsx**

```typescript
import Link from "next/link";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-[#dddddd] dark:border-[#3a3a3a]">
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        <span className="text-[22px] font-semibold text-[#ff385c] tracking-tight select-none">
          Roomify
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center h-10 px-4 rounded-full text-[14px] font-medium text-[#222222] dark:text-[#f0f0f0] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a] transition-colors duration-150"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center h-10 px-5 rounded-full bg-[#222222] dark:bg-[#f0f0f0] text-white dark:text-[#222222] text-[14px] font-semibold hover:bg-[#3a3a3a] dark:hover:bg-[#dddddd] transition-colors duration-150"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2 : Créer components/landing/HeroSection.tsx**

```typescript
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search } from "lucide-react";

const HERO_WORDS = ["Trouvez", "l'espace", "idéal", "pour", "votre", "équipe"];

const MOSAIC_SEEDS = ["meeting-room-1", "coworking-space-2", "event-space-3"];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0px", "-60px"]);

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-white dark:bg-[#1a1a1a] min-h-[600px] flex items-center">
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center w-full">

        {/* Left — text + search */}
        <div className="space-y-8">
          {/* Word reveal headline */}
          <h1 className="text-[clamp(32px,5vw,56px)] font-bold text-[#222222] dark:text-[#f0f0f0] leading-[1.1] tracking-tight">
            {HERO_WORDS.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-[18px] text-[#6a6a6a] leading-relaxed max-w-md"
          >
            Des salles de réunion aux studios créatifs, Roomify connecte les professionnels aux meilleurs espaces.
          </motion.p>

          {/* Pill search bar slide-up */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5, type: "spring", stiffness: 120, damping: 20 }}
          >
            <div className="flex items-center h-16 bg-white dark:bg-[#222222] border border-[#dddddd] dark:border-[#3a3a3a] rounded-full shadow-tier max-w-md">
              <div className="flex-1 px-6">
                <p className="text-[11px] font-semibold text-[#222222] dark:text-[#f0f0f0] uppercase tracking-wider mb-0.5">Où</p>
                <p className="text-[14px] text-[#929292]">Ville, quartier…</p>
              </div>
              <div className="w-px h-8 bg-[#dddddd] dark:bg-[#3a3a3a] shrink-0" />
              <div className="flex-1 px-6">
                <p className="text-[11px] font-semibold text-[#222222] dark:text-[#f0f0f0] uppercase tracking-wider mb-0.5">Type</p>
                <p className="text-[14px] text-[#929292]">Tous les espaces</p>
              </div>
              <div className="pr-2 shrink-0">
                <Link
                  href="/register"
                  className="w-12 h-12 rounded-full bg-[#ff385c] hover:bg-[#e00b41] flex items-center justify-center transition-colors duration-150"
                >
                  <Search className="w-5 h-5 text-white" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right — photo mosaïque avec parallax */}
        <motion.div
          style={{ y: photoY }}
          className="hidden lg:grid grid-cols-2 grid-rows-2 gap-3 h-[480px]"
        >
          <div className="col-span-1 row-span-2 relative rounded-[14px] overflow-hidden">
            <Image
              src={`https://picsum.photos/seed/${MOSAIC_SEEDS[0]}/600/900`}
              alt="Espace de travail"
              fill
              className="object-cover"
              sizes="300px"
            />
          </div>
          <div className="relative rounded-[14px] overflow-hidden">
            <Image
              src={`https://picsum.photos/seed/${MOSAIC_SEEDS[1]}/600/400`}
              alt="Coworking"
              fill
              className="object-cover"
              sizes="300px"
            />
          </div>
          <div className="relative rounded-[14px] overflow-hidden">
            <Image
              src={`https://picsum.photos/seed/${MOSAIC_SEEDS[2]}/600/400`}
              alt="Salle événementielle"
              fill
              className="object-cover"
              sizes="300px"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3 : Créer components/landing/StatsSection.tsx**

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const STATS = [
  { value: 200, suffix: "+", label: "Espaces vérifiés" },
  { value: 98,  suffix: "%", label: "Satisfaction client" },
  { value: 50,  suffix: "+", label: "Villes couvertes" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const steps    = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + increment, target);
      setCount(Math.round(current));
      if (current >= target) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="bg-[#f7f7f7] dark:bg-[#111111] py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {STATS.map(({ value, suffix, label }) => (
            <div key={label} className="space-y-2">
              <p className="text-[64px] font-bold text-[#222222] dark:text-[#f0f0f0] leading-none tracking-[-1px]">
                <AnimatedCounter target={value} suffix={suffix} />
              </p>
              <p className="text-[16px] text-[#6a6a6a]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4 : Créer components/landing/CategoryStrip.tsx**

```typescript
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Building2, Laptop, PartyPopper, Music2, Camera } from "lucide-react";

const CATEGORIES = [
  { label: "Salle de réunion", Icon: Building2,   type: "MEETING_ROOM"    },
  { label: "Coworking",        Icon: Laptop,       type: "COWORKING_SPACE" },
  { label: "Événementiel",     Icon: PartyPopper,  type: "EVENT_SPACE"     },
  { label: "Salle de fête",    Icon: Music2,       type: "PARTY_ROOM"      },
  { label: "Studio",           Icon: Camera,       type: "STUDIO"          },
];

export function CategoryStrip() {
  return (
    <section className="bg-white dark:bg-[#1a1a1a] py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="text-[21px] font-bold text-[#222222] dark:text-[#f0f0f0] mb-8"
        >
          Explorer par type d&apos;espace
        </motion.h2>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map(({ label, Icon, type }, i) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.35, ease: "easeOut" }}
              className="shrink-0"
            >
              <Link
                href={`/places?type=${type}`}
                className="flex flex-col items-center gap-3 px-8 py-5 rounded-[14px] border border-[#dddddd] dark:border-[#3a3a3a] hover:border-[#222222] dark:hover:border-[#f0f0f0] hover:shadow-tier transition-all duration-200 bg-white dark:bg-[#1a1a1a] group w-36 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#f7f7f7] dark:bg-[#2a2a2a] flex items-center justify-center group-hover:bg-[#fff0f3] dark:group-hover:bg-[#4d1020] transition-colors duration-200">
                  <Icon className="w-6 h-6 text-[#222222] dark:text-[#f0f0f0] group-hover:text-[#ff385c] transition-colors duration-200" strokeWidth={1.5} />
                </div>
                <span className="text-[13px] font-medium text-[#222222] dark:text-[#f0f0f0] leading-snug">
                  {label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5 : Créer components/landing/FeaturedPlaces.tsx**

Les espaces sont des données statiques de showcase (la landing page est publique, l'API requiert auth).

```typescript
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const FEATURED = [
  { id: "feat-1", seed: "meeting-room-featured-1", name: "Salle Haussmann",         address: "Paris 8e",      price: 45, type: "Salle de réunion" },
  { id: "feat-2", seed: "coworking-featured-2",    name: "Open Space République",   address: "Paris 11e",     price: 18, type: "Coworking"        },
  { id: "feat-3", seed: "event-space-featured-3",  name: "Loft Marais Événements",  address: "Paris 3e",      price: 120, type: "Événementiel"    },
  { id: "feat-4", seed: "studio-featured-4",       name: "Studio Pigalle",          address: "Paris 18e",     price: 65, type: "Studio"           },
];

export function FeaturedPlaces() {
  return (
    <section className="bg-white dark:bg-[#1a1a1a] py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="text-[21px] font-bold text-[#222222] dark:text-[#f0f0f0] mb-8"
        >
          Espaces populaires
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED.map(({ id, seed, name, address, price, type }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
            >
              <Link href="/register" className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c] rounded-[14px]">
                <div className="relative aspect-square rounded-[14px] overflow-hidden bg-[#f7f7f7]">
                  <Image
                    src={`https://picsum.photos/seed/${seed}/800/800`}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white shadow-tier">
                    <span className="text-[11px] font-semibold text-[#222222]">{type}</span>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[16px] font-semibold text-[#222222] dark:text-[#f0f0f0] line-clamp-1">{name}</h3>
                    <p className="text-[14px] font-semibold text-[#222222] dark:text-[#f0f0f0] shrink-0">
                      {price} €<span className="font-normal text-[#6a6a6a]"> /h</span>
                    </p>
                  </div>
                  <p className="flex items-center gap-1 text-[14px] text-[#6a6a6a]">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {address}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/register"
            className="inline-flex items-center h-12 px-8 rounded-full bg-[#ff385c] hover:bg-[#e00b41] text-white text-[16px] font-medium transition-colors duration-150"
          >
            Voir tous les espaces
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6 : Créer components/landing/TrustSection.tsx**

```typescript
"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CalendarCheck, Users } from "lucide-react";

const TRUST_ITEMS = [
  {
    Icon: ShieldCheck,
    title: "Espaces vérifiés",
    description: "Chaque espace est validé par notre équipe avant publication. Vous réservez en toute sérénité.",
  },
  {
    Icon: CalendarCheck,
    title: "Réservation instantanée",
    description: "Vérifiez la disponibilité en temps réel et réservez en quelques clics, sans aller-retour.",
  },
  {
    Icon: Users,
    title: "Propriétaires de confiance",
    description: "Une communauté de propriétaires professionnels notés et évalués par les locataires.",
  },
];

const iconVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
};

export function TrustSection() {
  return (
    <section className="bg-[#f7f7f7] dark:bg-[#111111] py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="text-[21px] font-bold text-[#222222] dark:text-[#f0f0f0] mb-12 text-center"
        >
          Pourquoi choisir Roomify ?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRUST_ITEMS.map(({ Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.4, ease: "easeOut" }}
              className="text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.1, duration: 0.4, type: "spring" }}
                className="w-14 h-14 rounded-full bg-[#fff0f3] dark:bg-[#4d1020] flex items-center justify-center mx-auto"
              >
                <Icon className="w-7 h-7 text-[#ff385c]" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-[16px] font-semibold text-[#222222] dark:text-[#f0f0f0]">{title}</h3>
              <p className="text-[14px] text-[#6a6a6a] leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7 : Créer components/landing/HostCTASection.tsx**

```typescript
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export function HostCTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [0.95, 1.05]);
  const textX      = useTransform(scrollYProgress, [0, 0.5], [-40, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={ref} className="bg-[#f7f7f7] dark:bg-[#111111] py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center rounded-[14px] bg-white dark:bg-[#1a1a1a] p-10 shadow-tier">

          {/* Texte */}
          <motion.div style={{ x: textX, opacity: textOpacity }} className="space-y-6">
            <h2 className="text-[28px] font-bold text-[#222222] dark:text-[#f0f0f0] leading-tight">
              Vous avez un espace à louer ?
            </h2>
            <p className="text-[16px] text-[#6a6a6a] leading-relaxed">
              Rejoignez des centaines de propriétaires qui génèrent des revenus supplémentaires grâce à leurs espaces professionnels inutilisés.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#ff385c] hover:bg-[#e00b41] text-white text-[16px] font-medium transition-colors duration-150 group"
            >
              Proposer mon espace
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div style={{ scale: imageScale }} className="relative h-72 rounded-[14px] overflow-hidden">
            <Image
              src="https://picsum.photos/seed/host-cta-workspace/800/600"
              alt="Espace professionnel"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 8 : Créer components/landing/LandingFooter.tsx**

```typescript
import Link from "next/link";

const FOOTER_COLS = [
  {
    head: "Support",
    links: [
      { label: "Centre d'aide",       href: "#" },
      { label: "Contact",             href: "#" },
      { label: "Signaler un problème", href: "#" },
    ],
  },
  {
    head: "Roomify",
    links: [
      { label: "À propos",            href: "#" },
      { label: "Blog",                href: "#" },
      { label: "Devenir propriétaire", href: "/register" },
    ],
  },
  {
    head: "Légal",
    links: [
      { label: "Conditions d'utilisation", href: "#" },
      { label: "Politique de confidentialité", href: "#" },
      { label: "Cookies",                  href: "#" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="bg-white dark:bg-[#1a1a1a] border-t border-[#dddddd] dark:border-[#3a3a3a]">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {FOOTER_COLS.map(({ head, links }) => (
            <div key={head} className="space-y-4">
              <h3 className="text-[16px] font-medium text-[#222222] dark:text-[#f0f0f0]">{head}</h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[14px] text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal band */}
        <div className="border-t border-[#ebebeb] dark:border-[#2e2e2e] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-[#6a6a6a]">© 2026 Roomify, Inc. · Tous droits réservés</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-[13px] text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] transition-colors">Confidentialité</Link>
            <Link href="#" className="text-[13px] text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] transition-colors">Conditions</Link>
            <Link href="#" className="text-[13px] text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] transition-colors">Plan du site</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 9 : Réécrire app/page.tsx**

```typescript
import { LandingNav }       from "@/components/landing/LandingNav";
import { HeroSection }      from "@/components/landing/HeroSection";
import { StatsSection }     from "@/components/landing/StatsSection";
import { CategoryStrip }    from "@/components/landing/CategoryStrip";
import { FeaturedPlaces }   from "@/components/landing/FeaturedPlaces";
import { TrustSection }     from "@/components/landing/TrustSection";
import { HostCTASection }   from "@/components/landing/HostCTASection";
import { LandingFooter }    from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1a1a1a]">
      <LandingNav />
      <HeroSection />
      <StatsSection />
      <CategoryStrip />
      <FeaturedPlaces />
      <TrustSection />
      <HostCTASection />
      <LandingFooter />
    </div>
  );
}
```

- [ ] **Step 10 : Vérifier le build**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully` — 0 erreurs TypeScript.

- [ ] **Step 11 : Vérifier visuellement dans le dev server**

```bash
npm run dev
```

Vérifier dans le navigateur :
- `http://localhost:3000` — landing page : hero word reveal, stats counters, category strip, featured places, trust section, CTA host, footer
- `http://localhost:3000/login` — auth page Airbnb : fond gris, card blanche centrée, logo Rausch
- `http://localhost:3000/register` — idem

- [ ] **Step 12 : Commit final**

```bash
git add components/landing/ app/page.tsx
git commit -m "feat: landing page Airbnb avec Framer Motion (word reveal, compteurs, parallax, stagger)"
```

---

## Self-Review

**Spec coverage :**
- ✅ Tokens Airbnb (globals.css) — Task 2
- ✅ Inter font — Task 2
- ✅ Dark mode tokens dérivés — Task 2
- ✅ Button Rausch + 8px radius — Task 3
- ✅ Input 56px + ink focus — Task 4
- ✅ Navbar 80px + tabs + account pill + mobile sheet — Task 5
- ✅ PlaceCard photo-first Picsum + badge + heart — Task 6
- ✅ SearchBar pill (Où + Type + orb) + filtres avancés — Task 7
- ✅ Auth pages surface-soft + card centrée + logo — Task 8
- ✅ Landing : word reveal, stats counters, category stagger, featured places, trust, CTA host, footer — Task 9
- ✅ picsum.photos remote pattern — Task 1
- ✅ framer-motion installé — Task 1

**Gaps : aucun gap identifié.**

**Cohérence des types :** `PlaceCard` utilise `Place` de `@/types/place`, `PlaceFilters` utilise `PlaceFilters as Filters` et `PlaceType` de `@/types/place` — cohérents avec l'existant.

**Seed format `buildImageSeed`** utilisé dans `PlaceCard` → `{type.toLowerCase().replace(/_/g, '-')}-{id}` — défini dans Task 6, pas réutilisé ailleurs (les landing cards ont leurs propres seeds hardcodés, cohérent).
