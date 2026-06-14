"use client";

import { useState } from "react";
import useSWR from "swr";
import { PlacesPage, PlaceStatus } from "@/types/place";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [moderatingId, setModeratingId] = useState<string | null>(null);
  const toast = useToast();

  const { data, isLoading, mutate } = useAdminPlaces(activeTab, page);
  const places = data?.results ?? [];
  const pageInfo = data?.pageInfo;

  function handleTabChange(status: PlaceStatus | null) {
    setActiveTab(status);
    setPage(0);
  }

  async function handleModerate(id: string, action: "approve" | "reject") {
    setModeratingId(`${id}-${action}`);
    try {
      const res = await fetch(`/api/admin/places/${id}/${action}`, { method: "PATCH" });
      if (!res.ok) {
        toast.error("Une erreur est survenue.");
      } else {
        toast.success(action === "approve" ? "Espace approuvé." : "Espace refusé.");
        await mutate();
      }
    } catch {
      toast.error("Impossible de contacter le serveur.");
    } finally {
      setModeratingId(null);
    }
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
        <h1 className="text-2xl font-bold text-[#222222] dark:text-[#f0f0f0]">Gestion des espaces</h1>
        <p className="text-sm text-[#6a6a6a] mt-1">
          Consultez et supprimez les espaces de la plateforme.
        </p>
      </div>

      <div className="inline-flex rounded-[8px] border border-[#dddddd] p-1 bg-[#f2f2f2] gap-1 dark:bg-[#2a2a2a] dark:border-[#3a3a3a]">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabChange(tab.status)}
            className={cn(
              "px-4 py-1.5 rounded-[6px] text-sm font-medium transition-colors duration-150",
              activeTab === tab.status
                ? "bg-white shadow-sm text-[#222222] dark:bg-[#3a3a3a] dark:text-[#f0f0f0]"
                : "text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-[14px] border border-[#dddddd] overflow-hidden dark:border-[#3a3a3a]">
        <table className="w-full text-sm">
          <thead className="bg-[#f2f2f2] text-[#6a6a6a] dark:bg-[#2a2a2a]">
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
                <td colSpan={6} className="px-4 py-8 text-center text-[#6a6a6a]">
                  Chargement…
                </td>
              </tr>
            )}
            {!isLoading && places.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#6a6a6a]">
                  Aucun espace trouvé.
                </td>
              </tr>
            )}
            {places.map((place) => {
              const statusCfg = STATUS_BADGES[place.status];
              const isConfirm = confirmId === String(place.id);
              return (
                <tr key={place.id} className="border-t border-[#dddddd] hover:bg-[#f7f7f7] dark:border-[#3a3a3a] dark:hover:bg-[#2a2a2a] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#222222] dark:text-[#f0f0f0]">{place.name}</td>
                  <td className="px-4 py-3 text-[#6a6a6a]">
                    {TYPE_LABELS[place.type] ?? place.type}
                  </td>
                  <td className="px-4 py-3 text-[#6a6a6a]">
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
                  <td className="px-4 py-3 text-[#6a6a6a]">
                    {place.pricePerHour != null ? `${place.pricePerHour} €` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1 text-emerald-700 hover:text-emerald-700 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50"
                        disabled={place.status !== "PENDING" || moderatingId === `${place.id}-approve`}
                        onClick={() => handleModerate(String(place.id), "approve")}
                      >
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1 text-destructive hover:text-destructive border-red-200 hover:border-red-300 hover:bg-red-50"
                        disabled={place.status === "REJECTED" || moderatingId === `${place.id}-reject`}
                        onClick={() => handleModerate(String(place.id), "reject")}
                      >
                        Refuser
                      </Button>
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
        <div className="flex items-center justify-between text-sm text-[#6a6a6a]">
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

    </div>
  );
}
