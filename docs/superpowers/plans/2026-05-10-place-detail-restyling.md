# Place Detail Page Restyling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle `app/(dashboard)/places/[id]/page.tsx` to align with the project's Airbnb design system — pure visual change, all logic preserved.

**Architecture:** Single-file restyling. Replace the gradient-based hero with a picsum landscape photo (Next.js `<Image>`), update TYPE_CONFIG/STATUS_CONFIG to Airbnb hardcoded hex tokens, and align all element styles (chip, tiles, booking card, skeleton, error state) with established patterns from `PlaceCard.tsx` and `globals.css`. The `buildImageSeed` helper is defined locally (not extracted) to match PlaceCard's seed format.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui, next/image

---

## Files

- Modify: `app/(dashboard)/places/[id]/page.tsx` — all tasks target this single file

---

### Task 1: TYPE_CONFIG, STATUS_CONFIG, imports, buildImageSeed

Remove `gradient` from TYPE_CONFIG (and unused icon imports), update STATUS_CONFIG to Airbnb tokens, add `Image` import, add `buildImageSeed` helper.

**Files:**
- Modify: `app/(dashboard)/places/[id]/page.tsx:1-29` (plus line ~77 for Icon destructure)

- [ ] **Step 1: Verify TypeScript compiles cleanly before touching anything**

```bash
npx tsc --noEmit
```

Expected: no errors (baseline). If there are pre-existing errors, note them — don't fix unrelated issues.

- [ ] **Step 2: Update imports (replace lines 1–11)**

```tsx
"use client";

import { use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePlaceById } from "@/hooks/usePlaces";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Building2,
  Users, MapPin, Clock, User,
} from "lucide-react";
import { cn } from "@/lib/utils";
```

Removed: `Laptop, PartyPopper, Music2, Camera` — only used in `TYPE_CONFIG.Icon` which is being removed. `Building2` stays (used in error state). `Image` added (for hero photo in Task 2).

- [ ] **Step 3: Replace TYPE_CONFIG (lines 13–23) with helper + slimmed config**

```tsx
function buildImageSeed(type: string, id: string | number): string {
  return `${type.toLowerCase().replace(/_/g, "-")}-${id}`;
}

const TYPE_CONFIG: Record<string, { label: string }> = {
  MEETING_ROOM:    { label: "Salle de réunion" },
  COWORKING_SPACE: { label: "Coworking" },
  EVENT_SPACE:     { label: "Événementiel" },
  PARTY_ROOM:      { label: "Salle de fête" },
  STUDIO:          { label: "Studio" },
};
```

`buildImageSeed` matches the function in `PlaceCard.tsx` exactly: type normalized (`MEETING_ROOM` → `meeting-room`) + `-` + id. Example seeds: `meeting-room-42`, `party-room-7`.

- [ ] **Step 4: Replace STATUS_CONFIG (lines 25–29)**

```tsx
const STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  APPROVED: { label: "Disponible", badge: "bg-[#f7f7f7] text-[#222222] border-[#dddddd]" },
  PENDING:  { label: "En attente", badge: "bg-amber-500 text-white border-transparent" },
  REJECTED: { label: "Refusé",     badge: "bg-[#c13515] text-white border-transparent" },
};
```

Note: `border` (border-width) is set in the `<span>` base class at each usage site; the badge field only provides color. `border-[#dddddd]` makes APPROVED border visible; `border-transparent` hides the border for colored badges.

- [ ] **Step 5: Remove `const { Icon } = type;` destructure (around line 77)**

Find:
```tsx
const type = TYPE_CONFIG[place.type] ?? TYPE_CONFIG.MEETING_ROOM;
const status = STATUS_CONFIG[place.status] ?? STATUS_CONFIG.PENDING;
const { Icon } = type;
```

Replace with (remove last line):
```tsx
const type = TYPE_CONFIG[place.type] ?? TYPE_CONFIG.MEETING_ROOM;
const status = STATUS_CONFIG[place.status] ?? STATUS_CONFIG.PENDING;
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. If `Icon` is reported as undefined, check the hero JSX still references it (will be removed in Task 2). The TypeScript error is expected in that case — proceed to Task 2 immediately.

- [ ] **Step 7: Commit**

```bash
git add "app/(dashboard)/places/[id]/page.tsx"
git commit -m "refactor(place-detail): remove gradient/Icon from TYPE_CONFIG, Airbnb tokens in STATUS_CONFIG"
```

---

### Task 2: Hero — picsum photo

Replace the gradient div + dot pattern + decorative icon with a Next.js `<Image>` (picsum photo). Keep the dark scrim, name, and status badge overlay.

**Files:**
- Modify: `app/(dashboard)/places/[id]/page.tsx` (Hero section, ~lines 90–110)

Context: `picsum.photos` is already configured as an allowed Next.js image domain — `PlaceCard.tsx` uses `https://picsum.photos/seed/${seed}/800/800` and is already in production. No `next.config` change needed.

- [ ] **Step 1: Replace the Hero JSX block**

Find the current hero (between `{/* Hero */}` and its closing `</div>`):
```tsx
{/* Hero */}
<div className={cn("relative h-72 rounded-2xl overflow-hidden bg-gradient-to-br", type.gradient)}>
  <div
    className="absolute inset-0 opacity-[0.06]"
    style={{
      backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
      backgroundSize: "22px 22px",
    }}
  />
  <div className="absolute inset-0 flex items-center justify-center">
    <Icon className="w-28 h-28 text-white/15" strokeWidth={1} />
  </div>
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent pt-20 pb-6 px-7">
    <div className="flex items-end justify-between gap-4">
      <h1 className="text-3xl font-bold text-white leading-tight">{place.name}</h1>
      <span className={cn("shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-sm", status.badge)}>
        {status.label}
      </span>
    </div>
  </div>
</div>
```

Replace with:
```tsx
{/* Hero */}
<div className="relative h-72 rounded-[14px] overflow-hidden bg-[#f7f7f7]">
  <Image
    src={`https://picsum.photos/seed/${buildImageSeed(place.type, place.id)}/1600/600`}
    alt={place.name}
    fill
    sizes="(max-width: 1024px) 100vw, 1024px"
    className="object-cover"
    priority
  />
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent pt-20 pb-6 px-7">
    <div className="flex items-end justify-between gap-4">
      <h1 className="text-3xl font-bold text-white leading-tight">{place.name}</h1>
      <span className={cn("shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-sm", status.badge)}>
        {status.label}
      </span>
    </div>
  </div>
</div>
```

`bg-[#f7f7f7]` is the placeholder color shown while the image loads. Dot pattern and decorative `<Icon>` removed — they were specific to the gradient aesthetic and would look wrong over a real photo.

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors. `buildImageSeed` and `Image` are both now defined.

- [ ] **Step 3: Verify visually**

```bash
npm run dev
```

Navigate to a place detail page (e.g. `/places/1`). The hero should show a landscape picsum photo filling the `h-72` area, with the place name and status badge overlaid on a dark scrim at the bottom. The photo corners should be `rounded-[14px]`.

- [ ] **Step 4: Commit**

```bash
git add "app/(dashboard)/places/[id]/page.tsx"
git commit -m "feat(place-detail): hero photo-first picsum, rounded-[14px], remove gradient"
```

---

### Task 3: Type chip + info tiles + divider

Update the type chip to a neutral pill, update info tile icon containers to `w-10 h-10 rounded-[8px] bg-[#f2f2f2]`, update the divider to `border-[#dddddd]`.

**Files:**
- Modify: `app/(dashboard)/places/[id]/page.tsx` (body left column, ~lines 117–178)

- [ ] **Step 1: Update the type chip (around line 119)**

Find:
```tsx
<span className="text-sm font-medium px-3 py-1 rounded-lg bg-primary/8 text-primary">
  {type.label}
</span>
```

Replace with:
```tsx
<span className="rounded-full px-3 py-1 bg-[#f7f7f7] text-[#222222] border border-[#dddddd] text-[13px] font-medium">
  {type.label}
</span>
```

- [ ] **Step 2: Update the divider (around line 138)**

Find:
```tsx
<div className="border-t border-border" />
```

Replace with:
```tsx
<div className="border-t border-[#dddddd]" />
```

- [ ] **Step 3: Update the three info tile icon containers**

Find and replace each of the three tiles. Replace inner `<div>` container class and icon color — keep the outer conditional wrapper (`{place.address && ...}`, `{place.pricePerHour != null && ...}`, `{place.owner && ...}`) and label/value text unchanged.

**Address tile** — find:
```tsx
<div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
  <MapPin className="w-4 h-4 text-muted-foreground" />
</div>
```
Replace with:
```tsx
<div className="w-10 h-10 rounded-[8px] bg-[#f2f2f2] flex items-center justify-center shrink-0">
  <MapPin className="w-4 h-4 text-[#6a6a6a]" />
</div>
```

**Price tile** — find:
```tsx
<div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
  <Clock className="w-4 h-4 text-muted-foreground" />
</div>
```
Replace with:
```tsx
<div className="w-10 h-10 rounded-[8px] bg-[#f2f2f2] flex items-center justify-center shrink-0">
  <Clock className="w-4 h-4 text-[#6a6a6a]" />
</div>
```

**Owner tile** — find:
```tsx
<div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
  <User className="w-4 h-4 text-muted-foreground" />
</div>
```
Replace with:
```tsx
<div className="w-10 h-10 rounded-[8px] bg-[#f2f2f2] flex items-center justify-center shrink-0">
  <User className="w-4 h-4 text-[#6a6a6a]" />
</div>
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add "app/(dashboard)/places/[id]/page.tsx"
git commit -m "style(place-detail): type chip pill neutre, info tiles rounded-[8px] bg-[#f2f2f2], divider border-[#dddddd]"
```

---

### Task 4: Booking card

Update the sticky booking card container to `rounded-[14px]`, `border-[#dddddd]`, `shadow-tier`, `bg-white`. Update internal divider.

**Files:**
- Modify: `app/(dashboard)/places/[id]/page.tsx` (right column, ~lines 182–226)

Note: The `status.badge` class used for the badge inside the card is already updated by Task 1 (STATUS_CONFIG). Only the card container and divider need touching here.

- [ ] **Step 1: Update booking card container (around line 183)**

Find:
```tsx
<div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-sm">
```

Replace with:
```tsx
<div className="rounded-[14px] border border-[#dddddd] bg-white p-6 space-y-5 shadow-tier">
```

`shadow-tier` is the 3-layer Airbnb shadow defined in `globals.css` lines 160–165. Using it permanently (not on hover) because this is a CTA panel that should stand out.

- [ ] **Step 2: Update internal booking card divider (around line 191)**

Find (the `border-t` inside the booking card `<div>`):
```tsx
<div className="border-t border-border" />
```

Replace with:
```tsx
<div className="border-t border-[#dddddd]" />
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "app/(dashboard)/places/[id]/page.tsx"
git commit -m "style(place-detail): booking card rounded-[14px] shadow-tier border-[#dddddd] bg-white"
```

---

### Task 5: Skeleton + error state

Update skeleton slots and error state icon container to use `rounded-[14px]` and `bg-[#f2f2f2]`.

**Files:**
- Modify: `app/(dashboard)/places/[id]/page.tsx` (`Skeleton` component ~lines 31–47, error block ~lines 57–73)

- [ ] **Step 1: Replace the Skeleton component (lines 31–47)**

Find the entire function:
```tsx
function Skeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-pulse">
      <div className="h-4 w-20 bg-muted rounded-md" />
      <div className="h-72 rounded-2xl bg-muted" />
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-4">
          <div className="h-7 w-2/3 bg-muted rounded-md" />
          <div className="h-4 w-full bg-muted rounded-md" />
          <div className="h-4 w-4/5 bg-muted rounded-md" />
          <div className="h-4 w-1/2 bg-muted rounded-md" />
        </div>
        <div className="h-56 bg-muted rounded-2xl" />
      </div>
    </div>
  );
}
```

Replace with:
```tsx
function Skeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-pulse">
      <div className="h-4 w-20 bg-[#f2f2f2] rounded-md" />
      <div className="h-72 rounded-[14px] bg-[#f2f2f2]" />
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-4">
          <div className="h-7 w-2/3 bg-[#f2f2f2] rounded-md" />
          <div className="h-4 w-full bg-[#f2f2f2] rounded-md" />
          <div className="h-4 w-4/5 bg-[#f2f2f2] rounded-md" />
          <div className="h-4 w-1/2 bg-[#f2f2f2] rounded-md" />
        </div>
        <div className="h-56 bg-[#f2f2f2] rounded-[14px]" />
      </div>
    </div>
  );
}
```

`bg-[#f2f2f2]` is the `--surface-strong` Airbnb token (lighter than `bg-muted` which maps to `#f7f7f7`). Using the slightly darker shade for skeleton makes the pulse more visible.

- [ ] **Step 2: Update error state icon container (around line 59)**

Find:
```tsx
<div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
  <Building2 className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
</div>
```

Replace with:
```tsx
<div className="w-14 h-14 rounded-[14px] bg-[#f2f2f2] flex items-center justify-center">
  <Building2 className="w-6 h-6 text-[#6a6a6a]" strokeWidth={1.5} />
</div>
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Final visual check**

```bash
npm run dev
```

Navigate to `/places/1` (or any valid id). Check:
- Hero: landscape picsum photo, `rounded-[14px]`, name + badge overlay on dark scrim
- Type chip: neutral pill (`bg-[#f7f7f7]` border `#dddddd`)
- Info tiles: `rounded-[8px] bg-[#f2f2f2]` icon containers, `text-[#6a6a6a]` icons
- Booking card: `rounded-[14px]`, 3-layer shadow, `border-[#dddddd]`
- Navigate to a non-existent id (e.g. `/places/99999`): error icon container `rounded-[14px] bg-[#f2f2f2]`
- Hard-refresh to see skeleton: all slots `bg-[#f2f2f2] rounded-[14px]`

- [ ] **Step 5: Commit**

```bash
git add "app/(dashboard)/places/[id]/page.tsx"
git commit -m "style(place-detail): skeleton + error state bg-[#f2f2f2] rounded-[14px]"
```
