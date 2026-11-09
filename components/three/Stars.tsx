"use client";
// R3F mutates uniforms/refs every frame inside useFrame — opt out of the React Compiler here.
"use no memo";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { GlobeController } from "./controller";
import { mulberry32 } from "./globe-math";

const vertex = /* glsl */ `
  attribute float aSize;
  uniform float uPixelRatio;
  varying float vA;
  void main() {
    vA = aSize;
    gl_PointSize = aSize * uPixelRatio;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragment = /* glsl */ `
  uniform float uOpacity;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vec3(0.62, 0.8, 1.0), (1.0 - smoothstep(0.0, 0.5, d)) * uOpacity * (0.5 + vA * 0.4));
  }
`;

/** Faint seeded starfield on a distant shell, drifting very slowly. */
export function Stars({ ctrl, count = 1500 }: { ctrl: GlobeController; count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const rnd = mulberry32(7);
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const v = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      v.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize().multiplyScalar(25 + rnd() * 20);
      pos.set([v.x, v.y, v.z], i * 3);
      size[i] = 0.6 + rnd() * 0.8;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { uPixelRatio: { value: 1 }, uOpacity: { value: 0 } },
        transparent: true,
        depthWrite: false,
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ gl }, delta) => {
    material.uniforms.uPixelRatio.value = gl.getPixelRatio();
    material.uniforms.uOpacity.value = 0.4 * ctrl.intro;
    if (ref.current && !ctrl.paused) ref.current.rotation.y += delta * 0.004;
  });

  return (
    <points ref={ref} geometry={geometry} material={material} renderOrder={-1} />
  );
}
