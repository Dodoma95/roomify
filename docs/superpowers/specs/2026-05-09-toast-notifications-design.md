# Roomify — Système de notifications toast

**Date :** 2026-05-09
**Scope :** Système de toast global (succès/erreur API) flottant top-right, dismissable, avec migration de tous les appels API existants

---

## 1. Règle globale

| Source de l'erreur | Affichage |
|--------------------|-----------|
| Validation client (champ requis, format, règle métier) | Inline sous le champ — inchangé |
| Erreur réponse API (`!res.ok`) | `toast.error(message)` |
| Succès action API | `toast.success(message)` |

---

## 2. Architecture

```
store/toastStore.ts              ← état Zustand : toasts[], addToast, removeToast
lib/hooks/useToast.ts            ← re-export simplifié : toast.success / toast.error
components/ui/Toast.tsx          ← un toast individuel (icône, message, ✕, auto-dismiss)
components/ui/ToastContainer.tsx ← liste animée fixed top-right, AnimatePresence
app/layout.tsx                   ← <ToastContainer /> monté une seule fois globalement
```

---

## 3. Store Zustand — `store/toastStore.ts`

```ts
import { create } from "zustand";

export type ToastType = "success" | "error";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (type, message) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
```

---

## 4. Hook — `lib/hooks/useToast.ts`

Expose une API impérative pour les composants clients. Aucun composant n'importe `useToastStore` directement.

```ts
import { useToastStore } from "@/store/toastStore";

export function useToast() {
  const { addToast } = useToastStore();
  return {
    success: (message: string) => addToast("success", message),
    error:   (message: string) => addToast("error",   message),
  };
}
```

---

## 5. Composant Toast — `components/ui/Toast.tsx`

### Visuel

- Fond blanc `#ffffff`, `rounded-xl`, `w-80` (320px fixe)
- Shadow Airbnb : `box-shadow: rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.1) 0 4px 8px 0`
- Barre gauche `4px` :
  - Succès : `#008A05` (vert)
  - Erreur : `#c13515` (rouge Airbnb error)
- Icône `20×20px` :
  - Succès : `CheckCircle2` en `#008A05`
  - Erreur : `AlertCircle` en `#c13515`
- Message : `14px / 500 / #222222`, max 2 lignes (`line-clamp-2`)
- Bouton ✕ : `X` 16px, `#929292` → hover `#222222`, `cursor-pointer`
- Padding interne : `12px 16px`

### Comportement

- À l'initialisation : lance un timer `duration` ms → appelle `removeToast(id)` à l'expiration
- Le timer est annulé si le composant est démonté (cleanup `useEffect`)
- Clic ✕ : appelle `removeToast(id)` immédiatement
- Durée : succès 4000ms, erreur non auto-dismiss (reste jusqu'au clic ✕)

---

## 6. Conteneur — `components/ui/ToastContainer.tsx`

- `"use client"` (accès au store Zustand)
- `fixed top-4 right-4 z-[200]` — au-dessus de tout (navbar z-50, modals z-100)
- `flex flex-col gap-2` — empile les toasts, le plus récent en bas de la pile
- Utilise `<AnimatePresence>` de Framer Motion (déjà installé)
- Chaque toast : `motion.div` avec :
  - `initial={{ opacity: 0, x: 64 }}` — entre depuis la droite
  - `animate={{ opacity: 1, x: 0 }}` — transition 200ms ease-out
  - `exit={{ opacity: 0, x: 64 }}` — sort vers la droite 150ms

---

## 7. Intégration dans `app/layout.tsx`

Ajouter `<ToastContainer />` dans le `<body>`, après `{children}` :

```tsx
import { ToastContainer } from "@/components/ui/ToastContainer";

// dans le body :
<body ...>
  {children}
  <ToastContainer />
</body>
```

---

## 8. Migration des appels API existants

### 8.1 `components/places/PlaceFormWizard.tsx`

- Supprimer : `const [submitError, setSubmitError] = useState<string | null>(null)`
- Supprimer : le bloc JSX `{submitError && <div ...>}` dans le rendu
- Ajouter : `const toast = useToast()`
- Dans `handleSubmit` :
  - `!res.ok` → `toast.error(json.error ?? json.message ?? "Une erreur est survenue.")`
  - `catch` → `toast.error("Impossible de contacter le serveur.")`
  - Succès → `toast.success(placeId ? "Espace mis à jour !" : "Espace publié !")` avant `router.push`

### 8.2 `components/auth/LoginForm.tsx`

- Supprimer : `setErrors({ password: "Email ou mot de passe incorrect" })` dans le bloc `!res.ok`
- Ajouter : `toast.error("Email ou mot de passe incorrect.")` à la place
- La validation client (champs vides) reste inline — inchangée

### 8.3 `components/auth/RegisterForm.tsx`

- Supprimer : `setErrors({ general: ... })` et le bloc JSX `{errors.general && <p ...>}`
- Supprimer : le champ `general` du type `FieldErrors`
- Ajouter : `toast.error(json.error ?? json.message ?? "Erreur lors de l'inscription.")` dans `!res.ok`
- Le bloc succès (`setSuccess(true)` → affichage "Vérifiez votre boîte mail") reste inchangé — c'est une UX multi-étape, pas un simple toast

### 8.4 Pages admin

Les pages admin effectuent des mutations (approbation, rejet, suppression) sans gestion d'erreur actualisée. Chaque `fetch` mutation doit être wrappé :

| Page | Action | Toast succès | Toast erreur |
|------|--------|--------------|--------------|
| `admin/places/page.tsx` | Approbation / Rejet d'un espace | "Espace approuvé." / "Espace rejeté." | "Une erreur est survenue." |
| `admin/places/page.tsx` | Suppression d'un espace | "Espace supprimé." | "Une erreur est survenue." |
| `admin/users/page.tsx` | Suppression d'un utilisateur | "Utilisateur supprimé." | "Une erreur est survenue." |
| `admin/bookings/page.tsx` | Confirmation / Annulation de réservation | "Réservation confirmée." / "Réservation annulée." | "Une erreur est survenue." |
| `owner/places/page.tsx` | Suppression d'un espace | "Espace supprimé." | "Une erreur est survenue." |

---

## 9. Durées auto-dismiss

| Type | Durée |
|------|-------|
| `success` | 4000ms |
| `error` | ∞ (manuel uniquement) |

---

## 10. Périmètre exclu

- Toasts de type `info` ou `warning` — non demandés
- Persistance des toasts entre navigations — non requise
- Accessibilité `role="alert"` — ajouté dans le composant Toast (ARIA live region)
