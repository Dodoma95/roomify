import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getMe } from "@/lib/api/auth";
import { AVATAR_ACCEPTED_TYPES, AVATAR_MAX_SIZE } from "@/lib/avatar";

const API_BASE = process.env.ROOMIFY_API_URL ?? "https://roomify-api-1ik6.onrender.com";

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }

  if (!AVATAR_ACCEPTED_TYPES.includes(file.type as typeof AVATAR_ACCEPTED_TYPES[number])) {
    return NextResponse.json({ error: "Format non supporté. Utilisez JPEG, PNG, GIF." }, { status: 400 });
  }
  if (file.size > AVATAR_MAX_SIZE) {
    return NextResponse.json({ error: "Fichier trop lourd (max 10 MB)." }, { status: 400 });
  }

  const upload = new FormData();
  upload.append("file", file);

  const res = await fetch(`${API_BASE}/api/v1/users/me/avatar`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${user.token}` },
    body: upload,
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json({ error: text || `Erreur ${res.status}` }, { status: res.status });
  }

  const data = await res.json() as { avatarUrl: string };
  return NextResponse.json(data);
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let avatarUrl: string | undefined;
  try {
    const me = await getMe(user.token);
    avatarUrl = me.avatarUrl;
  } catch {
    return new NextResponse(null, { status: 404 });
  }

  if (!avatarUrl) return new NextResponse(null, { status: 404 });

  const imgRes = await fetch(avatarUrl, { signal: AbortSignal.timeout(10_000) });
  if (!imgRes.ok) return new NextResponse(null, { status: 404 });

  const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
  const buffer = await imgRes.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
