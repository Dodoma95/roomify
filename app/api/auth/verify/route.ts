import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.ROOMIFY_API_URL ?? "https://roomify-api-1ik6.onrender.com";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Token manquant" }, { status: 400 });
  }

  const res = await fetch(
    `${API_BASE}/api/v1/auth/verify?token=${encodeURIComponent(token)}`,
    { cache: "no-store" }
  );

  if (res.ok) {
    return NextResponse.json({ ok: true });
  }

  const body = await res.json().catch(() => ({}));
  return NextResponse.json(
    { message: body.message ?? "Lien invalide ou expiré" },
    { status: res.status }
  );
}
