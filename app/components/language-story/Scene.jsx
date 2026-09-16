"use client";

import { Canvas } from "@react-three/fiber";
import { ContentModule } from "./ContentModule";
import { LanguageCore } from "./LanguageCore";
import { ServiceNodes } from "./ServiceNodes";
import { GlobeStage } from "./GlobeStage";

export default function Scene({ progressRef, active = true }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.2, 8], fov: 38, near: 0.1, far: 100 }}
      frameloop={active ? "always" : "never"}
    >
      <color attach="background" args={["#050a1e"]} />
      <fog attach="fog" args={["#050a1e", 12, 22]} />

      {/* Rim + fill so the metallic + glass materials read as premium */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 5, 6]}
        intensity={1.1}
        color="#eaf1ff"
      />
      <directionalLight
        position={[-5, -2, -3]}
        intensity={0.55}
        color="#2b6bff"
      />
      <pointLight position={[0, 0, 4]} intensity={0.35} color="#8ab4ff" />

      <ContentModule progressRef={progressRef} />
      <LanguageCore progressRef={progressRef} />
      <ServiceNodes progressRef={progressRef} />
      <GlobeStage progressRef={progressRef} />
    </Canvas>
  );
}
