import {NextResponse} from "next/server";
import {getSessionUser} from "@/lib/auth/session";
import {apiFetch} from "@/lib/api/client";
import {BookingResponse} from "@/types/booking";

export async function GET() {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    try {
        const bookings = await apiFetch<BookingResponse[]>("/api/v1/bookings/me", {token: user.token});
        return NextResponse.json(bookings);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur lors du chargement des réservations";
        return NextResponse.json({error: message}, {status: 500});
    }
}
