"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Text } from "@react-three/drei";
import * as THREE from "three";

// 7 services arranged in a hexagon + center. Positions in world space.
// The center service becomes the anchor that the others connect to.
const R = 2.4;
const SERVICES = [
  { key: "translation", label: "TRANSLATION", pos: [0, R, 0] },
  { key: "transcription", label: "TRANSCRIPTION", pos: [R * 0.87, R * 0.5, 0] },
  { key: "subtitles", label: "SUBTITLES", pos: [R * 0.87, -R * 0.5, 0] },
  { key: "voiceover", label: "VOICEOVER", pos: [0, -R, 0] },
  { key: "annotation", label: "DATA ANNOTATION", pos: [-R * 0.87, -R * 0.5, 0] },
  { key: "evolution", label: "DATA EVOLUTION", pos: [-R * 0.87, R * 0.5, 0] },
  { key: "multilingual", label: "MULTILINGUAL DATA", pos: [0, 0, 1.6] },
];

const EMERGE_START = 0.55;
const EMERGE_END = 0.72;
const CONTRACT_START = 0.80;
const CONTRACT_END = 0.92;

function clamp01(x) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
function smoothstep(a, b, x) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

export function ServiceNodes({ progressRef }) {
  const group = useRef(null);
  const nodeRefs = useRef([]);
  const labelRefs = useRef([]);
  const lineRefs = useRef([]);

  // Pre-compute rest positions as Vector3 for interpolation.
  const restPositions = useMemo(
    () => SERVICES.map((s) => new THREE.Vector3(...s.pos)),
    []
  );

  // Line endpoints get updated every frame — allocate once.
  const lineBuffers = useMemo(
    () =>
      SERVICES.map(() => [new THREE.Vector3(), new THREE.Vector3(0.001, 0, 0)]),
    []
  );

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const p = progressRef.current;

    const emerge = smoothstep(EMERGE_START, EMERGE_END, p);
    const contract = smoothstep(CONTRACT_START, CONTRACT_END, p);
    const opacity = emerge * (1 - contract);

    g.visible = opacity > 0.005;

    // Whole cluster spins slowly for life.
    g.rotation.z += dt * 0.05;

    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const rest = restPositions[i];
      // Emerge: interpolate from origin -> rest position.
      // Contract: interpolate from rest -> origin (pulled into globe).
      const outFactor = emerge * (1 - contract);
      mesh.position.set(
        rest.x * outFactor,
        rest.y * outFactor,
        rest.z * outFactor
      );

      // Scale envelope + gentle idle pulse.
      const pulse = 1 + Math.sin(performance.now() * 0.002 + i) * 0.05;
      const scale = 0.001 + emerge * (1 - contract) * 0.18 * pulse;
      mesh.scale.setScalar(scale);

      if (mesh.material) {
        mesh.material.opacity = opacity;
        mesh.material.transparent = opacity < 1;
      }

      // Label follows node with a small offset; opacity mirrors node.
      const label = labelRefs.current[i];
      if (label) {
        label.position.set(
          mesh.position.x,
          mesh.position.y + (rest.y >= 0 ? 0.35 : -0.35),
          mesh.position.z
        );
        label.fillOpacity = opacity;
      }

      // Update line: from origin (core) to current node position.
      const buf = lineBuffers[i];
      buf[0].set(0, 0, 0);
      buf[1].copy(mesh.position);
      const line = lineRefs.current[i];
      if (line && line.geometry) {
        line.geometry.setPositions([
          buf[0].x, buf[0].y, buf[0].z,
          buf[1].x, buf[1].y, buf[1].z,
        ]);
        if (line.material) line.material.opacity = opacity * 0.55;
      }
    });
  });

  return (
    <group ref={group}>
      {SERVICES.map((s, i) => (
        <group key={s.key}>
          {/* Connection line from core to node */}
          <Line
            ref={(l) => (lineRefs.current[i] = l)}
            points={[
              [0, 0, 0],
              [0.001, 0, 0],
            ]}
            color="#4f8bff"
            lineWidth={1.2}
            transparent
            opacity={0}
          />

          {/* Node itself */}
          <mesh ref={(m) => (nodeRefs.current[i] = m)}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#0f2555"
              emissive="#4f8bff"
              emissiveIntensity={0.9}
              metalness={0.7}
              roughness={0.3}
              transparent
              opacity={0}
            />
          </mesh>

          {/* Text label */}
          <Text
            ref={(t) => (labelRefs.current[i] = t)}
            fontSize={0.16}
            color="#cfe0ff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.05}
            fillOpacity={0}
          >
            {s.label}
          </Text>
        </group>
      ))}
    </group>
  );
}
