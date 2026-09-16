"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Icosahedron, Torus, Text } from "@react-three/drei";
import * as THREE from "three";

// Language pairs cycled inside the core during the translation stage.
// Progress 0.42-0.58 owns this transformation.
const PAIRS = [
  { src: "Hola", dst: "Hello" },
  { src: "Bonjour", dst: "Hello" },
  { src: "こんにちは", dst: "Hello" },
  { src: "नमस्ते", dst: "Hello" },
  { src: "Guten Tag", dst: "Hello" },
  { src: "안녕하세요", dst: "Hello" },
  { src: "مرحبا", dst: "Hello" },
];

const REVEAL_START = 0.15;
const REVEAL_END = 0.32;
const TRANSLATE_START = 0.42;
const TRANSLATE_END = 0.58;
const FADE_OUT_START = 0.70;
const FADE_OUT_END = 0.82;

function clamp01(x) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

function smoothstep(a, b, x) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

export function LanguageCore({ progressRef }) {
  const group = useRef(null);
  const innerCore = useRef(null);
  const ringA = useRef(null);
  const ringB = useRef(null);
  const ringC = useRef(null);
  const srcRef = useRef(null);
  const dstRef = useRef(null);
  const arrowRef = useRef(null);

  const state = useMemo(
    () => ({ pairIdx: 0, pairT: 0, lastP: -1 }),
    []
  );

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const p = progressRef.current;

    // Overall opacity envelope: reveal, hold, then fade as globe takes over.
    const reveal = smoothstep(REVEAL_START, REVEAL_END, p);
    const fade = 1 - smoothstep(FADE_OUT_START, FADE_OUT_END, p);
    const opacity = reveal * fade;

    g.visible = opacity > 0.01;

    // Scale envelope: pop in from small, hold at 1, contract slightly as
    // service nodes take over.
    const holdIn = smoothstep(REVEAL_START, REVEAL_END, p);
    const contract = 1 - smoothstep(0.68, 0.85, p) * 0.35;
    const scale = 0.2 + holdIn * 0.8 * contract;
    g.scale.setScalar(scale);

    // Continuous rotation on inner core + counter-rotation on rings.
    if (innerCore.current) innerCore.current.rotation.y += dt * 0.4;
    if (innerCore.current) innerCore.current.rotation.x += dt * 0.18;
    if (ringA.current) ringA.current.rotation.z += dt * 0.35;
    if (ringB.current) ringB.current.rotation.z -= dt * 0.22;
    if (ringC.current) {
      ringC.current.rotation.x += dt * 0.12;
      ringC.current.rotation.y += dt * 0.18;
    }

    // Apply material opacity to all descendants.
    g.traverse((o) => {
      if (o.material && "opacity" in o.material) {
        o.material.opacity = opacity;
        o.material.transparent = opacity < 1;
      }
    });

    // Translation label morph — only during the translate window.
    const inTranslate = p >= TRANSLATE_START && p <= TRANSLATE_END;
    if (srcRef.current && dstRef.current && arrowRef.current) {
      const labelOpacity = inTranslate
        ? smoothstep(TRANSLATE_START, TRANSLATE_START + 0.03, p) *
          (1 - smoothstep(TRANSLATE_END - 0.04, TRANSLATE_END, p))
        : 0;

      srcRef.current.fillOpacity = labelOpacity;
      dstRef.current.fillOpacity = labelOpacity;
      arrowRef.current.fillOpacity = labelOpacity;

      // Rotate through language pairs during the translate window.
      const window = TRANSLATE_END - TRANSLATE_START;
      const localT = clamp01((p - TRANSLATE_START) / window);
      const idx = Math.min(
        PAIRS.length - 1,
        Math.floor(localT * PAIRS.length)
      );
      if (state.pairIdx !== idx) {
        state.pairIdx = idx;
        srcRef.current.text = PAIRS[idx].src;
        dstRef.current.text = PAIRS[idx].dst;
      }
    }
  });

  return (
    <group ref={group}>
      {/* Outer glass shell — subtle sphere hinting at containment */}
      <mesh>
        <sphereGeometry args={[1.4, 48, 48]} />
        <meshPhysicalMaterial
          color="#0a1638"
          metalness={0.3}
          roughness={0.15}
          transmission={0.7}
          thickness={0.6}
          ior={1.3}
          clearcoat={1}
          clearcoatRoughness={0.2}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Metallic inner core — geodesic icosahedron */}
      <Icosahedron ref={innerCore} args={[0.85, 1]}>
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#2b6bff"
          emissiveIntensity={0.5}
          metalness={0.85}
          roughness={0.25}
          wireframe={false}
        />
      </Icosahedron>

      {/* Wireframe overlay on the inner core for tech feel */}
      <Icosahedron args={[0.86, 1]}>
        <meshBasicMaterial
          color="#8ab4ff"
          wireframe
          transparent
          opacity={0.6}
        />
      </Icosahedron>

      {/* Three orbiting rings — different axes for depth */}
      <Torus ref={ringA} args={[1.15, 0.008, 8, 96]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#4f8bff" transparent opacity={0.75} />
      </Torus>
      <Torus
        ref={ringB}
        args={[1.25, 0.006, 8, 96]}
        rotation={[Math.PI / 3, Math.PI / 4, 0]}
      >
        <meshBasicMaterial color="#4fc3f7" transparent opacity={0.55} />
      </Torus>
      <Torus
        ref={ringC}
        args={[1.05, 0.005, 8, 96]}
        rotation={[Math.PI / 6, -Math.PI / 3, 0]}
      >
        <meshBasicMaterial color="#7bcadb" transparent opacity={0.45} />
      </Torus>

      {/* Translation labels — sit above core, only visible during translate stage */}
      <Text
        ref={srcRef}
        position={[-0.75, 0, 1.6]}
        fontSize={0.24}
        color="#cfe0ff"
        anchorX="center"
        anchorY="middle"
        fillOpacity={0}
      >
        Hola
      </Text>
      <Text
        ref={arrowRef}
        position={[0, 0, 1.6]}
        fontSize={0.28}
        color="#4fc3f7"
        anchorX="center"
        anchorY="middle"
        fillOpacity={0}
      >
        →
      </Text>
      <Text
        ref={dstRef}
        position={[0.75, 0, 1.6]}
        fontSize={0.24}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fillOpacity={0}
      >
        Hello
      </Text>
    </group>
  );
}
