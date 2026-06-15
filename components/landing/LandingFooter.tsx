import Link from "next/link";

const FOOTER_COLS = [
    {
        head: "Support",
        links: [
            {label: "Centre d'aide", href: "#"},
            {label: "Contact", href: "#"},
            {label: "Signaler un problème", href: "#"},
        ],
    },
    {
        head: "Roomify",
        links: [
            {label: "À propos", href: "#"},
            {label: "Blog", href: "#"},
            {label: "Devenir propriétaire", href: "/register"},
        ],
    },
    {
        head: "Légal",
        links: [
            {label: "Conditions d'utilisation", href: "#"},
            {label: "Politique de confidentialité", href: "#"},
            {label: "Cookies", href: "#"},
        ],
    },
];

export function LandingFooter() {
    return (
        <footer className="bg-white dark:bg-[#1a1a1a] border-t border-[#dddddd] dark:border-[#3a3a3a]">
            <div className="max-w-[1280px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
                    {FOOTER_COLS.map(({head, links}) => (
                        <div key={head} className="space-y-4">
                            <h3 className="text-[16px] font-medium text-[#222222] dark:text-[#f0f0f0]">{head}</h3>
                            <ul className="space-y-3">
                                {links.map(({label, href}) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="text-[14px] text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] transition-colors duration-150"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Legal band */}
                <div className="border-t border-[#ebebeb] dark:border-[#2e2e2e] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[13px] text-[#6a6a6a]">© 2026 Roomify, Inc. · Tous droits réservés</p>
                    <div className="flex items-center gap-4">
                        <Link href="#"
                              className="text-[13px] text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] transition-colors">Confidentialité</Link>
                        <Link href="#"
                              className="text-[13px] text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] transition-colors">Conditions</Link>
                        <Link href="#" className="text-[13px] text-[#6a6a6a] hover:text-[#222222] dark:hover:text-[#f0f0f0] transition-colors">Plan du
                            site</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
