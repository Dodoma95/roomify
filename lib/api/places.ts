import { apiFetch, graphqlFetch } from "./client";
import { Place, PlaceFilters, PlacesPage, CreatePlaceInput } from "@/types/place";
import { PLACE_QUERY, PLACES_QUERY } from "@/lib/graphql/queries";

/*export function getPlaces(token: string): Promise<Place[]> {
  return apiFetch<Place[]>("/api/v1/places", { token });
}

export function getPlace(id: string, token: string): Promise<Place> {
  return apiFetch<Place>(`/api/v1/places/${id}`, { token });
}*/

export function queryPlaceById(id: string, token?: string): Promise<Place> {
  return graphqlFetch<{ place: Place }>(PLACE_QUERY, { id }, token).then((d) => d.place);
}

export function createPlace(input: CreatePlaceInput, token: string): Promise<Place> {
  return apiFetch<Place>("/api/v1/places", {
    method: "POST",
    body: JSON.stringify(input),
    token,
  });
}

export function updatePlace(
  id: string,
  input: Partial<CreatePlaceInput>,
  token: string
): Promise<Place> {
  return apiFetch<Place>(`/api/v1/places/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
    token,
  });
}

// TODO a utiliser? cf route.ts ou l'appel est fait en direct
export function deletePlace(id: string, token: string): Promise<void> {
  return apiFetch<void>(`/api/v1/places/${id}`, { method: "DELETE", token });
}

export async function queryPlaces(filters: PlaceFilters, token?: string): Promise<PlacesPage> {
  const {page, size, ...filterFields} = filters;

  const filter = Object.values(filterFields).some((v) => v !== undefined)
      ? filterFields
      : undefined;

  const pagination = (page !== undefined || size !== undefined)
      ? {page, pageSize: size}
      : undefined;

  const data = await graphqlFetch<{ places: PlacesPage; }>(PLACES_QUERY, {filter, pagination}, token);
  return data.places;
}
