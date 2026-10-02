"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "./animated-counter";

const TONES = {
  connected: "bg-connected-soft text-connected",
  "not-connected": "bg-not-connected-soft text-not-connected",
  neutral: "bg-muted text-navy-600",
} as const;

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  hint?: string;
  tone?: keyof typeof TONES;
  index?: number;
}

export function StatsCard({ icon: Icon, label, value, hint, tone = "neutral", index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-w-41 flex-1 flex-col gap-2.5 rounded-2xl border border-border/70 bg-card px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="whitespace-nowrap text-[12px] font-medium text-muted-foreground">{label}</span>
        <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg", TONES[tone])}>
          <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-[24px] font-bold leading-none tracking-tight text-navy-900 tabular-nums">
          <AnimatedCounter value={value} />
        </span>
        {hint && <span className="mt-1.5 whitespace-nowrap text-[11.5px] text-muted-foreground">{hint}</span>}
      </div>
    </motion.div>
  );
}
