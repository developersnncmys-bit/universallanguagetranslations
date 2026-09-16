"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

const PANELS = [
  { label: "DOC", color: "#8ab4ff", offset: [-0.55, 0.35, 0.0] },
  { label: "MP3", color: "#4fc3f7", offset: [0.55, 0.35, 0.1] },
  { label: "MP4", color: "#7bcadb", offset: [-0.55, -0.35, 0.1] },
  { label: "TXT", color: "#cfe0ff", offset: [0.55, -0.35, 0.0] },
];

// Range where the module is visible. Fades in [0, 0.05], travels along a
// path [0.05, 0.30], dissolves into core [0.30, 0.42], hidden after.
const START = 0.0;
const TRAVEL_END = 0.30;
const DISSOLVE_END = 0.42;

// Left-to-center path: cubic bezier via a slight arc so the module rises
// as it moves in, giving physical continuity to the language core hand-off.
const PATH = new THREE.CubicBezierCurve3(
  new THREE.Vector3(-5.6, 0.8, -0.5),
  new THREE.Vector3(-3.0, 1.4, 0.4),
  new THREE.Vector3(-1.2, 0.6, 0.4),
  new THREE.Vector3(0.0, 0.0, 0.0)
);

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function ContentModule({ progressRef }) {
  const group = useRef(null);
  const inner = useRef(null);
  const panelRefs = useRef([]);
  const tmpPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const p = progressRef.current;

    // Travel progress along the path (clamped).
    const travelT =
      p <= START
        ? 0
        : p >= TRAVEL_END
        ? 1
        : easeInOut((p - START) / (TRAVEL_END - START));

    PATH.getPoint(travelT, tmpPos);
    g.position.copy(tmpPos);

    // Fade-in on entry, dissolve into core on exit.
    let opacity = 1;
    if (p < 0.02) opacity = p / 0.02;
    else if (p > TRAVEL_END) {
      opacity = Math.max(0, 1 - (p - TRAVEL_END) / (DISSOLVE_END - TRAVEL_END));
    }

    // Hide entirely once past dissolve end (perf + no z-fighting inside core).
    g.visible = opacity > 0.01;

    // Scale down as it enters the core.
    const scale =
      p < TRAVEL_END
        ? 1
        : Math.max(0.2, 1 - (p - TRAVEL_END) / (DISSOLVE_END - TRAVEL_END));
    g.scale.setScalar(scale);

    // Subtle idle rotation on the inner cluster.
    if (inner.current) {
      inner.current.rotation.y += dt * 0.35;
      inner.current.rotation.x = Math.sin(performance.now() * 0.0006) * 0.15;
    }

    // Per-panel material opacity + gentle float relative to cluster center.
    panelRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = performance.now() * 0.001 + i * 0.9;
      mesh.position.z = PANELS[i].offset[2] + Math.sin(t) * 0.06;
      mesh.material.opacity = opacity;
      mesh.material.transparent = opacity < 1;
    });
  });

  return (
    <group ref={group}>
      <group ref={inner}>
        {PANELS.map((panel, i) => (
          <group key={panel.label} position={panel.offset}>
            <RoundedBox
              ref={(m) => (panelRefs.current[i] = m)}
              args={[0.65, 0.42, 0.08]}
              radius={0.06}
              smoothness={4}
              castShadow={false}
            >
              <meshPhysicalMaterial
                color="#0a1638"
                emissive={panel.color}
                emissiveIntensity={0.35}
                metalness={0.55}
                roughness={0.35}
                clearcoat={0.6}
                clearcoatRoughness={0.4}
              />
            </RoundedBox>
            <Text
              position={[0, 0, 0.05]}
              fontSize={0.13}
              color={panel.color}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.08}
              fontWeight={800}
            >
              {panel.label}
            </Text>
          </group>
        ))}

        {/* Cluster halo — thin ring behind the panels adds premium framing */}
        <mesh position={[0, 0, -0.15]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.95, 1.0, 64]} />
          <meshBasicMaterial
            color="#4f8bff"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
