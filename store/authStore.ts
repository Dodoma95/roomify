import { create } from "zustand";
import { SessionUser } from "@/types/user";

interface AuthState {
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
