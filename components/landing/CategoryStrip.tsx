"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Building2, Laptop, PartyPopper, Music2, Camera } from "lucide-react";

const CATEGORIES = [
    {
        label: "Salle de réunion",
        tagline: "Pour vos équipes",
        Icon: Building2,
        type: "MEETING_ROOM",
        seed: "meeting-room-category",
    },
    {
        label: "Coworking",
        tagline: "Bureau à la journée",
        Icon: Laptop,
        type: "COWORKING_SPACE",
        seed: "coworking-category",
    },
    {
        label: "Événementiel",
        tagline: "Séminaires & lancements",
        Icon: PartyPopper,
        type: "EVENT_SPACE",
        seed: "event-space-category",
    },
    {
        label: "Salle de fête",
        tagline: "Soirées & célébrations",
        Icon: Music2,
        type: "PARTY_ROOM",
        seed: "party-room-category",
    },
    {
        label: "Studio",
        tagline: "Photo, son & création",
        Icon: Camera,
        type: "STUDIO",
        seed: "studio-category",
    },
];

export function CategoryStrip() {
    return (
        <section className="bg-[#222222] py-20">
            <div className="max-w-[1280px] mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.4 }}
                    className="text-[21px] font-bold text-[#f0f0f0] mb-8"
                >
                    Explorer par type d&apos;espace
                </motion.h2>

                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {CATEGORIES.map(({ label, tagline, Icon, type, seed }, i) => (
                        <motion.div
                            key={type}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ delay: i * 0.08, duration: 0.35, ease: "easeOut" }}
                            className="shrink-0"
                        >
                            <Link
                                href="/register"
                                aria-label={`Explorer les ${label}`}
                                className="group relative block w-[160px] h-[240px] lg:w-[200px] lg:h-[300px] rounded-[16px] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#222222]"
                            >
                                {/* Photo avec scale au hover */}
                                <motion.div
                                    className="absolute inset-0"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                >
                                    <Image
                                        src={`https://picsum.photos/seed/${seed}/400/600`}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 160px, 200px"
                                    />
                                </motion.div>

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent group-hover:from-black/60 transition-all duration-[250ms]" />

                                {/* Icône + label + tagline */}
                                <div className="absolute bottom-0 left-0 p-4 space-y-0.5">
                                    <Icon className="w-5 h-5 text-white mb-1" strokeWidth={1.5} />
                                    <p className="text-[15px] font-semibold text-white leading-snug">
                                        {label}
                                    </p>
                                    <p className="text-[12px] text-[#d0d0d0]">{tagline}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
