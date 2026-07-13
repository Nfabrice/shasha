import type { School } from "@/types/school";

export interface SchoolCluster {
  id: string;
  latitude: number;
  longitude: number;
  schools: School[];
}

/**
 * Lightweight fixed-grid clustering (no external dependency): groups nearby
 * schools into cells whose size shrinks as the user zooms in, so pins never
 * fully overlap at country-wide zoom levels but resolve to individual
 * markers once zoomed into a district/sector.
 */
export function clusterSchools(schools: School[], zoom: number): SchoolCluster[] {
  if (zoom >= 11) {
    return schools.map((school) => ({
      id: school.id,
      latitude: school.latitude,
      longitude: school.longitude,
      schools: [school],
    }));
  }

  const cellSize = zoom >= 9.5 ? 0.1 : zoom >= 8.5 ? 0.2 : 0.35;
  const cells = new Map<string, School[]>();

  for (const school of schools) {
    const key = `${Math.round(school.latitude / cellSize)}:${Math.round(school.longitude / cellSize)}`;
    const bucket = cells.get(key);
    if (bucket) bucket.push(school);
    else cells.set(key, [school]);
  }

  return Array.from(cells.entries()).map(([key, group]) => {
    const latitude = group.reduce((sum, s) => sum + s.latitude, 0) / group.length;
    const longitude = group.reduce((sum, s) => sum + s.longitude, 0) / group.length;
    return { id: `cluster-${key}`, latitude, longitude, schools: group };
  });
}

export function dominantPhase(cluster: SchoolCluster) {
  const counts = new Map<string, number>();
  for (const school of cluster.schools) {
    counts.set(school.phase, (counts.get(school.phase) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0] as School["phase"];
}
