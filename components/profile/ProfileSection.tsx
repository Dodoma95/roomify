"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/hooks/useToast";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { cn } from "@/lib/utils";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  description?: string;
}

const TEXT_FIELDS: { key: "firstName" | "lastName" | "email"; label: string; type?: string }[] = [
  { key: "firstName", label: "Prénom" },
  { key: "lastName",  label: "Nom" },
  { key: "email",     label: "Email", type: "email" },
];

export function ProfileSection({ initialData, userId }: { initialData: ProfileData; userId: string }) {
  const toast = useToast();
  const [fields, setFields]         = useState(initialData);
  const [saved,  setSaved]          = useState(initialData);
  const [editingKey, setEditingKey] = useState<keyof ProfileData | null>(null);
  const [saving, setSaving]         = useState(false);

  const { uploading, avatarSrc, fileRef, handleFileChange } = useAvatarUpload(
    userId,
    fields.avatarUrl,
    (avatarUrl) => {
      setFields((prev) => ({ ...prev, avatarUrl }));
      setSaved((prev)  => ({ ...prev, avatarUrl }));
    },
  );

  const isDirty = (Object.keys(fields) as (keyof ProfileData)[]).some(
    (k) => fields[k] !== saved[k],
  );

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
      const { avatarUrl: _, ...payload } = fields;
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "Erreur lors de la sauvegarde");
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

      {/* Avatar block */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <Avatar src={avatarSrc} firstName={fields.firstName} lastName={fields.lastName} size="lg" />
          {uploading && (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="text-[13px] font-medium text-[#222222] underline underline-offset-2 hover:text-[#ff385c] transition-colors disabled:opacity-40 cursor-pointer"
          >
            {uploading ? "Envoi en cours…" : "Changer la photo"}
          </button>
          <p className="text-[11px] text-[#6a6a6a] mt-0.5">JPEG, PNG ou GIF · max 10 MB</p>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.gif" className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {TEXT_FIELDS.slice(0, 2).map(({ key, label }) => (
            <FieldItem
              key={key}
              label={label}
              value={fields[key] as string}
              isEditing={editingKey === key}
              onActivate={() => setEditingKey(key)}
              onChange={(v) => handleChange(key, v)}
              onBlur={() => setEditingKey(null)}
            />
          ))}
        </div>
        <FieldItem
          label={TEXT_FIELDS[2].label}
          value={fields.email}
          type="email"
          isEditing={editingKey === "email"}
          onActivate={() => setEditingKey("email")}
          onChange={(v) => handleChange("email", v)}
          onBlur={() => setEditingKey(null)}
        />
        <FieldItem
          label="Bio"
          value={fields.description ?? ""}
          multiline
          maxLength={300}
          placeholder="Parlez un peu de vous…"
          isEditing={editingKey === "description"}
          onActivate={() => setEditingKey("description")}
          onChange={(v) => handleChange("description", v)}
          onBlur={() => setEditingKey(null)}
        />
      </div>

      {isDirty && (
        <div className="flex gap-2.5">
          <Button
            onClick={handleSave}
            disabled={saving}
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
  multiline?: boolean;
  maxLength?: number;
  placeholder?: string;
  isEditing: boolean;
  onActivate: () => void;
  onChange: (v: string) => void;
  onBlur: () => void;
}

function FieldItem({ label, value, type = "text", multiline, maxLength, placeholder, isEditing, onActivate, onChange, onBlur }: FieldItemProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", !multiline && "flex-1")}>
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6a6a6a]">
        {label}
      </span>
      {isEditing ? (
        multiline ? (
          <div className="relative">
            <textarea
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              onKeyDown={(e) => { if (e.key === "Escape") onBlur(); }}
              maxLength={maxLength}
              rows={3}
              placeholder={placeholder}
              className="w-full px-3.5 py-[11px] rounded-lg border-[1.5px] border-[#222222] bg-white text-[14px] text-[#222222] outline-none shadow-[0_0_0_3px_rgba(34,34,34,0.08)] resize-y font-[inherit]"
            />
            {maxLength && (
              <span className="absolute right-3 bottom-2 text-[11px] text-[#6a6a6a]">
                {value.length}/{maxLength}
              </span>
            )}
          </div>
        ) : (
          <input
            autoFocus
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={(e) => { if (e.key === "Escape") onBlur(); }}
            className="px-3.5 py-[11px] rounded-lg border-[1.5px] border-[#222222] bg-white text-[14px] text-[#222222] outline-none shadow-[0_0_0_3px_rgba(34,34,34,0.08)] w-full font-[inherit]"
          />
        )
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
            "cursor-text text-[14px] transition-colors",
            multiline && "min-h-[48px]",
            value ? "text-[#222222]" : "text-[#6a6a6a]",
          )}
        >
          {value || placeholder}
          <span className={cn(
            "absolute right-2.5 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity",
            multiline ? "top-3" : "top-1/2 -translate-y-1/2",
          )}>
            ✏️
          </span>
        </div>
      )}
    </div>
  );
}
