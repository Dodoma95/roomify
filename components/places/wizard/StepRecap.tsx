"use client";

import { CreatePlaceInput } from "@/types/place";
import { PLACE_TYPE_META } from "./constants";

interface StepRecapProps {
  formData: CreatePlaceInput;
  onGoToStep: (step: number) => void;
}

export function StepRecap({ formData, onGoToStep }: StepRecapProps) {
  const typeMeta = PLACE_TYPE_META.find((t) => t.value === formData.type) ?? PLACE_TYPE_META[0];
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
