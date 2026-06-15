import {NextRequest, NextResponse} from "next/server";
import {getSessionUser} from "@/lib/auth/session";
import {graphqlFetch} from "@/lib/api/client";
import {BOOKINGS_ADMIN_QUERY} from "@/lib/graphql/queries";
import {BookingPage, BookingStatus} from "@/types/booking";

function isAdmin(roles: string[]): boolean {
    return roles.includes("ADMIN") || roles.includes("SUPER_ADMIN");
}

export async function GET(request: NextRequest) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    if (!isAdmin(user.roles)) return NextResponse.json({error: "Forbidden"}, {status: 403});

    const {searchParams} = request.nextUrl;
    const status = searchParams.get("status") as BookingStatus | null;
    const placeId = searchParams.get("placeId") ?? undefined;
    const placeName = searchParams.get("placeName") ?? undefined;
    const userEmail = searchParams.get("userEmail") ?? undefined;
    const page = parseInt(searchParams.get("page") ?? "0", 10);
    const pageSize = Math.min(parseInt(searchParams.get("size") ?? "20", 10), 50);

    const filter: Record<string, unknown> = {};
    if (status) filter.statuses = [status];
    if (placeId) filter.placeId = placeId;
    if (placeName) filter.placeNameContains = placeName;
    if (userEmail) filter.userEmailContains = userEmail;

    try {
        const data = await graphqlFetch<{ bookings: BookingPage }>(
            BOOKINGS_ADMIN_QUERY,
            {
                filter: Object.keys(filter).length > 0 ? filter : undefined,
                pagination: {page, pageSize},
            },
            user.token
        );
        return NextResponse.json(data.bookings);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({error: message}, {status: 500});
    }
}
