"use client";
// R3F mutates uniforms/refs every frame inside useFrame — opt out of the React Compiler here.
"use no memo";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { GlobeController } from "./controller";

const vertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

// Outer halo (back faces of a larger sphere). On the back faces dot(n, v) runs from about -0.52
// at the globe's limb (for scale 1.17) to 0 at the halo edge, so the glow peaks at the limb and fades out.
const haloFrag = /* glsl */ `
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float i = pow(clamp(-dot(vNormal, vView) / 0.55, 0.0, 1.0), 4.0);
    gl_FragColor = vec4(vec3(0.0, 0.659, 0.988), clamp(i * uIntensity, 0.0, 1.0));
  }
`;

// Thin rim on the globe's limb (front faces).
const rimFrag = /* glsl */ `
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = 1.0 - clamp(dot(vNormal, vView), 0.0, 1.0);
    float i = pow(f, 4.5);
    vec3 col = mix(vec3(0.043, 0.357, 0.827), vec3(0.498, 0.89, 1.0), i);
    gl_FragColor = vec4(col, clamp(i * uIntensity, 0.0, 1.0));
  }
`;

export function Atmosphere({ ctrl, intensity = 0.6 }: { ctrl: GlobeController; intensity?: number }) {
  // Materials built directly so useFrame writes to the uniforms the GPU program actually uses.
  const halo = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: haloFrag,
        uniforms: { uIntensity: { value: 0 } },
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );
  const rim = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: rimFrag,
        uniforms: { uIntensity: { value: 0 } },
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );
  useEffect(
    () => () => {
      halo.dispose();
      rim.dispose();
    },
    [halo, rim],
  );

  useFrame(() => {
    halo.uniforms.uIntensity.value = intensity * 0.75 * ctrl.intro;
    rim.uniforms.uIntensity.value = 0.55 * ctrl.intro;
  });

  return (
    <>
      <mesh scale={1.17} renderOrder={2} material={halo}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
      <mesh scale={1.012} renderOrder={3} material={rim}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
    </>
  );
}
