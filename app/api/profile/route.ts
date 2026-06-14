import { NextRequest, NextResponse } from "next/server";
import { getSession, getSessionUser } from "@/lib/auth/session";
import { apiFetch } from "@/lib/api/client";
import { getMe, login } from "@/lib/api/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const me = await getMe(user.token);
    return NextResponse.json({ firstName: me.firstName, lastName: me.lastName, email: me.email });
  } catch {
    const [firstName, ...rest] = user.name.split(" ");
    return NextResponse.json({ firstName: firstName ?? "", lastName: rest.join(" "), email: user.email });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { firstName, lastName, email } = await request.json() as {
    firstName: string;
    lastName: string;
    email: string;
  };

  await apiFetch("/api/v1/users/me", {
    method: "PATCH",
    body: JSON.stringify({ firstName, lastName, email }),
    token: user.token,
  });

  const session = await getSession();
  if (session.user) {
    session.user.name = `${firstName} ${lastName}`.trim();
    session.user.email = email;
    await session.save();
  }

  return NextResponse.json({ firstName, lastName, email });
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { password } = await request.json() as { password: string };

  if (!password) {
    return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
  }

  try {
    await login({ email: user.email, password });
  } catch {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  await apiFetch("/api/v1/users/me", { method: "DELETE", token: user.token });

  const session = await getSession();
  session.destroy();

  return NextResponse.json({ ok: true });
}
