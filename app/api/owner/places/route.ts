import {NextResponse} from "next/server";
import {getSessionUser} from "@/lib/auth/session";
import {queryPlaces} from "@/lib/api/places";
import {getMe} from "@/lib/api/auth";

function isValidId(v: unknown): boolean {
    return v != null && v !== "" && v !== "undefined" && v !== "null";
}

export async function GET() {
    const user = await getSessionUser();

    if (!user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    let ownerId: string | null = isValidId(user.id) ? String(user.id) : null;

    if (!ownerId) {
        try {
            const me = await getMe(user.token);
            if (isValidId(me.id)) ownerId = String(me.id);
        } catch {
            // getMe failed, ownerId stays null
        }
    }

    if (!ownerId) {
        return NextResponse.json(
            {error: "Session invalide, veuillez vous reconnecter."},
            {status: 401}
        );
    }

    try {
        const data = await queryPlaces({ownerId}, user.token);
        return NextResponse.json(data);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({error: message}, {status: 500});
    }
}
