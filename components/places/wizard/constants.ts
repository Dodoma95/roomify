import {Building2, Laptop, PartyPopper, Music2, Camera, type LucideIcon} from "lucide-react";
import {PlaceType} from "@/types/place";

export const PLACE_TYPE_META: {
    value: PlaceType;
    label: string;
    Icon: LucideIcon;
}[] = [
    {value: "MEETING_ROOM", label: "Salle de réunion", Icon: Building2},
    {value: "COWORKING_SPACE", label: "Coworking", Icon: Laptop},
    {value: "EVENT_SPACE", label: "Événementiel", Icon: PartyPopper},
    {value: "PARTY_ROOM", label: "Salle de fête", Icon: Music2},
    {value: "STUDIO", label: "Studio", Icon: Camera},
];
