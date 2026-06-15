import {NextRequest, NextResponse} from "next/server";
import {getSessionUser} from "@/lib/auth/session";
import {queryPlaces} from "@/lib/api/places";
import {PlaceFilters, PlaceStatus} from "@/types/place";

function isAdmin(roles: string[]): boolean {
    return roles.includes("ADMIN") || roles.includes("SUPER_ADMIN");
}

export async function GET(request: NextRequest) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    if (!isAdmin(user.roles)) return NextResponse.json({error: "Forbidden"}, {status: 403});

    const {searchParams} = request.nextUrl;
    const status = searchParams.get("status") as PlaceStatus | null;

    const filters: PlaceFilters = {
        statuses: status ? [status] : undefined,
    };

    try {
        const data = await queryPlaces(filters, user.token);
        return NextResponse.json(data);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({error: message}, {status: 500});
    }
}
