"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Place, PlaceFilters, PlacesPage } from "@/types/place";

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (r.status === 401) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  if (!r.ok) throw new Error("Failed to fetch");
  return r.json();
}

const fetchPlaces = (url: string): Promise<PlacesPage> => fetchJson<PlacesPage>(url);

export function usePlaces(filters: PlaceFilters = {}) {
  const router = useRouter();

  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      if (Array.isArray(v)) v.forEach((item) => params.append(k, String(item)));
      else params.set(k, String(v));
    }
  });

  const key = `/api/places?${params.toString()}`;
  const { data, isLoading, error, mutate } = useSWR<PlacesPage>(key, fetchPlaces, {
    onError: (err) => { if (err?.status === 401) router.push("/login"); },
  });

  return { places: data?.results ?? [], page: data, isLoading, error, mutate };
}

const fetchPlace = (url: string): Promise<Place> => fetchJson<Place>(url);

export function usePlaceById(id: string) {
  const router = useRouter();
  const { data, isLoading, error } = useSWR<Place>(`/api/places/${id}`, fetchPlace, {
    onError: (err) => { if (err?.status === 401) router.push("/login"); },
  });
  return { place: data, isLoading, error };
}
