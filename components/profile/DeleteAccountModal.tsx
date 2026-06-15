"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/store/authStore";
import {useToast} from "@/hooks/useToast";
import {Button} from "@/components/ui/button";

interface DeleteAccountModalProps {
    onClose: () => void;
}

export function DeleteAccountModal({onClose}: DeleteAccountModalProps) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const setUser = useAuthStore((s) => s.setUser);
    const toast = useToast();

    async function handleDelete() {
        if (!password) return;
        setLoading(true);
        try {
            const res = await fetch("/api/profile", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({password}),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? "Erreur lors de la suppression");
            }
            setUser(null);
            router.push("/login");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur inconnue");
            setLoading(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[14px] shadow-tier p-7 w-full max-w-[420px] mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-[18px] font-bold text-[#222222] mb-2">
                    Supprimer mon compte ?
                </h2>
                <p className="text-[14px] text-[#6a6a6a] leading-relaxed mb-4">
                    Cette action est définitive et irréversible. Tous vos espaces, réservations
                    et données personnelles seront supprimés.
                </p>

                <div className="bg-[#fff5f5] border border-[#fecaca] rounded-lg p-3 text-[13px] text-[#c13515] leading-relaxed mb-5">
                    ⚠️ Cette suppression est permanente. Vous ne pourrez pas récupérer votre compte.
                </div>

                <div className="flex flex-col gap-1.5 mb-5">
                    <label
                        htmlFor="confirm-password"
                        className="text-[11px] font-bold uppercase tracking-wider text-[#6a6a6a]"
                    >
                        Confirmez votre mot de passe
                    </label>
                    <input
                        id="confirm-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleDelete();
                        }}
                        placeholder="Votre mot de passe actuel"
                        className="px-3.5 py-[11px] rounded-lg bg-[#f2f2f2] border-[1.5px] border-[#dddddd] text-[14px] text-[#222222] outline-none focus:bg-white focus:border-[#222222] w-full font-[inherit] transition-colors"
                    />
                </div>

                <div className="flex gap-2.5">
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>
                    <button
                        onClick={handleDelete}
                        disabled={!password || loading}
                        className="flex-1 bg-[#c13515] text-white rounded-lg py-[11px] text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#b32505] transition-colors"
                    >
                        {loading ? "Suppression…" : "Supprimer définitivement"}
                    </button>
                </div>
            </div>
        </div>
    );
}
