"use client";

import { useState } from "react";
import useSWR from "swr";
import { UserAdminResponse, UserPage, Role } from "@/types/user";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Users as UsersIcon, Plus, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) return r.json().then((d: unknown) => Promise.reject(d));
    return r.json();
  });

const ROLE_BADGES: Record<Role, { label: string; className: string }> = {
  USER:        { label: "Utilisateur",  className: "bg-sky-100 text-sky-800 border-sky-200" },
  OWNER:       { label: "Propriétaire", className: "bg-violet-100 text-violet-800 border-violet-200" },
  ADMIN:       { label: "Admin",        className: "bg-teal-100 text-teal-800 border-teal-200" },
  SUPER_ADMIN: { label: "Super Admin",  className: "bg-rose-100 text-rose-800 border-rose-200" },
};

const ALL_ROLES: Role[] = ["USER", "OWNER", "ADMIN", "SUPER_ADMIN"];

const ROLE_FILTER_OPTIONS: { value: Role | ""; label: string }[] = [
  { value: "",           label: "Tous les rôles" },
  { value: "USER",       label: "Utilisateur" },
  { value: "OWNER",      label: "Propriétaire" },
  { value: "ADMIN",      label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

const PAGE_SIZE = 20;

function useAdminUsers(email: string, role: string, page: number) {
  const params = new URLSearchParams();
  if (email) params.set("email", email);
  if (role) params.set("role", role);
  params.set("page", String(page));
  params.set("size", String(PAGE_SIZE));
  return useSWR<UserPage>(`/api/admin/users?${params.toString()}`, fetcher);
}

export default function AdminUsersPage() {
  const [emailInput, setEmailInput] = useState("");
  const [activeEmail, setActiveEmail] = useState("");
  const [activeRole, setActiveRole] = useState<Role | "">("");
  const [page, setPage] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState<string | null>(null);
  const [addingRoleFor, setAddingRoleFor] = useState<string | null>(null);
  const toast = useToast();

  const { data, error, isLoading, mutate } = useAdminUsers(activeEmail, activeRole, page);
  const users: UserAdminResponse[] = data?.results ?? [];
  const pageInfo = data?.pageInfo;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setActiveEmail(emailInput.trim());
    setPage(0);
  }

  async function handleDelete(id: string) {
    if (confirmId !== id) { setConfirmId(id); return; }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) toast.error("Impossible de supprimer l'utilisateur.");
      else { toast.success("Utilisateur supprimé."); await mutate(); }
    } catch { toast.error("Impossible de contacter le serveur."); }
    finally { setDeletingId(null); setConfirmId(null); }
  }

  async function handleRoleAction(userId: string, role: Role, action: "ADD" | "REMOVE") {
    const key = `${userId}-${role}-${action}`;
    setRoleLoading(key);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, action }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast.error((d as { error?: string }).error ?? "Impossible de modifier le rôle.");
      } else {
        toast.success(action === "ADD" ? `Rôle ${role} ajouté.` : `Rôle ${role} retiré.`);
        await mutate();
      }
    } catch { toast.error("Impossible de contacter le serveur."); }
    finally { setRoleLoading(null); setAddingRoleFor(null); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222222] dark:text-[#f0f0f0]">Gestion des utilisateurs</h1>
        <p className="text-sm text-[#6a6a6a] mt-1">Consultez, modifiez les rôles et supprimez les comptes.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Input
            placeholder="Filtrer par email…"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="w-60"
          />
          <Button type="submit" variant="outline" className="gap-1.5 shrink-0">
            <Search className="w-4 h-4" />
            Filtrer
          </Button>
        </form>
        <select
          value={activeRole}
          onChange={(e) => { setActiveRole(e.target.value as Role | ""); setPage(0); }}
          className="h-9 rounded-[8px] border border-[#dddddd] px-3 text-sm text-[#222222] bg-white dark:bg-[#2a2a2a] dark:border-[#3a3a3a] dark:text-[#f0f0f0] focus:outline-none"
        >
          {ROLE_FILTER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {error && !isLoading && (
        <p className="text-destructive text-sm">
          Erreur : {(error as { error?: string }).error ?? "Impossible de charger les utilisateurs."}
        </p>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-[#6a6a6a]">Chargement…</div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[14px] border border-[#dddddd] bg-[#f2f2f2] py-16 px-8 text-center space-y-3 dark:bg-[#2a2a2a] dark:border-[#3a3a3a]">
          <UsersIcon className="w-8 h-8 text-[#6a6a6a]" />
          <p className="text-[#6a6a6a] text-sm">Aucun utilisateur trouvé.</p>
        </div>
      ) : (
        <div className="rounded-[14px] border border-[#dddddd] overflow-hidden dark:border-[#3a3a3a]">
          <table className="w-full text-sm">
            <thead className="bg-[#f2f2f2] text-[#6a6a6a] dark:bg-[#2a2a2a]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nom</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Rôles</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isConfirm = confirmId === user.id;
                const availableToAdd = ALL_ROLES.filter((r) => !user.roles.includes(r));
                return (
                  <tr
                    key={user.id}
                    className={cn(
                      "border-t border-[#dddddd] hover:bg-[#f7f7f7] dark:border-[#3a3a3a] dark:hover:bg-[#2a2a2a] transition-colors",
                      user.deletedAt && "opacity-60"
                    )}
                  >
                    <td className="px-4 py-3 font-medium text-[#222222] dark:text-[#f0f0f0] whitespace-nowrap">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-3 text-[#6a6a6a]">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {user.roles.map((role) => {
                          const cfg = ROLE_BADGES[role];
                          const removeKey = `${user.id}-${role}-REMOVE`;
                          return (
                            <span
                              key={role}
                              className={cn(
                                "inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full text-xs font-medium border",
                                cfg.className
                              )}
                            >
                              {cfg.label}
                              <button
                                disabled={roleLoading === removeKey || !!user.deletedAt}
                                onClick={() => handleRoleAction(user.id, role, "REMOVE")}
                                className="hover:opacity-70 disabled:opacity-40 transition-opacity"
                                title={`Retirer ${role}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          );
                        })}
                        {availableToAdd.length > 0 && !user.deletedAt && (
                          addingRoleFor === user.id ? (
                            <div className="flex items-center gap-1">
                              <select
                                autoFocus
                                className="text-xs rounded-[6px] border border-[#dddddd] px-1.5 py-0.5 bg-white dark:bg-[#2a2a2a] dark:border-[#3a3a3a] dark:text-[#f0f0f0] focus:outline-none"
                                defaultValue=""
                                onChange={(e) => {
                                  if (e.target.value) handleRoleAction(user.id, e.target.value as Role, "ADD");
                                }}
                              >
                                <option value="" disabled>Choisir…</option>
                                {availableToAdd.map((r) => (
                                  <option key={r} value={r}>{ROLE_BADGES[r].label}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => setAddingRoleFor(null)}
                                className="text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0]"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setAddingRoleFor(user.id)}
                              title="Ajouter un rôle"
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-[#dddddd] text-[#6a6a6a] hover:border-[#ff385c] hover:text-[#ff385c] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          )
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {user.deletedAt ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-red-100 text-red-800 border-red-200">
                          Supprimé
                        </span>
                      ) : !user.enabled ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-orange-100 text-orange-800 border-orange-200">
                          Désactivé
                        </span>
                      ) : !user.emailVerified ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-amber-100 text-amber-800 border-amber-200">
                          Non vérifié
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-800 border-emerald-200">
                          Actif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={isConfirm ? "destructive" : "outline"}
                          className={cn("text-xs gap-1.5", !isConfirm && "text-destructive hover:text-destructive")}
                          disabled={deletingId === user.id || !!user.deletedAt}
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {isConfirm ? "Confirmer" : "Supprimer"}
                        </Button>
                        {isConfirm && (
                          <button
                            className="text-xs text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0]"
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

      {pageInfo && pageInfo.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[#6a6a6a]">
          <span>
            Page {pageInfo.page + 1} sur {pageInfo.totalPages} ({pageInfo.totalElements} utilisateurs)
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!pageInfo.hasPrevious}
              onClick={() => setPage((p) => p - 1)}
            >
              Précédent
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!pageInfo.hasNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
