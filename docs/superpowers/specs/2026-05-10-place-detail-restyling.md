# Restyling — Page détail d'un espace (`places/[id]`)

**Date :** 2026-05-10
**Scope :** Refonte visuelle uniquement — aucune modification de comportement ni de structure de données
**Objectif :** Aligner `app/(dashboard)/places/[id]/page.tsx` sur le design system Airbnb du projet (tokens `globals.css`, patterns de `PlaceCard.tsx`)

---

## 1. Périmètre

Fichier unique : `app/(dashboard)/places/[id]/page.tsx`

Fonctionnalités conservées à l'identique :
- Chargement avec skeleton
- Affichage de l'état d'erreur / espace introuvable
- Hero avec nom et badge statut
- Grille body (infos gauche + booking card droite)
- Chip de type + chips de capacité
- Tiles d'information (adresse, tarif, propriétaire)
- Bouton de réservation (activé uniquement si APPROVED)

---

## 2. TYPE_CONFIG

| Champ    | Avant                                      | Après             |
|----------|--------------------------------------------|-------------------|
| `gradient` | `"from-teal-500 to-teal-700"` (et variantes par type) | Supprimé        |
| `label`  | inchangé                                   | inchangé          |
| `Icon`   | inchangé                                   | inchangé          |

---

## 3. STATUS_CONFIG

| Statut   | Avant                                                | Après                                              |
|----------|------------------------------------------------------|----------------------------------------------------|
| APPROVED | `bg-emerald-50 text-emerald-700 border-emerald-200`  | `bg-[#f7f7f7] text-[#222222] border border-[#dddddd]` |
| PENDING  | `bg-amber-50 text-amber-700 border-amber-200`        | `bg-amber-500 text-white border-transparent`        |
| REJECTED | `bg-red-50 text-red-700 border-red-200`              | `bg-[#c13515] text-white border-transparent`        |

Forme inchangée : `rounded-full` pill + `text-xs font-semibold px-3 py-1.5`

---

## 4. Hero — Approach A (photo-first)

| Propriété     | Avant                                                            | Après                                         |
|---------------|------------------------------------------------------------------|-----------------------------------------------|
| Fond          | `bg-gradient-to-br {type.gradient}` + dot pattern + icône       | `<Image>` picsum (next/image), `object-cover` |
| Seed          | —                                                                | `buildImageSeed(place.type, place.id)`        |
| URL image     | —                                                                | `https://picsum.photos/seed/${seed}/1600/600` |
| Radius        | `rounded-2xl`                                                    | `rounded-[14px]`                              |
| Hauteur       | `h-72`                                                           | `h-72` (inchangé)                             |
| Scrim bas     | `from-black/65 to-transparent` + nom + badge                     | Identique (conservé)                          |

### Fonction seed (à ajouter dans le fichier, pas d'extraction)
```ts
function buildImageSeed(type: string, id: string | number): string {
  return `${type.toLowerCase().replace(/_/g, "-")}-${id}`;
}
```

Exemples de seeds : `meeting-room-42`, `coworking-space-7`, `party-room-15`.

---

## 5. Type chip

| Propriété | Avant                                         | Après                                                                              |
|-----------|-----------------------------------------------|------------------------------------------------------------------------------------|
| Classes   | `text-sm font-medium px-3 py-1 rounded-lg bg-primary/8 text-primary` | `rounded-full px-3 py-1 bg-[#f7f7f7] text-[#222222] border border-[#dddddd] text-[13px] font-medium` |

---

## 6. Info tiles

| Élément              | Avant                                   | Après                                    |
|----------------------|-----------------------------------------|------------------------------------------|
| Container icône      | `w-9 h-9 rounded-xl bg-muted`           | `w-10 h-10 rounded-[8px] bg-[#f2f2f2]`  |
| Icône                | `text-muted-foreground`                 | `text-[#6a6a6a]`                         |
| Séparateur           | `border-t border-border`                | `border-t border-[#dddddd]`              |
| Labels section       | `text-xs text-muted-foreground font-medium uppercase tracking-wide` | inchangé (tokens sémantiques acceptables ici) |

---

## 7. Booking card (colonne droite)

| Propriété    | Avant                                          | Après                                                     |
|--------------|------------------------------------------------|-----------------------------------------------------------|
| Container    | `rounded-2xl border border-border bg-card p-6 shadow-sm` | `rounded-[14px] border border-[#dddddd] bg-white p-6 shadow-tier` |
| Séparateur   | `border-t border-border`                       | `border-t border-[#dddddd]`                               |
| Badge statut | Classes emerald/amber/red                      | Voir STATUS_CONFIG ci-dessus                              |
| Bouton CTA   | `w-full h-11 font-semibold cursor-pointer`     | inchangé                                                  |

---

## 8. Skeleton de chargement

| Élément      | Avant                        | Après                           |
|--------------|------------------------------|---------------------------------|
| Hero slot    | `h-72 rounded-2xl bg-muted`  | `h-72 rounded-[14px] bg-[#f2f2f2]` |
| Booking slot | `h-56 bg-muted rounded-2xl`  | `h-56 bg-[#f2f2f2] rounded-[14px]` |
| Autres slots | `bg-muted rounded-md`        | `bg-[#f2f2f2] rounded-md`       |

---

## 9. État d'erreur / espace introuvable

| Élément         | Avant                                  | Après                           |
|-----------------|----------------------------------------|---------------------------------|
| Icon container  | `w-14 h-14 rounded-2xl bg-muted`       | `w-14 h-14 rounded-[14px] bg-[#f2f2f2]` |
| Icône           | `text-muted-foreground`                | `text-[#6a6a6a]`                |

---

## Contraintes

- Aucun ajout de dépendance (next/image est déjà disponible)
- Aucun changement de logique métier, hooks, appels API, layout grid
- Le fichier reste un seul composant page (pas d'extraction)
- Tout le restyling tient dans `app/(dashboard)/places/[id]/page.tsx`
- `buildImageSeed` est définie localement dans le fichier (pas de module partagé)
