"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Mail, Loader2 } from "lucide-react";

type State = "loading" | "no-token" | "success" | "error";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<State>(token ? "loading" : "no-token");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.ok) {
          setState("success");
        } else {
          const body = await res.json().catch(() => ({}));
          setErrorMessage(body.message ?? "Lien invalide ou expiré");
          setState("error");
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setErrorMessage("Impossible de joindre le serveur");
        } else {
          setErrorMessage("La vérification a pris trop de temps, réessaie.");
        }
        setState("error");
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center justify-center px-4 py-16">

      <div className="w-full max-w-sm bg-white rounded-[14px] shadow-tier border border-[#dddddd] px-10 py-12 space-y-6 text-center">
        <span className="block text-[28px] font-bold text-[#ff385c] tracking-tight">Roomify</span>

        {state === "loading" && (
          <>
            <div className="w-14 h-14 rounded-full bg-[#fff0f2] flex items-center justify-center mx-auto">
              <Loader2 className="w-7 h-7 text-[#ff385c] animate-spin" strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h1 className="text-[21px] font-bold text-[#222222]">Vérification en cours…</h1>
              <p className="text-[14px] text-[#6a6a6a] leading-relaxed">
                Validation de votre adresse email, merci de patienter.
              </p>
            </div>
          </>
        )}

        {state === "no-token" && (
          <>
            <div className="w-14 h-14 rounded-full bg-[#fff0f2] flex items-center justify-center mx-auto">
              <Mail className="w-7 h-7 text-[#ff385c]" strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h1 className="text-[21px] font-bold text-[#222222]">Vérifiez votre email</h1>
              <p className="text-[14px] text-[#6a6a6a] leading-relaxed">
                Un lien de confirmation a été envoyé à votre adresse email. Cliquez dessus pour activer votre compte.
              </p>
            </div>
            <p className="text-[12px] text-[#929292]">
              Le lien est valable <strong className="text-[#6a6a6a]">24 heures</strong>.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full border border-[#222222] bg-white text-[#222222] hover:bg-[#f7f7f7] rounded-[8px] px-4 py-[11px] text-[14px] font-medium transition-colors"
            >
              Retour à la connexion
            </Link>
          </>
        )}

        {state === "success" && (
          <>
            <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-[#15803d]" strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h1 className="text-[21px] font-bold text-[#222222]">Email confirmé !</h1>
              <p className="text-[14px] text-[#6a6a6a] leading-relaxed">
                Votre adresse email a bien été vérifiée. Vous pouvez maintenant vous connecter.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full bg-[#ff385c] hover:bg-[#e00b41] text-white rounded-[8px] px-4 py-[11px] text-[14px] font-medium transition-colors"
            >
              Se connecter
            </Link>
          </>
        )}

        {state === "error" && (
          <>
            <div className="w-14 h-14 rounded-full bg-[#fef2f2] flex items-center justify-center mx-auto">
              <XCircle className="w-7 h-7 text-[#c13515]" strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h1 className="text-[21px] font-bold text-[#222222]">Lien invalide</h1>
              <p className="text-[14px] text-[#6a6a6a] leading-relaxed">{errorMessage}</p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center justify-center w-full bg-[#ff385c] hover:bg-[#e00b41] text-white rounded-[8px] px-4 py-[11px] text-[14px] font-medium transition-colors"
            >
              Créer un nouveau compte
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center text-[14px] text-[#6a6a6a] hover:text-[#222222] transition-colors"
            >
              Retour à la connexion
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
