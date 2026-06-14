export type UnavailabilityReason = "OWNER_BLOCKED" | "BOOKING";

export interface UnavailabilityPeriod {
  id: string;
  startDate: string;
  endDate: string;
  reason: UnavailabilityReason;
}
