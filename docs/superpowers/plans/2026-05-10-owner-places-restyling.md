# Owner Places Restyling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aligner visuellement `app/(dashboard)/owner/places/page.tsx` sur le design system Airbnb du projet sans toucher à la logique métier.

**Architecture:** Refonte purement cosmétique d'un seul fichier. Remplacement des classes Tailwind hardcodées (gradients teal, couleurs emerald/sky/amber génériques, rounded-2xl) par les tokens Airbnb définis dans `globals.css` (surface-soft, surface-strong, hairline, ink, rausch). Aucune extraction de composant.

**Tech Stack:** Next.js 15, Tailwind CSS v4, shadcn/ui, Lucide icons

> **Note TDD :** Ce plan ne contient pas de tests unitaires — les changements sont purement CSS/classes Tailwind sur un composant UI existant. La vérification se fait visuellement via le dev server (`npm run dev`).

---

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `app/(dashboard)/owner/places/page.tsx` | Modify — tous les changements de style |

---

## Task 1 : Supprimer le gradient des icônes de type + simplifier TYPE_CONFIG

**Files:**
- Modify: `app/(dashboard)/owner/places/page.tsx` (lignes 20-26)

- [ ] **Step 1 : Remplacer TYPE_CONFIG**

Remplacer le bloc actuel :
```tsx
const TYPE_CONFIG: Record<PlaceType, { label: string; gradient: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
  MEETING_ROOM:    { label: "Salle de réunion", gradient: "from-teal-500 to-teal-700",     Icon: Building2 },
  COWORKING_SPACE: { label: "Coworking",         gradient: "from-sky-500 to-sky-700",       Icon: Laptop },
  EVENT_SPACE:     { label: "Événementiel",      gradient: "from-violet-500 to-violet-700", Icon: PartyPopper },
  PARTY_ROOM:      { label: "Salle de fête",     gradient: "from-rose-500 to-rose-700",     Icon: Music2 },
  STUDIO:          { label: "Studio",            gradient: "from-amber-500 to-amber-700",   Icon: Camera },
};
```

Par :
```tsx
const TYPE_CONFIG: Record<PlaceType, { label: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
  MEETING_ROOM:    { label: "Salle de réunion", Icon: Building2 },
  COWORKING_SPACE: { label: "Coworking",        Icon: Laptop },
  EVENT_SPACE:     { label: "Événementiel",     Icon: PartyPopper },
  PARTY_ROOM:      { label: "Salle de fête",    Icon: Music2 },
  STUDIO:          { label: "Studio",           Icon: Camera },
};
```

- [ ] **Step 2 : Mettre à jour le rendu de l'icône dans la card**

Trouver ce bloc (vers la ligne 448) :
```tsx
<div className={cn(
  "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br",
  typeCfg.gradient
)}>
  <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
</div>
```

Remplacer par :
```tsx
<div className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 bg-[#f2f2f2]">
  <Icon className="w-5 h-5 text-[#3f3f3f]" strokeWidth={1.5} />
</div>
```

- [ ] **Step 3 : Vérifier que `typeCfg.gradient` n'est plus référencé nulle part**

```bash
grep -n "gradient" app/\(dashboard\)/owner/places/page.tsx
```
Résultat attendu : aucune occurrence.

- [ ] **Step 4 : Commit**

```bash
git add app/\(dashboard\)/owner/places/page.tsx
git commit -m "style(owner/places): icônes type → fond plat surface-strong, supprimer gradients"
```

---

## Task 2 : Mettre à jour les badges de statut des espaces

**Files:**
- Modify: `app/(dashboard)/owner/places/page.tsx` (lignes 28-32 + rendu du badge)

- [ ] **Step 1 : Remplacer STATUS_BADGE**

Remplacer :
```tsx
const STATUS_BADGE: Record<PlaceStatus, { label: string; className: string }> = {
  APPROVED: { label: "Approuvé",   className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  PENDING:  { label: "En attente", className: "bg-amber-100 text-amber-800 border-amber-200" },
  REJECTED: { label: "Refusé",     className: "bg-red-100 text-red-800 border-red-200" },
};
```

Par :
```tsx
const STATUS_BADGE: Record<PlaceStatus, { label: string; className: string }> = {
  APPROVED: { label: "Approuvé",   className: "bg-[#f7f7f7] text-[#222222] border-[#dddddd]" },
  PENDING:  { label: "En attente", className: "bg-amber-500 text-white border-transparent" },
  REJECTED: { label: "Refusé",     className: "bg-[#c13515] text-white border-transparent" },
};
```

- [ ] **Step 2 : Mettre à jour le rendu du badge dans la card**

Trouver (vers la ligne 459) :
```tsx
<span className={cn(
  "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
  statusCfg.className
)}>
  {statusCfg.label}
</span>
```

Remplacer par :
```tsx
<span className={cn(
  "text-[11px] font-semibold px-2.5 py-0.5 rounded-full border",
  statusCfg.className
)}>
  {statusCfg.label}
</span>
```

- [ ] **Step 3 : Commit**

```bash
git add app/\(dashboard\)/owner/places/page.tsx
git commit -m "style(owner/places): badges statut espace → tokens Airbnb"
```

---

## Task 3 : Typographie des cards

**Files:**
- Modify: `app/(dashboard)/owner/places/page.tsx` (section Info de la card, vers lignes 456-474)

- [ ] **Step 1 : Mettre à jour le nom de l'espace**

Trouver :
```tsx
<p className="font-semibold text-foreground leading-snug">{place.name}</p>
```

Remplacer par :
```tsx
<p className="text-[16px] font-semibold text-[#222222] leading-snug">{place.name}</p>
```

- [ ] **Step 2 : Mettre à jour le meta type/prix/capacité**

Trouver :
```tsx
<p className="text-xs text-muted-foreground mt-0.5">
  {typeCfg.label}
  {place.pricePerHour != null && ` · ${place.pricePerHour} €/h`}
  {place.capacity != null && ` · ${place.capacity} pers.`}
</p>
```

Remplacer par :
```tsx
<p className="text-[14px] text-[#6a6a6a] mt-0.5">
  {typeCfg.label}
  {place.pricePerHour != null && ` · ${place.pricePerHour} €/h`}
  {place.capacity != null && ` · ${place.capacity} pers.`}
</p>
```

- [ ] **Step 3 : Mettre à jour l'adresse**

Trouver :
```tsx
<p className="text-xs text-muted-foreground mt-0.5 truncate">{place.address}</p>
```

Remplacer par :
```tsx
<p className="text-[14px] text-[#6a6a6a] mt-0.5 truncate">{place.address}</p>
```

- [ ] **Step 4 : Commit**

```bash
git add app/\(dashboard\)/owner/places/page.tsx
git commit -m "style(owner/places): typographie cards → scale Airbnb 16px/14px"
```

---

## Task 4 : Card container + skeletons + état vide

**Files:**
- Modify: `app/(dashboard)/owner/places/page.tsx` (card wrapper, skeletons, empty state)

- [ ] **Step 1 : Mettre à jour le conteneur de card**

Trouver :
```tsx
<div
  key={place.id}
  className="rounded-2xl border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-sm"
>
```

Remplacer par :
```tsx
<div
  key={place.id}
  className="rounded-[14px] bg-white p-5 transition-shadow duration-200 hover:shadow-tier"
>
```

- [ ] **Step 2 : Mettre à jour les skeletons de chargement**

Trouver :
```tsx
{[1, 2, 3].map((i) => (
  <div key={i} className="h-24 rounded-2xl border border-border bg-muted animate-pulse" />
))}
```

Remplacer par :
```tsx
{[1, 2, 3].map((i) => (
  <div key={i} className="h-[72px] rounded-[14px] bg-[#f2f2f2] animate-pulse" />
))}
```

- [ ] **Step 3 : Mettre à jour l'état vide**

Trouver :
```tsx
<div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center space-y-4">
  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
    <Building2 className="w-6 h-6 text-primary" strokeWidth={1.5} />
  </div>
```

Remplacer par :
```tsx
<div className="flex flex-col items-center justify-center rounded-[14px] bg-[#f7f7f7] py-16 text-center space-y-4">
  <div className="w-12 h-12 rounded-[14px] bg-[#f2f2f2] flex items-center justify-center">
    <Building2 className="w-6 h-6 text-[#6a6a6a]" strokeWidth={1.5} />
  </div>
```

- [ ] **Step 4 : Mettre à jour le CTA de l'état vide**

Trouver (dans l'état vide) :
```tsx
<Button size="sm" className="gap-1.5 cursor-pointer" render={<Link href="/places/new" />}>
```

Remplacer par :
```tsx
<Button size="sm" className="rounded-full gap-1.5 cursor-pointer" render={<Link href="/places/new" />}>
```

- [ ] **Step 5 : Mettre à jour le bouton "Ajouter" dans le header**

Trouver (dans le header, vers la ligne 396) :
```tsx
<Button
  size="sm"
  className="gap-1.5 cursor-pointer shrink-0"
  render={<Link href="/places/new" />}
>
```

Remplacer par :
```tsx
<Button
  size="sm"
  className="rounded-full gap-1.5 cursor-pointer shrink-0"
  render={<Link href="/places/new" />}
>
```

- [ ] **Step 6 : Commit**

```bash
git add app/\(dashboard\)/owner/places/page.tsx
git commit -m "style(owner/places): card container shadow-tier, skeletons, empty state → tokens Airbnb"
```

---

## Task 5 : Boutons d'action (toggles, modifier, supprimer)

**Files:**
- Modify: `app/(dashboard)/owner/places/page.tsx` (section Actions de la card, vers lignes 477-541)

- [ ] **Step 1 : Mettre à jour le toggle Réservations**

Trouver :
```tsx
<button
  type="button"
  onClick={() => togglePanel(placeId, "bookings")}
  className={cn(
    "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer",
    bookingsExpanded
      ? "bg-primary/10 text-primary border-primary/20"
      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
  )}
>
```

Remplacer par :
```tsx
<button
  type="button"
  onClick={() => togglePanel(placeId, "bookings")}
  className={cn(
    "flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer",
    bookingsExpanded
      ? "bg-[#ff385c]/5 text-[#ff385c] border-[#ff385c]"
      : "border-[#dddddd] text-[#6a6a6a] hover:border-[#222222] hover:text-[#222222]"
  )}
>
```

- [ ] **Step 2 : Mettre à jour le toggle Indisponibilités**

Trouver :
```tsx
<button
  type="button"
  onClick={() => togglePanel(placeId, "unavailability")}
  className={cn(
    "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer",
    unavailExpanded
      ? "bg-primary/10 text-primary border-primary/20"
      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
  )}
>
```

Remplacer par :
```tsx
<button
  type="button"
  onClick={() => togglePanel(placeId, "unavailability")}
  className={cn(
    "flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer",
    unavailExpanded
      ? "bg-[#ff385c]/5 text-[#ff385c] border-[#ff385c]"
      : "border-[#dddddd] text-[#6a6a6a] hover:border-[#222222] hover:text-[#222222]"
  )}
>
```

- [ ] **Step 3 : Mettre à jour le bouton Modifier**

Trouver :
```tsx
<Button
  size="sm"
  variant="outline"
  className="text-xs gap-1 cursor-pointer"
  render={<Link href={`/owner/places/${placeId}/edit`} />}
>
```

Remplacer par :
```tsx
<Button
  size="sm"
  variant="outline"
  className="rounded-full text-[13px] gap-1 cursor-pointer border-[#dddddd] text-[#222222] hover:border-[#222222]"
  render={<Link href={`/owner/places/${placeId}/edit`} />}
>
```

- [ ] **Step 4 : Mettre à jour le bouton Supprimer**

Trouver :
```tsx
<Button
  size="sm"
  variant={isConfirm ? "destructive" : "outline"}
  className={cn("text-xs gap-1 cursor-pointer", !isConfirm && "text-destructive hover:text-destructive")}
  disabled={deletingId === placeId}
  onClick={() => handleDelete(placeId)}
>
  <Trash2 className="w-3.5 h-3.5" />
  {isConfirm ? "Confirmer" : "Supprimer"}
</Button>
{isConfirm && (
  <button
    type="button"
    className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
    onClick={() => setConfirmId(null)}
  >
    Annuler
  </button>
)}
```

Remplacer par :
```tsx
<Button
  size="sm"
  variant={isConfirm ? "destructive" : "ghost"}
  className={cn(
    "rounded-full text-[13px] gap-1 cursor-pointer",
    isConfirm
      ? "font-semibold"
      : "text-[#6a6a6a] hover:text-[#c13515] hover:bg-transparent"
  )}
  disabled={deletingId === placeId}
  onClick={() => handleDelete(placeId)}
>
  <Trash2 className="w-3.5 h-3.5" />
  {isConfirm ? "Confirmer" : "Supprimer"}
</Button>
{isConfirm && (
  <button
    type="button"
    className="text-[13px] text-[#6a6a6a] hover:text-[#222222] cursor-pointer"
    onClick={() => setConfirmId(null)}
  >
    Annuler
  </button>
)}
```

- [ ] **Step 5 : Commit**

```bash
git add app/\(dashboard\)/owner/places/page.tsx
git commit -m "style(owner/places): boutons d'action → pills Airbnb, hover Rausch"
```

---

## Task 6 : Panneau Indisponibilités (UnavailabilityPanel)

**Files:**
- Modify: `app/(dashboard)/owner/places/page.tsx` (composant UnavailabilityPanel, lignes 63-208)

- [ ] **Step 1 : Mettre à jour le séparateur et les labels de section**

Trouver dans `UnavailabilityPanel` :
```tsx
<div className="border-t border-border mt-4 pt-4 space-y-4">
```
Remplacer par :
```tsx
<div className="border-t border-[#dddddd] mt-4 pt-4 space-y-4">
```

Trouver les deux occurrences de :
```tsx
<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
```
Remplacer les deux par :
```tsx
<p className="text-[12px] font-semibold uppercase tracking-wide text-[#6a6a6a]">
```

- [ ] **Step 2 : Mettre à jour les lignes de période bloquée**

Trouver :
```tsx
className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2"
```
Remplacer par :
```tsx
className="flex items-center justify-between rounded-[8px] bg-[#f7f7f7] px-3 py-2"
```

- [ ] **Step 3 : Mettre à jour le badge raison (Manuel / Réservation)**

Trouver :
```tsx
<span className={cn(
  "ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border",
  p.reason === "OWNER_BLOCKED"
    ? "bg-primary/10 text-primary border-primary/20"
    : "bg-sky-50 text-sky-700 border-sky-200"
)}>
```
Remplacer par :
```tsx
<span className={cn(
  "ml-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-full border",
  p.reason === "OWNER_BLOCKED"
    ? "bg-[#f2f2f2] text-[#3f3f3f] border-[#dddddd]"
    : "bg-[#f7f7f7] text-[#6a6a6a] border-[#dddddd]"
)}>
```

- [ ] **Step 4 : Mettre à jour le bouton Bloquer**

Trouver dans le formulaire :
```tsx
<Button
  type="submit"
  size="sm"
  disabled={!from || !to || blocking}
  className="h-9 gap-1.5 cursor-pointer shrink-0"
>
```
Remplacer par :
```tsx
<Button
  type="submit"
  size="sm"
  disabled={!from || !to || blocking}
  className="h-9 rounded-full gap-1.5 cursor-pointer shrink-0"
>
```

- [ ] **Step 5 : Commit**

```bash
git add app/\(dashboard\)/owner/places/page.tsx
git commit -m "style(owner/places): panneau indisponibilités → tokens Airbnb"
```

---

## Task 7 : Panneau Réservations (BookingsPanel)

**Files:**
- Modify: `app/(dashboard)/owner/places/page.tsx` (composant BookingsPanel, lignes 212-343)

- [ ] **Step 1 : Mettre à jour BOOKING_STATUS_CONFIG**

Remplacer :
```tsx
const BOOKING_STATUS_CONFIG: Record<BookingStatus, { label: string; className: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
  PENDING:   { label: "En attente",  className: "bg-amber-50 text-amber-700 border-amber-200",   Icon: Clock },
  CONFIRMED: { label: "Confirmée",   className: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircle2 },
  CANCELLED: { label: "Annulée",     className: "bg-red-50 text-red-600 border-red-200",          Icon: XCircle },
  COMPLETED: { label: "Terminée",    className: "bg-sky-50 text-sky-700 border-sky-200",           Icon: CheckCircle2 },
};
```

Par :
```tsx
const BOOKING_STATUS_CONFIG: Record<BookingStatus, { label: string; className: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
  PENDING:   { label: "En attente", className: "bg-amber-500 text-white border-transparent",            Icon: Clock },
  CONFIRMED: { label: "Confirmée",  className: "bg-[#f7f7f7] text-[#222222] border-[#dddddd]",         Icon: CheckCircle2 },
  CANCELLED: { label: "Annulée",    className: "bg-[#c13515] text-white border-transparent",            Icon: XCircle },
  COMPLETED: { label: "Terminée",   className: "bg-[#f7f7f7] text-[#6a6a6a] border-[#dddddd]",        Icon: CheckCircle2 },
};
```

- [ ] **Step 2 : Mettre à jour le séparateur et le label de section**

Trouver dans `BookingsPanel` :
```tsx
<div className="border-t border-border mt-4 pt-4 space-y-3">
  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
```
Remplacer par :
```tsx
<div className="border-t border-[#dddddd] mt-4 pt-4 space-y-3">
  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6a6a6a]">
```

- [ ] **Step 3 : Mettre à jour les cards de réservation**

Trouver :
```tsx
className="rounded-xl border border-border bg-muted/20 px-4 py-3 space-y-2"
```
Remplacer par :
```tsx
className="rounded-[14px] bg-[#f7f7f7] px-4 py-3 space-y-2"
```

- [ ] **Step 4 : Mettre à jour le badge de statut de réservation**

Trouver :
```tsx
<span className={cn(
  "flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
  cfg.className
)}>
```
Remplacer par :
```tsx
<span className={cn(
  "flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border",
  cfg.className
)}>
```

- [ ] **Step 5 : Mettre à jour le timestamp de réservation**

Trouver :
```tsx
<p className="text-[10px] text-muted-foreground">
  Créée le {fmtDateTime(b.createdAt)}
</p>
```
Remplacer par :
```tsx
<p className="text-[12px] text-[#6a6a6a]">
  Créée le {fmtDateTime(b.createdAt)}
</p>
```

- [ ] **Step 6 : Mettre à jour les boutons Confirmer/Annuler dans les cards**

Trouver (boutons PENDING) :
```tsx
<Button
  size="sm"
  className="h-7 text-xs gap-1 cursor-pointer"
  disabled={busy}
  onClick={() => handleAction(b.id, "confirm")}
>
  <CheckCircle2 className="w-3.5 h-3.5" />
  Confirmer
</Button>
<Button
  size="sm"
  variant="outline"
  className="h-7 text-xs gap-1 cursor-pointer text-destructive hover:text-destructive"
  disabled={busy}
  onClick={() => handleAction(b.id, "cancel")}
>
  <XCircle className="w-3.5 h-3.5" />
  Refuser
</Button>
```
Remplacer par :
```tsx
<Button
  size="sm"
  className="h-7 rounded-full text-[13px] gap-1 cursor-pointer"
  disabled={busy}
  onClick={() => handleAction(b.id, "confirm")}
>
  <CheckCircle2 className="w-3.5 h-3.5" />
  Confirmer
</Button>
<Button
  size="sm"
  variant="outline"
  className="h-7 rounded-full text-[13px] gap-1 cursor-pointer border-[#dddddd] text-[#c13515] hover:text-[#c13515] hover:border-[#c13515]"
  disabled={busy}
  onClick={() => handleAction(b.id, "cancel")}
>
  <XCircle className="w-3.5 h-3.5" />
  Refuser
</Button>
```

Trouver (bouton annuler CONFIRMED) :
```tsx
<Button
  size="sm"
  variant="outline"
  className="h-7 text-xs gap-1 cursor-pointer text-destructive hover:text-destructive"
  disabled={busy}
  onClick={() => handleAction(b.id, "cancel")}
>
  <XCircle className="w-3.5 h-3.5" />
  Annuler
</Button>
```
Remplacer par :
```tsx
<Button
  size="sm"
  variant="outline"
  className="h-7 rounded-full text-[13px] gap-1 cursor-pointer border-[#dddddd] text-[#c13515] hover:text-[#c13515] hover:border-[#c13515]"
  disabled={busy}
  onClick={() => handleAction(b.id, "cancel")}
>
  <XCircle className="w-3.5 h-3.5" />
  Annuler
</Button>
```

- [ ] **Step 7 : Commit**

```bash
git add app/\(dashboard\)/owner/places/page.tsx
git commit -m "style(owner/places): panneau réservations → tokens Airbnb, badges status"
```

---

## Task 8 : Vérification visuelle finale

- [ ] **Step 1 : Lancer le dev server**

```bash
npm run dev
```

- [ ] **Step 2 : Vérifier les états suivants dans le navigateur sur `/owner/places`**

  - [ ] Liste avec des espaces : icône type fond gris plat, badge statut cohérent, typographie 16px/14px
  - [ ] Hover sur une card : ombre `shadow-tier` visible (légère triple ombre Airbnb)
  - [ ] Toggle Réservations actif : pill border rouge + fond rosé
  - [ ] Toggle Indisponibilités actif : même état
  - [ ] Panneau indisponibilités ouvert : fond gris `#f7f7f7`, badges Manuel/Réservation discrets
  - [ ] Panneau réservations ouvert : cards `#f7f7f7`, badge PENDING amber, CONFIRMED discret, CANCELLED rouge
  - [ ] Bouton Supprimer → mode confirmation → clic Annuler
  - [ ] État vide (si applicable) : fond `#f7f7f7`, icône grise
  - [ ] Skeletons au chargement : fond `#f2f2f2`

- [ ] **Step 3 : Vérifier qu'aucune régression TypeScript**

```bash
npx tsc --noEmit
```
Résultat attendu : aucune erreur.

- [ ] **Step 4 : Commit final si ajustements mineurs**

```bash
git add app/\(dashboard\)/owner/places/page.tsx
git commit -m "style(owner/places): ajustements finaux après vérification visuelle"
```
