import {NextRequest, NextResponse} from "next/server";
import {getSessionUser} from "@/lib/auth/session";
import {apiFetch} from "@/lib/api/client";
import {BookingResponse} from "@/types/booking";

export async function POST(req: NextRequest) {
    const [user, body] = await Promise.all([getSessionUser(), req.json()]);
    if (!user) return NextResponse.json({error: "Non autorisé"}, {status: 401});

    try {
        const booking = await apiFetch<BookingResponse>("/api/v1/bookings", {
            method: "POST",
            body: JSON.stringify(body),
            token: user.token,
        });
        return NextResponse.json(booking, {status: 201});
    } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur lors de la réservation";
        const status = (err as Error & { status?: number }).status ?? 500;
        return NextResponse.json({error: message}, {status});
    }
}