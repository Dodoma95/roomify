"use client";

import {motion} from "framer-motion";
import Link from "next/link";
import {Building2, Laptop, PartyPopper, Music2, Camera} from "lucide-react";

const CATEGORIES = [
    {label: "Salle de réunion", Icon: Building2, type: "MEETING_ROOM"},
    {label: "Coworking", Icon: Laptop, type: "COWORKING_SPACE"},
    {label: "Événementiel", Icon: PartyPopper, type: "EVENT_SPACE"},
    {label: "Salle de fête", Icon: Music2, type: "PARTY_ROOM"},
    {label: "Studio", Icon: Camera, type: "STUDIO"},
];

export function CategoryStrip() {
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
                    Explorer par type d&apos;espace
                </motion.h2>

                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {CATEGORIES.map(({label, Icon, type}, i) => (
                        <motion.div
                            key={type}
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true, margin: "-80px"}}
                            transition={{delay: i * 0.08, duration: 0.35, ease: "easeOut"}}
                            className="shrink-0"
                        >
                            <Link
                                href="/register"
                                className="flex flex-col items-center gap-3 px-8 py-5 rounded-[14px] border border-[#dddddd] dark:border-[#3a3a3a] hover:border-[#222222] dark:hover:border-[#f0f0f0] hover:shadow-tier transition-all duration-200 bg-white dark:bg-[#1a1a1a] group w-40 text-center"
                            >
                                <div
                                    className="w-12 h-12 rounded-full bg-[#f7f7f7] dark:bg-[#2a2a2a] flex items-center justify-center group-hover:bg-[#fff0f3] dark:group-hover:bg-[#4d1020] transition-colors duration-200">
                                    <Icon
                                        className="w-6 h-6 text-[#222222] dark:text-[#f0f0f0] group-hover:text-[#ff385c] transition-colors duration-200"
                                        strokeWidth={1.5}/>
                                </div>
                                <span className="text-[13px] font-medium text-[#222222] dark:text-[#f0f0f0] leading-snug">
                  {label}
                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
