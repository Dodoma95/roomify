import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { apiFetch } from "@/lib/api/client";
import { BookingResponse } from "@/types/booking";

function isAdmin(roles: string[]): boolean {
  return roles.includes("ADMIN") || roles.includes("SUPER_ADMIN");
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(user.roles)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  try {
    const data = await apiFetch<BookingResponse>(`/api/v1/bookings/${id}/confirm`, {
      method: "PATCH",
      token: user.token,
    });
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
