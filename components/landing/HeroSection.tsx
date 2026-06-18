"use client";

import Link from "next/link";
import Image from "next/image";
import {motion, useScroll, useTransform} from "framer-motion";
import {useRef} from "react";
import {Search} from "lucide-react";

const HERO_WORDS = ["Trouvez", "l'espace", "idéal", "pour", "votre", "équipe"];

const MOSAIC_SEEDS = ["meeting-room-1", "coworking-space-2", "event-space-3"];

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const {scrollYProgress} = useScroll({target: containerRef, offset: ["start start", "end start"]});
    const photoY = useTransform(scrollYProgress, [0, 1], ["0px", "-60px"]);

    return (
        <section ref={containerRef} style={{ position: 'relative' }} className="relative overflow-hidden bg-white dark:bg-[#1a1a1a] min-h-[600px] flex items-center">
            <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center w-full">

                {/* Left — text + search */}
                <div className="space-y-8">
                    {/* Word reveal headline */}
                    <h1 className="text-[clamp(32px,5vw,56px)] font-bold text-[#222222] dark:text-[#f0f0f0] leading-[1.1] tracking-tight">
                        {HERO_WORDS.map((word, i) => (
                            <motion.span
                                key={i}
                                initial={{opacity: 0, y: 16}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: i * 0.08, duration: 0.4, ease: "easeOut"}}
                                className="inline-block mr-[0.25em]"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </h1>

                    <motion.p
                        initial={{opacity: 0, y: 12}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.6, duration: 0.4}}
                        className="text-[18px] text-[#6a6a6a] leading-relaxed max-w-md"
                    >
                        Des salles de réunion aux studios créatifs, Roomify connecte les professionnels aux meilleurs espaces.
                    </motion.p>

                    {/* Pill search bar slide-up */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.75, duration: 0.5, type: "spring", stiffness: 120, damping: 20}}
                    >
                        <div
                            className="flex items-center h-16 bg-white dark:bg-[#222222] border border-[#dddddd] dark:border-[#3a3a3a] rounded-full shadow-tier max-w-md">
                            <div className="flex-1 px-6">
                                <p className="text-[11px] font-semibold text-[#222222] dark:text-[#f0f0f0] uppercase tracking-wider mb-0.5">Où</p>
                                <p className="text-[14px] text-[#929292]">Ville, quartier…</p>
                            </div>
                            <div className="w-px h-8 bg-[#dddddd] dark:bg-[#3a3a3a] shrink-0"/>
                            <div className="flex-1 px-6">
                                <p className="text-[11px] font-semibold text-[#222222] dark:text-[#f0f0f0] uppercase tracking-wider mb-0.5">Type</p>
                                <p className="text-[14px] text-[#929292]">Tous les espaces</p>
                            </div>
                            <div className="pr-2 shrink-0">
                                <Link
                                    href="/register"
                                    className="w-12 h-12 rounded-full bg-[#ff385c] hover:bg-[#e00b41] flex items-center justify-center transition-colors duration-150"
                                >
                                    <Search className="w-5 h-5 text-white"/>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right — photo mosaïque avec parallax */}
                <motion.div
                    style={{y: photoY}}
                    className="hidden lg:grid grid-cols-2 grid-rows-2 gap-3 h-[480px]"
                >
                    <div className="col-span-1 row-span-2 relative rounded-[14px] overflow-hidden">
                        <Image
                            src={`https://picsum.photos/seed/${MOSAIC_SEEDS[0]}/600/900`}
                            alt="Espace de travail"
                            fill
                            priority
                            className="object-cover"
                            sizes="300px"
                        />
                    </div>
                    <div className="relative rounded-[14px] overflow-hidden">
                        <Image
                            src={`https://picsum.photos/seed/${MOSAIC_SEEDS[1]}/600/400`}
                            alt="Coworking"
                            fill
                            className="object-cover"
                            sizes="300px"
                        />
                    </div>
                    <div className="relative rounded-[14px] overflow-hidden">
                        <Image
                            src={`https://picsum.photos/seed/${MOSAIC_SEEDS[2]}/600/400`}
                            alt="Salle événementielle"
                            fill
                            className="object-cover"
                            sizes="300px"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
