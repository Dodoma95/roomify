import { NextRequest, NextResponse } from "next/server";
import { login, getMe } from "@/lib/api/auth";
import { getSession } from "@/lib/auth/session";
import { SessionUser } from "@/types/user";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const sessionPromise = getSession();
  const { accessToken } = await login(body);
  const [me, session] = await Promise.all([getMe(accessToken), sessionPromise]);

  session.user = {
    id: String(me.id),
    email: me.email,
    name: `${me.firstName} ${me.lastName}`.trim(),
    roles: me.roles.map((r) => r.replace(/^ROLE_/, "") as SessionUser["roles"][number]),
    token: accessToken,
  };
  await session.save();

  return NextResponse.json({ ok: true });
}
