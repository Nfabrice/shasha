import { MapView } from "@/components/map/map-view";
import { SchoolDetailsModal } from "@/components/school/school-details-modal";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { StatsBar } from "./stats-bar";

export function DashboardLayout() {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-canvas md:flex-row">
      <Header />

      <aside className="hidden w-[340px] shrink-0 border-r border-border/60 bg-card md:block lg:w-[368px]">
        <Sidebar />
      </aside>

      <main className="flex min-h-0 flex-1 flex-col gap-4 p-4 md:p-5">
        <StatsBar />
        <div className="min-h-0 flex-1">
          <MapView />
        </div>
      </main>

      <SchoolDetailsModal />
    </div>
  );
}
