"use client";

import useSWR from "swr";
import { User, Role } from "@/types/user";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) return r.json().then((d) => Promise.reject(d));
    return r.json();
  });

const ROLE_BADGES: Record<Role, { label: string; className: string }> = {
  USER:        { label: "Utilisateur", className: "bg-sky-100 text-sky-800 border-sky-200" },
  OWNER:       { label: "Propriétaire", className: "bg-violet-100 text-violet-800 border-violet-200" },
  ADMIN:       { label: "Admin", className: "bg-teal-100 text-teal-800 border-teal-200" },
  SUPER_ADMIN: { label: "Super Admin", className: "bg-rose-100 text-rose-800 border-rose-200" },
};

export default function AdminUsersPage() {
  const { data, error, isLoading, mutate } = useSWR<User[]>("/api/admin/users", fetcher);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const toast = useToast();

  const endpointUnavailable =
    error?.endpointUnavailable === true ||
    (error && /404/.test(String(error?.error)));

  async function handleDelete(id: string) {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Impossible de supprimer l'utilisateur.");
      } else {
        toast.success("Utilisateur supprimé.");
        await mutate();
      }
    } catch {
      toast.error("Impossible de contacter le serveur.");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  if (endpointUnavailable) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des utilisateurs</h1>
          <p className="text-sm text-muted-foreground mt-1">Consultez et supprimez les comptes utilisateurs.</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-muted/30 py-16 px-8 text-center space-y-4">
          <div className="rounded-full bg-amber-100 p-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Endpoint non disponible</p>
            <p className="text-sm text-muted-foreground mt-1">
              L'endpoint <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">GET /api/v1/users</code> n'est pas encore implémenté dans l'API Roomify.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Gestion des utilisateurs</h1>
        <p className="text-destructive text-sm">Une erreur est survenue : {error?.error ?? "Erreur inconnue"}</p>
      </div>
    );
  }

  const users = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestion des utilisateurs</h1>
        <p className="text-sm text-muted-foreground mt-1">Consultez et supprimez les comptes utilisateurs.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">Chargement…</div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-muted/30 py-16 px-8 text-center space-y-3">
          <UsersIcon className="w-8 h-8 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Aucun utilisateur trouvé.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Prénom</th>
                <th className="px-4 py-3 text-left font-medium">Nom</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Rôle</th>
                <th className="px-4 py-3 text-left font-medium">Inscrit le</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const roleCfg = ROLE_BADGES[user.role] ?? { label: user.role, className: "bg-muted text-foreground border-border" };
                const isConfirm = confirmId === user.id;
                return (
                  <tr key={user.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{user.firstName}</td>
                    <td className="px-4 py-3 text-foreground">{user.lastName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                          roleCfg.className
                        )}
                      >
                        {roleCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={isConfirm ? "destructive" : "outline"}
                          className={cn("text-xs gap-1.5", !isConfirm && "text-destructive hover:text-destructive")}
                          disabled={deletingId === user.id}
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {isConfirm ? "Confirmer" : "Supprimer"}
                        </Button>
                        {isConfirm && (
                          <button
                            className="text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => setConfirmId(null)}
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
