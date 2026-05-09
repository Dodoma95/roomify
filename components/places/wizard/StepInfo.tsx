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
          <label htmlFor="place-name" className={labelClass}>Nom de l&apos;espace *</label>
          <input
            id="place-name"
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
          <label htmlFor="place-description" className={labelClass}>Description *</label>
          <textarea
            id="place-description"
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
