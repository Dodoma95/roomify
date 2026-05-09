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
