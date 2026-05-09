"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CalendarCheck, Users } from "lucide-react";

const TRUST_ITEMS = [
  {
    Icon: ShieldCheck,
    title: "Espaces vérifiés",
    description: "Chaque espace est validé par notre équipe avant publication. Vous réservez en toute sérénité.",
  },
  {
    Icon: CalendarCheck,
    title: "Réservation instantanée",
    description: "Vérifiez la disponibilité en temps réel et réservez en quelques clics, sans aller-retour.",
  },
  {
    Icon: Users,
    title: "Propriétaires de confiance",
    description: "Une communauté de propriétaires professionnels notés et évalués par les locataires.",
  },
];

export function TrustSection() {
  return (
    <section className="bg-[#f7f7f7] dark:bg-[#111111] py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="text-[21px] font-bold text-[#222222] dark:text-[#f0f0f0] mb-12 text-center"
        >
          Pourquoi choisir Roomify ?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRUST_ITEMS.map(({ Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.4, ease: "easeOut" }}
              className="text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.1, duration: 0.4, type: "spring" }}
                className="w-14 h-14 rounded-full bg-[#fff0f3] dark:bg-[#4d1020] flex items-center justify-center mx-auto"
              >
                <Icon className="w-7 h-7 text-[#ff385c]" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-[16px] font-semibold text-[#222222] dark:text-[#f0f0f0]">{title}</h3>
              <p className="text-[14px] text-[#6a6a6a] leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
