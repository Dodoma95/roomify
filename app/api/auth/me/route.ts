import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json(null, { status: 401 });
  const { token: _token, ...safeUser } = user;
  return NextResponse.json(safeUser);
}
