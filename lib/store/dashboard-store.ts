import { create } from "zustand";
import type {
  ConnectionFilterValue,
  PhaseFilterValue,
  SchoolFilters,
  SubscriptionFilterValue,
} from "@/types/school";

export const INITIAL_FILTERS: SchoolFilters = {
  search: "",
  connection: "All",
  country: null,
  province: null,
  district: null,
  phase: "All",
  subscription: "All",
};

export type Basemap = "map" | "satellite";

interface DashboardState {
  filters: SchoolFilters;
  basemap: Basemap;
  selectedSchoolId: string | null;
  hoveredSchoolId: string | null;
  isDetailsModalOpen: boolean;
  isMobileFiltersOpen: boolean;
  /** Incremented to ask the map to fit the visible schools. */
  fitRequest: number;

  setSearch: (search: string) => void;
  setConnection: (connection: ConnectionFilterValue) => void;
  setCountry: (country: string | null) => void;
  setProvince: (province: string | null) => void;
  setDistrict: (district: string | null) => void;
  setPhase: (phase: PhaseFilterValue) => void;
  setSubscription: (subscription: SubscriptionFilterValue) => void;
  resetFilters: () => void;

  selectSchool: (id: string | null) => void;
  clearSelectedSchool: () => void;
  setHoveredSchool: (id: string | null) => void;

  openDetailsModal: () => void;
  closeDetailsModal: () => void;

  setMobileFiltersOpen: (open: boolean) => void;
  requestFit: () => void;
  setBasemap: (basemap: Basemap) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  filters: INITIAL_FILTERS,
  basemap: "map",
  selectedSchoolId: null,
  hoveredSchoolId: null,
  isDetailsModalOpen: false,
  isMobileFiltersOpen: false,
  fitRequest: 0,

  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  // Phase and subscription only describe connected schools, so they reset when showing the rest.
  setConnection: (connection) =>
    set((state) => ({
      filters:
        connection === "Not connected"
          ? { ...state.filters, connection, phase: "All", subscription: "All" }
          : { ...state.filters, connection },
    })),
  setCountry: (country) =>
    set((state) => ({ filters: { ...state.filters, country, province: null, district: null } })),
  setProvince: (province) =>
    set((state) => ({ filters: { ...state.filters, province, district: null } })),
  setDistrict: (district) => set((state) => ({ filters: { ...state.filters, district } })),
  setPhase: (phase) => set((state) => ({ filters: { ...state.filters, phase } })),
  setSubscription: (subscription) => set((state) => ({ filters: { ...state.filters, subscription } })),
  resetFilters: () => set({ filters: INITIAL_FILTERS }),

  selectSchool: (id) => set({ selectedSchoolId: id }),
  clearSelectedSchool: () => set({ selectedSchoolId: null, isDetailsModalOpen: false }),
  setHoveredSchool: (id) => set({ hoveredSchoolId: id }),

  openDetailsModal: () => set({ isDetailsModalOpen: true }),
  closeDetailsModal: () => set({ isDetailsModalOpen: false }),

  setMobileFiltersOpen: (open) => set({ isMobileFiltersOpen: open }),
  requestFit: () => set((state) => ({ fitRequest: state.fitRequest + 1 })),
  setBasemap: (basemap) => set({ basemap }),
}));
