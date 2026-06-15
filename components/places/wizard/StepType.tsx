"use client";

import {cn} from "@/lib/utils";
import {PlaceType} from "@/types/place";
import {PLACE_TYPE_META} from "./constants";

interface StepTypeProps {
    value: PlaceType;
    onChange: (type: PlaceType) => void;
}

export function StepType({value, onChange}: StepTypeProps) {
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
                {PLACE_TYPE_META.map(({value: v, label, Icon}) => (
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
                            <Icon className="w-6 h-6 text-[#222222]" strokeWidth={1.5}/>
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
