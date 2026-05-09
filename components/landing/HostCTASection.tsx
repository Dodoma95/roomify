"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export function HostCTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageScale  = useTransform(scrollYProgress, [0, 1], [0.95, 1.05]);
  const textX       = useTransform(scrollYProgress, [0, 0.5], [-40, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={ref} className="bg-[#f7f7f7] dark:bg-[#111111] py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center rounded-[14px] bg-white dark:bg-[#1a1a1a] p-10 shadow-tier">

          {/* Texte */}
          <motion.div style={{ x: textX, opacity: textOpacity }} className="space-y-6">
            <h2 className="text-[28px] font-bold text-[#222222] dark:text-[#f0f0f0] leading-tight">
              Vous avez un espace à louer ?
            </h2>
            <p className="text-[16px] text-[#6a6a6a] leading-relaxed">
              Rejoignez des centaines de propriétaires qui génèrent des revenus supplémentaires grâce à leurs espaces professionnels inutilisés.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#ff385c] hover:bg-[#e00b41] text-white text-[16px] font-medium transition-colors duration-150 group"
            >
              Proposer mon espace
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div style={{ scale: imageScale }} className="relative h-72 rounded-[14px] overflow-hidden">
            <Image
              src="https://picsum.photos/seed/host-cta-workspace/800/600"
              alt="Espace professionnel"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
