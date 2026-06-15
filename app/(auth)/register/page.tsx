import Link from "next/link";
import {RegisterForm} from "@/components/auth/RegisterForm";
import {ArrowLeft} from "lucide-react";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#f7f7f7] dark:bg-[#111111] flex flex-col items-center justify-center px-4 py-16">
            {/* Back link */}
            <Link
                href="/"
                className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] transition-colors duration-150"
            >
                <ArrowLeft className="w-3.5 h-3.5"/>
                Accueil
            </Link>

            {/* Card */}
            <div className="w-full max-w-lg bg-white dark:bg-[#1a1a1a] rounded-[14px] shadow-tier px-10 py-12 space-y-8">
                {/* Logo */}
                <div className="text-center">
                    <span className="text-[28px] font-bold text-[#ff385c] tracking-tight">Roomify</span>
                </div>

                <div className="space-y-2">
                    <h1 className="text-[21px] font-bold text-[#222222] dark:text-[#f0f0f0]">Créer un compte</h1>
                    <p className="text-[14px] text-[#6a6a6a]">Rejoignez la marketplace des espaces professionnels</p>
                </div>

                <RegisterForm/>

                <p className="text-center text-[14px] text-[#6a6a6a]">
                    Déjà un compte ?{" "}
                    <Link
                        href="/login"
                        className="text-[#222222] dark:text-[#f0f0f0] font-semibold underline underline-offset-2 hover:text-[#ff385c] transition-colors duration-150"
                    >
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}
