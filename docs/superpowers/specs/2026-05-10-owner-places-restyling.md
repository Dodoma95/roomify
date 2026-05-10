# Restyling — Page "Mes espaces" (owner/places)

**Date :** 2026-05-10
**Scope :** Refonte visuelle uniquement — aucune modification de comportement ni de structure de données
**Objectif :** Aligner la page `app/(dashboard)/owner/places/page.tsx` sur le design system Airbnb du projet (tokens `globals.css`, patterns de `PlaceCard.tsx`)

---

## 1. Périmètre

Fichier unique : `app/(dashboard)/owner/places/page.tsx`

Fonctionnalités conservées à l'identique :
- Liste des espaces avec panneaux dépliables (réservations, indisponibilités)
- Toggle d'un seul panneau à la fois par espace
- Blocage / suppression de périodes d'indisponibilité
- Confirmation / annulation de réservations
- Suppression d'espace avec double confirmation
- Skeletons de chargement
- État vide avec CTA

---

## 2. Cards d'espace

| Propriété     | Avant                                       | Après                                      |
|---------------|---------------------------------------------|--------------------------------------------|
| Border        | `border border-border` permanent            | Aucune border au repos                     |
| Ombre         | `hover:shadow-sm`                           | `hover:shadow-tier` (token Airbnb)         |
| Radius        | `rounded-2xl`                               | `rounded-[14px]`                           |
| Fond          | `bg-card`                                   | `bg-white` (canvas)                        |
| Padding       | `p-5`                                       | `p-5` (inchangé)                           |

---

## 3. Icônes de type

| Propriété | Avant                                            | Après                               |
|-----------|--------------------------------------------------|-------------------------------------|
| Fond      | `bg-gradient-to-br from-X-500 to-X-700` par type | `bg-[#f2f2f2]` (surface-strong)    |
| Icône     | `text-white`                                     | `text-[#3f3f3f]` (body-text)       |
| Radius    | `rounded-xl`                                     | `rounded-[8px]` (radius-sm)        |
| Taille    | `w-11 h-11`                                      | `w-10 h-10` (légèrement réduit)    |

---

## 4. Badges de statut

| Statut   | Avant                                              | Après                                           |
|----------|----------------------------------------------------|-------------------------------------------------|
| APPROVED | `bg-emerald-100 text-emerald-800 border-emerald-200` | `bg-[#f7f7f7] text-[#222222] border border-[#dddddd]` |
| PENDING  | `bg-amber-100 text-amber-800 border-amber-200`     | `bg-amber-500 text-white`                       |
| REJECTED | `bg-red-100 text-red-800 border-red-200`           | `bg-[#c13515] text-white`                       |

Forme : pill `rounded-full px-2.5 py-0.5 text-[11px] font-semibold`

---

## 5. Typographie

| Élément                       | Classe                                              |
|-------------------------------|-----------------------------------------------------|
| Nom de l'espace               | `text-[16px] font-semibold text-[#222222]`          |
| Type · Prix · Capacité        | `text-[14px] text-[#6a6a6a]`                        |
| Adresse                       | `text-[14px] text-[#6a6a6a] truncate`               |
| Labels section panneaux       | `text-[12px] font-semibold text-[#6a6a6a] uppercase tracking-wide` |

---

## 6. Boutons d'action

### Toggles (Réservations / Indisponibilités)
- Repos : `rounded-full px-3 py-1.5 text-[13px] font-medium border border-[#dddddd] text-[#6a6a6a] hover:border-[#222222] hover:text-[#222222]`
- Actif : `border-[#ff385c] text-[#ff385c] bg-[#ff385c]/5`
- Icône + label + chevron (inchangé)

### Modifier
- Bouton outline pill : `rounded-full px-3 py-1.5 text-[13px] border border-[#dddddd] text-[#222222] hover:border-[#222222]`

### Supprimer
- Repos : bouton texte `text-[13px] text-[#6a6a6a] hover:text-[#c13515]`
- Mode confirmation : `text-[13px] font-semibold text-[#c13515]`
- Lien "Annuler" : `text-[13px] text-[#6a6a6a] hover:text-[#222222]`

### Bouton "Ajouter" (header)
- Rausch pill : shadcn `Button` avec `className="rounded-full"` (via le `size="sm"` existant + override radius)

---

## 7. Panneaux dépliables

| Élément                   | Avant                                     | Après                              |
|---------------------------|-------------------------------------------|------------------------------------|
| Séparateur                | `border-t border-border`                  | `border-t border-[#dddddd]`        |
| Lignes de période         | `bg-muted/30 rounded-lg border border-border` | `bg-[#f7f7f7] rounded-[8px]`   |
| Cards de réservation      | `bg-muted/20 rounded-xl border border-border` | `bg-[#f7f7f7] rounded-[14px]`  |
| Badge statut réservation  | Classes emerald/amber/red/sky             | Voir tableau ci-dessous                         |

#### Badges statut réservation

| Statut    | Rendu                                                           |
|-----------|-----------------------------------------------------------------|
| PENDING   | `bg-amber-500 text-white`                                       |
| CONFIRMED | `bg-[#f7f7f7] text-[#222222] border border-[#dddddd]`          |
| CANCELLED | `bg-[#c13515] text-white`                                       |
| COMPLETED | `bg-[#f7f7f7] text-[#6a6a6a] border border-[#dddddd]`          |

---

## 8. État vide

| Élément         | Avant                              | Après                           |
|-----------------|------------------------------------|---------------------------------|
| Container outer | `rounded-2xl border border-border bg-card` | `rounded-[14px] bg-[#f7f7f7]` |
| Icon container  | `bg-primary/10 rounded-xl`         | `bg-[#f2f2f2] rounded-[14px]`  |
| Icône           | `text-primary`                     | `text-[#6a6a6a]`               |
| CTA             | `Button size="sm"`                 | `Button size="sm" className="rounded-full"` |

---

## 9. Skeletons de chargement

- `bg-[#f2f2f2] animate-pulse rounded-[14px]` (au lieu de `bg-muted`)
- Hauteur : `h-[72px]` pour coller à la nouvelle taille de card

---

## Contraintes

- Aucun ajout de dépendance
- Aucun changement de logique métier, hooks, appels API
- Le fichier reste un seul composant page (pas d'extraction)
- Tout le restyling tient dans `app/(dashboard)/owner/places/page.tsx`
