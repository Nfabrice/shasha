"use client";

import { GraduationCap, MapPin, Users, Wifi, WifiOff } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { StatsCard } from "./stats-card";

export function StatsBar() {
  const stats = useDashboardStats();
  const connectedShare = stats.total > 0 ? Math.round((stats.connected / stats.total) * 100) : 0;

  const items = [
    {
      icon: Wifi,
      label: "Connected schools",
      value: stats.connected,
      hint: `${connectedShare}% of schools`,
      tone: "connected" as const,
    },
    {
      icon: WifiOff,
      label: "Not connected",
      value: stats.notConnected,
      hint: "Awaiting Starlink",
      tone: "not-connected" as const,
    },
    { icon: GraduationCap, label: "Students reached", value: stats.studentsReached, hint: "In connected schools" },
    { icon: Users, label: "Teachers empowered", value: stats.teachersEmpowered, hint: "In connected schools" },
    { icon: MapPin, label: "Districts covered", value: stats.districtsCovered, hint: "With a connected school" },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] xl:grid xl:grid-cols-5 xl:overflow-visible xl:pb-0 [&::-webkit-scrollbar]:hidden">
      {items.map((item, index) => (
        <StatsCard key={item.label} {...item} index={index} />
      ))}
    </div>
  );
}
