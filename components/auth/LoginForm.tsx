"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type FieldErrors = Partial<Record<"email" | "password", string>>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-[#c13515] mt-1.5">{message}</p>;
}

export function LoginForm() {
  const router = useRouter();
  const toast = useToast();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const next: FieldErrors = {};
    if (!email) next.email = "L'email est requis";
    if (!password) next.password = "Le mot de passe est requis";
    if (Object.keys(next).length) { setErrors(next); return; }

    setErrors({});
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      toast.error("Email ou mot de passe incorrect.");
      return;
    }

    router.push("/places");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="vous@exemple.com"
          className="h-11"
          aria-invalid={!!errors.email}
          onChange={() => errors.email && setErrors((p) => ({ ...p, email: undefined }))}
        />
        <FieldError message={errors.email} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-11 pr-10"
            aria-invalid={!!errors.password}
            onChange={() => errors.password && setErrors((p) => ({ ...p, password: undefined }))}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <FieldError message={errors.password} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] active:bg-[#e00b41] text-white text-base font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Connexion…</> : "Se connecter"}
      </button>
    </form>
  );
}
