import Link from "next/link";
import { Place } from "@/types/place";
import { MapPin } from "lucide-react";
import { PlaceCardCarousel } from "./PlaceCardCarousel";

export function PlaceCard({ place }: { place: Place }) {
  return (
    <Link
      href={`/places/${place.id}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c] rounded-[14px]"
    >
      <PlaceCardCarousel place={place} />

      <div className="mt-3 space-y-1 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16px] font-semibold text-[#222222] dark:text-[#f0f0f0] leading-snug line-clamp-1 flex-1">
            {place.name}
          </h3>
          {place.pricePerHour != null && (
            <p className="text-[14px] font-semibold text-[#222222] dark:text-[#f0f0f0] shrink-0">
              {place.pricePerHour} €
              <span className="font-normal text-[#6a6a6a]"> /h</span>
            </p>
          )}
        </div>
        {place.address && (
          <p className="flex items-center gap-1 text-[14px] text-[#6a6a6a] line-clamp-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {place.address}
          </p>
        )}
      </div>
    </Link>
  );
}
