"use client";
// R3F mutates uniforms/refs every frame inside useFrame — opt out of the React Compiler here.
"use no memo";

// Lazy WebGL chunk (imported with next/dynamic, ssr:false). Keep three.js imports inside components/three/.
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HUBS } from "@/lib/geo";
import { GLOBE_BG, type GlobeController } from "./controller";
import { DottedEarth } from "./DottedEarth";
import { Atmosphere } from "./Atmosphere";
import { Arcs } from "./Arcs";
import { Hubs } from "./Hubs";
import { Stars } from "./Stars";
import { Effects } from "./Effects";
import { AXIAL_TILT, HUB_KEYS, START_VIEW, facingRotation, latLngToVec3, lerpAngle } from "./globe-math";

const FOV = 35;
const START = facingRotation(START_VIEW.lat, START_VIEW.lng);
const KOCHI = facingRotation(HUBS.kochi.lat, HUBS.kochi.lng);
const KOCHI_POS = latLngToVec3(HUBS.kochi.lat, HUBS.kochi.lng, 1.01);
const DUBAI_POS = latLngToVec3(HUBS.dubai.lat, HUBS.dubai.lng, 1.01);
const ease = (t: number) => t * t * (3 - 2 * t);

type Quality = { dpr: number; bloom: boolean; density: number; arcs: number; stars: number };

/**
 * Camera that keeps the globe's silhouette exactly over the DOM anchor (centre + diameter),
 * using a lens shift (setViewOffset) so GSAP can choreograph the globe in plain CSS space.
 */
function Rig({ ctrl, poster, children }: { ctrl: GlobeController; poster: boolean; children: React.ReactNode }) {
  const { camera, gl, size } = useThree();
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const auto = useRef(0);
  const look = useRef({ x: 0, y: 0 });
  const tmp = useRef(new THREE.Vector3());
  const first = useRef(false);

  useFrame((_, delta) => {
    const cam = camera as THREE.PerspectiveCamera;
    const canvasRect = gl.domElement.getBoundingClientRect();
    const a = ctrl.anchor?.getBoundingClientRect();
    const W = size.width;
    const H = size.height;
    let px = W / 2;
    let py = H / 2;
    let r = Math.min(W, H) / 3;
    if (a && a.width > 0) {
      px = a.left + a.width / 2 - canvasRect.left;
      py = a.top + a.height / 2 - canvasRect.top;
      r = a.width / 2;
    }
    // Distance at which a unit sphere's silhouette has radius r px.
    const k = ((2 * r) / H) * Math.tan((FOV * Math.PI) / 360);
    const d = Math.sqrt(1 + 1 / (k * k));
    cam.position.set(0, 0, d);
    cam.setViewOffset(W, H, W / 2 - px, H / 2 - py, W, H);
    cam.updateProjectionMatrix();

    // Rotation: slow auto-spin → centre on Kochi with scroll, plus damped pointer parallax.
    if (!ctrl.paused && !poster) auto.current += delta * 0.04 * (1 - ctrl.focus);
    const f = ease(ctrl.focus);
    const px2 = poster ? 0 : ctrl.pointer.x;
    const py2 = poster ? 0 : ctrl.pointer.y;
    look.current.x = THREE.MathUtils.damp(look.current.x, py2 * 0.18, 3, delta);
    look.current.y = THREE.MathUtils.damp(look.current.y, px2 * 0.25, 3, delta);
    if (spin.current) {
      spin.current.rotation.x = THREE.MathUtils.lerp(START.x, KOCHI.x, f) + look.current.x;
      spin.current.rotation.y = lerpAngle(START.y + auto.current, KOCHI.y, f) + look.current.y;
    }
    if (tilt.current) tilt.current.rotation.z = AXIAL_TILT * (1 - 0.6 * f);

    // Hub labels (DOM) follow the projected hub positions.
    const place = (el: HTMLElement | null, pos: THREE.Vector3) => {
      if (!el || !spin.current) return;
      const v = tmp.current.copy(pos);
      spin.current.localToWorld(v);
      const facing = v.dot(cam.position) / (v.length() * cam.position.length());
      v.project(cam);
      const x = ((v.x + 1) / 2) * W;
      const y = ((1 - v.y) / 2) * H;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = String(ctrl.labelAlpha * THREE.MathUtils.smoothstep(facing, 0.25, 0.55));
    };
    place(ctrl.labels.kochi, KOCHI_POS);
    place(ctrl.labels.dubai, DUBAI_POS);

    if (!first.current) {
      first.current = true;
      requestAnimationFrame(() => ctrl.onFirstFrame?.());
    }
  });

  // Poster tooling: expose hub positions (as % of the canvas) for the reduced-motion pulse overlay.
  useEffect(() => {
    if (!poster) return;
    const id = setTimeout(() => {
      if (!spin.current) return;
      const out: Record<string, [number, number]> = {};
      const cam = camera as THREE.PerspectiveCamera;
      for (const key of HUB_KEYS) {
        const v = latLngToVec3(HUBS[key].lat, HUBS[key].lng, 1.004);
        spin.current.localToWorld(v);
        if (v.dot(cam.position) <= 0.2 * cam.position.length()) continue;
        v.project(cam);
        out[key] = [+(((v.x + 1) / 2) * 100).toFixed(2), +(((1 - v.y) / 2) * 100).toFixed(2)];
      }
      (window as unknown as { __posterHubs: unknown }).__posterHubs = out;
    }, 1500);
    return () => clearTimeout(id);
  }, [poster, camera]);

  return (
    <group ref={tilt}>
      <group ref={spin}>{children}</group>
    </group>
  );
}

/** Drops quality (bloom, then DPR) when the frame rate sags. One-way, so it never oscillates. */
function Monitor({ onDecline }: { onDecline: () => void }) {
  const acc = useRef({ t: 0, n: 0 });
  useFrame((_, delta) => {
    acc.current.t += delta;
    acc.current.n += 1;
    if (acc.current.t < 2) return;
    const fps = acc.current.n / acc.current.t;
    acc.current = { t: 0, n: 0 };
    if (fps < 42) onDecline();
  });
  return null;
}

export default function GlobeCanvas({
  ctrl,
  active = true,
  mobile = false,
  poster = false,
}: {
  ctrl: GlobeController;
  /** Pause rendering entirely when offscreen. */
  active?: boolean;
  mobile?: boolean;
  /** Deterministic still frame for the AVIF poster (tooling only). */
  poster?: boolean;
}) {
  const maxDpr = poster ? 1 : mobile ? 1.5 : 1.75;
  const [q, setQ] = useState<Quality>(() => ({
    dpr: Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio, maxDpr),
    bloom: true,
    density: mobile ? 0.36 : 1,
    arcs: mobile ? 8 : 16,
    stars: mobile ? 700 : 1500,
  }));

  return (
    <Canvas
      dpr={q.dpr}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false, preserveDrawingBuffer: poster }}
      camera={{ fov: FOV, near: 0.01, far: 200, position: [0, 0, 4] }}
      legacy
      linear
      flat
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={[GLOBE_BG]} />
      <Stars ctrl={ctrl} count={q.stars} />
      <Rig ctrl={ctrl} poster={poster}>
        <DottedEarth ctrl={ctrl} density={q.density} />
        <Atmosphere ctrl={ctrl} />
        <Arcs ctrl={ctrl} count={q.arcs} radius={mobile ? 0.005 : 0.0035} />
        <Hubs ctrl={ctrl} />
      </Rig>
      {q.bloom && <Effects />}
      {!poster && (
        <Monitor
          onDecline={() =>
            setQ((s) => (s.bloom ? { ...s, bloom: false } : s.dpr > 1 ? { ...s, dpr: 1 } : s))
          }
        />
      )}
    </Canvas>
  );
}

