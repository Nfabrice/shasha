"use client";

import { GraduationCap, Map, MapPin, Users, UserCheck, Satellite } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { StatsCard } from "./stats-card";

export function StatsBar() {
  const stats = useDashboardStats();

  const items = [
    { icon: GraduationCap, label: "Schools Connected", value: stats.schoolsConnected },
    { icon: Map, label: "Provinces Reached", value: stats.provincesReached },
    { icon: MapPin, label: "Districts Covered", value: stats.districtsCovered },
    { icon: Users, label: "Students Reached", value: stats.studentsReached, suffix: "+" },
    { icon: UserCheck, label: "Teachers Empowered", value: stats.teachersEmpowered, suffix: "+" },
    { icon: Satellite, label: "Installation Phases", value: stats.installationPhases },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
      {items.map((item, index) => (
        <StatsCard key={item.label} {...item} index={index} />
      ))}
    </div>
  );
}
