import {NextRequest, NextResponse} from "next/server";
import {getSessionUser} from "@/lib/auth/session";
import {graphqlFetch} from "@/lib/api/client";
import {USERS_ADMIN_QUERY} from "@/lib/graphql/queries";
import {UserPage} from "@/types/user";

function isAdmin(roles: string[]): boolean {
    return roles.includes("ADMIN") || roles.includes("SUPER_ADMIN");
}

export async function GET(request: NextRequest) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    if (!isAdmin(user.roles)) return NextResponse.json({error: "Forbidden"}, {status: 403});

    const {searchParams} = request.nextUrl;
    const emailContains = searchParams.get("email") ?? undefined;
    const role = searchParams.get("role") ?? undefined;
    const page = parseInt(searchParams.get("page") ?? "0", 10);
    const pageSize = Math.min(parseInt(searchParams.get("size") ?? "20", 10), 100);

    const filter: Record<string, unknown> = {};
    if (emailContains) filter.emailContains = emailContains;
    if (role) filter.role = role;

    try {
        const data = await graphqlFetch<{ users: UserPage }>(
            USERS_ADMIN_QUERY,
            {
                filter: Object.keys(filter).length > 0 ? filter : undefined,
                pagination: {page, pageSize},
            },
            user.token
        );
        return NextResponse.json(data.users);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({error: message}, {status: 500});
    }
}
