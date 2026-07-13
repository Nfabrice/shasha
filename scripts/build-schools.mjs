// One-time build script: transforms RAW_SCHOOLS into data/schools.json,
// geocoding each unique Sector/District/Province via OpenStreetMap Nominatim.
// Run with: node scripts/build-schools.mjs
// Coordinates are cached in scripts/.geocode-cache.json so re-runs don't hit the network.

import { writeFile, readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { RAW_SCHOOLS } from "./raw-schools.mjs";

const CACHE_PATH = new URL("./.geocode-cache.json", import.meta.url);
const OUT_PATH = path.resolve("data/schools.json");

const RWANDA_CENTER = { lat: -1.9403, lng: 29.8739 };

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseDate(mdY) {
  if (!mdY) return undefined;
  const [m, d, y] = mdY.split("/").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10);
}

// Deterministic small offset so schools sharing a sector-level geocode don't stack exactly.
function jitter(seedStr, magnitude = 0.006) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = (h << 5) - h + seedStr.charCodeAt(i);
    h |= 0;
  }
  const a = ((h % 1000) / 1000) * Math.PI * 2;
  const r = (((h >> 8) % 1000) / 1000) * magnitude;
  return { dLat: Math.cos(a) * r, dLng: Math.sin(a) * r };
}

async function loadCache() {
  try {
    const raw = await readFile(CACHE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveCache(cache) {
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function nominatimSearch(query) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "rw");

  const res = await fetch(url, {
    headers: {
      "User-Agent": "shasha-network-dashboard/1.0 (build-time geocoding script)",
      "Accept-Language": "en",
    },
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!Array.isArray(json) || json.length === 0) return null;
  return { lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) };
}

async function geocodeLocation(sector, district, province, cache) {
  const attempts = [
    `${sector}, ${district} District, ${province} Province, Rwanda`,
    `${district}, ${province} Province, Rwanda`,
    `${district}, Rwanda`,
    `${province} Province, Rwanda`,
  ];

  for (const query of attempts) {
    const key = query.toLowerCase();
    if (cache[key]) return cache[key];

    const result = await nominatimSearch(query);
    await sleep(1100); // respect Nominatim's 1 req/sec usage policy

    if (result) {
      cache[key] = result;
      return result;
    }
  }

  return RWANDA_CENTER;
}

async function main() {
  await mkdir(path.dirname(OUT_PATH), { recursive: true });
  const cache = await loadCache();

  const locationCoords = new Map(); // "province|district|sector" -> {lat,lng}
  const uniqueLocations = [
    ...new Set(RAW_SCHOOLS.map(([, province, district, sector]) => `${province}|${district}|${sector}`)),
  ];

  console.log(`Geocoding ${uniqueLocations.length} unique locations...`);
  let i = 0;
  for (const key of uniqueLocations) {
    const [province, district, sector] = key.split("|");
    i++;
    process.stdout.write(`  [${i}/${uniqueLocations.length}] ${sector}, ${district}, ${province}... `);
    const coords = await geocodeLocation(sector, district, province, cache);
    locationCoords.set(key, coords);
    console.log(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
    await saveCache(cache);
  }

  const usedIds = new Set();
  const schools = RAW_SCHOOLS.map((row) => {
    const [
      name, province, district, sector, phone,
      hc2024, hc2025, students, laptops, teachers,
      phaseRaw, installRaw, subEndRaw, monthsText,
    ] = row;

    let id = slugify(name);
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${slugify(name)}-${suffix++}`;
    }
    usedIds.add(id);

    const locKey = `${province}|${district}|${sector}`;
    const base = locationCoords.get(locKey) ?? RWANDA_CENTER;
    const { dLat, dLng } = jitter(id);

    const phase = phaseRaw ?? "Phase I";
    const installationDate = parseDate(installRaw);
    const subscriptionEnd = parseDate(subEndRaw);
    const status = monthsText === "Subscription Expired" ? "Expired" : "Active";

    return {
      id,
      name,
      province,
      district,
      sector,
      latitude: Number((base.lat + dLat).toFixed(6)),
      longitude: Number((base.lng + dLng).toFixed(6)),
      students,
      teachers,
      laptops,
      phase,
      installationDate,
      subscriptionEnd,
      status,
      headmasterPhone: phone ?? undefined,
      headcount2024: hc2024 ?? undefined,
      headcount2025: hc2025 ?? undefined,
    };
  });

  await writeFile(OUT_PATH, JSON.stringify(schools, null, 2));
  console.log(`\nWrote ${schools.length} schools to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
