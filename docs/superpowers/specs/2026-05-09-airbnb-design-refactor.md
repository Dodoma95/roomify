# Roomify — Refonte Design Airbnb

**Date :** 2026-05-09  
**Scope :** Refonte visuelle complète (tokens, composants, layouts, landing page)  
**Objectif :** Remplacer la palette teal par le système design Airbnb, restructurer les composants clés selon les patterns Airbnb (photo-first cards, pill search bar, navbar avec onglets rôle-based), et produire une landing page moderne avec effets scroll Framer Motion.

---

## 1. Tokens & Fondations (`globals.css` + `layout.tsx`)

### Palette
Remplacement complet de la palette teal par les tokens Airbnb :

| Token CSS                  | Light          | Dark (dérivé)  | Usage                                      |
|----------------------------|----------------|----------------|--------------------------------------------|
| `--color-canvas`           | `#ffffff`      | `#1a1a1a`      | Fond de page par défaut                    |
| `--color-ink`              | `#222222`      | `#f0f0f0`      | Headlines, body principal                  |
| `--color-body`             | `#3f3f3f`      | `#cccccc`      | Texte courant secondaire                   |
| `--color-muted`            | `#6a6a6a`      | `#888888`      | Sous-titres, labels inactifs               |
| `--color-muted-soft`       | `#929292`      | `#666666`      | Liens désactivés                           |
| `--color-primary`          | `#ff385c`      | `#ff385c`      | Rausch — CTA, orb, cœur, liens brand      |
| `--color-primary-active`   | `#e00b41`      | `#e00b41`      | Press state sur CTA Rausch                 |
| `--color-primary-disabled` | `#ffd1da`      | `#4d1020`      | CTA désactivé                              |
| `--color-on-primary`       | `#ffffff`      | `#ffffff`      | Texte blanc sur fond Rausch                |
| `--color-surface-soft`     | `#f7f7f7`      | `#2a2a2a`      | Hover backgrounds, filter band             |
| `--color-surface-strong`   | `#f2f2f2`      | `#333333`      | Icon-button surfaces                       |
| `--color-hairline`         | `#dddddd`      | `#3a3a3a`      | Bordures 1px, séparateurs                  |
| `--color-hairline-soft`    | `#ebebeb`      | `#2e2e2e`      | Séparateurs éditoriaux                     |
| `--color-border-strong`    | `#c1c1c1`      | `#555555`      | Outline buttons, focus inputs              |
| `--color-error`            | `#c13515`      | `#ff6b4a`      | Texte d'erreur formulaire                  |
| `--color-scrim`            | `#000000`      | `#000000`      | Backdrop modal (50% opacity au rendu)      |

### Typographie
- **Police :** Inter via `next/font/google` (substitut open-source de Airbnb Cereal VF)
- **Fallbacks :** `Circular, -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif`
- **Ajustement :** line-height des display heads réduit de ~2% par rapport aux défauts Inter pour coller aux proportions Cereal

| Token                   | Size  | Weight | Line Height | Lettre Spacing | Usage                              |
|-------------------------|-------|--------|-------------|----------------|------------------------------------|
| `display-xl`            | 28px  | 700    | 1.43        | 0              | H1 homepage                        |
| `display-lg`            | 22px  | 500    | 1.18        | -0.44px        | H1 listing detail                  |
| `display-md`            | 21px  | 700    | 1.43        | 0              | Section heads                      |
| `display-sm`            | 20px  | 600    | 1.20        | -0.18px        | Sous-sections                      |
| `title-md`              | 16px  | 600    | 1.25        | 0              | Titres de cards                    |
| `title-sm`              | 16px  | 500    | 1.25        | 0              | Footer column heads                |
| `body-md`               | 16px  | 400    | 1.5         | 0              | Texte courant                      |
| `body-sm`               | 14px  | 400    | 1.43        | 0              | Meta cards, dates, prix            |
| `caption`               | 14px  | 500    | 1.29        | 0              | Labels segments search bar         |
| `caption-sm`            | 13px  | 400    | 1.23        | 0              | Legal footer                       |
| `badge`                 | 11px  | 600    | 1.18        | 0              | Badges flottants                   |
| `button-md`             | 16px  | 500    | 1.25        | 0              | Labels CTA primaires               |
| `button-sm`             | 14px  | 500    | 1.29        | 0              | Labels pill buttons                |
| `rating-display`        | 64px  | 700    | 1.1         | -1px           | Compteurs stats landing page       |

### Spacing
Base 4px : `2 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64px` (section padding = 64px)

### Radius
- `sm` → 8px (buttons)
- `md` → 14px (cards, dropdowns)
- `full` → 9999px (pills, orb, avatars)

### Elevation
Un seul tier de shadow (hover cards, search bar, dropdowns) :
```
box-shadow: rgba(0,0,0,0.02) 0 0 0 1px,
            rgba(0,0,0,0.04) 0 2px 6px 0,
            rgba(0,0,0,0.1)  0 4px 8px 0
```

### Dark mode
Conservé via `.dark` class. Tokens dérivés dans le même esprit Airbnb (fond `#1a1a1a`, Rausch inchangé, surfaces graduées).

---

## 2. Navbar (`components/layout/Navbar.tsx`)

**Structure :**
- Hauteur **80px**, fond canvas, `1px` hairline bottom, `sticky top-0 z-50`
- **Logo** flush left : `Roomify` en Rausch (`#ff385c`), `font-weight 600`, `font-size 22px`
- **Onglets centrés** (rôle-based, même logique qu'aujourd'hui) :
  - Label `16px/600`, underline `2px` Rausch sur actif, label muted sur inactifs
  - Onglets masqués selon le rôle (USER/OWNER/ADMIN/SUPER_ADMIN) — comportement inchangé
- **Droite :** nom utilisateur + icône globe + "Account pill" (`border hairline`, `rounded-full`, padding `8×16px`) contenant avatar initial + chevron → dropdown avec Déconnexion
- **Mobile `< 744px`** : logo + hamburger, sheet latéral avec les onglets rôle-based

**Fichiers touchés :** `components/layout/Navbar.tsx`

---

## 3. PlaceCard (`components/places/PlaceCard.tsx`)

**Structure photo-first :**
- Aspect ratio **1:1**, `rounded-md` (14px), overflow hidden
- **Image :** `https://picsum.photos/seed/{type}-{id}/800/800` — seed déterministe garantit même image par espace. `next/image` avec `fill` + `object-cover`.
- **Badge type** top-left : pill blanc `rounded-full`, shadow tier, label `11px/600` (ex: "Salle de réunion")
- **Cœur** top-right : `32×32px` circle button, outline par défaut, Rausch filled si sauvegardé
- **Status badge** (PENDING/REJECTED uniquement) : pill semi-transparent centré top, `badge` token
- **Bloc meta** sous l'image :
  - Nom : `title-md` (16px/600), `line-clamp-1`
  - Adresse : `body-sm` muted, `MapPin` icon, `line-clamp-1`
  - Prix right-aligned : `body-sm`, `font-weight 600`, `X €/h`
- **Hover :** shadow tier élevé, pas de transform

**Fichiers touchés :** `components/places/PlaceCard.tsx`

---

## 4. Search Bar Pill (`components/places/PlaceFilters.tsx` → refactorisé)

**Structure :**
- Fond canvas, `rounded-full`, `height 64px`, `1px hairline border` + shadow tier au repos
- **Segment Où :** input texte libre (nom/adresse), label `caption` uppercase au-dessus, placeholder muted
- **Séparateur :** `1px` hairline vertical
- **Segment Type :** select natif ou custom dropdown, 5 types + "Tous"
- **Orb Rausch :** `48×48px` circle, fond Rausch, icône loupe blanche centrée — déclenche la recherche
- **Filtres avancés** (capacité, prix min/max) : dropdown sous la pill, fond canvas, shadow tier
- **Mobile :** pill collapsée en un seul champ → overlay plein écran

**Fichiers touchés :** `components/places/PlaceFilters.tsx` (renommage interne en `SearchBar`)

---

## 5. Pages Auth (`app/(auth)/login` · `app/(auth)/register`)

- Fond `surface-soft` (`#f7f7f7`)
- Card blanche centrée, `rounded-md`, shadow tier, `padding 48px`
- Logo Rausch centré en haut de la card
- Inputs style Airbnb : `56px` height, `1px hairline` border → `2px ink` au focus, label stacked au-dessus
- CTA primaire Rausch full-width, `48px` height
- Lien secondaire (ghost) sous le CTA
- Pas de dark background sur ces pages — fond soft constant

**Fichiers touchés :** `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`, `components/auth/LoginForm.tsx`, `components/auth/RegisterForm.tsx`

---

## 6. Landing Page (`app/page.tsx`) — avec effets scroll Framer Motion

**Dépendance :** `framer-motion` (à installer)

### Nav publique
Navbar simplifiée : logo Rausch left, "Se connecter" ghost + "Créer un compte" pill Rausch right. Pas d'onglets centrés (utilisateur non connecté).

### Hero
- Fond canvas blanc, max-width `1280px` centré
- **Word reveal** : h1 `28px/700` ("Trouvez l'espace idéal pour votre équipe") — chaque mot apparaît avec un décalage de `80ms` via `motion.span`
- **Slide up spring** : pill search bar apparaît après le titre avec `y: 20 → 0, opacity: 0 → 1`
- **Mosaïque photo** : 3 photos Picsum (seeds fixes) disposées en collage top-right, `rounded-md`, **parallax** au scroll via `useScroll` + `useTransform` (`y: 0 → -60px`)

### Stats Band
- 3 colonnes : `200+` espaces · `98%` satisfaction · `50+` villes
- Chiffres en `rating-display` (64px/700) — même token que le rating Airbnb
- **Compteurs animés** : `useSpring` + `useInView` — incrémentent de 0 à la valeur cible quand la section entre dans le viewport (`once: true`)

### Category Strip
- 5 pills de types d'espaces (icône + label), scroll horizontal sur mobile
- **Stagger cascade** : chaque pill `fade + translateY(20px → 0)` avec délai `index × 80ms` via `motion.div` + `whileInView`
- Clic → filtre la grille de places

### Featured Places Grid
- 4 PlaceCards APPROVED en preview
- **Stagger fade + slide-up** : `whileInView`, `initial: { opacity: 0, y: 32 }`, délai `index × 100ms`
- CTA "Voir tous les espaces" pill Rausch centré sous la grille

### Trust Band
- 3 colonnes (Espaces vérifiés / Réservation instantanée / Propriétaires de confiance)
- Icônes Rausch en **SVG stroke animation** (`pathLength: 0 → 1`) déclenchée par `whileInView`
- Texte en fade après l'icône

### CTA Host Band
- Fond `surface-soft` (`#f7f7f7`)
- Layout split 2 colonnes
- **Texte** (left) : slide depuis `x: -40 → 0` au scroll
- **Image** (right, Picsum seed "workspace-coworking") : `scale: 0.95 → 1.0` au scroll, `rounded-md`
- Pill CTA Rausch "Proposer mon espace → /register"

### Footer
- 3 colonnes lien : Support / Roomify / Légal
- `font: title-sm` pour les heads, `body-sm` pour les liens
- Legal band : copyright + langue + liens légaux en `muted`

**Fichiers touchés :** `app/page.tsx` (splitté en sous-composants si > 200 lignes)

---

## 7. Shadcn/ui — Overrides tokens

Les composants shadcn (`Button`, `Input`, `Badge`, etc.) seront remappés via les nouvelles variables CSS pour hériter automatiquement du design Airbnb sans les réécrire.

---

## Périmètre exclu de cette itération
- Pages dashboard internes (admin, owner, profile) : restent fonctionnelles mais ne reçoivent pas la refonte complète
- Listing detail (`/places/[id]`) : refonte visuelle partielle (photo hero, reservation card) dans une itération suivante
- Vrai upload d'images : géré côté API dans une itération suivante
- Map view (Mapbox)

---

## Ordre d'implémentation recommandé
1. Tokens + font (`globals.css`, `layout.tsx`)
2. Shadcn overrides (Button, Input, Badge)
3. Navbar
4. PlaceCard
5. SearchBar pill
6. Pages auth
7. Landing page (Framer Motion en dernier — dépend des composants précédents)
