"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Building2, Users, CalendarCheck } from "lucide-react";

const TABS = [
  { href: "/admin",          label: "Aperçu",        Icon: LayoutDashboard, exact: true },
  { href: "/admin/places",   label: "Espaces",        Icon: Building2,       exact: false },
  { href: "/admin/users",    label: "Utilisateurs",   Icon: Users,           exact: false },
  { href: "/admin/bookings", label: "Réservations",   Icon: CalendarCheck,   exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-[#dddddd] bg-white dark:bg-[#1a1a1a] dark:border-[#3a3a3a]">
      <div className="max-w-[1280px] mx-auto px-6">
        <nav className="flex items-center gap-1 overflow-x-auto">
          {TABS.map(({ href, label, Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors duration-150 whitespace-nowrap",
                  isActive
                    ? "border-[#ff385c] text-[#222222] dark:text-[#f0f0f0]"
                    : "border-transparent text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] hover:border-[#dddddd] dark:hover:border-[#3a3a3a]"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
