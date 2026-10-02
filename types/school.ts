export type Phase = "Phase I" | "Phase II" | "Phase III" | "Phase IV";

/** The sheet's Status column: whether Shasha has installed Starlink at the school. */
export type ConnectionStatus = "Connected" | "Not connected";

export type SubscriptionStatus = "Active" | "Expiring soon" | "Expired";

export interface School {
  id: string;
  name: string;

  country: string;
  province: string;
  district: string;
  sector?: string;

  latitude: number;
  longitude: number;
  /** True when the school could only be placed at district level or coarser. */
  approximateLocation?: boolean;

  connection: ConnectionStatus;

  students?: number;
  teachers?: number;
  laptops?: number;
  equipmentNotes?: string;

  // Connected schools only.
  phase?: Phase;
  installationDate?: string;
  subscriptionEnd?: string;
  /** The sheet marks the subscription as expired but gives no end date. */
  subscriptionExpired?: boolean;

  headmasterPhone?: string;
  headcount2024?: number;
  headcount2025?: number;
}

export type ConnectionFilterValue = ConnectionStatus | "All";
export type PhaseFilterValue = Phase | "All";
export type SubscriptionFilterValue = "All" | "Active" | "Expired";

export interface SchoolFilters {
  search: string;
  connection: ConnectionFilterValue;
  country: string | null;
  province: string | null;
  district: string | null;
  phase: PhaseFilterValue;
  subscription: SubscriptionFilterValue;
}

export interface DashboardStats {
  total: number;
  connected: number;
  notConnected: number;
  studentsReached: number;
  teachersEmpowered: number;
  districtsCovered: number;
}
