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
