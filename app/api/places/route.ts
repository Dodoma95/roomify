import {NextRequest, NextResponse} from "next/server";
import {getSessionUser} from "@/lib/auth/session";
import {queryPlaces, createPlace} from "@/lib/api/places";
import {PlaceFilters} from "@/types/place";

export async function GET(request: NextRequest) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const {searchParams} = request.nextUrl;

    const filters: PlaceFilters = {
        nameContains: searchParams.get("nameContains") ?? undefined,
        capacityMin: searchParams.get("capacityMin") ? Number(searchParams.get("capacityMin")) : undefined,
        capacityMax: searchParams.get("capacityMax") ? Number(searchParams.get("capacityMax")) : undefined,
        pricePerHourMin: searchParams.get("pricePerHourMin") ? Number(searchParams.get("pricePerHourMin")) : undefined,
        pricePerHourMax: searchParams.get("pricePerHourMax") ? Number(searchParams.get("pricePerHourMax")) : undefined,
        types: searchParams.getAll("types").length ? (searchParams.getAll("types") as PlaceFilters["types"]) : undefined,
        statuses: searchParams.getAll("statuses").length ? (searchParams.getAll("statuses") as PlaceFilters["statuses"]) : ["APPROVED"],
        availableFrom: searchParams.get("availableFrom") ?? undefined,
        availableTo: searchParams.get("availableTo") ?? undefined,
        page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
        size: searchParams.get("size") ? Number(searchParams.get("size")) : undefined,
    };

    try {
        const data = await queryPlaces(filters, user.token);
        return NextResponse.json(data);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Internal server error";
        const isAuthError = /40[13]/.test(message);
        return NextResponse.json({error: message}, {status: isAuthError ? 401 : 500});
    }
}

export async function POST(request: NextRequest) {
    const [user, body] = await Promise.all([getSessionUser(), request.json()]);
    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const place = await createPlace(body, user.token);
    return NextResponse.json(place, {status: 201});
}
