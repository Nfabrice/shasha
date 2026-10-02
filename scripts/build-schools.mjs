// One-time build script: transforms RAW_SCHOOLS into data/schools.json,
// geocoding each unique Sector/District/Province via OpenStreetMap Nominatim.
// Run with: node scripts/build-schools.mjs
// Coordinates are cached in scripts/.geocode-cache.json so re-runs don't hit the network.
//
// Real GPS positions go in data/school-coordinates.csv (the "coordinates" column, as
// "latitude, longitude" — the format Google Maps copies). Schools with coordinates there are
// placed exactly and marked locationConfirmed; the rest keep an estimated position near the
// center of their sector or district.

import { writeFile, readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { RAW_SCHOOLS } from "./raw-schools.mjs";

const CACHE_PATH = new URL("./.geocode-cache.json", import.meta.url);
const OUT_PATH = path.resolve("data/schools.json");
const COORDINATES_PATH = path.resolve("data/school-coordinates.csv");
// Confirmed positions further than this from the school's district/sector estimate are reported,
// since they usually mean swapped latitude/longitude or a pin dropped in the wrong place.
const SUSPICIOUS_DISTANCE_KM = 50;

const RWANDA_CENTER = { lat: -1.9403, lng: 29.8739 };

// ISO country code (for Nominatim's countrycodes filter) and a fallback center point
// used when geocoding fails to resolve a more specific location.
const COUNTRY_META = {
  Rwanda: { code: "rw", center: RWANDA_CENTER },
  Zimbabwe: { code: "zw", center: { lat: -19.0154, lng: 29.1549 } },
  Kenya: { code: "ke", center: { lat: -1.2921, lng: 36.8219 } },
};

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

// Minimal CSV parser: comma-separated, double-quoted fields may contain commas and "" escapes.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  row.push(field);
  if (row.some((value) => value.trim() !== "")) rows.push(row);
  return rows;
}

/** school id -> { lat, lng } for every row of data/school-coordinates.csv with coordinates filled in. */
async function loadConfirmedCoordinates() {
  let text;
  try {
    text = await readFile(COORDINATES_PATH, "utf-8");
  } catch {
    return new Map();
  }
  const [header, ...rows] = parseCsv(text);
  const idCol = header.indexOf("id");
  const coordCol = header.indexOf("coordinates");
  const confirmed = new Map();
  for (const row of rows) {
    const raw = (row[coordCol] ?? "").trim();
    if (!raw) continue;
    const [lat, lng] = raw.split(/[\s,]+/).map(Number);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      throw new Error(`Invalid coordinates for ${row[idCol]}: "${raw}" (expected "latitude, longitude")`);
    }
    confirmed.set(row[idCol], { lat, lng });
  }
  return confirmed;
}

function distanceKm(a, b) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
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

async function nominatimSearch(query, countryCode) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  if (countryCode) url.searchParams.set("countrycodes", countryCode);

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

// Resolves a location to coordinates. `precise` is true only when the sector itself was found;
// district/province/country fallbacks are approximate.
async function geocodeLocation(country, sector, district, province, cache) {
  // Rwanda's admin hierarchy (Sector/District/Province) resolves well with these suffixes;
  // other countries here don't have a sector-level division, so keep it simpler.
  const sectorQuery =
    sector && sector !== district
      ? country === "Rwanda"
        ? `${sector}, ${district} District, ${province} Province, Rwanda`
        : `${sector}, ${district}, ${province}, ${country}`
      : null;
  const fallbacks =
    country === "Rwanda"
      ? [`${district}, ${province} Province, Rwanda`, `${district}, Rwanda`, `${province} Province, Rwanda`]
      : [`${district}, ${province}, ${country}`, `${province}, ${country}`, `${country}`];
  const attempts = [...(sectorQuery ? [sectorQuery] : []), ...fallbacks];

  const countryCode = COUNTRY_META[country]?.code;

  for (const query of attempts) {
    const precise = query === sectorQuery;
    const key = query.toLowerCase();
    if (cache[key]) return { ...cache[key], precise };

    const result = await nominatimSearch(query, countryCode);
    await sleep(1100); // respect Nominatim's 1 req/sec usage policy

    if (result) {
      cache[key] = result;
      return { ...result, precise };
    }
  }

  return { ...(COUNTRY_META[country]?.center ?? RWANDA_CENTER), precise: false };
}

async function main() {
  await mkdir(path.dirname(OUT_PATH), { recursive: true });
  const cache = await loadCache();

  const locationCoords = new Map(); // "country|province|district|sector" -> {lat,lng}
  const uniqueLocations = [
    ...new Set(
      RAW_SCHOOLS.map(([country, , province, district, sector]) => `${country}|${province}|${district}|${sector}`)
    ),
  ];

  console.log(`Geocoding ${uniqueLocations.length} unique locations...`);
  let i = 0;
  for (const key of uniqueLocations) {
    const [country, province, district, sector] = key.split("|");
    i++;
    process.stdout.write(`  [${i}/${uniqueLocations.length}] ${sector}, ${district}, ${province}, ${country}... `);
    const coords = await geocodeLocation(country, sector === "null" ? null : sector, district, province, cache);
    locationCoords.set(key, coords);
    console.log(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
    await saveCache(cache);
  }

  const confirmedCoordinates = await loadConfirmedCoordinates();
  const usedIds = new Set();
  const schools = RAW_SCHOOLS.map((row) => {
    const [
      country, name, province, district, sector, phone,
      hc2024, hc2025, students, laptops, teachers,
      phase, installRaw, subEndRaw, monthsText, connection, notes,
    ] = row;

    let id = slugify(name);
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${slugify(name)}-${suffix++}`;
    }
    usedIds.add(id);

    const locKey = `${country}|${province}|${district}|${sector}`;
    const base = locationCoords.get(locKey);
    // Spread schools that could only be placed at district level or coarser over a wider area,
    // so dozens of schools in one district don't stack on a single point.
    const { dLat, dLng } = jitter(id, base.precise ? 0.006 : 0.04);
    const confirmed = confirmedCoordinates.get(id);
    if (confirmed && distanceKm(confirmed, base) > SUSPICIOUS_DISTANCE_KM) {
      console.warn(
        `  ! ${name}: confirmed position is ${Math.round(distanceKm(confirmed, base))} km from ${district} — check it`,
      );
    }

    const installationDate = parseDate(installRaw);
    const subscriptionEnd = parseDate(subEndRaw);

    return {
      id,
      name,
      country,
      province,
      district,
      sector: sector ?? undefined,
      latitude: Number((confirmed ? confirmed.lat : base.lat + dLat).toFixed(6)),
      longitude: Number((confirmed ? confirmed.lng : base.lng + dLng).toFixed(6)),
      locationConfirmed: confirmed ? true : undefined,
      connection,
      students: students ?? undefined,
      teachers: teachers ?? undefined,
      laptops: laptops ?? undefined,
      equipmentNotes: notes ?? undefined,
      phase: phase ?? undefined,
      installationDate,
      subscriptionEnd,
      // The sheet marks a few schools as expired without giving an end date.
      subscriptionExpired: !subscriptionEnd && monthsText === "Subscription Expired" ? true : undefined,
      headmasterPhone: phone ?? undefined,
      headcount2024: hc2024 ?? undefined,
      headcount2025: hc2025 ?? undefined,
    };
  });

  const unknownIds = [...confirmedCoordinates.keys()].filter((id) => !usedIds.has(id));
  if (unknownIds.length > 0) console.warn(`  ! Unknown ids in ${COORDINATES_PATH}: ${unknownIds.join(", ")}`);

  await writeFile(OUT_PATH, JSON.stringify(schools, null, 2));
  console.log(`\nWrote ${schools.length} schools to ${OUT_PATH} (${confirmedCoordinates.size} with confirmed locations)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
