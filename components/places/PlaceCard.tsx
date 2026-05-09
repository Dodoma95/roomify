import Link from "next/link";
import Image from "next/image";
import { Place } from "@/types/place";
import { MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  MEETING_ROOM:    "Salle de réunion",
  COWORKING_SPACE: "Coworking",
  EVENT_SPACE:     "Événementiel",
  PARTY_ROOM:      "Salle de fête",
  STUDIO:          "Studio",
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  PENDING:  { label: "En attente",  className: "bg-amber-500/80  text-white" },
  REJECTED: { label: "Refusé",      className: "bg-[#c13515]/80  text-white" },
};

function buildImageSeed(type: string, id: string | number): string {
  const normalized = type.toLowerCase().replace(/_/g, "-");
  return `${normalized}-${id}`;
}

export function PlaceCard({ place }: { place: Place }) {
  const typeLabel   = TYPE_LABELS[place.type] ?? place.type;
  const statusBadge = STATUS_BADGES[place.status];
  const seed = buildImageSeed(place.type, place.id);

  return (
    <Link
      href={`/places/${place.id}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c] rounded-[14px]"
    >
      {/* Photo */}
      <div className="relative aspect-square rounded-[14px] overflow-hidden bg-[#f7f7f7]">
        <Image
          src={`https://picsum.photos/seed/${seed}/800/800`}
          alt={place.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Type badge — top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-tier">
          <span className="text-[11px] font-semibold text-[#222222] leading-none">
            {typeLabel}
          </span>
        </div>

        {/* Status badge — top center (PENDING / REJECTED only) */}
        {statusBadge && (
          <div className={cn(
            "absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-semibold",
            statusBadge.className
          )}>
            {statusBadge.label}
          </div>
        )}

        {/* Heart — top right */}
        <button
          type="button"
          aria-label="Sauvegarder"
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white/80 hover:bg-white transition-colors duration-150 cursor-pointer"
        >
          <Heart className="w-4 h-4 text-[#222222]" strokeWidth={1.75} />
        </button>
      </div>

      {/* Meta block */}
      <div className="mt-3 space-y-1 px-0.5">
        {/* Name + price */}
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

        {/* Address */}
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
