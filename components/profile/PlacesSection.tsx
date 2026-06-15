"use client";

import useSWR from "swr";
import Link from "next/link";
import { PlacesPage } from "@/types/place";
import { PlaceGrid } from "@/components/places/PlaceGrid";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function PlacesSection() {
  const { data, isLoading } = useSWR<PlacesPage>("/api/owner/places", fetcher);

  const places = data?.results ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <h1 className="text-[22px] font-semibold text-[#222222]">Mes espaces</h1>
        <Link
          href="/owner/places"
          className="inline-flex items-center border border-[#222222] bg-white text-[#222222] hover:bg-[#f7f7f7] rounded-[8px] px-3 py-1.5 text-sm font-medium transition-colors"
        >
          Gérer mes espaces
        </Link>
      </div>
      <p className="text-[14px] text-[#6a6a6a] mb-6">
        Espaces dont vous êtes propriétaire
      </p>

      {!isLoading && places.length === 0 && (
        <div className="text-center py-16 text-[#6a6a6a]">
          <p className="mb-4">Vous n'avez aucun espace enregistré.</p>
          <Link
            href="/places/new"
            className="inline-flex items-center bg-[#ff385c] hover:bg-[#e00b41] text-white rounded-[8px] px-5 py-[11px] text-sm font-medium transition-colors"
          >
            Ajouter un espace
          </Link>
        </div>
      )}

      {(isLoading || places.length > 0) && (
        <PlaceGrid places={places} isLoading={isLoading} />
      )}
    </div>
  );
}
