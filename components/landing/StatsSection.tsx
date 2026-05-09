"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const STATS = [
  { value: 200, suffix: "+", label: "Espaces vérifiés" },
  { value: 98,  suffix: "%", label: "Satisfaction client" },
  { value: 50,  suffix: "+", label: "Villes couvertes" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const steps    = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + increment, target);
      setCount(Math.round(current));
      if (current >= target) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="bg-[#f7f7f7] dark:bg-[#111111] py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {STATS.map(({ value, suffix, label }) => (
            <div key={label} className="space-y-2">
              <p className="text-[64px] font-bold text-[#222222] dark:text-[#f0f0f0] leading-none tracking-[-1px]">
                <AnimatedCounter target={value} suffix={suffix} />
              </p>
              <p className="text-[16px] text-[#6a6a6a]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
