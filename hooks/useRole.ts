"use client";

import {Role} from "@/types/user";
import {useAuth} from "./useAuth";

export function useRole() {
    const {user} = useAuth();
    const roles = user?.roles ?? [];

    const is = (...check: Role[]) => check.some((r) => roles.includes(r));

    return {
        roles,
        isUser: is("USER"),
        isOwner: is("OWNER"),
        isAdmin: is("ADMIN", "SUPER_ADMIN"),
        isSuperAdmin: is("SUPER_ADMIN"),
        can: is,
    };
}
