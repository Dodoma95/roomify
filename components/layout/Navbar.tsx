"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { cn } from "@/lib/utils";
import { Menu, X, Globe } from "lucide-react";

const NAV_LINKS = [
  { href: "/places",       label: "Espaces",           roles: ["USER", "OWNER", "ADMIN", "SUPER_ADMIN"] },
  { href: "/places/new",   label: "Ajouter un espace", roles: ["USER", "OWNER", "ADMIN", "SUPER_ADMIN"] },
  { href: "/owner/places", label: "Mes espaces",        roles: ["OWNER", "ADMIN", "SUPER_ADMIN"] },
  { href: "/admin",        label: "Administration",     roles: ["ADMIN", "SUPER_ADMIN"] },
];

export function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { roles } = useRole();

  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const visibleLinks = NAV_LINKS.filter((l) =>
    l.roles.some((r) => roles.includes(r as never))
  );

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  async function handleLogout() {
    await logout();
    setAccountOpen(false);
    setMobileOpen(false);
    router.push("/login");
  }

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  function isActive(href: string) {
    if (href === "/places") return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[#dddddd] dark:bg-[#1a1a1a] dark:border-[#3a3a3a]">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between gap-8">

          {/* Logo */}
          <Link
            href="/places"
            className="shrink-0 text-[22px] font-semibold text-[#ff385c] tracking-tight select-none"
          >
            Roomify
          </Link>

          {/* Tabs centrés — desktop */}
          <nav className="hidden md:flex items-end gap-8 h-full">
            {visibleLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center h-full pb-0 text-[16px] font-semibold transition-colors duration-150 whitespace-nowrap",
                    active
                      ? "text-[#222222] dark:text-[#f0f0f0]"
                      : "text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0]"
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff385c] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Droite : globe + account pill */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              aria-label="Langue"
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-[#222222] hover:bg-[#f7f7f7] transition-colors duration-150 dark:text-[#f0f0f0] dark:hover:bg-[#2a2a2a]"
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Account pill */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-2 h-10 px-3 rounded-full border border-[#dddddd] transition-all duration-150 cursor-pointer",
                  "hover:shadow-md dark:border-[#3a3a3a]",
                  accountOpen && "shadow-md"
                )}
              >
                <Menu className="w-4 h-4 text-[#222222] dark:text-[#f0f0f0]" />
                <div className="w-8 h-8 rounded-full bg-[#222222] dark:bg-[#f0f0f0] flex items-center justify-center">
                  <span className="text-xs font-semibold text-white dark:text-[#222222]">
                    {initials}
                  </span>
                </div>
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full mt-3 w-52 bg-white dark:bg-[#222222] rounded-[14px] border border-[#dddddd] dark:border-[#3a3a3a] shadow-tier py-2 z-50">
                  {user && (
                    <div className="px-4 py-2.5 border-b border-[#ebebeb] dark:border-[#2e2e2e]">
                      <p className="text-sm font-semibold text-[#222222] dark:text-[#f0f0f0] truncate">{user.name}</p>
                      <p className="text-xs text-[#6a6a6a] truncate">{user.email}</p>
                    </div>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setAccountOpen(false)}
                    className="block px-4 py-2.5 text-sm text-[#222222] dark:text-[#f0f0f0] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a] transition-colors duration-150"
                  >
                    Mon profil
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-[#222222] dark:text-[#f0f0f0] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a] transition-colors duration-150"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-[#222222] hover:bg-[#f7f7f7] dark:text-[#f0f0f0] dark:hover:bg-[#2a2a2a] transition-colors duration-150"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-[#1a1a1a] shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-[#dddddd] dark:border-[#3a3a3a]">
              <span className="text-[22px] font-semibold text-[#ff385c]">Roomify</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a]"
              >
                <X className="w-5 h-5 text-[#222222] dark:text-[#f0f0f0]" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              {visibleLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center px-6 py-3.5 text-[16px] font-medium transition-colors duration-150",
                      active
                        ? "text-[#ff385c] bg-[#fff0f3] dark:bg-[#4d1020]"
                        : "text-[#222222] dark:text-[#f0f0f0] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-[#dddddd] dark:border-[#3a3a3a] p-6 space-y-3">
              {user && (
                <p className="text-sm font-semibold text-[#222222] dark:text-[#f0f0f0] truncate">{user.name}</p>
              )}
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-[#222222] dark:text-[#f0f0f0] hover:text-[#ff385c] transition-colors duration-150"
              >
                Mon profil
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full text-left text-sm text-[#222222] dark:text-[#f0f0f0] hover:text-[#ff385c] transition-colors duration-150"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
