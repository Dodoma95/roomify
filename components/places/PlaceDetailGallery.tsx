"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Place } from "@/types/place";
import { useCarousel } from "@/hooks/useCarousel";
import { buildPhotoUrls } from "@/lib/place-photos";
import { cn } from "@/lib/utils";

interface LightboxProps {
  photos: string[];
  placeName: string;
  initialIndex: number;
  onClose: () => void;
}

function Lightbox({ photos, placeName, initialIndex, onClose }: LightboxProps) {
  const { index, prev, next, goTo, count } = useCarousel(photos.length, initialIndex);
  const direction = useRef(1);
  const prefersReduced = useReducedMotion();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  const handlePrev = useCallback(() => { direction.current = -1; prev(); }, [prev]);
  const handleNext = useCallback(() => { direction.current = 1; next(); }, [next]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, handlePrev, handleNext]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: prefersReduced ? 1 : 0.97 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <button
        ref={closeBtnRef}
        type="button"
        aria-label="Fermer la galerie"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white text-sm font-medium select-none">
        {index + 1} / {count}
      </div>

      <div
        className="relative w-full h-full p-12 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="relative w-full h-full"
            initial={{ opacity: 0, x: prefersReduced ? 0 : direction.current * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: prefersReduced ? 0 : direction.current * -40 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Image
              src={photos[index]}
              alt={`${placeName} — photo ${index + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        type="button"
        aria-label="Photo précédente"
        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer",
          index === 0 && "invisible"
        )}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        type="button"
        aria-label="Photo suivante"
        onClick={(e) => { e.stopPropagation(); handleNext(); }}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer",
          index === count - 1 && "invisible"
        )}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Photo ${i + 1}`}
            onClick={(e) => { e.stopPropagation(); goTo(i); }}
            className={cn(
              "w-2 h-2 rounded-full transition-colors cursor-pointer",
              i === index ? "bg-white" : "bg-white/40"
            )}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function PlaceDetailGallery({ place }: { place: Place }) {
  const photos = buildPhotoUrls(place.type, place.id);
  const { index, prev, next, goTo, count } = useCarousel(photos.length);
  const direction = useRef(1);
  const prefersReduced = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  function handlePrev(e: React.MouseEvent) {
    e.preventDefault();
    direction.current = -1;
    prev();
  }

  function handleNext(e: React.MouseEvent) {
    e.preventDefault();
    direction.current = 1;
    next();
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-[2fr_1fr] gap-2 h-80">
          <div
            className="relative overflow-hidden rounded-l-[14px] cursor-pointer"
            onClick={() => setLightboxIndex(0)}
          >
            <motion.div
              className="absolute inset-0"
              whileHover={prefersReduced ? {} : { scale: 1.02 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Image
                src={photos[0]}
                alt={place.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 66vw, 660px"
                priority
              />
            </motion.div>
          </div>

          <div className="flex flex-col gap-2">
            <div
              className="relative flex-1 overflow-hidden rounded-tr-[14px] cursor-pointer"
              onClick={() => setLightboxIndex(1)}
            >
              <motion.div
                className="absolute inset-0"
                whileHover={prefersReduced ? {} : { scale: 1.02 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Image
                  src={photos[1]}
                  alt={place.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 33vw, 330px"
                />
              </motion.div>
            </div>

            <div
              className="relative flex-1 overflow-hidden rounded-br-[14px] cursor-pointer"
              onClick={() => setLightboxIndex(2)}
            >
              <motion.div
                className="absolute inset-0"
                whileHover={prefersReduced ? {} : { scale: 1.02 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Image
                  src={photos[2]}
                  alt={place.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 33vw, 330px"
                />
              </motion.div>
              <button
                type="button"
                aria-label="Voir toutes les photos de cet espace"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(0); }}
                className="absolute bottom-3 right-3 bg-white text-[#222222] text-[13px] font-semibold px-3 py-1.5 rounded-full shadow-tier hover:bg-[#f7f7f7] transition-colors cursor-pointer"
              >
                Voir les 5 photos
              </button>
            </div>
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden relative h-64 rounded-[14px] overflow-hidden bg-[#f7f7f7]">
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
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <button
            type="button"
            aria-label="Photo précédente"
            onClick={handlePrev}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-white/80 shadow-sm cursor-pointer",
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
              "absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-white/80 shadow-sm cursor-pointer",
              index === count - 1 && "invisible"
            )}
          >
            <ChevronRight className="w-4 h-4 text-[#222222]" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Photo ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors duration-150 cursor-pointer",
                  i === index ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            placeName={place.name}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
