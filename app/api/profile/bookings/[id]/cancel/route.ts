import {NextRequest, NextResponse} from "next/server";
import {getSessionUser} from "@/lib/auth/session";
import {apiFetch} from "@/lib/api/client";

export async function PATCH(
    _req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const [{id}, user] = await Promise.all([params, getSessionUser()]);
    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    try {
        await apiFetch(`/api/v1/bookings/${id}/cancel`, {method: "PATCH", token: user.token});
        return NextResponse.json({ok: true});
    } catch (err) {
        const message = err instanceof Error ? err.message : "Impossible d'annuler cette réservation";
        const status = (err as Error & { status?: number }).status ?? 500;
        return NextResponse.json({error: message}, {status});
    }
}
