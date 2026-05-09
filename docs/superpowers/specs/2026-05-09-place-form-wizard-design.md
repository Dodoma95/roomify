# Roomify — Wizard PlaceForm & Fix CategoryStrip

**Date :** 2026-05-09
**Scope :** Refonte de la page "Ajouter / Modifier un espace" en wizard multi-étapes Airbnb + correctif sizing CategoryStrip

---

## 1. Contexte

`PlaceForm` est un formulaire une-page partagé entre :
- `app/(dashboard)/places/new/page.tsx` — création
- `app/(dashboard)/owner/places/[id]/edit/page.tsx` — édition

Les deux pages seront migrées vers un wizard multi-étapes (`PlaceFormWizard`) suivant le design system Airbnb décrit dans `DESIGN.md`.

---

## 2. Architecture

```
components/places/
  PlaceFormWizard.tsx       ← shell : step state, formData, submit, progress bar
  wizard/
    StepType.tsx            ← étape 1 : choix du type d'espace
    StepInfo.tsx            ← étape 2 : nom + description
    StepLocation.tsx        ← étape 3 : adresse + capacité + prix/heure
    StepRecap.tsx           ← étape 4 : récapitulatif + soumission
```

**Props de `PlaceFormWizard` :** identiques à l'ancien `PlaceForm` —
`defaultValues?: Partial<Place>`, `placeId?: string`, `backHref?: string`

`PlaceForm.tsx` est supprimé ; les deux pages consommatrices importent `PlaceFormWizard`.

---

## 3. État partagé

`PlaceFormWizard` maintient un state local :

```ts
const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
const [formData, setFormData] = useState<CreatePlaceInput>({
  type:         defaultValues?.type         ?? "MEETING_ROOM",
  name:         defaultValues?.name         ?? "",
  description:  defaultValues?.description  ?? "",
  address:      defaultValues?.address      ?? "",
  capacity:     defaultValues?.capacity     ?? 1,
  pricePerHour: defaultValues?.pricePerHour ?? 0,
});
```

Chaque sous-composant reçoit `formData`, `setFormData`, et des callbacks `onNext` / `onBack`.

---

## 4. Barre de progression

- Positionnée en haut du wizard, avant le contenu de l'étape courante
- Track horizontal : `1px #dddddd` pleine largeur
- Fill Rausch (`#ff385c`) progressant de 25 % (étape 1) à 100 % (étape 4) : `width: (step / 4) * 100%`
- 4 pastilles numérotées sur le track :
  - Complétée / active : cercle `24px`, fond Rausch, chiffre blanc
  - À venir : cercle `24px`, fond `#f7f7f7`, bordure `1px #dddddd`, chiffre `#929292`
- Libellés sous chaque pastille : "Type" · "Infos" · "Lieu & prix" · "Récap" en `12px/500 #929292`

---

## 5. Navigation inter-étapes

- **Précédent** : `button-secondary` (fond blanc, `1px ink outline`, `h-12`, `rounded-lg`) — absent à l'étape 1
- **Suivant** : `button-primary` (fond Rausch, texte blanc, `h-12`, `rounded-lg`) — libellé "Suivant" aux étapes 1–3, "Publier l'espace" à l'étape 4 (ou "Mettre à jour" en mode édition)
- Validation avant passage à l'étape suivante : champs requis non vides → message d'erreur inline `12px #c13515` sous le champ en défaut

---

## 6. Étape 1 — Type d'espace

**Composant :** `StepType.tsx`

Grille responsive `grid-cols-2 sm:grid-cols-3 md:grid-cols-5`, gap `12px`.

Chaque carte :
- Fond blanc, bordure `1px #dddddd`, `rounded-xl`, padding `20px`, centré
- Icône dans un cercle `48×48px`, fond `#f7f7f7`
- Label `14px/500 #222222` sous l'icône
- **Sélectionnée :** bordure `2px #222222`, fond `#f7f7f7` — pas de gradient (Airbnb monochrome)
- Transition `duration-150 ease-out` sur la bordure et le fond

Types : `MEETING_ROOM` · `COWORKING_SPACE` · `EVENT_SPACE` · `PARTY_ROOM` · `STUDIO`

---

## 7. Étape 2 — Informations générales

**Composant :** `StepInfo.tsx`

- **Nom de l'espace** (requis) : input `h-14` (56px), `rounded-lg`, `border border-[#dddddd]`, focus → `border-2 border-[#222222]` sans box-shadow. Label stacked au-dessus en `12px/500 #929292`.
- **Description** (requis) : textarea `rows={4}`, `resize-none`, même style d'input. Label stacked.

---

## 8. Étape 3 — Lieu & prix

**Composant :** `StepLocation.tsx`

- **Adresse** (requis) : input pleine largeur, style identique à étape 2
- Grille `sm:grid-cols-2 gap-4` :
  - **Capacité** (personnes, requis, min 1) : input `type="number"`
  - **Prix/heure** (€, requis, min 0, step 0.01) : input `type="number"`

---

## 9. Étape 4 — Récapitulatif

**Composant :** `StepRecap.tsx`

3 blocs read-only empilés, séparés par hairlines `#ebebeb` :

| Bloc | Contenu | Lien "Modifier" → étape |
|------|---------|------------------------|
| Type | Icône + label du type sélectionné | 1 |
| Infos | Nom en `16px/600`, description tronquée `line-clamp-2` en `14px #6a6a6a` | 2 |
| Lieu & prix | Adresse · Capacité · Prix/h | 3 |

Lien "Modifier" : `14px/400 #222222`, underline au hover, `cursor-pointer`, appelle `setStep(n)` sur le wizard shell.

En-dessous des blocs : bloc d'erreur si le submit échoue (`border border-[#c13515]/30 bg-[#c13515]/5`, icône `AlertCircle`, texte `#c13515`).

---

## 10. Tokens Airbnb appliqués

| Rôle | Valeur |
|------|--------|
| Canvas | `#ffffff` |
| Ink | `#222222` |
| Muted | `#6a6a6a` |
| Muted Soft | `#929292` |
| Hairline | `#dddddd` |
| Hairline Soft | `#ebebeb` |
| Primary (Rausch) | `#ff385c` |
| Error | `#c13515` |
| Surface Soft | `#f7f7f7` |
| button-primary height | 48px (`h-12`) |
| input height | 56px (`h-14`) |
| input radius | 8px (`rounded-lg`) |
| input focus | `border-2 border-[#222222]`, pas de ring |

---

## 11. Pages consommatrices

### `app/(dashboard)/places/new/page.tsx`
Remplace `<PlaceForm />` par `<PlaceFormWizard />`. Conserve le header (lien retour, h1, sous-titre).

### `app/(dashboard)/owner/places/[id]/edit/page.tsx`
Remplace `<PlaceForm defaultValues={place} placeId={...} backHref="..." />` par `<PlaceFormWizard defaultValues={place} placeId={...} backHref="..." />`. Conserve les états loading/error existants.

---

## 12. Fix CategoryStrip — "Salle de réunion"

**Fichier :** `components/landing/CategoryStrip.tsx`

**Problème :** les cartes ont `w-36` (144px) avec `px-8` (32px de padding total), laissant ~112px pour le texte. "Salle de réunion" (15 caractères) dépasse et wrappe sur 2 lignes, rendant cette carte plus haute que les autres.

**Correctif :** passer `w-36` → `w-40` (160px) sur l'élément `Link`, ce qui donne ~128px utiles — largeur confortable pour tous les labels.

---

## 13. Périmètre exclu

- Upload d'image pour les espaces (géré dans une itération API)
- Animations Framer Motion sur le wizard (les transitions inter-étapes restent instantanées)
- Validation côté serveur au-delà du retour d'erreur API existant
