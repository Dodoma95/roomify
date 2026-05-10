"use client";

import { useState } from "react";
import useSWR from "swr";
import { PlacesPage, PlaceStatus } from "@/types/place";
import { useToast } from "@/hooks/useToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Tab = { label: string; status: PlaceStatus | null };

const TABS: Tab[] = [
  { label: "Tous",        status: null },
  { label: "En attente",  status: "PENDING" },
  { label: "Approuvés",   status: "APPROVED" },
  { label: "Refusés",     status: "REJECTED" },
];

const STATUS_BADGES: Record<PlaceStatus, { label: string; className: string }> = {
  PENDING:  { label: "En attente", className: "bg-amber-100 text-amber-800 border-amber-200" },
  APPROVED: { label: "Approuvé",   className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  REJECTED: { label: "Refusé",     className: "bg-red-100 text-red-800 border-red-200" },
};

const TYPE_LABELS: Record<string, string> = {
  MEETING_ROOM:    "Salle de réunion",
  COWORKING_SPACE: "Coworking",
  EVENT_SPACE:     "Événementiel",
  PARTY_ROOM:      "Salle de fête",
  STUDIO:          "Studio",
};

const PAGE_SIZE = 20;

function useAdminPlaces(status: PlaceStatus | null, page: number) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  params.set("page", String(page));
  params.set("size", String(PAGE_SIZE));
  const { data, error, isLoading, mutate } = useSWR<PlacesPage>(
    `/api/admin/places?${params.toString()}`,
    fetcher
  );
  return { data, error, isLoading, mutate };
}

export default function AdminPlacesPage() {
  const [activeTab, setActiveTab] = useState<PlaceStatus | null>(null);
  const [page, setPage] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const toast = useToast();

  const { data, isLoading, mutate } = useAdminPlaces(activeTab, page);
  const places = data?.results ?? [];
  const pageInfo = data?.pageInfo;

  function handleTabChange(status: PlaceStatus | null) {
    setActiveTab(status);
    setPage(0);
  }

  async function handleDelete(id: string) {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/places/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Impossible de supprimer l'espace.");
      } else {
        toast.success("Espace supprimé.");
        await mutate();
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestion des espaces</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Consultez et supprimez les espaces de la plateforme.
        </p>
      </div>

      <div className="inline-flex rounded-lg border border-border p-1 bg-muted/40 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabChange(tab.status)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-150",
              activeTab === tab.status
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Nom</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Propriétaire</th>
              <th className="px-4 py-3 text-left font-medium">Statut</th>
              <th className="px-4 py-3 text-left font-medium">Prix/h</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Chargement…
                </td>
              </tr>
            )}
            {!isLoading && places.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Aucun espace trouvé.
                </td>
              </tr>
            )}
            {places.map((place) => {
              const statusCfg = STATUS_BADGES[place.status];
              const isConfirm = confirmId === String(place.id);
              return (
                <tr key={place.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{place.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {TYPE_LABELS[place.type] ?? place.type}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {place.owner
                      ? `${place.owner.firstName} ${place.owner.lastName}`
                      : "—"}
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
                    {place.pricePerHour != null ? `${place.pricePerHour} €` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div title="L'approbation/le refus ne sont pas disponibles via l'API actuelle">
                        <Button size="sm" variant="outline" disabled className="opacity-40 cursor-not-allowed text-xs">
                          Approuver
                        </Button>
                      </div>
                      <div title="L'approbation/le refus ne sont pas disponibles via l'API actuelle">
                        <Button size="sm" variant="outline" disabled className="opacity-40 cursor-not-allowed text-xs">
                          Refuser
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant={isConfirm ? "destructive" : "outline"}
                        className={cn("text-xs gap-1.5", !isConfirm && "text-destructive hover:text-destructive")}
                        disabled={deletingId === String(place.id)}
                        onClick={() => handleDelete(String(place.id))}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {isConfirm ? "Confirmer" : "Supprimer"}
                      </Button>
                      {isConfirm && (
                        <button
                          className="text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => setConfirmId(null)}
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pageInfo && pageInfo.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {pageInfo.page + 1} sur {pageInfo.totalPages} ({pageInfo.totalElements} espaces)
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!pageInfo.hasPrevious}
              onClick={() => setPage((p) => p - 1)}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!pageInfo.hasNext}
              onClick={() => setPage((p) => p + 1)}
              className="gap-1"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          Les actions Approuver et Refuser sont désactivées — l'API ne dispose pas encore d'endpoints de modération.
        </span>
      </div>
    </div>
  );
}
