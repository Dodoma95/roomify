"use client";

import Link from "next/link";
import Image from "next/image";
import {motion} from "framer-motion";
import {MapPin} from "lucide-react";

const FEATURED = [
    {id: "feat-1", seed: "meeting-room-featured-1", name: "Salle Haussmann", address: "Paris 8e", price: 45, type: "Salle de réunion"},
    {id: "feat-2", seed: "coworking-featured-2", name: "Open Space République", address: "Paris 11e", price: 18, type: "Coworking"},
    {id: "feat-3", seed: "event-space-featured-3", name: "Loft Marais Événements", address: "Paris 3e", price: 120, type: "Événementiel"},
    {id: "feat-4", seed: "studio-featured-4", name: "Studio Pigalle", address: "Paris 18e", price: 65, type: "Studio"},
];

export function FeaturedPlaces() {
    return (
        <section className="bg-white dark:bg-[#1a1a1a] py-16">
            <div className="max-w-[1280px] mx-auto px-6">
                <motion.h2
                    initial={{opacity: 0, y: 16}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, margin: "-80px"}}
                    transition={{duration: 0.4}}
                    className="text-[21px] font-bold text-[#222222] dark:text-[#f0f0f0] mb-8"
                >
                    Espaces populaires
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURED.map(({id, seed, name, address, price, type}, i) => (
                        <motion.div
                            key={id}
                            initial={{opacity: 0, y: 32}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true, margin: "-60px"}}
                            transition={{delay: i * 0.1, duration: 0.4, ease: "easeOut"}}
                        >
                            <Link href="/register"
                                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c] rounded-[14px]">
                                <div className="relative aspect-square rounded-[14px] overflow-hidden bg-[#f7f7f7]">
                                    <Image
                                        src={`https://picsum.photos/seed/${seed}/800/800`}
                                        alt={name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white shadow-tier">
                                        <span className="text-[11px] font-semibold text-[#222222]">{type}</span>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1 px-0.5">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-[16px] font-semibold text-[#222222] dark:text-[#f0f0f0] line-clamp-1">{name}</h3>
                                        <p className="text-[14px] font-semibold text-[#222222] dark:text-[#f0f0f0] shrink-0">
                                            {price} €<span className="font-normal text-[#6a6a6a]"> /h</span>
                                        </p>
                                    </div>
                                    <p className="flex items-center gap-1 text-[14px] text-[#6a6a6a]">
                                        <MapPin className="w-3.5 h-3.5 shrink-0"/>
                                        {address}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link
                        href="/register"
                        className="inline-flex items-center h-12 px-8 rounded-full bg-[#ff385c] hover:bg-[#e00b41] text-white text-[16px] font-medium transition-colors duration-150"
                    >
                        Voir tous les espaces
                    </Link>
                </div>
            </div>
        </section>
    );
}
