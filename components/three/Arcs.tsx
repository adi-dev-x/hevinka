"use client";
// R3F mutates uniforms/refs every frame inside useFrame — opt out of the React Compiler here.
"use no memo";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { GlobeController } from "./controller";
import { ARCS, arcCurve } from "./globe-math";

const vertex = /* glsl */ `
  varying float vT;
  void main() {
    vT = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// A faint base line plus a bright travelling pulse with a comet tail. Head values > 1 feed the bloom.
const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uOffset;
  uniform float uBoost;
  uniform float uHover;
  uniform float uDraw;
  varying float vT;
  void main() {
    if (vT > uDraw) discard;
    float head = fract(uTime * uSpeed + uOffset) * 1.35 - 0.1;
    float dist = head - vT;
    float trail = dist > 0.0 ? exp(-dist * 9.0) : smoothstep(-0.015, 0.0, dist);
    float base = 0.3 + 0.35 * uBoost + 0.2 * uHover;
    float ends = smoothstep(0.0, 0.05, vT) * (1.0 - smoothstep(0.95, 1.0, vT));
    vec3 col = mix(vec3(0.0, 0.659, 0.988), vec3(0.498, 0.89, 1.0), vT);
    float a = (base + trail * (1.6 + 1.4 * uBoost)) * ends;
    // Additive blending multiplies by alpha, so keep colour un-premultiplied and push >1 into the colour for bloom.
    gl_FragColor = vec4(col * (1.0 + max(a - 1.0, 0.0) * 1.5), min(a, 1.0));
  }
`;

export function Arcs({ ctrl, count = ARCS.length, radius = 0.0035 }: { ctrl: GlobeController; count?: number; radius?: number }) {
  const arcs = useMemo(
    () =>
      ARCS.slice(0, count).map((a, i) => {
        const geometry = new THREE.TubeGeometry(arcCurve(a.from, a.to), 96, radius, 6, false);
        // Material built here (not via JSX props) so useFrame mutates the exact uniforms the GPU program reads.
        const material = new THREE.ShaderMaterial({
          vertexShader: vertex,
          fragmentShader: fragment,
          uniforms: {
            uTime: { value: 0 },
            uSpeed: { value: 0.16 + ((i * 37) % 10) / 90 },
            uOffset: { value: (i * 0.618) % 1 },
            uBoost: { value: 0 },
            uHover: { value: 0 },
            uDraw: { value: 0 },
          },
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        return { geometry, material, uniforms: material.uniforms, fromKochi: a.from === "kochi", delay: (i % 8) * 0.06 };
      }),
    [count, radius],
  );

  useEffect(
    () => () =>
      arcs.forEach((a) => {
        a.geometry.dispose();
        a.material.dispose();
      }),
    [arcs],
  );

  useFrame((_, delta) => {
    for (const a of arcs) {
      const u = a.uniforms;
      if (!ctrl.paused) u.uTime.value += delta;
      u.uDraw.value = THREE.MathUtils.clamp((ctrl.intro - a.delay) / 0.55, 0, 1) * 1.001;
      u.uBoost.value = ctrl.arcBoost * (a.fromKochi ? 1 : 0.25);
      u.uHover.value = THREE.MathUtils.damp(u.uHover.value, ctrl.pointer.inside ? 1 : 0, 4, delta);
    }
  });

  return (
    <group>
      {arcs.map((a, i) => (
        <mesh key={i} geometry={a.geometry} material={a.material} renderOrder={4} />
      ))}
    </group>
  );
}
