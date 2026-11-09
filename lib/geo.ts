// Geo helpers shared by the flat dotted map (public/brand/world-dots.svg, 1000×500 equirectangular)
// and network-line visuals.

export const MAP_W = 1000;
export const MAP_H = 500;

export const HUBS = {
  kochi: { name: "Kochi · India", lat: 9.97, lng: 76.28 },
  dubai: { name: "Dubai · UAE", lat: 25.2, lng: 55.27 },
  london: { name: "London", lat: 51.5, lng: -0.13 },
  frankfurt: { name: "Frankfurt", lat: 50.1, lng: 8.68 },
  singapore: { name: "Singapore", lat: 1.35, lng: 103.8 },
  sydney: { name: "Sydney", lat: -33.87, lng: 151.2 },
  newYork: { name: "New York", lat: 40.7, lng: -74 },
  nairobi: { name: "Nairobi", lat: -1.29, lng: 36.8 },
  tokyo: { name: "Tokyo", lat: 35.7, lng: 139.7 },
  riyadh: { name: "Riyadh", lat: 24.7, lng: 46.7 },
  saoPaulo: { name: "São Paulo", lat: -23.55, lng: -46.63 },
  mumbai: { name: "Mumbai", lat: 19.08, lng: 72.88 },
  bengaluru: { name: "Bengaluru", lat: 12.97, lng: 77.59 },
  doha: { name: "Doha", lat: 25.29, lng: 51.53 },
} as const;

export type HubKey = keyof typeof HUBS;

/** Equirectangular projection onto the flat map's viewBox. */
export function project(lat: number, lng: number) {
  return { x: ((lng + 180) / 360) * MAP_W, y: ((90 - lat) / 180) * MAP_H };
}

/** Quadratic arc between two points, lifted by `lift` × distance. */
export function arc(x1: number, y1: number, x2: number, y2: number, lift = 0.35) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const d = Math.hypot(x2 - x1, y2 - y1);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${mx.toFixed(1)} ${(my - d * lift).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

/** Arc between two named hubs on the flat map. */
export function hubArc(from: HubKey, to: HubKey, lift = 0.3) {
  const a = project(HUBS[from].lat, HUBS[from].lng);
  const b = project(HUBS[to].lat, HUBS[to].lng);
  return arc(a.x, a.y, b.x, b.y, lift);
}
