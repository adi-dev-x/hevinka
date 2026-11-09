"use client";
// R3F mutates uniforms/refs every frame inside useFrame — opt out of the React Compiler here.
"use no memo";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { HUBS } from "@/lib/geo";
import type { GlobeController } from "./controller";
import { HUB_KEYS, latLngToVec3 } from "./globe-math";

const RING_PERIOD = 2.4;
const Z = new THREE.Vector3(0, 0, 1);

/** Glowing hub dots with expanding ring pulses. Kochi & Dubai are larger and brighter. */
export function Hubs({ ctrl }: { ctrl: GlobeController }) {
  const rings = useRef<THREE.Mesh[]>([]);
  const time = useRef(0);

  const hubs = useMemo(
    () =>
      HUB_KEYS.map((key, i) => {
        const home = key === "kochi" || key === "dubai";
        const p = latLngToVec3(HUBS[key].lat, HUBS[key].lng, 1.004);
        const q = new THREE.Quaternion().setFromUnitVectors(Z, p.clone().normalize());
        return { key, home, p, q, size: home ? 1.7 : 1, phase: (i * 0.37) % 1 };
      }),
    [],
  );

  const dotGeo = useMemo(() => new THREE.CircleGeometry(0.009, 20), []);
  const ringGeo = useMemo(() => new THREE.RingGeometry(0.011, 0.0145, 40), []);

  useFrame((_, delta) => {
    if (!ctrl.paused) time.current += delta;
    rings.current.forEach((m, i) => {
      if (!m) return;
      const hub = hubs[Math.floor(i / 2)];
      const t = ((time.current / RING_PERIOD + hub.phase + (i % 2) * 0.5) % 1 + 1) % 1;
      const s = hub.size * (1 + t * 2.4);
      m.scale.setScalar(s);
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.9 * ctrl.intro;
    });
  });

  return (
    <group>
      {hubs.map((h, i) => (
        <group key={h.key} position={h.p} quaternion={h.q}>
          <mesh geometry={dotGeo} scale={h.size} renderOrder={5}>
            <meshBasicMaterial color={h.home ? "#bff3ff" : "#7fe3ff"} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          {[0, 1].map((k) => (
            <mesh
              key={k}
              ref={(m) => {
                if (m) rings.current[i * 2 + k] = m;
              }}
              geometry={ringGeo}
              renderOrder={5}
            >
              <meshBasicMaterial
                color={h.home ? "#7fe3ff" : "#00a8fc"}
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
