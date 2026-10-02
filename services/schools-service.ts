import rawSchools from "@/data/schools.json";
import { EXPIRING_SOON_DAYS } from "@/lib/constants";
import { daysUntil } from "@/lib/format";
import type { DashboardStats, School, SchoolFilters, SubscriptionStatus } from "@/types/school";

const SCHOOLS = rawSchools as School[];

export function getAllSchools(): School[] {
  return SCHOOLS;
}

export function getSchoolById(id: string): School | undefined {
  return SCHOOLS.find((school) => school.id === id);
}

export function getCountries(): string[] {
  return Array.from(new Set(SCHOOLS.map((s) => s.country))).sort();
}

export function getProvinces(country?: string | null): string[] {
  const source = country ? SCHOOLS.filter((s) => s.country === country) : SCHOOLS;
  return Array.from(new Set(source.map((s) => s.province))).sort();
}

export function getDistrictsByProvince(country?: string | null, province?: string | null): string[] {
  const source = SCHOOLS.filter((s) => (!country || s.country === country) && (!province || s.province === province));
  return Array.from(new Set(source.map((s) => s.district))).sort();
}

export function isConnected(school: School): boolean {
  return school.connection === "Connected";
}

/** Subscription state of a connected school; undefined when the sheet has no subscription data. */
export function getSubscriptionStatus(school: School): SubscriptionStatus | undefined {
  if (!isConnected(school)) return undefined;
  if (school.subscriptionEnd) {
    const days = daysUntil(school.subscriptionEnd);
    if (days < 0) return "Expired";
    return days <= EXPIRING_SOON_DAYS ? "Expiring soon" : "Active";
  }
  return school.subscriptionExpired ? "Expired" : undefined;
}

export function filterSchools(filters: SchoolFilters): School[] {
  const query = filters.search.trim().toLowerCase();

  return SCHOOLS.filter((school) => {
    if (filters.connection !== "All" && school.connection !== filters.connection) return false;
    if (filters.country && school.country !== filters.country) return false;
    if (filters.province && school.province !== filters.province) return false;
    if (filters.district && school.district !== filters.district) return false;
    if (filters.phase !== "All" && school.phase !== filters.phase) return false;
    if (filters.subscription !== "All") {
      const status = getSubscriptionStatus(school);
      const isExpired = status === "Expired";
      if (!status || isExpired !== (filters.subscription === "Expired")) return false;
    }
    if (query) {
      const haystack =
        `${school.name} ${school.district} ${school.sector ?? ""} ${school.province} ${school.country}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function computeStats(schools: School[]): DashboardStats {
  const connected = schools.filter(isConnected);
  return {
    total: schools.length,
    connected: connected.length,
    notConnected: schools.length - connected.length,
    studentsReached: connected.reduce((sum, s) => sum + (s.students ?? 0), 0),
    teachersEmpowered: connected.reduce((sum, s) => sum + (s.teachers ?? 0), 0),
    districtsCovered: new Set(connected.map((s) => `${s.country}|${s.district}`)).size,
  };
}
