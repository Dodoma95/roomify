"use client";

import {use} from "react";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {usePlaceById} from "@/hooks/usePlaces";
import {PlaceFormWizard} from "@/components/places/PlaceFormWizard";

export default function EditPlacePage({
                                          params,
                                      }: {
    params: Promise<{ id: string }>;
}) {
    const {id} = use(params);
    const {place, isLoading, error} = usePlaceById(id);

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-pulse">
                <div className="h-4 w-24 bg-[#f2f2f2] rounded-md"/>
                <div className="h-8 w-64 bg-[#f2f2f2] rounded-md"/>
                <div className="h-96 bg-[#f2f2f2] rounded-2xl"/>
            </div>
        );
    }

    if (error || !place) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <p className="text-[#6a6a6a]">Espace introuvable.</p>
                <Link
                    href="/owner/places"
                    className="text-sm text-[#ff385c] mt-2 inline-block hover:underline"
                >
                    Retour à mes espaces
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
            <div>
                <Link
                    href="/owner/places"
                    className="inline-flex items-center gap-1.5 text-sm text-[#6a6a6a] hover:text-[#222222] transition-colors duration-150 mb-4"
                >
                    <ArrowLeft className="w-4 h-4"/>
                    Mes espaces
                </Link>
                <h1 className="text-[22px] font-semibold text-[#222222]">
                    Modifier l&apos;espace
                </h1>
                <p className="text-[14px] text-[#6a6a6a] mt-1">
                    Les modifications soumettront l&apos;espace à une nouvelle validation.
                </p>
            </div>
            <PlaceFormWizard
                defaultValues={place}
                placeId={String(place.id)}
                backHref="/owner/places"
            />
        </div>
    );
}
