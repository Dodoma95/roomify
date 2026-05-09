import Link from "next/link";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-[#dddddd] dark:border-[#3a3a3a]">
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        <span className="text-[22px] font-semibold text-[#ff385c] tracking-tight select-none">
          Roomify
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center h-10 px-4 rounded-full text-[14px] font-medium text-[#222222] dark:text-[#f0f0f0] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a] transition-colors duration-150"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center h-10 px-5 rounded-full bg-[#222222] dark:bg-[#f0f0f0] text-white dark:text-[#222222] text-[14px] font-semibold hover:bg-[#3a3a3a] dark:hover:bg-[#dddddd] transition-colors duration-150"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </header>
  );
}
