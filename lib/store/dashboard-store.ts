import { create } from "zustand";
import type { PhaseFilterValue, SchoolFilters, StatusFilterValue } from "@/types/school";

export const INITIAL_FILTERS: SchoolFilters = {
  search: "",
  country: null,
  province: null,
  district: null,
  phase: "All",
  status: "All",
};

interface DashboardState {
  filters: SchoolFilters;
  selectedSchoolId: string | null;
  isDetailsModalOpen: boolean;
  isMobileFiltersOpen: boolean;

  setSearch: (search: string) => void;
  setCountry: (country: string | null) => void;
  setProvince: (province: string | null) => void;
  setDistrict: (district: string | null) => void;
  setPhase: (phase: PhaseFilterValue) => void;
  setStatus: (status: StatusFilterValue) => void;
  resetFilters: () => void;

  selectSchool: (id: string | null) => void;
  clearSelectedSchool: () => void;

  openDetailsModal: () => void;
  closeDetailsModal: () => void;

  setMobileFiltersOpen: (open: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  filters: INITIAL_FILTERS,
  selectedSchoolId: null,
  isDetailsModalOpen: false,
  isMobileFiltersOpen: false,

  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  setCountry: (country) =>
    set((state) => ({ filters: { ...state.filters, country, province: null, district: null } })),
  setProvince: (province) =>
    set((state) => ({ filters: { ...state.filters, province, district: null } })),
  setDistrict: (district) => set((state) => ({ filters: { ...state.filters, district } })),
  setPhase: (phase) => set((state) => ({ filters: { ...state.filters, phase } })),
  setStatus: (status) => set((state) => ({ filters: { ...state.filters, status } })),
  resetFilters: () => set({ filters: INITIAL_FILTERS }),

  selectSchool: (id) => set({ selectedSchoolId: id }),
  clearSelectedSchool: () => set({ selectedSchoolId: null, isDetailsModalOpen: false }),

  openDetailsModal: () => set({ isDetailsModalOpen: true }),
  closeDetailsModal: () => set({ isDetailsModalOpen: false }),

  setMobileFiltersOpen: (open) => set({ isMobileFiltersOpen: open }),
}));
