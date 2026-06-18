"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Place } from "@/types/place";
import { useCarousel } from "@/hooks/useCarousel";
import { buildPhotoUrls } from "@/lib/place-photos";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  MEETING_ROOM: "Salle de réunion",
  COWORKING_SPACE: "Coworking",
  EVENT_SPACE: "Événementiel",
  PARTY_ROOM: "Salle de fête",
  STUDIO: "Studio",
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  PENDING: { label: "En attente", className: "bg-amber-500/80 text-white" },
  REJECTED: { label: "Refusé", className: "bg-[#c13515]/80 text-white" },
};

export function PlaceCardCarousel({ place }: { place: Place }) {
  const photos = buildPhotoUrls(place.type, place.id);
  const { index, prev, next, goTo, count } = useCarousel(photos.length);
  const direction = useRef(1);
  const prefersReduced = useReducedMotion();
  const typeLabel = TYPE_LABELS[place.type] ?? place.type;
  const statusBadge = STATUS_BADGES[place.status];

  function handlePrev(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    direction.current = -1;
    prev();
  }

  function handleNext(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    direction.current = 1;
    next();
  }

  return (
    <div className="group relative aspect-square rounded-[14px] overflow-hidden bg-[#f7f7f7]">
      <motion.div
        className="absolute inset-0"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.x < -40) { direction.current = 1; next(); }
          else if (info.offset.x > 40) { direction.current = -1; prev(); }
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, x: prefersReduced ? 0 : direction.current * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: prefersReduced ? 0 : direction.current * -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Image
              src={photos[index]}
              alt={place.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-tier">
        <span className="text-[11px] font-semibold text-[#222222] leading-none">{typeLabel}</span>
      </div>

      {statusBadge && (
        <div className={cn(
          "absolute bottom-3 left-3 z-10 px-3 py-1 rounded-full text-[11px] font-semibold",
          statusBadge.className
        )}>
          {statusBadge.label}
        </div>
      )}

      <button
        type="button"
        aria-label="Sauvegarder"
        onClick={(e) => e.preventDefault()}
        className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/80 hover:bg-white transition-colors duration-150 cursor-pointer"
      >
        <Heart className="w-4 h-4 text-[#222222]" strokeWidth={1.75} />
      </button>

      <button
        type="button"
        aria-label="Photo précédente"
        onClick={handlePrev}
        className={cn(
          "hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-7 h-7 rounded-full bg-white/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150",
          index === 0 && "invisible"
        )}
      >
        <ChevronLeft className="w-4 h-4 text-[#222222]" />
      </button>

      <button
        type="button"
        aria-label="Photo suivante"
        onClick={handleNext}
        className={cn(
          "hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-7 h-7 rounded-full bg-white/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150",
          index === count - 1 && "invisible"
        )}
      >
        <ChevronRight className="w-4 h-4 text-[#222222]" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Photo ${i + 1}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(i); }}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors duration-150",
              i === index ? "bg-white" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
