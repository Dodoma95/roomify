export type PlaceType =
  | "MEETING_ROOM"
  | "COWORKING_SPACE"
  | "EVENT_SPACE"
  | "PARTY_ROOM"
  | "STUDIO";

export type PlaceStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PlaceOwner {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Place {
  id: number;
  name: string;
  description: string;
  type: PlaceType;
  status: PlaceStatus;
  capacity: number;
  pricePerHour: number;
  address: string;
  owner: PlaceOwner;
}

export interface PlaceFilters {
  types?: PlaceType[];
  statuses?: PlaceStatus[];
  nameContains?: string;
  ownerId?: string;
  capacityMin?: number;
  capacityMax?: number;
  pricePerHourMin?: number;
  pricePerHourMax?: number;
  availableFrom?: string;
  availableTo?: string;
  page?: number;
  size?: number;
}

export interface PlacePageInfo {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PlacesPage {
  results: Place[];
  pageInfo: PlacePageInfo;
}

export interface CreatePlaceInput {
  name: string;
  description: string;
  type: PlaceType;
  capacity: number;
  pricePerHour: number;
  address: string;
}
