"use client";

import useSWR from "swr";
import Link from "next/link";
import {BookingResponse, BookingStatus} from "@/types/booking";
import {useToast} from "@/hooks/useToast";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string }> = {
    CONFIRMED: {label: "Confirmée", className: "bg-[#dcfce7] text-[#15803d]"},
    PENDING: {label: "En attente", className: "bg-[#fef9c3] text-[#854d0e]"},
    COMPLETED: {label: "Terminée", className: "bg-[#f2f2f2] text-[#6a6a6a] border border-[#dddddd]"},
    CANCELLED: {label: "Annulée", className: "bg-[#fef2f2] text-[#c13515]"},
};

const CANCELLABLE: BookingStatus[] = ["PENDING", "CONFIRMED"];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", {day: "numeric", month: "long", year: "numeric"});
}

export function BookingsSection() {
    const toast = useToast();
    const {data: bookings, isLoading, mutate} = useSWR<BookingResponse[]>(
        "/api/profile/bookings",
        fetcher
    );

    async function handleCancel(id: string) {
        try {
            const res = await fetch(`/api/profile/bookings/${id}/cancel`, {method: "PATCH"});
            if (!res.ok) {
                const d = await res.json().catch(() => ({}));
                toast.error((d as {error?: string}).error ?? "Impossible d'annuler cette réservation");
                return;
            }
            await mutate();
            toast.success("Réservation annulée");
        } catch {
            toast.error("Impossible de contacter le serveur");
        }
    }

    return (
        <div>
            <h1 className="text-[22px] font-semibold text-[#222222] mb-1">Mes réservations</h1>
            <p className="text-[14px] text-[#6a6a6a] mb-6">Vos réservations d'espaces</p>

            {isLoading && (
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[116px] rounded-[14px] bg-[#f2f2f2] animate-pulse"/>
                    ))}
                </div>
            )}

            {!isLoading && bookings?.length === 0 && (
                <div className="text-center py-16 text-[#6a6a6a]">
                    <p className="mb-4">Vous n'avez aucune réservation pour le moment.</p>
                    <Link
                        href="/places"
                        className="inline-flex h-9 gap-1.5 rounded-[8px] px-4 text-sm items-center justify-center border border-[#222222] bg-white text-[#222222] hover:bg-[#f7f7f7] transition-all"
                    >
                        Explorer les espaces
                    </Link>
                </div>
            )}

            {!isLoading && bookings && bookings.length > 0 && (
                <div className="flex flex-col gap-3">
                    {bookings.map((booking) => {
                        const s = STATUS_CONFIG[booking.status];
                        return (
                            <div
                                key={booking.id}
                                className="bg-white border border-[#dddddd] rounded-[14px] shadow-tier p-5"
                            >
                                <div className="flex justify-between items-start mb-2.5">
                                    <div>
                                        <p className="text-[15px] font-semibold text-[#222222]">{booking.placeName}</p>
                                    </div>
                                    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold", s.className)}>
                    {s.label}
                  </span>
                                </div>
                                <div className="flex flex-wrap gap-x-5 gap-y-1 mb-3 text-[13px] text-[#3f3f3f]">
                                    <span>📅 {formatDate(booking.startDate)} → {formatDate(booking.endDate)}</span>
                                    <span className="font-semibold text-[#222222]">{booking.totalPrice} €</span>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/places/${booking.placeId}`}
                                        className="inline-flex h-9 gap-1.5 rounded-[8px] px-4 text-sm items-center justify-center border border-[#222222] bg-white text-[#222222] hover:bg-[#f7f7f7] transition-all"
                                    >
                                        Voir l'espace
                                    </Link>
                                    {CANCELLABLE.includes(booking.status) && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-[#c13515] border-[#dddddd] hover:border-[#c13515] hover:bg-[#fff5f5]"
                                            onClick={() => handleCancel(booking.id)}
                                        >
                                            Annuler
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
