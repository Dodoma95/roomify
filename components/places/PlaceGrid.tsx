"use client";

import { motion } from "framer-motion";
import {Place} from "@/types/place";
import {PlaceCard} from "./PlaceCard";
import {Building2} from "lucide-react";

interface PlaceGridProps {
    places: Place[];
    isLoading?: boolean;
}

export function PlaceGrid({places, isLoading}: PlaceGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({length: 8}).map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-border bg-card animate-pulse">
                        <div className="aspect-[3/2] bg-muted"/>
                        <div className="p-4 space-y-2.5">
                            <div className="h-4 bg-muted rounded-md w-3/4"/>
                            <div className="h-3 bg-muted rounded-md w-1/2"/>
                            <div className="h-3 bg-muted rounded-md w-2/3"/>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!places.length) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-muted-foreground" strokeWidth={1.5}/>
                </div>
                <div>
                    <p className="font-semibold text-foreground">Aucun espace trouvé</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Essayez de modifier vos filtres pour voir plus de résultats.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {places.map((place, i) => (
                <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.3, ease: "easeOut" }}
                    whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                >
                    <PlaceCard place={place}/>
                </motion.div>
            ))}
        </div>
    );
}
