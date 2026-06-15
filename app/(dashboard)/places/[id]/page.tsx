"use client";

import { use, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { DayPicker, DateRange } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import { usePlaceById } from "@/hooks/usePlaces";
import { useToast } from "@/hooks/useToast";
import { UnavailabilityPeriod } from "@/types/unavailability";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Building2, Users, MapPin, Clock, User,
  Loader2, AlertCircle, CalendarCheck, CalendarOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function parseDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmtDate(str: string): string {
  return parseDate(str).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
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

function buildImageSeed(type: string, id: string | number): string {
  return `${type.toLowerCase().replace(/_/g, "-")}-${id}`;
}

function Skeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-pulse">
      <div className="h-4 w-20 bg-[#f2f2f2] rounded-md" />
      <div className="h-72 rounded-[14px] bg-[#f2f2f2]" />
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-4">
          <div className="h-7 w-2/3 bg-[#f2f2f2] rounded-md" />
          <div className="h-4 w-full bg-[#f2f2f2] rounded-md" />
          <div className="h-4 w-4/5 bg-[#f2f2f2] rounded-md" />
        </div>
        <div className="h-64 bg-[#f2f2f2] rounded-[14px]" />
      </div>
    </div>
  );
}

export default function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();
  const { place, isLoading, error } = usePlaceById(id);

  const { data: unavailability } = useSWR<UnavailabilityPeriod[]>(
    `/api/places/${id}/unavailability`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const [bookingOpen, setBookingOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const periods: UnavailabilityPeriod[] = Array.isArray(unavailability) ? unavailability : [];

  const unavailabilityMatchers = periods.map((p) => ({
    from: parseDate(p.startDate),
    to: parseDate(p.endDate),
  }));

  const disabledDays = [
    { before: today },
    ...unavailabilityMatchers,
  ];

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!range?.from || !range?.to) return;
    setSubmitting(true);
    setBookingError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: place?.id,
          startDate: toISO(range.from),
          endDate: toISO(range.to),
          notes: notes.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setBookingError((d as { error?: string }).error ?? "Une erreur est survenue.");
        return;
      }
      setBooked(true);
      toast.success("Réservation effectuée avec succès !");
      setTimeout(() => router.push("/profile"), 1500);
    } catch {
      setBookingError("Impossible de contacter le serveur.");
    } finally {
      setSubmitting(false);
    }
  }

  function openForm() {
    setBookingOpen(true);
    setBookingError(null);
    setRange(undefined);
    setNotes("");
    setBooked(false);
  }

  if (isLoading) return <Skeleton />;

  if (error || !place) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-14 h-14 rounded-[14px] bg-[#f2f2f2] flex items-center justify-center">
          <Building2 className="w-6 h-6 text-[#6a6a6a]" strokeWidth={1.5} />
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
          {/* Type + capacity chips */}
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

          {/* Unavailability list */}
          {periods.length > 0 && (
            <>
              <div className="border-t border-[#dddddd]" />
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-foreground">Périodes indisponibles</h2>
                <div className="space-y-2">
                  {periods.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 flex-wrap text-sm">
                      <CalendarOff className="w-3.5 h-3.5 shrink-0 text-[#c13515]" />
                      <span className="text-foreground">
                        {fmtDate(p.startDate)} → {fmtDate(p.endDate)}
                      </span>
                      <span className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded-full border",
                        p.reason === "BOOKING"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-[#f2f2f2] text-[#6a6a6a] border-[#dddddd]"
                      )}>
                        {p.reason === "BOOKING" ? "Réservé" : "Bloqué"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Right: booking card ── */}
        <div className="sticky top-20">
          <div className="rounded-[14px] border border-[#dddddd] bg-white dark:bg-[#1a1a1a] shadow-tier overflow-hidden">

            {/* ── Success state ── */}
            {booked ? (
              <div className="flex flex-col items-center gap-3 py-8 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center">
                  <CalendarCheck className="w-6 h-6 text-[#15803d]" />
                </div>
                <p className="font-semibold text-foreground">Réservation envoyée !</p>
                <p className="text-sm text-muted-foreground">Redirection vers vos réservations…</p>
              </div>

            /* ── Booking form ── */
            ) : bookingOpen ? (
              <form onSubmit={handleBook}>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 px-5 py-4 border-b border-[#f2f2f2]">
                  <p className="font-semibold text-foreground text-[15px]">Choisir vos dates</p>
                  <button
                    type="button"
                    onClick={() => setBookingOpen(false)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Annuler
                  </button>
                </div>

                {/* Calendar */}
                <div className="px-3 py-2 flex justify-center">
                  <DayPicker
                    mode="range"
                    locale={fr}
                    weekStartsOn={1}
                    selected={range}
                    onSelect={(r) => { setRange(r); setBookingError(null); }}
                    disabled={disabledDays}
                    modifiers={{ unavailable: unavailabilityMatchers }}
                    modifiersClassNames={{ unavailable: "rdp-unavailable" }}
                    showOutsideDays={false}
                  />
                </div>

                <div className="px-5 pb-5 space-y-4">
                  {/* Selected dates summary */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className={cn(
                      "rounded-[8px] border px-3 py-2 text-sm transition-colors",
                      range?.from ? "border-[#222222]" : "border-[#dddddd]"
                    )}>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Arrivée</p>
                      <p className={cn("font-medium", range?.from ? "text-foreground" : "text-muted-foreground")}>
                        {range?.from ? range.from.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—"}
                      </p>
                    </div>
                    <div className={cn(
                      "rounded-[8px] border px-3 py-2 text-sm transition-colors",
                      range?.to ? "border-[#222222]" : "border-[#dddddd]"
                    )}>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Départ</p>
                      <p className={cn("font-medium", range?.to ? "text-foreground" : "text-muted-foreground")}>
                        {range?.to ? range.to.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Notes <span className="font-normal">(optionnel)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Informations pour le propriétaire…"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-[8px] border border-[#dddddd] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#222222]/20 focus:border-[#222222] resize-none transition"
                    />
                  </div>

                  {/* Error */}
                  {bookingError && (
                    <div className="flex items-start gap-2 rounded-[8px] bg-[#fef2f2] border border-[#fecaca] p-3 text-sm text-[#c13515]">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  {place.pricePerHour != null && (
                    <p className="text-xs text-muted-foreground text-center">
                      {place.pricePerHour} €/h · total calculé à la confirmation
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-10 font-semibold cursor-pointer"
                    disabled={!range?.from || !range?.to || submitting}
                  >
                    {submitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi…</>
                      : "Confirmer la réservation"
                    }
                  </Button>
                </div>
              </form>

            /* ── Info card ── */
            ) : (
              <div className="p-6 space-y-5">
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
                  {periods.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
                      <CalendarOff className="w-3.5 h-3.5 text-[#c13515]" />
                      {periods.length} période{periods.length > 1 ? "s" : ""} indisponible{periods.length > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
                <Button
                  className="w-full h-11 font-semibold cursor-pointer"
                  disabled={place.status !== "APPROVED"}
                  onClick={openForm}
                >
                  {place.status === "APPROVED" ? "Réserver cet espace" : "Non disponible"}
                </Button>
                {place.status !== "APPROVED" && (
                  <p className="text-xs text-center text-muted-foreground">
                    Cet espace n'est pas encore disponible à la réservation.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
