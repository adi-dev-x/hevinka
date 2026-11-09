"use client";
// R3F mutates uniforms/refs every frame inside useFrame — opt out of the React Compiler here.
"use no memo";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import type { GlobeController } from "./controller";
import { latLngToVec3 } from "./globe-math";

const vertex = /* glsl */ `
  attribute float aRand;
  uniform float uSize;
  uniform float uScale;
  uniform float uTime;
  varying float vLit;
  varying float vCity;
  varying float vFacing;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * position);
    vFacing = n.z;
    vLit = smoothstep(-0.35, 0.95, dot(n, normalize(vec3(0.55, 0.45, 0.7))));
    // ~3% of dots are "city lights" that softly twinkle (biased to the lit side)
    vCity = step(0.97, aRand) * vLit * (0.6 + 0.4 * sin(uTime * 1.3 + aRand * 80.0));
    gl_PointSize = uSize * uScale * (1.0 + vCity * 0.5) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform float uOpacity;
  varying float vLit;
  varying float vCity;
  varying float vFacing;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = 1.0 - smoothstep(0.18, 0.5, d);
    vec3 royal = vec3(0.043, 0.357, 0.827);
    vec3 electric = vec3(0.0, 0.659, 0.988);
    vec3 ion = vec3(0.498, 0.89, 1.0);
    vec3 col = mix(royal, electric, vLit);
    col = mix(col, ion, vCity);
    float bright = 0.5 + 0.65 * vLit + vCity * 0.7;
    float limb = smoothstep(-0.05, 0.4, vFacing);
    gl_FragColor = vec4(col * bright, a * uOpacity * limb);
  }
`;

/** Halftone land dots (one Points draw call) over a dark core sphere that hides the far side. */
export function DottedEarth({ ctrl, density = 1 }: { ctrl: GlobeController; density?: number }) {
  const [coords, setCoords] = useState<Int16Array | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/data/globe-dots.bin")
      .then((r) => r.arrayBuffer())
      .then((buf) => alive && setCoords(new Int16Array(buf)));
    return () => {
      alive = false;
    };
  }, []);

  const geometry = useMemo(() => {
    if (!coords) return null;
    const step = Math.max(1, Math.round(1 / density));
    const count = Math.floor(coords.length / 2 / step);
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    const v = new THREE.Vector3();
    for (let i = 0, j = 0; j < count; i += step, j++) {
      latLngToVec3(coords[i * 2 + 1] / 100, coords[i * 2] / 100, 1.001, v);
      pos.set([v.x, v.y, v.z], j * 3);
      // hash → stable pseudo-random per dot
      rand[j] = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    return g;
  }, [coords, density]);

  useEffect(() => () => geometry?.dispose(), [geometry]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { uSize: { value: 0.0085 }, uScale: { value: 1 }, uTime: { value: 0 }, uOpacity: { value: 0 } },
        transparent: true,
        depthWrite: false,
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  const uniforms = material.uniforms;

  useFrame(({ camera, size, gl, clock }) => {
    const cam = camera as THREE.PerspectiveCamera;
    // pixels per world unit at distance 1, for size attenuation that matches the projection
    uniforms.uScale.value = (size.height * gl.getPixelRatio()) / (2 * Math.tan((cam.fov * Math.PI) / 360));
    if (!ctrl.paused) uniforms.uTime.value = clock.elapsedTime;
    uniforms.uOpacity.value = Math.min(1, ctrl.intro * 1.4);
  });

  return (
    <group>
      <mesh renderOrder={0}>
        <sphereGeometry args={[0.995, 64, 64]} />
        <meshBasicMaterial color="#021633" />
      </mesh>
      {geometry && (
        <points geometry={geometry} material={material} renderOrder={1} />
      )}
    </group>
  );
}
