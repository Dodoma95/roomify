import {NextRequest, NextResponse} from "next/server";
import {getSession, getSessionUser} from "@/lib/auth/session";
import {apiFetch} from "@/lib/api/client";
import {getMe, login} from "@/lib/api/auth";

export async function GET() {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    try {
        const me = await getMe(user.token);
        return NextResponse.json({
            firstName: me.firstName,
            lastName: me.lastName,
            email: me.email,
            avatarUrl: me.avatarUrl,
            description: me.description,
        });
    } catch {
        const [firstName, ...rest] = user.name.split(" ");
        return NextResponse.json({firstName: firstName ?? "", lastName: rest.join(" "), email: user.email});
    }
}

export async function PATCH(request: NextRequest) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const {firstName, lastName, email, description} = await request.json() as {
        firstName: string;
        lastName: string;
        email: string;
        description?: string;
    };

    if (!firstName?.trim() && !lastName?.trim() && !email?.trim()) {
        return NextResponse.json({error: "Au moins un champ requis"}, {status: 400});
    }

    if (description !== undefined && description.length > 300) {
        return NextResponse.json({error: "La bio ne peut pas dépasser 300 caractères."}, {status: 400});
    }

    try {
        await apiFetch("/api/v1/users/me", {
            method: "PATCH",
            body: JSON.stringify({firstName, lastName, email, description}),
            token: user.token,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour";
        return NextResponse.json({error: message}, {status: 500});
    }

    const session = await getSession();
    if (session.user) {
        session.user.name = `${firstName} ${lastName}`.trim();
        session.user.email = email;
        await session.save();
    }

    return NextResponse.json({firstName, lastName, email, description});
}

export async function DELETE(request: NextRequest) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const {password} = await request.json() as { password: string };

    if (!password) {
        return NextResponse.json({error: "Mot de passe requis"}, {status: 400});
    }

    try {
        await login({email: user.email, password});
    } catch {
        return NextResponse.json({error: "Mot de passe incorrect"}, {status: 401});
    }

    try {
        await apiFetch("/api/v1/users/me", {method: "DELETE", token: user.token});
    } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur lors de la suppression";
        return NextResponse.json({error: message}, {status: 500});
    }

    const session = await getSession();
    await session.destroy();

    return NextResponse.json({ok: true});
}
