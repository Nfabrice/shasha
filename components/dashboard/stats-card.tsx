"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  index?: number;
}

export function StatsCard({ icon: Icon, label, value, suffix, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="flex min-w-[172px] flex-1 items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-shadow hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50">
        <Icon className="h-5 w-5 text-brand-500" strokeWidth={2} />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-xl font-bold leading-tight text-navy-900 tabular-nums">
          <AnimatedCounter value={value} />
          {suffix}
        </span>
        <span className="whitespace-nowrap text-[12px] font-medium leading-snug text-muted-foreground">
          {label}
        </span>
      </div>
    </motion.div>
  );
}
