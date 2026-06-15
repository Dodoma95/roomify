"use client";

import { useState } from "react";
import useSWR from "swr";
import { BookingGraphQLResponse, BookingPage, BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, CheckCircle2, XCircle, CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_TABS: { label: string; value: BookingStatus | null }[] = [
  { label: "Tous",       value: null },
  { label: "En attente", value: "PENDING" },
  { label: "Confirmées", value: "CONFIRMED" },
  { label: "Annulées",   value: "CANCELLED" },
  { label: "Terminées",  value: "COMPLETED" },
];

const STATUS_BADGES: Record<BookingStatus, { label: string; className: string }> = {
  PENDING:   { label: "En attente",  className: "bg-amber-100 text-amber-800 border-amber-200" },
  CONFIRMED: { label: "Confirmée",   className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  CANCELLED: { label: "Annulée",     className: "bg-red-100 text-red-800 border-red-200" },
  COMPLETED: { label: "Terminée",    className: "bg-sky-100 text-sky-800 border-sky-200" },
};

const TYPE_LABELS: Record<string, string> = {
  MEETING_ROOM:    "Réunion",
  COWORKING_SPACE: "Coworking",
  EVENT_SPACE:     "Événement",
  PARTY_ROOM:      "Fête",
  STUDIO:          "Studio",
};

const PAGE_SIZE = 20;

function useAdminBookings(
  status: BookingStatus | null,
  placeName: string,
  userEmail: string,
  page: number
) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (placeName) params.set("placeName", placeName);
  if (userEmail) params.set("userEmail", userEmail);
  params.set("page", String(page));
  params.set("size", String(PAGE_SIZE));
  return useSWR<BookingPage>(`/api/admin/bookings?${params.toString()}`, fetcher);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminBookingsPage() {
  const [activeStatus, setActiveStatus] = useState<BookingStatus | null>(null);
  const [placeInput, setPlaceInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [activePlaceName, setActivePlaceName] = useState("");
  const [activeEmail, setActiveEmail] = useState("");
  const [page, setPage] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const toast = useToast();

  const { data, error, isLoading, mutate } = useAdminBookings(activeStatus, activePlaceName, activeEmail, page);
  const bookings: BookingGraphQLResponse[] = data?.results ?? [];
  const pageInfo = data?.pageInfo;

  function handleTabChange(status: BookingStatus | null) {
    setActiveStatus(status);
    setPage(0);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setActivePlaceName(placeInput.trim());
    setActiveEmail(emailInput.trim());
    setPage(0);
  }

  async function handleAction(id: string, action: "confirm" | "cancel") {
    setActionLoading(`${id}-${action}`);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/${action}`, { method: "PATCH" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast.error((d as {error?: string}).error ?? "Une erreur est survenue.");
      } else {
        toast.success(action === "confirm" ? "Réservation confirmée." : "Réservation annulée.");
        await mutate();
      }
    } catch {
      toast.error("Impossible de contacter le serveur.");
    } finally {
      setActionLoading(null);
    }
  }

  const ActionButtons = ({ booking }: { booking: BookingGraphQLResponse }) => (
    <>
      <Button
        size="sm"
        variant="outline"
        className="text-xs gap-1 text-emerald-700 hover:text-emerald-700 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50"
        disabled={booking.status !== "PENDING" || actionLoading === `${booking.id}-confirm`}
        onClick={() => handleAction(booking.id, "confirm")}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        Confirmer
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-xs gap-1 text-destructive hover:text-destructive border-red-200 hover:border-red-300 hover:bg-red-50"
        disabled={booking.status === "CANCELLED" || booking.status === "COMPLETED" || actionLoading === `${booking.id}-cancel`}
        onClick={() => handleAction(booking.id, "cancel")}
      >
        <XCircle className="w-3.5 h-3.5" />
        Annuler
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222222] dark:text-[#f0f0f0]">Gestion des réservations</h1>
        <p className="text-sm text-[#6a6a6a] mt-1">Consultez, confirmez ou annulez les réservations.</p>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="inline-flex rounded-[8px] border border-[#dddddd] p-1 bg-[#f2f2f2] gap-1 dark:bg-[#2a2a2a] dark:border-[#3a3a3a]">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                "px-4 py-1.5 rounded-[6px] text-sm font-medium transition-colors duration-150 whitespace-nowrap",
                activeStatus === tab.value
                  ? "bg-white shadow-sm text-[#222222] dark:bg-[#3a3a3a] dark:text-[#f0f0f0]"
                  : "text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Nom de l'espace…"
          value={placeInput}
          onChange={(e) => setPlaceInput(e.target.value)}
          className="w-full sm:w-48"
        />
        <Input
          placeholder="Email du locataire…"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="w-full sm:w-52"
        />
        <Button type="submit" variant="outline" className="gap-1.5 shrink-0">
          <Search className="w-4 h-4" />
          Filtrer
        </Button>
        {(activePlaceName || activeEmail) && (
          <button
            type="button"
            onClick={() => {
              setPlaceInput(""); setEmailInput("");
              setActivePlaceName(""); setActiveEmail("");
              setPage(0);
            }}
            className="text-xs text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0]"
          >
            Réinitialiser
          </button>
        )}
      </form>

      {error && (
        <p className="text-destructive text-sm">Erreur : impossible de charger les réservations.</p>
      )}

      {/* Mobile : cartes */}
      <div className="md:hidden space-y-3">
        {isLoading && [1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-[14px] bg-[#f2f2f2] dark:bg-[#2a2a2a] animate-pulse" />
        ))}
        {!isLoading && bookings.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-[#6a6a6a]">
            <CalendarCheck className="w-7 h-7" />
            <p className="text-sm">Aucune réservation trouvée.</p>
          </div>
        )}
        {bookings.map((booking) => {
          const s = STATUS_BADGES[booking.status];
          return (
            <div key={booking.id} className="rounded-[14px] border border-[#dddddd] dark:border-[#3a3a3a] bg-white dark:bg-[#1a1a1a] p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[#222222] dark:text-[#f0f0f0]">{booking.place.name}</p>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#f2f2f2] text-[#6a6a6a] dark:bg-[#3a3a3a] mt-0.5">
                    {TYPE_LABELS[booking.place.type] ?? booking.place.type}
                  </span>
                </div>
                <span className={cn("shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", s.className)}>
                  {s.label}
                </span>
              </div>
              <div className="text-sm text-[#6a6a6a] space-y-1">
                <p><span className="font-medium text-[#222222] dark:text-[#f0f0f0]">Locataire :</span> {booking.booker.firstName} {booking.booker.lastName}</p>
                <p className="text-xs">{booking.booker.email}</p>
                <p><span className="font-medium text-[#222222] dark:text-[#f0f0f0]">Propriétaire :</span> {booking.place.owner.firstName} {booking.place.owner.lastName}</p>
                <p><span className="font-medium text-[#222222] dark:text-[#f0f0f0]">Dates :</span> {fmtDate(booking.startDate)} → {fmtDate(booking.endDate)}</p>
                {booking.totalPrice != null && (
                  <p><span className="font-medium text-[#222222] dark:text-[#f0f0f0]">Prix :</span> {booking.totalPrice} €</p>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <ActionButtons booking={booking} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop : tableau */}
      <div className="hidden md:block rounded-[14px] border border-[#dddddd] dark:border-[#3a3a3a]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-[#f2f2f2] text-[#6a6a6a] dark:bg-[#2a2a2a]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Espace</th>
                <th className="px-4 py-3 text-left font-medium">Locataire</th>
                <th className="px-4 py-3 text-left font-medium">Propriétaire</th>
                <th className="px-4 py-3 text-left font-medium">Dates</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Prix</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#6a6a6a]">Chargement…</td>
                </tr>
              )}
              {!isLoading && bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CalendarCheck className="w-7 h-7 text-[#6a6a6a]" />
                      <p className="text-[#6a6a6a] text-sm">Aucune réservation trouvée.</p>
                    </div>
                  </td>
                </tr>
              )}
              {bookings.map((booking) => {
                const statusCfg = STATUS_BADGES[booking.status];
                return (
                  <tr key={booking.id} className="border-t border-[#dddddd] hover:bg-[#f7f7f7] dark:border-[#3a3a3a] dark:hover:bg-[#2a2a2a] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#222222] dark:text-[#f0f0f0]">{booking.place.name}</p>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#f2f2f2] text-[#6a6a6a] dark:bg-[#3a3a3a] mt-0.5">
                        {TYPE_LABELS[booking.place.type] ?? booking.place.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#222222] dark:text-[#f0f0f0]">{booking.booker.firstName} {booking.booker.lastName}</p>
                      <p className="text-xs text-[#929292]">{booking.booker.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[#6a6a6a] whitespace-nowrap">
                      {booking.place.owner.firstName} {booking.place.owner.lastName}
                    </td>
                    <td className="px-4 py-3 text-[#6a6a6a] whitespace-nowrap">
                      {new Date(booking.startDate).toLocaleDateString("fr-FR")}
                      {" — "}
                      {new Date(booking.endDate).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", statusCfg.className)}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6a6a6a] whitespace-nowrap">
                      {booking.totalPrice != null ? `${booking.totalPrice} €` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ActionButtons booking={booking} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {pageInfo && pageInfo.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#6a6a6a]">
          <span>Page {pageInfo.page + 1} sur {pageInfo.totalPages} ({pageInfo.totalElements} réservations)</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" disabled={!pageInfo.hasPrevious} onClick={() => setPage((p) => p - 1)} className="gap-1">
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            <Button size="sm" variant="outline" disabled={!pageInfo.hasNext} onClick={() => setPage((p) => p + 1)} className="gap-1">
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}