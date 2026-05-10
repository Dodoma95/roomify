"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { PlacesPage, PlaceStatus, PlaceType } from "@/types/place";
import { UnavailabilityPeriod } from "@/types/unavailability";
import { BookingResponse, BookingStatus } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2, Laptop, PartyPopper, Music2, Camera,
  Plus, Trash2, CalendarOff, ChevronDown, ChevronUp,
  CalendarRange, X, Pencil, BookOpen,
  CheckCircle2, XCircle, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<PlaceType, { label: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
  MEETING_ROOM:    { label: "Salle de réunion", Icon: Building2 },
  COWORKING_SPACE: { label: "Coworking",        Icon: Laptop },
  EVENT_SPACE:     { label: "Événementiel",     Icon: PartyPopper },
  PARTY_ROOM:      { label: "Salle de fête",    Icon: Music2 },
  STUDIO:          { label: "Studio",           Icon: Camera },
};

const STATUS_BADGE: Record<PlaceStatus, { label: string; className: string }> = {
  APPROVED: { label: "Approuvé",   className: "bg-[#f7f7f7] text-[#222222] border-[#dddddd]" },
  PENDING:  { label: "En attente", className: "bg-amber-500 text-white border-transparent" },
  REJECTED: { label: "Refusé",     className: "bg-[#c13515] text-white border-transparent" },
};

const BOOKING_STATUS_CONFIG: Record<BookingStatus, { label: string; className: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
  PENDING:   { label: "En attente",  className: "bg-amber-50 text-amber-700 border-amber-200",   Icon: Clock },
  CONFIRMED: { label: "Confirmée",   className: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircle2 },
  CANCELLED: { label: "Annulée",     className: "bg-red-50 text-red-600 border-red-200",          Icon: XCircle },
  COMPLETED: { label: "Terminée",    className: "bg-sky-50 text-sky-700 border-sky-200",           Icon: CheckCircle2 },
};

function todayStr() { return new Date().toISOString().slice(0, 10); }

function addDaysStr(d: string, n: number) {
  const [y, m, day] = d.split("-").map(Number);
  const date = new Date(y, m - 1, day);
  date.setDate(date.getDate() + n);
  return date.toISOString().slice(0, 10);
}

function fmtDate(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function fmtDateTime(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// ── Unavailability panel ────────────────────────────────────────────────────

function UnavailabilityPanel({ placeId }: { placeId: string }) {
  const { data, isLoading, mutate } = useSWR<UnavailabilityPeriod[]>(
    `/api/owner/places/${placeId}/unavailability`,
    fetcher
  );
  const [from, setFrom] = useState("");
  const [to, setTo]     = useState("");
  const [blocking, setBlocking]   = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toast = useToast();

  const periods = data ?? [];

  async function handleBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!from || !to) return;
    setBlocking(true);
    try {
      const res = await fetch(`/api/owner/places/${placeId}/unavailability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: from, endDate: to }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        toast.error(json.error ?? "Erreur lors du blocage.");
      } else {
        toast.success("Période bloquée.");
        setFrom("");
        setTo("");
        mutate();
      }
    } catch {
      toast.error("Impossible de contacter le serveur.");
    } finally {
      setBlocking(false);
    }
  }

  async function handleDelete(uid: string) {
    setDeletingId(uid);
    try {
      const res = await fetch(
        `/api/owner/places/${placeId}/unavailability/${uid}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        toast.error("Impossible de supprimer la période.");
      } else {
        toast.success("Période débloquée.");
        mutate();
      }
    } catch {
      toast.error("Impossible de contacter le serveur.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="border-t border-border mt-4 pt-4 space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Périodes bloquées
        </p>

        {isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}

        {!isLoading && periods.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucune période bloquée.</p>
        )}

        {periods.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2"
          >
            <div className="flex items-center gap-2 text-sm">
              <CalendarRange className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-foreground">{fmtDate(p.startDate)}</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-foreground">{fmtDate(p.endDate)}</span>
              <span className={cn(
                "ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border",
                p.reason === "OWNER_BLOCKED"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-sky-50 text-sky-700 border-sky-200"
              )}>
                {p.reason === "OWNER_BLOCKED" ? "Manuel" : "Réservation"}
              </span>
            </div>
            {p.reason === "OWNER_BLOCKED" && (
              <button
                type="button"
                disabled={deletingId === p.id}
                onClick={() => handleDelete(p.id)}
                className="ml-2 text-muted-foreground hover:text-destructive transition-colors duration-150 cursor-pointer disabled:opacity-50"
                aria-label="Supprimer la période"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleBlock} className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Bloquer une période
        </p>
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
          <div className="space-y-1 w-full sm:w-auto">
            <label className="text-xs text-muted-foreground">Du</label>
            <Input
              type="date"
              min={todayStr()}
              value={from}
              onChange={(e) => { setFrom(e.target.value); if (to && to <= e.target.value) setTo(""); }}
              className="h-9 text-sm w-full sm:w-40"
            />
          </div>
          <div className="space-y-1 w-full sm:w-auto">
            <label className="text-xs text-muted-foreground">Au</label>
            <Input
              type="date"
              min={from ? addDaysStr(from, 1) : todayStr()}
              value={to}
              disabled={!from}
              onChange={(e) => setTo(e.target.value)}
              className="h-9 text-sm w-full sm:w-40 disabled:opacity-40"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!from || !to || blocking}
            className="h-9 gap-1.5 cursor-pointer shrink-0"
          >
            <CalendarOff className="w-3.5 h-3.5" />
            {blocking ? "Blocage…" : "Bloquer"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ── Bookings panel ──────────────────────────────────────────────────────────

function BookingsPanel({ placeId }: { placeId: string }) {
  const { data, isLoading, mutate } = useSWR<BookingResponse[]>(
    `/api/owner/places/${placeId}/bookings`,
    fetcher
  );
  const [actionId, setActionId] = useState<string | null>(null);
  const toast = useToast();

  const bookings = data ?? [];

  async function handleAction(bookingId: string, action: "confirm" | "cancel") {
    setActionId(bookingId);
    try {
      const res = await fetch(
        `/api/owner/bookings/${bookingId}/${action}`,
        { method: "PATCH" }
      );
      if (!res.ok) {
        toast.error("Une erreur est survenue.");
      } else {
        toast.success(action === "confirm" ? "Réservation confirmée." : "Réservation annulée.");
        mutate();
      }
    } catch {
      toast.error("Impossible de contacter le serveur.");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="border-t border-border mt-4 pt-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Réservations
      </p>

      {isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}

      {!isLoading && bookings.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucune réservation pour cet espace.</p>
      )}

      <div className="space-y-2">
        {bookings.map((b) => {
          const cfg = BOOKING_STATUS_CONFIG[b.status] ?? BOOKING_STATUS_CONFIG.PENDING;
          const { Icon: StatusIcon } = cfg;
          const busy = actionId === b.id;

          return (
            <div
              key={b.id}
              className="rounded-xl border border-border bg-muted/20 px-4 py-3 space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {b.userFirstName} {b.userLastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fmtDate(b.startDate)} → {fmtDate(b.endDate)}
                  </p>
                  {b.notes && (
                    <p className="text-xs text-muted-foreground italic truncate max-w-sm">
                      « {b.notes} »
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn(
                    "flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                    cfg.className
                  )}>
                    <StatusIcon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                  {b.totalPrice != null && (
                    <span className="text-xs font-semibold text-foreground">
                      {b.totalPrice} €
                    </span>
                  )}
                </div>
              </div>

              {b.status === "PENDING" && (
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    className="h-7 text-xs gap-1 cursor-pointer"
                    disabled={busy}
                    onClick={() => handleAction(b.id, "confirm")}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Confirmer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1 cursor-pointer text-destructive hover:text-destructive"
                    disabled={busy}
                    onClick={() => handleAction(b.id, "cancel")}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Refuser
                  </Button>
                </div>
              )}

              {b.status === "CONFIRMED" && (
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1 cursor-pointer text-destructive hover:text-destructive"
                    disabled={busy}
                    onClick={() => handleAction(b.id, "cancel")}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Annuler
                  </Button>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground">
                Créée le {fmtDateTime(b.createdAt)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Page principale ─────────────────────────────────────────────────────────

type PanelType = "unavailability" | "bookings";

export default function OwnerPlacesPage() {
  const { data, isLoading, mutate } = useSWR<PlacesPage>("/api/owner/places", fetcher);
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [expandedPanel, setExpandedPanel] = useState<PanelType>("unavailability");
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [confirmId, setConfirmId]     = useState<string | null>(null);
  const toast = useToast();

  const places = data?.results ?? [];

  function togglePanel(id: string, panel: PanelType) {
    if (expandedId === id && expandedPanel === panel) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setExpandedPanel(panel);
    }
  }

  async function handleDelete(id: string) {
    if (confirmId !== id) { setConfirmId(id); return; }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/owner/places/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Impossible de supprimer l'espace.");
      } else {
        toast.success("Espace supprimé.");
        mutate();
      }
    } catch {
      toast.error("Impossible de contacter le serveur.");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes espaces</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez vos espaces, leurs réservations et leurs périodes d&apos;indisponibilité.
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full gap-1.5 cursor-pointer shrink-0"
          render={<Link href="/places/new" />}
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter
        </Button>
      </div>

      {isLoading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[88px] rounded-[14px] bg-[#f2f2f2] animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && places.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[14px] bg-[#f7f7f7] py-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#f2f2f2] flex items-center justify-center">
            <Building2 className="w-6 h-6 text-[#6a6a6a]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-semibold text-foreground">Aucun espace pour l&apos;instant</p>
            <p className="text-sm text-muted-foreground mt-1">Créez votre premier espace pour commencer.</p>
          </div>
          <Button size="sm" className="rounded-full gap-1.5 cursor-pointer" render={<Link href="/places/new" />}>
            <Plus className="w-3.5 h-3.5" />
            Ajouter un espace
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {places.map((place) => {
          const typeCfg   = TYPE_CONFIG[place.type] ?? TYPE_CONFIG.MEETING_ROOM;
          const statusCfg = STATUS_BADGE[place.status] ?? STATUS_BADGE.PENDING;
          const { Icon }  = typeCfg;
          const placeId   = String(place.id);
          const isConfirm = confirmId === placeId;

          const unavailExpanded = expandedId === placeId && expandedPanel === "unavailability";
          const bookingsExpanded = expandedId === placeId && expandedPanel === "bookings";

          return (
            <div
              key={place.id}
              className="rounded-[14px] bg-white border border-[#ebebeb] p-5 transition-shadow duration-200 hover:shadow-tier"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 bg-[#f2f2f2]">
                  <Icon className="w-5 h-5 text-[#3f3f3f]" strokeWidth={1.5} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[16px] font-semibold text-[#222222] leading-snug">{place.name}</p>
                    <span className={cn(
                      "text-[11px] font-semibold px-2.5 py-0.5 rounded-full border",
                      statusCfg.className
                    )}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="text-[14px] text-[#6a6a6a] mt-0.5">
                    {typeCfg.label}
                    {place.pricePerHour != null && ` · ${place.pricePerHour} €/h`}
                    {place.capacity != null && ` · ${place.capacity} pers.`}
                  </p>
                  {place.address && (
                    <p className="text-[14px] text-[#6a6a6a] mt-0.5 truncate">{place.address}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  {/* Bookings toggle */}
                  <button
                    type="button"
                    onClick={() => togglePanel(placeId, "bookings")}
                    className={cn(
                      "flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer",
                      bookingsExpanded
                        ? "bg-[#ff385c]/5 text-[#ff385c] border-[#ff385c]"
                        : "border-[#dddddd] text-[#6a6a6a] hover:border-[#222222] hover:text-[#222222]"
                    )}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Réservations</span>
                    {bookingsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Unavailability toggle */}
                  <button
                    type="button"
                    onClick={() => togglePanel(placeId, "unavailability")}
                    className={cn(
                      "flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer",
                      unavailExpanded
                        ? "bg-[#ff385c]/5 text-[#ff385c] border-[#ff385c]"
                        : "border-[#dddddd] text-[#6a6a6a] hover:border-[#222222] hover:text-[#222222]"
                    )}
                  >
                    <CalendarOff className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Indisponibilités</span>
                    {unavailExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Edit */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-[13px] gap-1 cursor-pointer border-[#dddddd] text-[#222222] hover:border-[#222222]"
                    render={<Link href={`/owner/places/${placeId}/edit`} />}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Modifier</span>
                  </Button>

                  {/* Delete */}
                  <Button
                    size="sm"
                    variant={isConfirm ? "destructive" : "ghost"}
                    className={cn(
                      "rounded-full text-[13px] gap-1 cursor-pointer",
                      isConfirm
                        ? "font-semibold"
                        : "text-[#6a6a6a] hover:text-[#c13515] hover:bg-transparent"
                    )}
                    disabled={deletingId === placeId}
                    onClick={() => handleDelete(placeId)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {isConfirm ? "Confirmer" : "Supprimer"}
                  </Button>
                  {isConfirm && (
                    <button
                      type="button"
                      className="text-[13px] text-[#6a6a6a] hover:text-[#222222] cursor-pointer"
                      onClick={() => setConfirmId(null)}
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>

              {unavailExpanded && <UnavailabilityPanel placeId={placeId} />}
              {bookingsExpanded && <BookingsPanel placeId={placeId} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
