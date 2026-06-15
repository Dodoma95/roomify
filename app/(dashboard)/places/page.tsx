"use client";

import {useState} from "react";
import {PlaceGrid} from "@/components/places/PlaceGrid";
import {PlaceFilters} from "@/components/places/PlaceFilters";
import {usePlaces} from "@/hooks/usePlaces";
import {PlaceFilters as Filters} from "@/types/place";
import {useRole} from "@/hooks/useRole";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Plus} from "lucide-react";

export default function PlacesPage() {
    const [filters, setFilters] = useState<Filters>({});
    const {places, isLoading} = usePlaces(filters);
    const {isOwner, isAdmin} = useRole();

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Espaces disponibles</h1>
                    {!isLoading && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {places.length} espace{places.length !== 1 ? "s" : ""} trouvé{places.length !== 1 ? "s" : ""}
                        </p>
                    )}
                </div>
                {(isOwner || isAdmin) && (
                    <Button size="sm" className="gap-1.5 cursor-pointer" render={<Link href="/places/new"/>}>
                        <Plus className="w-3.5 h-3.5"/>
                        Ajouter
                    </Button>
                )}
            </div>

            <PlaceFilters onFilter={setFilters}/>
            <PlaceGrid places={places} isLoading={isLoading}/>
        </div>
    );
}
