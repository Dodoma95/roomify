# Toast Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implémenter un système de notifications toast Zustand flottant top-right et migrer tous les appels API existants pour utiliser `toast.error` / `toast.success`.

**Architecture:** Un store Zustand (`toastStore`) gère la liste des toasts. Un hook `useToast()` expose une API impérative (`toast.success`, `toast.error`). Un `ToastContainer` client monté dans le root layout rend les toasts animés via Framer Motion. Toutes les erreurs API existantes (inline) sont migrées vers le toast.

**Tech Stack:** Next.js 15, React 19, TypeScript strict, Zustand 5, Framer Motion (déjà installé), Lucide React, Tailwind CSS v4

---

## File Map

| Action | Chemin |
|--------|--------|
| Create | `store/toastStore.ts` |
| Create | `hooks/useToast.ts` |
| Create | `components/ui/Toast.tsx` |
| Create | `components/ui/ToastContainer.tsx` |
| Modify | `app/layout.tsx` |
| Modify | `components/places/PlaceFormWizard.tsx` |
| Modify | `components/auth/LoginForm.tsx` |
| Modify | `components/auth/RegisterForm.tsx` |
| Modify | `app/(dashboard)/admin/places/page.tsx` |
| Modify | `app/(dashboard)/admin/users/page.tsx` |
| Modify | `app/(dashboard)/admin/bookings/page.tsx` |
| Modify | `app/(dashboard)/owner/places/page.tsx` |

---

## Task 1: Infrastructure toast (store + hook + composants)

**Files:**
- Create: `store/toastStore.ts`
- Create: `hooks/useToast.ts`
- Create: `components/ui/Toast.tsx`
- Create: `components/ui/ToastContainer.tsx`

- [ ] **Step 1: Créer `store/toastStore.ts`**

```ts
// store/toastStore.ts
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

- [ ] **Step 2: Créer `hooks/useToast.ts`**

```ts
// hooks/useToast.ts
import { useToastStore } from "@/store/toastStore";

export function useToast() {
  const { addToast } = useToastStore();
  return {
    success: (message: string) => addToast("success", message),
    error:   (message: string) => addToast("error",   message),
  };
}
```

- [ ] **Step 3: Créer `components/ui/Toast.tsx`**

```tsx
// components/ui/Toast.tsx
"use client";

import { useEffect } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Toast as ToastType, useToastStore } from "@/store/toastStore";

const SUCCESS_DURATION = 4000;

const CONFIG: Record<ToastType, { Icon: typeof CheckCircle2; color: string; bar: string }> = {
  success: { Icon: CheckCircle2, color: "#008A05", bar: "#008A05" },
  error:   { Icon: AlertCircle,  color: "#c13515", bar: "#c13515" },
};

export function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const { Icon, color, bar } = CONFIG[toast.type];

  useEffect(() => {
    if (toast.type !== "success") return;
    const timer = setTimeout(() => removeToast(toast.id), SUCCESS_DURATION);
    return () => clearTimeout(timer);
  }, [toast.id, toast.type, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 64 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 64 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-80 bg-white rounded-xl overflow-hidden"
      style={{
        borderLeft: `4px solid ${bar}`,
        boxShadow:
          "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.1) 0 4px 8px 0",
      }}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color }} />
        <p className="flex-1 text-[14px] font-medium text-[#222222] leading-snug line-clamp-3">
          {toast.message}
        </p>
        <button
          type="button"
          onClick={() => removeToast(toast.id)}
          className="shrink-0 text-[#929292] hover:text-[#222222] transition-colors duration-150 cursor-pointer"
          aria-label="Fermer la notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 4: Créer `components/ui/ToastContainer.tsx`**

```tsx
// components/ui/ToastContainer.tsx
"use client";

import { AnimatePresence } from "framer-motion";
import { useToastStore } from "@/store/toastStore";
import { ToastItem } from "./Toast";

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      className="fixed top-4 right-4 z-[200] flex flex-col gap-2"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 5: Vérifier TypeScript**

```bash
cd /Users/72337B/workspace/perso/roomify && npx tsc --noEmit
```

Attendu : aucune erreur

- [ ] **Step 6: Commit**

```bash
git add store/toastStore.ts hooks/useToast.ts components/ui/Toast.tsx components/ui/ToastContainer.tsx
git commit -m "feat: toast infrastructure — store Zustand, hook useToast, composants Toast/ToastContainer"
```

---

## Task 2: Brancher ToastContainer dans le root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Mettre à jour `app/layout.tsx`**

Remplacer l'intégralité du fichier par :

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ui/ToastContainer";

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
      <body className="min-h-full flex flex-col">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
cd /Users/72337B/workspace/perso/roomify && npx tsc --noEmit
```

Attendu : aucune erreur

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: monter ToastContainer dans le root layout"
```

---

## Task 3: Migrer PlaceFormWizard

**Files:**
- Modify: `components/places/PlaceFormWizard.tsx`

- [ ] **Step 1: Appliquer les changements**

Dans `components/places/PlaceFormWizard.tsx` :

**a) Ajouter l'import du hook** après les imports existants :
```tsx
import { useToast } from "@/hooks/useToast";
```

**b) À l'intérieur de la fonction `PlaceFormWizard`, remplacer** :
```tsx
const [submitError, setSubmitError] = useState<string | null>(null);
```
Par (supprimer cette ligne entièrement — `loading` reste).

**c) Ajouter** juste après `const [loading, setLoading] = useState(false);` :
```tsx
const toast = useToast();
```

**d) Remplacer** la fonction `handleSubmit` entière par :
```tsx
async function handleSubmit() {
  setLoading(true);

  const url    = placeId ? `/api/places/${placeId}` : "/api/places";
  const method = placeId ? "PATCH" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      toast.error(json.error ?? json.message ?? "Une erreur est survenue.");
      return;
    }

    toast.success(placeId ? "Espace mis à jour !" : "Espace publié !");
    router.push(backHref ?? "/places");
    router.refresh();
  } catch {
    toast.error("Impossible de contacter le serveur.");
  } finally {
    setLoading(false);
  }
}
```

**e) Supprimer** le bloc JSX de l'erreur de soumission (rechercher et supprimer) :
```tsx
      {/* Erreur de soumission */}
      {submitError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-[#c13515]/30 bg-[#c13515]/5 px-4 py-3 text-sm text-[#c13515] mt-6">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {submitError}
        </div>
      )}
```

**f) Supprimer** l'import `AlertCircle` de lucide-react s'il n'est plus utilisé nulle part dans le fichier.

- [ ] **Step 2: Vérifier TypeScript**

```bash
cd /Users/72337B/workspace/perso/roomify && npx tsc --noEmit
```

Attendu : aucune erreur

- [ ] **Step 3: Commit**

```bash
git add components/places/PlaceFormWizard.tsx
git commit -m "feat(toast): migrer PlaceFormWizard — submitError inline → toast"
```

---

## Task 4: Migrer les formulaires d'authentification

**Files:**
- Modify: `components/auth/LoginForm.tsx`
- Modify: `components/auth/RegisterForm.tsx`

- [ ] **Step 1: Mettre à jour `LoginForm.tsx`**

**a) Ajouter l'import** :
```tsx
import { useToast } from "@/hooks/useToast";
```

**b) Ajouter** dans le corps de `LoginForm` (juste après `const router = useRouter();`) :
```tsx
const toast = useToast();
```

**c) Remplacer** le bloc `!res.ok` :
```tsx
// AVANT
    if (!res.ok) {
      setErrors({ password: "Email ou mot de passe incorrect" });
      return;
    }
// APRÈS
    if (!res.ok) {
      toast.error("Email ou mot de passe incorrect.");
      return;
    }
```

- [ ] **Step 2: Mettre à jour `RegisterForm.tsx`**

**a) Ajouter l'import** :
```tsx
import { useToast } from "@/hooks/useToast";
```

**b) Modifier le type `FieldErrors`** — supprimer le champ `general` :
```tsx
// AVANT
type FieldErrors = Partial<Record<"firstName" | "lastName" | "email" | "password" | "confirmPassword" | "general", string>>;
// APRÈS
type FieldErrors = Partial<Record<"firstName" | "lastName" | "email" | "password" | "confirmPassword", string>>;
```

**c) Ajouter** dans le corps de `RegisterForm` (juste après `const router = useRouter();`) :
```tsx
const toast = useToast();
```

**d) Remplacer** le bloc `!res.ok` dans `handleSubmit` :
```tsx
// AVANT
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setErrors({ general: json.message ?? "Erreur lors de l'inscription" });
      return;
    }
// APRÈS
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      toast.error(json.error ?? json.message ?? "Erreur lors de l'inscription.");
      return;
    }
```

**e) Supprimer** le bloc JSX `errors.general` du rendu :
```tsx
      {/* Erreur API générale */}
      {errors.general && (
        <p className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2.5">
          {errors.general}
        </p>
      )}
```

- [ ] **Step 3: Vérifier TypeScript**

```bash
cd /Users/72337B/workspace/perso/roomify && npx tsc --noEmit
```

Attendu : aucune erreur

- [ ] **Step 4: Commit**

```bash
git add components/auth/LoginForm.tsx components/auth/RegisterForm.tsx
git commit -m "feat(toast): migrer LoginForm et RegisterForm — erreurs API → toast"
```

---

## Task 5: Migrer les pages admin

**Files:**
- Modify: `app/(dashboard)/admin/places/page.tsx`
- Modify: `app/(dashboard)/admin/users/page.tsx`
- Modify: `app/(dashboard)/admin/bookings/page.tsx`

- [ ] **Step 1: Mettre à jour `admin/places/page.tsx`**

**a) Ajouter l'import** en tête de fichier :
```tsx
import { useToast } from "@/hooks/useToast";
```

**b) Ajouter** dans `AdminPlacesPage` (juste après les `useState`) :
```tsx
const toast = useToast();
```

**c) Remplacer** la fonction `handleDelete` entière :
```tsx
async function handleDelete(id: string) {
  if (confirmId !== id) {
    setConfirmId(id);
    return;
  }
  setDeletingId(id);
  try {
    const res = await fetch(`/api/admin/places/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Impossible de supprimer l'espace.");
    } else {
      toast.success("Espace supprimé.");
      await mutate();
    }
  } catch {
    toast.error("Impossible de contacter le serveur.");
  } finally {
    setDeletingId(null);
    setConfirmId(null);
  }
}
```

- [ ] **Step 2: Mettre à jour `admin/users/page.tsx`**

**a) Ajouter l'import** :
```tsx
import { useToast } from "@/hooks/useToast";
```

**b) Ajouter** dans `AdminUsersPage` (juste après les `useState`) :
```tsx
const toast = useToast();
```

**c) Remplacer** la fonction `handleDelete` entière :
```tsx
async function handleDelete(id: string) {
  if (confirmId !== id) {
    setConfirmId(id);
    return;
  }
  setDeletingId(id);
  try {
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Impossible de supprimer l'utilisateur.");
    } else {
      toast.success("Utilisateur supprimé.");
      await mutate();
    }
  } catch {
    toast.error("Impossible de contacter le serveur.");
  } finally {
    setDeletingId(null);
    setConfirmId(null);
  }
}
```

- [ ] **Step 3: Mettre à jour `admin/bookings/page.tsx`**

**a) Ajouter l'import** :
```tsx
import { useToast } from "@/hooks/useToast";
```

**b) Ajouter** dans `AdminBookingsPage` (juste après les `useState`) :
```tsx
const toast = useToast();
```

**c) Remplacer** la fonction `handleAction` entière :
```tsx
async function handleAction(id: string, action: "confirm" | "cancel") {
  setActionLoading(`${id}-${action}`);
  try {
    const res = await fetch(`/api/admin/bookings/${id}/${action}`, { method: "POST" });
    if (!res.ok) {
      toast.error("Une erreur est survenue.");
    } else {
      toast.success(action === "confirm" ? "Réservation confirmée." : "Réservation annulée.");
      await mutate();
    }
  } catch {
    toast.error("Impossible de contacter le serveur.");
  } finally {
    setActionLoading(null);
  }
}
```

- [ ] **Step 4: Vérifier TypeScript**

```bash
cd /Users/72337B/workspace/perso/roomify && npx tsc --noEmit
```

Attendu : aucune erreur

- [ ] **Step 5: Commit**

```bash
git add "app/(dashboard)/admin/places/page.tsx" "app/(dashboard)/admin/users/page.tsx" "app/(dashboard)/admin/bookings/page.tsx"
git commit -m "feat(toast): migrer pages admin — erreurs/succès API → toast"
```

---

## Task 6: Migrer la page owner/places

**Files:**
- Modify: `app/(dashboard)/owner/places/page.tsx`

Cette page contient 3 composants avec des appels API : `OwnerPlacesPage` (handleDelete), `UnavailabilityPanel` (handleBlock + handleDelete), `BookingsPanel` (handleAction).

- [ ] **Step 1: Ajouter l'import du hook**

En tête de `app/(dashboard)/owner/places/page.tsx`, ajouter :
```tsx
import { useToast } from "@/hooks/useToast";
```

- [ ] **Step 2: Mettre à jour `UnavailabilityPanel`**

**a) Ajouter** `const toast = useToast();` dans le corps de `UnavailabilityPanel` (juste après les `useState`).

**b) Supprimer** la ligne :
```tsx
const [blockError, setBlockError] = useState<string | null>(null);
```

**c) Remplacer** la fonction `handleBlock` entière :
```tsx
async function handleBlock(e: React.FormEvent) {
  e.preventDefault();
  if (!from || !to) return;
  setBlocking(true);
  try {
    const res = await fetch(`/api/owner/places/${placeId}/unavailability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: from, endDate: to }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      toast.error(json.error ?? "Erreur lors du blocage.");
    } else {
      toast.success("Période bloquée.");
      setFrom("");
      setTo("");
      mutate();
    }
  } catch {
    toast.error("Impossible de contacter le serveur.");
  } finally {
    setBlocking(false);
  }
}
```

**d) Remplacer** la fonction `handleDelete` (dans `UnavailabilityPanel`) entière :
```tsx
async function handleDelete(uid: string) {
  setDeletingId(uid);
  try {
    const res = await fetch(
      `/api/owner/places/${placeId}/unavailability/${uid}`,
      { method: "DELETE" }
    );
    if (!res.ok) {
      toast.error("Impossible de supprimer la période.");
    } else {
      toast.success("Période débloquée.");
      mutate();
    }
  } catch {
    toast.error("Impossible de contacter le serveur.");
  } finally {
    setDeletingId(null);
  }
}
```

**e) Supprimer** le bloc JSX de l'erreur inline (dans le `<form>`) :
```tsx
        {blockError ? (
          <div className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {blockError}
          </div>
        ) : null}
```

- [ ] **Step 3: Mettre à jour `BookingsPanel`**

**a) Ajouter** `const toast = useToast();` dans le corps de `BookingsPanel` (juste après les `useState`).

**b) Remplacer** la fonction `handleAction` entière :
```tsx
async function handleAction(bookingId: string, action: "confirm" | "cancel") {
  setActionId(bookingId);
  try {
    const res = await fetch(
      `/api/owner/bookings/${bookingId}/${action}`,
      { method: "PATCH" }
    );
    if (!res.ok) {
      toast.error("Une erreur est survenue.");
    } else {
      toast.success(action === "confirm" ? "Réservation confirmée." : "Réservation annulée.");
      mutate();
    }
  } catch {
    toast.error("Impossible de contacter le serveur.");
  } finally {
    setActionId(null);
  }
}
```

- [ ] **Step 4: Mettre à jour `OwnerPlacesPage`**

**a) Ajouter** `const toast = useToast();` dans le corps de `OwnerPlacesPage` (juste après les `useState`).

**b) Remplacer** la fonction `handleDelete` entière :
```tsx
async function handleDelete(id: string) {
  if (confirmId !== id) { setConfirmId(id); return; }
  setDeletingId(id);
  try {
    const res = await fetch(`/api/owner/places/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Impossible de supprimer l'espace.");
    } else {
      toast.success("Espace supprimé.");
      mutate();
    }
  } catch {
    toast.error("Impossible de contacter le serveur.");
  } finally {
    setDeletingId(null);
    setConfirmId(null);
  }
}
```

**c) Vérifier** si `AlertCircle` est encore utilisé dans le fichier. Si `UnavailabilityPanel` était le seul consommateur et que le bloc JSX a été supprimé, retirer `AlertCircle` de l'import Lucide.

- [ ] **Step 5: Vérifier TypeScript et lint**

```bash
cd /Users/72337B/workspace/perso/roomify && npx tsc --noEmit && npm run lint
```

Attendu : aucune erreur TypeScript, aucune erreur ESLint critique

- [ ] **Step 6: Commit final**

```bash
git add "app/(dashboard)/owner/places/page.tsx"
git commit -m "feat(toast): migrer owner/places — erreurs/succès API → toast, supprimer blockError inline"
```
