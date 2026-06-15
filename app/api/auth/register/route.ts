import {NextRequest, NextResponse} from "next/server";
import {register} from "@/lib/api/auth";

export async function POST(request: NextRequest) {
    const body = await request.json();

    try {
        const data = await register(body);
        return NextResponse.json(data, {status: 201});
    } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur lors de l'inscription";
        const status = (err as { status?: number }).status ?? 400;
        return NextResponse.json({message}, {status});
    }
}
