"use client";

import useSWR from "swr";
import { SessionUser } from "@/types/user";
import { useAuthStore } from "@/store/authStore";

const fetchSession = (): Promise<SessionUser | null> =>
  fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null));

export function useAuth() {
  const { user, setUser } = useAuthStore();
  const { data, isLoading, mutate } = useSWR<SessionUser | null>(
    "/api/auth/me",
    fetchSession,
    {
      revalidateOnFocus: false,
      onSuccess: (d) => setUser(d ?? null),
    }
  );

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    await mutate(null, false);
  };

  return { user: user ?? data, isLoading, logout, mutate };
}
