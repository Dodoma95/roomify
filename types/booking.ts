export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface BookingResponse {
  id: string;
  placeId: string;
  placeName: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  createdAt: string;
}

export interface BookingPlaceInfo {
  id: string;
  name: string;
  address: string;
  type: string;
  status: string;
  pricePerHour: number;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface BookingGraphQLResponse {
  id: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  totalPrice: number;
  notes: string | null;
  createdAt: string;
  place: BookingPlaceInfo;
  booker: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface BookingPage {
  results: BookingGraphQLResponse[];
  pageInfo: {
    page: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
