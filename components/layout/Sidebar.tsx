"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useRole} from "@/hooks/useRole";
import {Role} from "@/types/user";
import {cn} from "@/lib/utils";

const links: { href: string; label: string; roles: Role[] }[] = [
    {href: "/places", label: "Espaces", roles: ["USER", "OWNER", "ADMIN", "SUPER_ADMIN"]},
    {href: "/places/new", label: "Ajouter un espace", roles: ["OWNER", "ADMIN", "SUPER_ADMIN"]},
    {href: "/owner/places", label: "Mes espaces", roles: ["OWNER", "ADMIN", "SUPER_ADMIN"]},
    {href: "/admin/places", label: "Modération", roles: ["ADMIN", "SUPER_ADMIN"]},
    {href: "/admin/users", label: "Utilisateurs", roles: ["ADMIN", "SUPER_ADMIN"]},
    {href: "/profile", label: "Mon profil", roles: ["USER", "OWNER", "ADMIN", "SUPER_ADMIN"]},
];

export function Sidebar() {
    const pathname = usePathname();
    const {roles} = useRole();

    const visible = links.filter((l) => l.roles.some((r) => (roles as Role[]).includes(r)));

    return (
        <aside className="w-56 shrink-0">
            <nav className="flex flex-col gap-1">
                {visible.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                            pathname === link.href && "bg-accent text-accent-foreground font-medium"
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
