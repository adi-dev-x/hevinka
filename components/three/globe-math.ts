import * as THREE from "three";
import { HUBS, type HubKey } from "@/lib/geo";

const D2R = Math.PI / 180;

/** Unit-sphere position for a lat/lng (three.js Y-up). */
export function latLngToVec3(lat: number, lng: number, r = 1, out = new THREE.Vector3()) {
  const phi = (90 - lat) * D2R;
  const theta = (lng + 180) * D2R;
  return out.set(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

/** Group rotation (x, y) that brings lat/lng to face the camera (+Z). Euler order XYZ. */
export function facingRotation(lat: number, lng: number) {
  const p = latLngToVec3(0, lng);
  return { x: lat * D2R, y: Math.atan2(-p.x, p.z) };
}

/** Shortest-path angle lerp. */
export function lerpAngle(a: number, b: number, t: number) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

/** Deterministic RNG so the poster and the live scene share the same stars. */
export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Great-circle arc lifted off the surface; height grows with distance. */
export function arcCurve(from: HubKey, to: HubKey) {
  const a = latLngToVec3(HUBS[from].lat, HUBS[from].lng);
  const b = latLngToVec3(HUBS[to].lat, HUBS[to].lng);
  const angle = a.angleTo(b);
  const lift = 0.05 + 0.2 * (angle / Math.PI);
  const pts: THREE.Vector3[] = [];
  const N = 64;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const p = new THREE.Vector3().copy(a).lerp(b, t).normalize();
    // proper slerp for long arcs
    if (angle > 0.001) {
      const s = Math.sin(angle);
      p.copy(a)
        .multiplyScalar(Math.sin((1 - t) * angle) / s)
        .add(b.clone().multiplyScalar(Math.sin(t * angle) / s));
    }
    pts.push(p.multiplyScalar(1.004 + lift * Math.sin(Math.PI * t)));
  }
  return new THREE.CatmullRomCurve3(pts);
}

export type ArcDef = { from: HubKey; to: HubKey };

/** Network routes from the two home hubs. First 8 are kept on mobile. */
export const ARCS: ArcDef[] = [
  { from: "kochi", to: "dubai" },
  { from: "kochi", to: "singapore" },
  { from: "dubai", to: "london" },
  { from: "kochi", to: "sydney" },
  { from: "dubai", to: "newYork" },
  { from: "kochi", to: "tokyo" },
  { from: "dubai", to: "nairobi" },
  { from: "kochi", to: "frankfurt" },
  { from: "dubai", to: "riyadh" },
  { from: "dubai", to: "doha" },
  { from: "kochi", to: "mumbai" },
  { from: "kochi", to: "bengaluru" },
  { from: "dubai", to: "saoPaulo" },
  { from: "kochi", to: "nairobi" },
  { from: "dubai", to: "frankfurt" },
  { from: "kochi", to: "london" },
];

export const HUB_KEYS: HubKey[] = [
  "kochi", "dubai", "london", "frankfurt", "singapore", "sydney", "newYork", "nairobi",
  "tokyo", "riyadh", "saoPaulo", "mumbai", "bengaluru", "doha",
];

/** Opening orientation: centred between India and the Middle East. */
export const START_VIEW = { lat: 18, lng: 64 };
export const AXIAL_TILT = 23 * D2R;
