import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {ToastContainer} from "@/components/ui/ToastContainer";

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Roomify — La marketplace des espaces professionnels",
    description: "Trouvez et réservez des salles de réunion, espaces coworking, studios et espaces événementiels.",
    metadataBase: new URL("https://roomify-l3vv.onrender.com"),
    icons: {icon: "/icon.svg"},
    openGraph: {
        title: "Roomify — La marketplace des espaces professionnels",
        description: "Trouvez et réservez des salles de réunion, espaces coworking, studios et espaces événementiels.",
        url: "https://roomify-l3vv.onrender.com",
        siteName: "Roomify",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 627,
                alt: "Roomify — Trouvez l'espace idéal pour votre équipe",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Roomify — La marketplace des espaces professionnels",
        description: "Trouvez et réservez des salles de réunion, espaces coworking, studios et espaces événementiels.",
        images: ["/og-image.png"],
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={`${inter.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col">
        {children}
        <ToastContainer/>
        </body>
        </html>
    );
}
