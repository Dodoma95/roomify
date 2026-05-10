"use client";

import { use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePlaceById } from "@/hooks/usePlaces";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Building2,
  Users, MapPin, Clock, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

function buildImageSeed(type: string, id: string | number): string {
  return `${type.toLowerCase().replace(/_/g, "-")}-${id}`;
}

const TYPE_CONFIG: Record<string, { label: string }> = {
  MEETING_ROOM:    { label: "Salle de réunion" },
  COWORKING_SPACE: { label: "Coworking" },
  EVENT_SPACE:     { label: "Événementiel" },
  PARTY_ROOM:      { label: "Salle de fête" },
  STUDIO:          { label: "Studio" },
};

const STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  APPROVED: { label: "Disponible", badge: "bg-[#f7f7f7] text-[#222222] border-[#dddddd]" },
  PENDING:  { label: "En attente", badge: "bg-amber-500 text-white border-transparent" },
  REJECTED: { label: "Refusé",     badge: "bg-[#c13515] text-white border-transparent" },
};

function Skeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-pulse">
      <div className="h-4 w-20 bg-muted rounded-md" />
      <div className="h-72 rounded-2xl bg-muted" />
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-4">
          <div className="h-7 w-2/3 bg-muted rounded-md" />
          <div className="h-4 w-full bg-muted rounded-md" />
          <div className="h-4 w-4/5 bg-muted rounded-md" />
          <div className="h-4 w-1/2 bg-muted rounded-md" />
        </div>
        <div className="h-56 bg-muted rounded-2xl" />
      </div>
    </div>
  );
}

export default function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { place, isLoading, error } = usePlaceById(id);

  if (isLoading) return <Skeleton />;

  if (error || !place) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
          <Building2 className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-semibold text-foreground">Espace introuvable</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error?.message ?? "Cet espace n'existe pas ou a été supprimé."}
          </p>
        </div>
        <Button variant="outline" className="cursor-pointer" onClick={() => router.push("/places")}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  const type = TYPE_CONFIG[place.type] ?? TYPE_CONFIG.MEETING_ROOM;
  const status = STATUS_CONFIG[place.status] ?? STATUS_CONFIG.PENDING;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      {/* Hero */}
      <div className="relative h-72 rounded-[14px] overflow-hidden bg-[#f7f7f7]">
        <Image
          src={`https://picsum.photos/seed/${buildImageSeed(place.type, place.id)}/1600/600`}
          alt={place.name}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent pt-20 pb-6 px-7">
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-3xl font-bold text-white leading-tight">{place.name}</h1>
            <span className={cn("shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-sm", status.badge)}>
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">

        {/* ── Left ── */}
        <div className="space-y-7">
          {/* chips */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="rounded-full px-3 py-1 bg-[#f7f7f7] text-[#222222] border border-[#dddddd] text-[13px] font-medium">
              {type.label}
            </span>
            {place.capacity != null && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                Jusqu'à {place.capacity} personnes
              </span>
            )}
          </div>

          {/* Description */}
          {place.description && (
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">À propos de cet espace</h2>
              <p className="text-muted-foreground leading-relaxed">{place.description}</p>
            </div>
          )}

          <div className="border-t border-[#dddddd]" />

          {/* Info tiles */}
          <div className="grid sm:grid-cols-2 gap-5">
            {place.address && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[8px] bg-[#f2f2f2] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#6a6a6a]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Adresse</p>
                  <p className="text-sm text-foreground">{place.address}</p>
                </div>
              </div>
            )}

            {place.pricePerHour != null && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[8px] bg-[#f2f2f2] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#6a6a6a]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Tarif</p>
                  <p className="text-sm font-semibold text-foreground">{place.pricePerHour} €/heure</p>
                </div>
              </div>
            )}

            {place.owner && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[8px] bg-[#f2f2f2] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#6a6a6a]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Propriétaire</p>
                  <p className="text-sm text-foreground">{place.owner.firstName} {place.owner.lastName}</p>
                  <p className="text-xs text-muted-foreground">{place.owner.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: booking card ── */}
        <div className="sticky top-20">
          <div className="rounded-[14px] border border-[#dddddd] bg-white p-6 space-y-5 shadow-tier">
            {place.pricePerHour != null && (
              <p className="text-3xl font-bold text-foreground">
                {place.pricePerHour} €
                <span className="text-base font-normal text-muted-foreground ml-1">/heure</span>
              </p>
            )}

            <div className="border-t border-[#dddddd]" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Statut</span>
                <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", status.badge)}>
                  {status.label}
                </span>
              </div>
              {place.capacity != null && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Capacité</span>
                  <span className="font-medium">{place.capacity} pers.</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{type.label}</span>
              </div>
            </div>

            <Button
              className="w-full h-11 font-semibold cursor-pointer"
              disabled={place.status !== "APPROVED"}
            >
              {place.status === "APPROVED" ? "Réserver cet espace" : "Non disponible"}
            </Button>

            {place.status !== "APPROVED" ? (
              <p className="text-xs text-center text-muted-foreground">
                Cet espace n'est pas encore disponible à la réservation.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
