"use client";

import {useRef, useState} from "react";
import {useToast} from "@/hooks/useToast";
import {AVATAR_ACCEPTED_TYPES, AVATAR_MAX_SIZE, buildAvatarSrc} from "@/lib/avatar";

export function useAvatarUpload(
    userId: string,
    currentAvatarUrl: string | undefined,
    onSuccess: (avatarUrl: string) => void,
) {
    const toast = useToast();
    const [uploading, setUploading] = useState(false);
    const [avatarKey, setAvatarKey] = useState(0);
    const fileRef = useRef<HTMLInputElement>(null);

    const avatarSrc = currentAvatarUrl
        ? buildAvatarSrc(userId, avatarKey)
        : undefined;

    function resetInput() {
        if (fileRef.current) fileRef.current.value = "";
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!AVATAR_ACCEPTED_TYPES.includes(file.type as typeof AVATAR_ACCEPTED_TYPES[number])) {
            toast.error("Format non supporté. Utilisez JPEG, PNG ou GIF.");
            resetInput();
            return;
        }
        if (file.size > AVATAR_MAX_SIZE) {
            toast.error("Fichier trop lourd (max 10 MB).");
            resetInput();
            return;
        }

        setUploading(true);
        try {
            const form = new FormData();
            form.append("file", file);
            const res = await fetch("/api/profile/avatar", {method: "PUT", body: form});
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error((body as { error?: string }).error ?? "Erreur lors de l'upload");
            }
            const {avatarUrl} = await res.json() as { avatarUrl: string };
            setAvatarKey((k) => k + 1);
            onSuccess(avatarUrl);
            toast.success("Photo mise à jour");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setUploading(false);
            resetInput();
        }
    }

    return {uploading, avatarSrc, fileRef, handleFileChange};
}
