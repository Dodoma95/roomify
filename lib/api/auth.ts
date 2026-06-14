import { apiFetch } from "./client";
import { SessionUser } from "@/types/user";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface MeResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: SessionUser["roles"][number][];
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterPayload): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMe(token: string): Promise<MeResponse> {
  return apiFetch<MeResponse>("/api/v1/users/me", { token });
}
