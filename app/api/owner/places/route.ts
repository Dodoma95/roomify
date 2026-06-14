import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { queryPlaces } from "@/lib/api/places";
import { getMe } from "@/lib/api/auth";

function isValidId(v: unknown): boolean {
  return v != null && v !== "" && v !== "undefined" && v !== "null";
}

export async function GET() {
  const user = await getSessionUser();

  console.log("[owner/places] user:", JSON.stringify(user));
  console.log("[owner/places] user.id raw:", (user as Record<string, unknown> | null)?.id, "| typeof:", typeof (user as Record<string, unknown> | null)?.id);

  if (!user) {
    console.log("[owner/places] → 401 : user is null");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let ownerId: string | null = isValidId(user.id) ? String(user.id) : null;
  console.log("[owner/places] ownerId from session:", ownerId);

  if (!ownerId) {
    console.log("[owner/places] id manquant, fallback getMe...");
    try {
      const me = await getMe(user.token);
      console.log("[owner/places] getMe FULL response:", JSON.stringify(me));
      if (isValidId(me.id)) ownerId = String(me.id);
    } catch (e) {
      console.log("[owner/places] getMe failed:", e);
    }
  }

  console.log("[owner/places] final ownerId:", ownerId);

  if (!ownerId) {
    return NextResponse.json(
      { error: "Session invalide, veuillez vous reconnecter." },
      { status: 401 }
    );
  }

  try {
    const data = await queryPlaces({ ownerId }, user.token);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
