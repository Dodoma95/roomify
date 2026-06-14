import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { apiFetch } from "@/lib/api/client";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await apiFetch(`/api/v1/bookings/${id}/cancel`, { method: "PATCH", token: user.token });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Impossible d'annuler cette réservation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
