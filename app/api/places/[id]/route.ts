import {NextRequest, NextResponse} from "next/server";
import {getSessionUser} from "@/lib/auth/session";
import {queryPlaceById, updatePlace} from "@/lib/api/places";

export async function PATCH(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const [{id}, user, body] = await Promise.all([params, getSessionUser(), req.json()]);
    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    try {
        const place = await updatePlace(id, body, user.token);
        return NextResponse.json(place);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Internal server error";
        const status = (err as Error & { status?: number }).status ?? 500;
        return NextResponse.json({error: message}, {status});
    }
}

export async function GET(
    _req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const [{id}, user] = await Promise.all([params, getSessionUser()]);

    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    try {
        const place = await queryPlaceById(id, user.token);
        return NextResponse.json(place);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Internal server error";
        const isAuthError = /40[13]/.test(message);
        const status = isAuthError ? 401 : message.includes("404") ? 404 : 500;
        return NextResponse.json({error: message}, {status});
    }
}
