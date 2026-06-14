"use client";

import { cn } from "@/lib/utils";

export type ProfileSection = "profile" | "bookings" | "places" | "danger";

interface ProfileNavProps {
  active: ProfileSection;
  onSelect: (s: ProfileSection) => void;
  isOwner: boolean;
}

export function ProfileNav({ active, onSelect, isOwner }: ProfileNavProps) {
  return (
    <aside className="w-56 shrink-0">
      <nav className="flex flex-col gap-1">
        {(
          [
            { id: "profile",   label: "Mon profil" },
            { id: "bookings",  label: "Mes réservations" },
            ...(isOwner ? [{ id: "places", label: "Mes espaces" }] : []),
          ] as { id: ProfileSection; label: string }[]
        ).map(({ id, label }) => (
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
