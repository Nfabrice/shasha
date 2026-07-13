export type Phase = "Phase I" | "Phase II" | "Phase III";

export type SchoolStatus = "Active" | "Expired";

export interface School {
  id: string;
  name: string;

  province: string;
  district: string;
  sector: string;

  latitude: number;
  longitude: number;

  students: number;
  teachers: number;
  laptops: number;

  phase: Phase;

  installationDate?: string;
  subscriptionEnd?: string;

  status: SchoolStatus;

  headmasterPhone?: string;
  headcount2024?: number;
  headcount2025?: number;
}

export type PhaseFilterValue = Phase | "All";
export type StatusFilterValue = SchoolStatus | "All";

export interface SchoolFilters {
  search: string;
  province: string | null;
  district: string | null;
  phase: PhaseFilterValue;
  status: StatusFilterValue;
}

export interface DashboardStats {
  schoolsConnected: number;
  provincesReached: number;
  districtsCovered: number;
  studentsReached: number;
  teachersEmpowered: number;
  installationPhases: number;
}
