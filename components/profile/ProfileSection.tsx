"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

const FIELDS: { key: keyof ProfileData; label: string; type?: string }[] = [
  { key: "firstName", label: "Prénom" },
  { key: "lastName",  label: "Nom" },
  { key: "email",     label: "Email", type: "email" },
];

export function ProfileSection({ initialData }: { initialData: ProfileData }) {
  const toast = useToast();
  const [fields, setFields] = useState(initialData);
  const [saved,  setSaved]  = useState(initialData);
  const [editingKey, setEditingKey] = useState<keyof ProfileData | null>(null);
  const [saving, setSaving] = useState(false);

  const isDirty = JSON.stringify(fields) !== JSON.stringify(saved);

  function handleChange(key: keyof ProfileData, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function handleCancel() {
    setFields(saved);
    setEditingKey(null);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erreur lors de la sauvegarde");
      }
      setSaved(fields);
      setEditingKey(null);
      toast.success("Profil mis à jour");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-[#222222] mb-1">Mon profil</h1>
      <p className="text-[14px] text-[#6a6a6a] mb-6">Cliquez sur un champ pour le modifier</p>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {FIELDS.slice(0, 2).map(({ key, label }) => (
            <FieldItem
              key={key}
              label={label}
              value={fields[key]}
              isEditing={editingKey === key}
              onActivate={() => setEditingKey(key)}
              onChange={(v) => handleChange(key, v)}
              onBlur={() => setEditingKey(null)}
            />
          ))}
        </div>
        <FieldItem
          label={FIELDS[2].label}
          value={fields.email}
          type="email"
          isEditing={editingKey === "email"}
          onActivate={() => setEditingKey("email")}
          onChange={(v) => handleChange("email", v)}
          onBlur={() => setEditingKey(null)}
        />
      </div>

      {(isDirty || editingKey !== null) && (
        <div className="flex gap-2.5">
          <Button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="bg-[#ff385c] hover:bg-[#e00b41] text-white border-0"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            Annuler
          </Button>
        </div>
      )}
    </div>
  );
}

interface FieldItemProps {
  label: string;
  value: string;
  type?: string;
  isEditing: boolean;
  onActivate: () => void;
  onChange: (v: string) => void;
  onBlur: () => void;
}

function FieldItem({ label, value, type = "text", isEditing, onActivate, onChange, onBlur }: FieldItemProps) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6a6a6a]">
        {label}
      </span>
      {isEditing ? (
        <input
          autoFocus
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={(e) => { if (e.key === "Escape") onBlur(); }}
          className="px-3.5 py-[11px] rounded-lg border-[1.5px] border-[#222222] bg-white text-[14px] text-[#222222] outline-none shadow-[0_0_0_3px_rgba(34,34,34,0.08)] w-full font-[inherit]"
        />
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={onActivate}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onActivate(); }}
          className={cn(
            "group relative px-3.5 py-[11px] rounded-lg bg-[#f2f2f2]",
            "border-[1.5px] border-transparent",
            "hover:bg-white hover:border-[#222222]",
            "cursor-text text-[14px] text-[#222222] transition-colors"
          )}
        >
          {value}
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
            ✏️
          </span>
        </div>
      )}
    </div>
  );
}
