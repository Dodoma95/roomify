import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { apiFetch } from "@/lib/api/client";
import { UnavailabilityPeriod } from "@/types/unavailability";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const [{ id }, user] = await Promise.all([params, getSessionUser()]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await apiFetch<UnavailabilityPeriod[]>(
      `/api/v1/places/${id}/unavailability`,
      { token: user.token }
    );
    return NextResponse.json(data);
  } catch (err) {
    const status = (err as Error & { status?: number }).status ?? 500;
    // L'endpoint est restreint OWNER/ADMIN — un USER reçoit 403 ; on retourne [] plutôt
    // que d'exposer l'erreur (le calendrier s'affiche sans dates bloquées, l'API rejettera
    // les réservations en conflit avec un message explicite)
    if (status === 403) return NextResponse.json([]);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status });
  }
}
