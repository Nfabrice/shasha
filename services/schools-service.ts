import rawSchools from "@/data/schools.json";
import type { DashboardStats, School, SchoolFilters } from "@/types/school";

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

export function filterSchools(filters: SchoolFilters): School[] {
  const query = filters.search.trim().toLowerCase();

  return SCHOOLS.filter((school) => {
    if (filters.country && school.country !== filters.country) return false;
    if (filters.province && school.province !== filters.province) return false;
    if (filters.district && school.district !== filters.district) return false;
    if (filters.phase !== "All" && school.phase !== filters.phase) return false;
    if (filters.status !== "All" && school.status !== filters.status) return false;
    if (query) {
      const haystack = `${school.name} ${school.district} ${school.sector ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function computeStats(schools: School[]): DashboardStats {
  return {
    schoolsConnected: schools.length,
    provincesReached: new Set(schools.map((s) => s.province)).size,
    districtsCovered: new Set(schools.map((s) => s.district)).size,
    studentsReached: schools.reduce((sum, s) => sum + s.students, 0),
    teachersEmpowered: schools.reduce((sum, s) => sum + s.teachers, 0),
    installationPhases: new Set(schools.map((s) => s.phase)).size,
  };
}
