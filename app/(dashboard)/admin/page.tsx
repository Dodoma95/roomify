"use client";

import useSWR from "swr";
import Link from "next/link";
import {Building2, Users, CalendarCheck, Clock, CheckCircle2, XCircle, ArrowRight} from "lucide-react";
import {PlacesPage} from "@/types/place";
import {cn} from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function usePlaceStats() {
    const {data: pending} = useSWR<PlacesPage>("/api/admin/places?status=PENDING", fetcher);
    const {data: approved} = useSWR<PlacesPage>("/api/admin/places?status=APPROVED", fetcher);
    const {data: rejected} = useSWR<PlacesPage>("/api/admin/places?status=REJECTED", fetcher);

    return {
        pending: pending?.pageInfo?.totalElements ?? null,
        approved: approved?.pageInfo?.totalElements ?? null,
        rejected: rejected?.pageInfo?.totalElements ?? null,
    };
}

const STATUS_CARDS = [
    {
        key: "pending" as const,
        label: "En attente",
        description: "Espaces en cours de modération",
        Icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-50 dark:bg-amber-950/30",
        border: "border-amber-200 dark:border-amber-800",
    },
    {
        key: "approved" as const,
        label: "Approuvés",
        description: "Espaces publiés et disponibles",
        Icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        border: "border-emerald-200 dark:border-emerald-800",
    },
    {
        key: "rejected" as const,
        label: "Refusés",
        description: "Espaces non conformes",
        Icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-200 dark:border-red-800",
    },
];

const QUICK_LINKS = [
    {
        href: "/admin/places",
        label: "Gérer les espaces",
        description: "Consulter, filtrer et supprimer les espaces",
        Icon: Building2,
    },
    {
        href: "/admin/users",
        label: "Gérer les utilisateurs",
        description: "Consulter et supprimer les comptes",
        Icon: Users,
    },
    {
        href: "/admin/bookings",
        label: "Gérer les réservations",
        description: "Confirmer ou annuler les réservations par espace",
        Icon: CalendarCheck,
    },
];

export default function AdminPage() {
    const stats = usePlaceStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Tableau de bord admin</h1>
                <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble de la plateforme Roomify</p>
            </div>

            <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6a6a6a]">Espaces</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {STATUS_CARDS.map(({key, label, description, Icon, color, bg, border}) => (
                        <div
                            key={key}
                            className={cn(
                                "rounded-[14px] border p-5 space-y-3",
                                bg,
                                border
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">{label}</span>
                                <Icon className={cn("w-5 h-5", color)}/>
                            </div>
                            <p className={cn("text-3xl font-bold", color)}>
                                {stats[key] === null ? "—" : stats[key]}
                            </p>
                            <p className="text-xs text-muted-foreground">{description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6a6a6a]">Accès rapides</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {QUICK_LINKS.map(({href, label, description, Icon}) => (
                        <Link
                            key={href}
                            href={href}
                            className="group flex items-start gap-4 rounded-[14px] border border-[#dddddd] bg-white p-5 shadow-tier hover:-translate-y-0.5 transition-all duration-200 dark:bg-[#2a2a2a] dark:border-[#3a3a3a]"
                        >
                            <div className="rounded-[8px] bg-[#f2f2f2] p-2.5 shrink-0 dark:bg-[#3a3a3a]">
                                <Icon className="w-5 h-5 text-[#ff385c]"/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[#222222] text-sm group-hover:text-[#ff385c] transition-colors dark:text-[#f0f0f0]">{label}</p>
                                <p className="text-xs text-[#6a6a6a] mt-0.5">{description}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#6a6a6a] group-hover:text-[#ff385c] transition-colors shrink-0 mt-0.5"/>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
