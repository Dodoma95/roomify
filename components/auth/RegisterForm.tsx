"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, MailCheck, Check, X } from "lucide-react";

const PASSWORD_RULES = [
  { label: "12 caractères minimum", test: (p: string) => p.length >= 12 },
  { label: "Une majuscule", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Une minuscule", test: (p: string) => /[a-z]/.test(p) },
  { label: "Un chiffre", test: (p: string) => /\d/.test(p) },
  { label: "Un caractère spécial (@#$%^&+=!)", test: (p: string) => /[@#$%^&+=!]/.test(p) },
];

const NAME_PATTERN = /^[\p{L}]+([ '\-][\p{L}]+)*$/u;

type FieldErrors = Partial<Record<"firstName" | "lastName" | "email" | "password" | "confirmPassword", string>>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-[#c13515] mt-1.5">{message}</p>;
}

export function RegisterForm() {
  const router = useRouter();
  const toast = useToast();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  function validate(data: FormData): boolean {
    const next: FieldErrors = {};
    const pwd = data.get("password") as string;
    const confirm = data.get("confirmPassword") as string;

    const firstName = data.get("firstName") as string;
    if (!firstName || firstName.length < 2) next.firstName = "Minimum 2 caractères";
    else if (!NAME_PATTERN.test(firstName)) next.firstName = "Lettres uniquement (espaces, tirets, apostrophes acceptés)";

    const lastName = data.get("lastName") as string;
    if (!lastName || lastName.length < 2) next.lastName = "Minimum 2 caractères";
    else if (!NAME_PATTERN.test(lastName)) next.lastName = "Lettres uniquement (espaces, tirets, apostrophes acceptés)";

    const email = data.get("email") as string;
    if (!email) next.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Email invalide";

    if (!pwd) {
      next.password = "Le mot de passe est requis";
    } else {
      const failed = PASSWORD_RULES.find((r) => !r.test(pwd));
      if (failed) next.password = failed.label;
    }

    if (!confirm) {
      next.confirmPassword = "Veuillez confirmer le mot de passe";
    } else if (pwd !== confirm) {
      next.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!validate(data)) return;

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          email: data.get("email"),
          password: data.get("password"),
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        toast.error(json.error ?? json.message ?? "Erreur lors de l'inscription.");
        return;
      }

      setSuccess(true);
    } catch {
      toast.error("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <MailCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Vérifiez votre boîte mail</p>
          <p className="text-sm text-muted-foreground mt-1">
            Un email de confirmation vous a été envoyé. Cliquez sur le lien pour activer votre compte.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full h-12 rounded-[8px] border border-[#dddddd] text-[#222222] dark:border-[#3a3a3a] dark:text-[#f0f0f0] text-base font-medium hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer"
        >
          Aller à la connexion
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Prénom / Nom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            placeholder="Jean"
            className="h-11"
            aria-invalid={!!errors.firstName}
            onChange={() => errors.firstName && setErrors((p) => ({ ...p, firstName: undefined }))}
          />
          <FieldError message={errors.firstName} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            placeholder="Dupont"
            className="h-11"
            aria-invalid={!!errors.lastName}
            onChange={() => errors.lastName && setErrors((p) => ({ ...p, lastName: undefined }))}
          />
          <FieldError message={errors.lastName} />
        </div>
      </div>

      {/* Email */}
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

      {/* Mot de passe */}
      <div className="space-y-1.5">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="Min. 12 car., maj., chiffre, spécial"
            className="h-11 pr-10"
            aria-invalid={!!errors.password}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Masquer" : "Afficher"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <FieldError message={errors.password} />

        {/* Règles de mot de passe */}
        {password.length > 0 && (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
            {PASSWORD_RULES.map(({ label, test }) => {
              const valid = test(password);
              return (
                <li key={label} className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${valid ? "text-[#ff385c]" : "text-[#6a6a6a]"}`}>
                  {valid
                    ? <Check className="w-3 h-3 shrink-0" />
                    : <X className="w-3 h-3 shrink-0 opacity-40" />}
                  {label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Confirmation */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="h-11 pr-10"
            aria-invalid={!!errors.confirmPassword}
            onChange={() => errors.confirmPassword && setErrors((p) => ({ ...p, confirmPassword: undefined }))}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Masquer" : "Afficher"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <FieldError message={errors.confirmPassword} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] active:bg-[#e00b41] text-white text-base font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-1"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Création…</> : "Créer mon compte"}
      </button>
    </form>
  );
}
