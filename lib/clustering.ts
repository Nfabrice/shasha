import type { School } from "@/types/school";

export interface SchoolCluster {
  id: string;
  latitude: number;
  longitude: number;
  schools: School[];
}

// Clustering radius in screen pixels; clusters are roughly this far apart at any zoom.
const CLUSTER_RADIUS_PX = 56;
const UNCLUSTER_ZOOM = 12.5;

/**
 * Lightweight greedy clustering (no external dependency): each school joins the first
 * cluster whose seed is within a fixed on-screen radius, otherwise it seeds a new one.
 * Markers never fully overlap at continent-wide zoom levels, and resolve to individual
 * markers once zoomed into a district/sector.
 */
export function clusterSchools(schools: School[], zoom: number): SchoolCluster[] {
  if (zoom >= UNCLUSTER_ZOOM) {
    return schools.map((school) => ({
      id: school.id,
      latitude: school.latitude,
      longitude: school.longitude,
      schools: [school],
    }));
  }

  // Degrees per pixel at this zoom (256px Web Mercator tiles); close enough near the equator.
  const radius = (CLUSTER_RADIUS_PX * 360) / (256 * 2 ** zoom);
  const ordered = [...schools].sort((a, b) => a.latitude - b.latitude || a.longitude - b.longitude);
  const groups: { seed: School; schools: School[] }[] = [];

  for (const school of ordered) {
    const group = groups.find(
      ({ seed }) => Math.hypot(seed.latitude - school.latitude, seed.longitude - school.longitude) < radius,
    );
    if (group) group.schools.push(school);
    else groups.push({ seed: school, schools: [school] });
  }

  const clusters = groups.map(({ seed, schools: group }) => toCluster(seed, group));

  // Centroids drift toward their members, so merge any clusters that ended up within the radius.
  for (let merged = true; merged; ) {
    merged = false;
    outer: for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const a = clusters[i];
        const b = clusters[j];
        if (Math.hypot(a.latitude - b.latitude, a.longitude - b.longitude) < radius) {
          clusters[i] = toCluster(a.schools[0], [...a.schools, ...b.schools]);
          clusters.splice(j, 1);
          merged = true;
          break outer;
        }
      }
    }
  }

  return clusters;
}

function toCluster(seed: School, schools: School[]): SchoolCluster {
  const latitude = schools.reduce((sum, s) => sum + s.latitude, 0) / schools.length;
  const longitude = schools.reduce((sum, s) => sum + s.longitude, 0) / schools.length;
  return { id: schools.length > 1 ? `cluster-${seed.id}` : seed.id, latitude, longitude, schools };
}
