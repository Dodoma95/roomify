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
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const [{ id }, user, body] = await Promise.all([params, getSessionUser(), req.json()]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await apiFetch<UnavailabilityPeriod>(
      `/api/v1/places/${id}/unavailability/block`,
      { method: "POST", body: JSON.stringify(body), token: user.token }
    );
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
