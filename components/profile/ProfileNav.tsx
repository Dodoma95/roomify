"use client";

import { cn } from "@/lib/utils";

export type ProfileSection = "profile" | "bookings" | "places" | "danger";

interface ProfileNavProps {
  active: ProfileSection;
  onSelect: (s: ProfileSection) => void;
  isOwner: boolean;
}

export function ProfileNav({ active, onSelect, isOwner }: ProfileNavProps) {
  const items = [
    { id: "profile",   label: "Mon profil" },
    { id: "bookings",  label: "Mes réservations" },
    ...(isOwner ? [{ id: "places", label: "Mes espaces" }] : []),
  ] as { id: ProfileSection; label: string }[];

  return (
    <aside className="md:w-56 md:shrink-0">
      {/* Mobile : barre horizontale scrollable */}
      <nav className="flex md:hidden overflow-x-auto gap-1 pb-1 -mx-4 px-4 scrollbar-none border-b border-[#ebebeb]">
        {items.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              active === id
                ? "bg-[#222222] text-white font-medium"
                : "text-[#6a6a6a]"
            )}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => onSelect("danger")}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors text-destructive",
            "hover:bg-destructive/5",
            active === "danger" && "bg-destructive/5 font-medium"
          )}
        >
          Supprimer
        </button>
      </nav>

      {/* Desktop : sidebar verticale */}
      <nav className="hidden md:flex flex-col gap-1">
        {items.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={cn(
              "rounded-md px-3 py-2 text-sm text-left transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              active === id && "bg-accent text-accent-foreground font-medium"
            )}
          >
            {label}
          </button>
        ))}

        <button
          onClick={() => onSelect("danger")}
          className={cn(
            "mt-2 rounded-md px-3 py-2 text-sm text-left transition-colors text-destructive",
            "hover:bg-destructive/5",
            active === "danger" && "bg-destructive/5 font-medium"
          )}
        >
          Supprimer mon compte
        </button>
      </nav>
    </aside>
  );
}
