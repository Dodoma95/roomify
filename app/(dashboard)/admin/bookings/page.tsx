"use client";

import { useState } from "react";
import useSWR from "swr";
import { BookingResponse, BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, Info, CheckCircle2, XCircle, CalendarCheck } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_BADGES: Record<BookingStatus, { label: string; className: string }> = {
  PENDING:   { label: "En attente",  className: "bg-amber-100 text-amber-800 border-amber-200" },
  CONFIRMED: { label: "Confirmée",   className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  CANCELLED: { label: "Annulée",     className: "bg-red-100 text-red-800 border-red-200" },
  COMPLETED: { label: "Terminée",    className: "bg-sky-100 text-sky-800 border-sky-200" },
};

function useBookings(placeId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<BookingResponse[]>(
    placeId ? `/api/admin/bookings?placeId=${placeId}` : null,
    fetcher
  );
  return { data, error, isLoading, mutate };
}

export default function AdminBookingsPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchedId, setSearchedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const toast = useToast();

  const { data, error, isLoading, mutate } = useBookings(searchedId);
  const bookings: BookingResponse[] = Array.isArray(data) ? data : [];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) setSearchedId(trimmed);
  }

  async function handleAction(id: string, action: "confirm" | "cancel") {
    setActionLoading(`${id}-${action}`);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/${action}`, { method: "POST" });
      if (!res.ok) {
        toast.error("Une erreur est survenue.");
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestion des réservations</h1>
        <p className="text-sm text-muted-foreground mt-1">Confirmez ou annulez les réservations par espace.</p>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 dark:bg-sky-950/30 dark:border-sky-800 px-4 py-3 text-sm text-sky-800 dark:text-sky-200">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          La recherche globale des réservations n'est pas disponible. Entrez l'ID d'un espace pour voir ses réservations.
        </span>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-md">
        <Input
          placeholder="ID de l'espace…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" className="gap-1.5 shrink-0">
          <Search className="w-4 h-4" />
          Rechercher
        </Button>
      </form>

      {!searchedId && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-muted/30 py-16 px-8 text-center space-y-3">
          <CalendarCheck className="w-8 h-8 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Entrez un ID d'espace pour charger ses réservations.</p>
        </div>
      )}

      {searchedId && isLoading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">Chargement…</div>
      )}

      {searchedId && error && (
        <p className="text-destructive text-sm">Erreur : {error?.error ?? "Impossible de charger les réservations."}</p>
      )}

      {searchedId && !isLoading && !error && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-muted/30 py-12 px-8 text-center space-y-2">
          <CalendarCheck className="w-7 h-7 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Aucune réservation pour cet espace.</p>
        </div>
      )}

      {searchedId && !isLoading && bookings.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Espace</th>
                <th className="px-4 py-3 text-left font-medium">Locataire</th>
                <th className="px-4 py-3 text-left font-medium">Dates</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Prix total</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const statusCfg = STATUS_BADGES[booking.status];
                return (
                  <tr key={booking.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{booking.placeName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {booking.userFirstName} {booking.userLastName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(booking.startDate).toLocaleDateString("fr-FR")}
                      {" — "}
                      {new Date(booking.endDate).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                          statusCfg.className
                        )}
                      >
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {booking.totalPrice != null ? `${booking.totalPrice} €` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1 text-emerald-700 hover:text-emerald-700 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50"
                          disabled={
                            booking.status !== "PENDING" ||
                            actionLoading === `${booking.id}-confirm`
                          }
                          onClick={() => handleAction(booking.id, "confirm")}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirmer
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1 text-destructive hover:text-destructive border-red-200 hover:border-red-300 hover:bg-red-50"
                          disabled={
                            booking.status === "CANCELLED" ||
                            booking.status === "COMPLETED" ||
                            actionLoading === `${booking.id}-cancel`
                          }
                          onClick={() => handleAction(booking.id, "cancel")}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Annuler
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
