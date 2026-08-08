// One-off generator: builds data/bus_stops.ts and data/bus_lines.ts from:
//  - Overpass API (OpenStreetMap) -> real bus stop nodes on São Miguel
//  - Nominatim (OpenStreetMap) -> geocoded locality centers for existing route origins/destinations
//  - OSRM -> real road-following path per line
// Run once with: node generate_bus_network.cjs
const fs = require('fs');
const path = require('path');

const UA = { 'User-Agent': 'Azores4you-App/1.0 (dev contact: all4techazores2@gmail.com)' };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Pre-geocoded locality centers (São Miguil, bounded viewbox query already run and verified)
const LOCALITIES = {
  'Achada': [37.8506665, -25.2662995],
  'Capelas': [37.8370218, -25.6888676],
  'Fajã de Baixo': [37.7604340, -25.6446772],
  'Fajã de Cima': [37.7692317, -25.6601041],
  'Fenais da Ajuda': [37.8520942, -25.3262977],
  'Fenais da Luz': [37.8117828, -25.6387242],
  'Furnas': [37.7724694, -25.3133068],
  'João Bom': [37.8926791, -25.7927960],
  'Lagoa': [37.7429202, -25.5275936],
  'Maia': [37.8048937, -25.3841027],
  'Mosteiros': [37.8820921, -25.8091508],
  'Nordeste': [37.8182511, -25.2203287],
  'Ponta Delgada': [37.7393398, -25.6689503],
  'Povoação': [37.7468829, -25.2451613],
  'Praia do Pópulo': [37.7506333, -25.6185343],
  'Rabo de Peixe': [37.8142769, -25.5824158],
  'Ramal Mosteiros': [37.8829997, -25.8242878],
  'Ribeira Chã': [37.7196236, -25.4875140],
  'Ribeira Grande': [37.8136666, -25.4644342],
  'Santo António': [37.8513298, -25.7191389],
  'Sete Cidades': [37.8589091, -25.7875601],
  'Vila Franca do Campo': [37.7171624, -25.4335352],
};

const LINE_COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed',
  '#0891b2', '#db2777', '#65a30d', '#ea580c', '#4338ca',
  '#0d9488', '#c026d3', '#ca8a04', '#4f46e5', '#059669',
  '#e11d48', '#0284c7', '#9333ea', '#b45309', '#15803d', '#be123c',
];

// Temporary placeholder — rename here once the new operator's official name is known.
const NEW_COMPANY_NAME = 'Nova Operadora São Miguel';

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function distToPolylineMeters(lat, lon, coords) {
  // coords: array of [lon, lat] (GeoJSON order). Returns {dist, idx} of nearest segment.
  let best = Infinity;
  let bestIdx = 0;
  for (let i = 0; i < coords.length; i++) {
    const [clon, clat] = coords[i];
    const d = haversine(lat, lon, clat, clon);
    if (d < best) { best = d; bestIdx = i; }
  }
  return { dist: best, idx: bestIdx };
}

// Ramer–Douglas–Peucker simplification on [lat, lng] points, tolerance in meters.
function perpendicularDistanceMeters(pt, a, b) {
  if (a[0] === b[0] && a[1] === b[1]) return haversine(pt[0], pt[1], a[0], a[1]);
  // Project in a local equirectangular approximation (fine at this scale).
  const toXY = (p) => [p[1] * Math.cos(a[0] * Math.PI / 180), p[0]];
  const [ax, ay] = toXY(a), [bx, by] = toXY(b), [px, py] = toXY(pt);
  const dx = bx - ax, dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  const closestLatLng = [cy, cx / Math.cos(a[0] * Math.PI / 180)];
  return haversine(pt[0], pt[1], closestLatLng[0], closestLatLng[1]);
}

function simplifyPath(points, toleranceMeters) {
  if (points.length < 3) return points;
  let maxDist = 0, index = 0;
  const a = points[0], b = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistanceMeters(points[i], a, b);
    if (d > maxDist) { maxDist = d; index = i; }
  }
  if (maxDist > toleranceMeters) {
    const left = simplifyPath(points.slice(0, index + 1), toleranceMeters);
    const right = simplifyPath(points.slice(index), toleranceMeters);
    return left.slice(0, -1).concat(right);
  }
  return [a, b];
}

function nearestLocalityName(lat, lon) {
  let best = null, bestDist = Infinity;
  for (const [name, [llat, llon]] of Object.entries(LOCALITIES)) {
    const d = haversine(lat, lon, llat, llon);
    if (d < bestDist) { bestDist = d; best = name; }
  }
  return best;
}

async function fetchOverpassStops() {
  const query = '[out:json][timeout:90][bbox:37.70,-25.87,37.88,-25.10]; (node["highway"="bus_stop"]; node["amenity"="bus_station"];); out body;';
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { ...UA, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(query),
  });
  const json = await res.json();
  return json.elements;
}

async function fetchOsrmPath(origin, dest) {
  const [olat, olon] = origin;
  const [dlat, dlon] = dest;
  const url = `https://router.project-osrm.org/route/v1/driving/${olon},${olat};${dlon},${dlat}?overview=full&geometries=geojson`;
  const res = await fetch(url, { headers: UA });
  const json = await res.json();
  if (!json.routes || !json.routes[0]) return null;
  return json.routes[0].geometry.coordinates; // [lon, lat][]
}

function extractScheduleEntries() {
  const files = ['./data/crp_buses.ts', './data/varela_buses.ts', './data/avm_buses.ts'];
  const entries = [];
  for (const f of files) {
    const txt = fs.readFileSync(f, 'utf8');
    const blocks = txt.split(/\{\s*\n\s*id:/).slice(1);
    for (const b of blocks) {
      const idMatch = b.match(/^\s*'([^']+)'/);
      const companyMatch = b.match(/company:\s*'([^']+)'/);
      const originMatch = b.match(/origin:\s*'([^']+)'/);
      const destMatch = b.match(/destination:\s*'([^']+)'/);
      if (idMatch && originMatch && destMatch) {
        entries.push({
          id: idMatch[1],
          company: companyMatch ? companyMatch[1] : '',
          origin: originMatch[1],
          destination: destMatch[1],
        });
      }
    }
  }
  return entries;
}

async function main() {
  console.log('1/5 Extracting existing schedule origin/destination pairs...');
  const entries = extractScheduleEntries();
  console.log('  found', entries.length, 'schedule entries');

  // Dedupe into unordered origin<->destination line pairs
  const pairMap = new Map();
  for (const e of entries) {
    if (!LOCALITIES[e.origin] || !LOCALITIES[e.destination]) {
      console.warn('  ! skipping (no geocode):', e.origin, '<->', e.destination);
      continue;
    }
    const key = [e.origin, e.destination].sort().join('|');
    if (!pairMap.has(key)) {
      pairMap.set(key, { a: e.origin, b: e.destination, scheduleIds: [] });
    }
    pairMap.get(key).scheduleIds.push(e.id);
  }
  const uniquePairs = [...pairMap.values()];
  console.log('  unique lines:', uniquePairs.length);

  console.log('2/5 Fetching real bus stops from OpenStreetMap (Overpass)...');
  const rawStops = await fetchOverpassStops();
  console.log('  found', rawStops.length, 'stop nodes');

  const busStops = rawStops.map((n) => {
    const name = n.tags && n.tags.name ? n.tags.name : `Paragem – ${nearestLocalityName(n.lat, n.lon)}`;
    return { id: `osm_${n.id}`, name, lat: n.lat, lng: n.lon };
  });

  console.log('3/5 Fetching road-following paths (OSRM) per line...');
  const busLines = [];
  let colorIdx = 0;
  for (const pair of uniquePairs) {
    const origin = LOCALITIES[pair.a];
    const dest = LOCALITIES[pair.b];
    let coords = null;
    try {
      coords = await fetchOsrmPath(origin, dest);
    } catch (e) {
      console.warn('  ! OSRM failed for', pair.a, '<->', pair.b, e.message);
    }
    await sleep(600);

    let path = [];
    let stopIds = [];
    if (coords) {
      path = simplifyPath(coords.map(([lon, lat]) => [lat, lon]), 15);
      const BUFFER_M = 350;
      const onRoute = [];
      for (const stop of busStops) {
        const { dist, idx } = distToPolylineMeters(stop.lat, stop.lng, coords);
        if (dist <= BUFFER_M) onRoute.push({ stop, idx });
      }
      onRoute.sort((a, b) => a.idx - b.idx);
      stopIds = onRoute.map((o) => o.stop.id);
    } else {
      path = [origin, dest];
    }

    busLines.push({
      id: `line_${pair.a}_${pair.b}`.replace(/\s+/g, '_'),
      name: `${pair.a} ↔ ${pair.b}`,
      company: NEW_COMPANY_NAME,
      color: LINE_COLORS[colorIdx % LINE_COLORS.length],
      origin: pair.a,
      destination: pair.b,
      scheduleIds: pair.scheduleIds,
      stopIds,
      path,
    });
    colorIdx++;
    console.log(`  ✓ ${pair.a} ↔ ${pair.b} (${stopIds.length} paragens no percurso, ${path.length} pontos)`);
  }

  console.log('4/5 Writing data/bus_stops.ts ...');
  const stopsTs = `// AUTO-GENERATED by generate_bus_network.cjs — real bus stops from OpenStreetMap (Overpass API).
// Re-run the script to refresh. Do not hand-edit generated entries; add manual ones separately.
import { BusStop } from '../types';

export const realBusStops: BusStop[] = ${JSON.stringify(busStops, null, 2)};
`;
  fs.writeFileSync(path.join(__dirname, 'data', 'bus_stops.ts'), stopsTs, 'utf8');

  console.log('5/5 Writing data/bus_lines.ts ...');
  const linesTs = `// AUTO-GENERATED by generate_bus_network.cjs — line paths from OSRM (OpenStreetMap road network),
// stops matched from data/bus_stops.ts within 350m of each route. Re-run to refresh.
import { BusLine } from '../types';

export const busLines: BusLine[] = ${JSON.stringify(busLines, null, 2)};
`;
  fs.writeFileSync(path.join(__dirname, 'data', 'bus_lines.ts'), linesTs, 'utf8');

  console.log('Done.', busStops.length, 'stops,', busLines.length, 'lines.');
}

main().catch((e) => { console.error(e); process.exit(1); });
