# Place Form Wizard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer `PlaceForm` (une page) par `PlaceFormWizard` (4 étapes Airbnb) et corriger le sizing "Salle de réunion" dans `CategoryStrip`.

**Architecture:** `PlaceFormWizard` est un shell client qui gère `step` (1–4), `formData` et `errors` en state local. Chaque étape est un sous-composant dans `components/places/wizard/`. Les deux pages consommatrices (`new/page.tsx`, `edit/page.tsx`) remplacent `<PlaceForm>` par `<PlaceFormWizard>` avec les mêmes props.

**Tech Stack:** Next.js 15, React 19, TypeScript strict, Tailwind CSS v4, Lucide React, `cn` (`@/lib/utils`)

---

## File Map

| Action | Chemin |
|--------|--------|
| Modify | `components/landing/CategoryStrip.tsx` |
| Create | `components/places/wizard/constants.ts` |
| Create | `components/places/wizard/StepType.tsx` |
| Create | `components/places/wizard/StepInfo.tsx` |
| Create | `components/places/wizard/StepLocation.tsx` |
| Create | `components/places/wizard/StepRecap.tsx` |
| Create | `components/places/PlaceFormWizard.tsx` |
| Modify | `app/(dashboard)/places/new/page.tsx` |
| Modify | `app/(dashboard)/owner/places/[id]/edit/page.tsx` |
| Delete | `components/places/PlaceForm.tsx` |

---

## Task 1: Fix CategoryStrip — "Salle de réunion" sizing

**Files:**
- Modify: `components/landing/CategoryStrip.tsx`

- [ ] **Step 1: Changer `w-36` → `w-40` sur le `Link`**

Dans `components/landing/CategoryStrip.tsx`, ligne 41, remplacer `w-36` par `w-40` :

```tsx
// AVANT
className="flex flex-col items-center gap-3 px-8 py-5 rounded-[14px] border border-[#dddddd] dark:border-[#3a3a3a] hover:border-[#222222] dark:hover:border-[#f0f0f0] hover:shadow-tier transition-all duration-200 bg-white dark:bg-[#1a1a1a] group w-36 text-center"

// APRÈS
className="flex flex-col items-center gap-3 px-8 py-5 rounded-[14px] border border-[#dddddd] dark:border-[#3a3a3a] hover:border-[#222222] dark:hover:border-[#f0f0f0] hover:shadow-tier transition-all duration-200 bg-white dark:bg-[#1a1a1a] group w-40 text-center"
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
npx tsc --noEmit
```

Attendu : aucune erreur

- [ ] **Step 3: Commit**

```bash
git add components/landing/CategoryStrip.tsx
git commit -m "fix: CategoryStrip card width w-36→w-40 pour Salle de réunion"
```

---

## Task 2: Constantes partagées du wizard

**Files:**
- Create: `components/places/wizard/constants.ts`

- [ ] **Step 1: Créer le fichier**

```ts
// components/places/wizard/constants.ts
import { Building2, Laptop, PartyPopper, Music2, Camera, type LucideIcon } from "lucide-react";
import { PlaceType } from "@/types/place";

export const PLACE_TYPE_META: {
  value: PlaceType;
  label: string;
  Icon: LucideIcon;
}[] = [
  { value: "MEETING_ROOM",    label: "Salle de réunion",   Icon: Building2   },
  { value: "COWORKING_SPACE", label: "Coworking",           Icon: Laptop      },
  { value: "EVENT_SPACE",     label: "Événementiel",        Icon: PartyPopper },
  { value: "PARTY_ROOM",      label: "Salle de fête",       Icon: Music2      },
  { value: "STUDIO",          label: "Studio",              Icon: Camera      },
];
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
npx tsc --noEmit
```

Attendu : aucune erreur

---

## Task 3: StepType — sélecteur de type d'espace

**Files:**
- Create: `components/places/wizard/StepType.tsx`

- [ ] **Step 1: Créer le composant**

```tsx
// components/places/wizard/StepType.tsx
"use client";

import { cn } from "@/lib/utils";
import { PlaceType } from "@/types/place";
import { PLACE_TYPE_META } from "./constants";

interface StepTypeProps {
  value: PlaceType;
  onChange: (type: PlaceType) => void;
}

export function StepType({ value, onChange }: StepTypeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-semibold text-[#222222]">
          Quel type d&apos;espace proposez-vous ?
        </h2>
        <p className="text-[14px] text-[#6a6a6a] mt-1">
          Choisissez la catégorie qui correspond le mieux.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {PLACE_TYPE_META.map(({ value: v, label, Icon }) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={cn(
              "flex flex-col items-center gap-3 rounded-xl p-5 text-center transition-all duration-150 cursor-pointer",
              value === v
                ? "border-2 border-[#222222] bg-[#f7f7f7]"
                : "border border-[#dddddd] bg-white hover:border-[#222222]"
            )}
          >
            <div className="w-12 h-12 rounded-full bg-[#f7f7f7] flex items-center justify-center">
              <Icon className="w-6 h-6 text-[#222222]" strokeWidth={1.5} />
            </div>
            <span className="text-[14px] font-medium text-[#222222] leading-snug">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
npx tsc --noEmit
```

Attendu : aucune erreur

---

## Task 4: StepInfo — nom et description

**Files:**
- Create: `components/places/wizard/StepInfo.tsx`

- [ ] **Step 1: Créer le composant**

```tsx
// components/places/wizard/StepInfo.tsx
"use client";

import { CreatePlaceInput } from "@/types/place";

interface StepInfoProps {
  values: Pick<CreatePlaceInput, "name" | "description">;
  onChange: (values: Pick<CreatePlaceInput, "name" | "description">) => void;
  errors: Partial<Record<"name" | "description", string>>;
}

const inputClass =
  "w-full h-14 px-3 rounded-lg border border-[#dddddd] text-[16px] text-[#222222] placeholder:text-[#929292] focus:outline-none focus:border-2 focus:border-[#222222] transition-colors duration-150 bg-white";
const labelClass = "block text-[12px] font-medium text-[#929292] mb-1.5";

export function StepInfo({ values, onChange, errors }: StepInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-semibold text-[#222222]">
          Présentez votre espace
        </h2>
        <p className="text-[14px] text-[#6a6a6a] mt-1">
          Ces informations seront visibles par les locataires.
        </p>
      </div>
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Nom de l&apos;espace *</label>
          <input
            className={inputClass}
            placeholder="Ex : Salle Horizon, Studio Nord…"
            value={values.name}
            onChange={(e) => onChange({ ...values, name: e.target.value })}
          />
          {errors.name && (
            <p className="text-[12px] text-[#c13515] mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Description *</label>
          <textarea
            className="w-full px-3 py-3 rounded-lg border border-[#dddddd] text-[16px] text-[#222222] placeholder:text-[#929292] focus:outline-none focus:border-2 focus:border-[#222222] transition-colors duration-150 bg-white resize-none"
            rows={5}
            placeholder="Décrivez l'espace, ses équipements, son ambiance…"
            value={values.description}
            onChange={(e) => onChange({ ...values, description: e.target.value })}
          />
          {errors.description && (
            <p className="text-[12px] text-[#c13515] mt-1">{errors.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
npx tsc --noEmit
```

Attendu : aucune erreur

---

## Task 5: StepLocation — adresse, capacité, prix

**Files:**
- Create: `components/places/wizard/StepLocation.tsx`

- [ ] **Step 1: Créer le composant**

```tsx
// components/places/wizard/StepLocation.tsx
"use client";

import { CreatePlaceInput } from "@/types/place";

interface StepLocationProps {
  values: Pick<CreatePlaceInput, "address" | "capacity" | "pricePerHour">;
  onChange: (
    values: Pick<CreatePlaceInput, "address" | "capacity" | "pricePerHour">
  ) => void;
  errors: Partial<Record<"address" | "capacity" | "pricePerHour", string>>;
}

const inputClass =
  "w-full h-14 px-3 rounded-lg border border-[#dddddd] text-[16px] text-[#222222] placeholder:text-[#929292] focus:outline-none focus:border-2 focus:border-[#222222] transition-colors duration-150 bg-white";
const labelClass = "block text-[12px] font-medium text-[#929292] mb-1.5";

export function StepLocation({ values, onChange, errors }: StepLocationProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-semibold text-[#222222]">
          Où se trouve votre espace ?
        </h2>
        <p className="text-[14px] text-[#6a6a6a] mt-1">
          L&apos;adresse et les informations pratiques.
        </p>
      </div>
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Adresse *</label>
          <input
            className={inputClass}
            placeholder="12 rue de la Paix, 75002 Paris"
            value={values.address}
            onChange={(e) => onChange({ ...values, address: e.target.value })}
          />
          {errors.address && (
            <p className="text-[12px] text-[#c13515] mt-1">{errors.address}</p>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Capacité (personnes) *</label>
            <input
              type="number"
              min={1}
              max={1000}
              className={inputClass}
              placeholder="20"
              value={values.capacity || ""}
              onChange={(e) =>
                onChange({ ...values, capacity: Number(e.target.value) })
              }
            />
            {errors.capacity && (
              <p className="text-[12px] text-[#c13515] mt-1">{errors.capacity}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Prix par heure (€) *</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className={inputClass}
              placeholder="50.00"
              value={values.pricePerHour || ""}
              onChange={(e) =>
                onChange({ ...values, pricePerHour: Number(e.target.value) })
              }
            />
            {errors.pricePerHour && (
              <p className="text-[12px] text-[#c13515] mt-1">
                {errors.pricePerHour}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
npx tsc --noEmit
```

Attendu : aucune erreur

---

## Task 6: StepRecap — récapitulatif

**Files:**
- Create: `components/places/wizard/StepRecap.tsx`

- [ ] **Step 1: Créer le composant**

```tsx
// components/places/wizard/StepRecap.tsx
"use client";

import { CreatePlaceInput } from "@/types/place";
import { PLACE_TYPE_META } from "./constants";

interface StepRecapProps {
  formData: CreatePlaceInput;
  onGoToStep: (step: number) => void;
}

export function StepRecap({ formData, onGoToStep }: StepRecapProps) {
  const typeMeta = PLACE_TYPE_META.find((t) => t.value === formData.type)!;
  const { Icon } = typeMeta;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-semibold text-[#222222]">
          Vérifiez vos informations
        </h2>
        <p className="text-[14px] text-[#6a6a6a] mt-1">
          Relisez avant de publier. Vous pouvez modifier chaque section.
        </p>
      </div>
      <div className="rounded-xl border border-[#dddddd] divide-y divide-[#ebebeb] bg-white">
        {/* Type */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f7f7f7] flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[#222222]" strokeWidth={1.5} />
            </div>
            <span className="text-[15px] font-medium text-[#222222]">
              {typeMeta.label}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="text-[14px] text-[#222222] underline-offset-2 hover:underline cursor-pointer"
          >
            Modifier
          </button>
        </div>
        {/* Infos */}
        <div className="flex items-start justify-between px-5 py-4">
          <div className="flex-1 min-w-0 mr-4">
            <p className="text-[15px] font-semibold text-[#222222] truncate">
              {formData.name}
            </p>
            <p className="text-[13px] text-[#6a6a6a] mt-0.5 line-clamp-2">
              {formData.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            className="text-[14px] text-[#222222] underline-offset-2 hover:underline cursor-pointer shrink-0"
          >
            Modifier
          </button>
        </div>
        {/* Lieu & prix */}
        <div className="flex items-start justify-between px-5 py-4">
          <div className="space-y-1">
            <p className="text-[14px] text-[#222222]">{formData.address}</p>
            <p className="text-[13px] text-[#6a6a6a]">
              {formData.capacity} pers. · {formData.pricePerHour} €/h
            </p>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="text-[14px] text-[#222222] underline-offset-2 hover:underline cursor-pointer shrink-0"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
npx tsc --noEmit
```

Attendu : aucune erreur

---

## Task 7: PlaceFormWizard — shell principal

**Files:**
- Create: `components/places/PlaceFormWizard.tsx`

- [ ] **Step 1: Créer le shell wizard**

```tsx
// components/places/PlaceFormWizard.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Place, CreatePlaceInput } from "@/types/place";
import { StepType } from "./wizard/StepType";
import { StepInfo } from "./wizard/StepInfo";
import { StepLocation } from "./wizard/StepLocation";
import { StepRecap } from "./wizard/StepRecap";

interface PlaceFormWizardProps {
  defaultValues?: Partial<Place>;
  placeId?: string;
  backHref?: string;
}

type Step = 1 | 2 | 3 | 4;
type FormErrors = Partial<Record<keyof CreatePlaceInput, string>>;

const STEP_LABELS = ["Type", "Infos", "Lieu & prix", "Récap"];

export function PlaceFormWizard({
  defaultValues,
  placeId,
  backHref,
}: PlaceFormWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<CreatePlaceInput>({
    type:         defaultValues?.type         ?? "MEETING_ROOM",
    name:         defaultValues?.name         ?? "",
    description:  defaultValues?.description  ?? "",
    address:      defaultValues?.address      ?? "",
    capacity:     defaultValues?.capacity     ?? 1,
    pricePerHour: defaultValues?.pricePerHour ?? 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validateStep(s: Step): FormErrors {
    const errs: FormErrors = {};
    if (s === 2) {
      if (!formData.name.trim()) errs.name = "Le nom est requis.";
      if (!formData.description.trim()) errs.description = "La description est requise.";
    }
    if (s === 3) {
      if (!formData.address.trim()) errs.address = "L'adresse est requise.";
      if (!formData.capacity || formData.capacity < 1)
        errs.capacity = "La capacité doit être ≥ 1.";
      if (formData.pricePerHour < 0)
        errs.pricePerHour = "Le prix doit être ≥ 0.";
    }
    return errs;
  }

  function handleNext() {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => (s + 1) as Step);
  }

  function handleBack() {
    setErrors({});
    setStep((s) => (s - 1) as Step);
  }

  async function handleSubmit() {
    setSubmitError(null);
    setLoading(true);

    const url    = placeId ? `/api/places/${placeId}` : "/api/places";
    const method = placeId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setSubmitError(json.message ?? "Une erreur est survenue.");
      return;
    }

    router.push(backHref ?? "/places");
    router.refresh();
  }

  return (
    <div>
      {/* Barre de progression */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center">
          {[1, 2, 3, 4].map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0",
                  s <= step
                    ? "bg-[#ff385c] text-white"
                    : "bg-[#f7f7f7] border border-[#dddddd] text-[#929292]"
                )}
              >
                {s}
              </div>
              {i < 3 && (
                <div className="flex-1 h-0.5 mx-1 bg-[#dddddd] relative">
                  {s < step && (
                    <div className="absolute inset-0 bg-[#ff385c]" />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="grid grid-cols-4 text-center">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={cn(
                "text-[11px] font-medium",
                i + 1 === step ? "text-[#222222]" : "text-[#929292]"
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div className="min-h-[300px]">
        {step === 1 && (
          <StepType
            value={formData.type}
            onChange={(type) => setFormData({ ...formData, type })}
          />
        )}
        {step === 2 && (
          <StepInfo
            values={{ name: formData.name, description: formData.description }}
            onChange={(v) => setFormData({ ...formData, ...v })}
            errors={{ name: errors.name, description: errors.description }}
          />
        )}
        {step === 3 && (
          <StepLocation
            values={{
              address:      formData.address,
              capacity:     formData.capacity,
              pricePerHour: formData.pricePerHour,
            }}
            onChange={(v) => setFormData({ ...formData, ...v })}
            errors={{
              address:      errors.address,
              capacity:     errors.capacity,
              pricePerHour: errors.pricePerHour,
            }}
          />
        )}
        {step === 4 && (
          <StepRecap
            formData={formData}
            onGoToStep={(s) => setStep(s as Step)}
          />
        )}
      </div>

      {/* Erreur de soumission */}
      {submitError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-[#c13515]/30 bg-[#c13515]/5 px-4 py-3 text-sm text-[#c13515] mt-6">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {submitError}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <div>
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="h-12 px-6 rounded-lg border border-[#222222] bg-white text-[#222222] text-[16px] font-medium hover:bg-[#f7f7f7] transition-colors duration-150 cursor-pointer"
            >
              Précédent
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={step === 4 ? handleSubmit : handleNext}
          disabled={loading}
          className="h-12 px-8 rounded-lg bg-[#ff385c] text-white text-[16px] font-medium hover:bg-[#e00b41] transition-colors duration-150 cursor-pointer disabled:bg-[#ffd1da] disabled:cursor-not-allowed"
        >
          {loading
            ? "Enregistrement…"
            : step === 4
            ? placeId
              ? "Mettre à jour"
              : "Publier l'espace"
            : "Suivant"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Vérifier TypeScript**

```bash
npx tsc --noEmit
```

Attendu : aucune erreur

---

## Task 8: Wirer les pages consommatrices et supprimer PlaceForm

**Files:**
- Modify: `app/(dashboard)/places/new/page.tsx`
- Modify: `app/(dashboard)/owner/places/[id]/edit/page.tsx`
- Delete: `components/places/PlaceForm.tsx`

- [ ] **Step 1: Mettre à jour `new/page.tsx`**

Remplacer l'import et l'usage de `PlaceForm` par `PlaceFormWizard` :

```tsx
// app/(dashboard)/places/new/page.tsx
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { PlaceFormWizard } from "@/components/places/PlaceFormWizard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewPlacePage() {
  const user = await getSessionUser();

  if (!user || user.roles.length === 0) {
    redirect("/places");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          href="/places"
          className="inline-flex items-center gap-1.5 text-sm text-[#6a6a6a] hover:text-[#222222] transition-colors duration-150 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux espaces
        </Link>
        <h1 className="text-[22px] font-semibold text-[#222222]">
          Ajouter un espace
        </h1>
        <p className="text-[14px] text-[#6a6a6a] mt-1">
          Votre espace sera soumis à validation avant publication.
        </p>
      </div>
      <PlaceFormWizard />
    </div>
  );
}
```

- [ ] **Step 2: Mettre à jour `edit/page.tsx`**

```tsx
// app/(dashboard)/owner/places/[id]/edit/page.tsx
"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePlaceById } from "@/hooks/usePlaces";
import { PlaceFormWizard } from "@/components/places/PlaceFormWizard";

export default function EditPlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { place, isLoading, error } = usePlaceById(id);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-pulse">
        <div className="h-4 w-24 bg-[#f2f2f2] rounded-md" />
        <div className="h-8 w-64 bg-[#f2f2f2] rounded-md" />
        <div className="h-96 bg-[#f2f2f2] rounded-2xl" />
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <p className="text-[#6a6a6a]">Espace introuvable.</p>
        <Link
          href="/owner/places"
          className="text-sm text-[#ff385c] mt-2 inline-block hover:underline"
        >
          Retour à mes espaces
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          href="/owner/places"
          className="inline-flex items-center gap-1.5 text-sm text-[#6a6a6a] hover:text-[#222222] transition-colors duration-150 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Mes espaces
        </Link>
        <h1 className="text-[22px] font-semibold text-[#222222]">
          Modifier l&apos;espace
        </h1>
        <p className="text-[14px] text-[#6a6a6a] mt-1">
          Les modifications soumettront l&apos;espace à une nouvelle validation.
        </p>
      </div>
      <PlaceFormWizard
        defaultValues={place}
        placeId={String(place.id)}
        backHref="/owner/places"
      />
    </div>
  );
}
```

- [ ] **Step 3: Supprimer `PlaceForm.tsx`**

```bash
rm components/places/PlaceForm.tsx
```

- [ ] **Step 4: Vérifier TypeScript et lint**

```bash
npx tsc --noEmit && npm run lint
```

Attendu : aucune erreur TypeScript, aucune erreur ESLint critique

- [ ] **Step 5: Commit final**

```bash
git add components/places/wizard/ components/places/PlaceFormWizard.tsx \
  app/(dashboard)/places/new/page.tsx \
  app/(dashboard)/owner/places/[id]/edit/page.tsx
git rm components/places/PlaceForm.tsx
git commit -m "feat: wizard PlaceForm 4 étapes style Airbnb (type, infos, lieu, récap)"
```
