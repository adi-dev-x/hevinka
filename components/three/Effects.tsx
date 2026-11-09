"use client";
// R3F mutates uniforms/refs every frame inside useFrame — opt out of the React Compiler here.
"use no memo";

import { Bloom, EffectComposer } from "@react-three/postprocessing";

export function Effects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.2} luminanceSmoothing={0.3} radius={0.7} />
    </EffectComposer>
  );
}
