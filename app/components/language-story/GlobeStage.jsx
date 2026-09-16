"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const FORM_START = 0.82;
const FORM_END = 0.92;
const ARC_START = 0.90;
const ARC_END = 1.0;

const GLOBE_R = 1.9;
const N_DOTS = 480;

// City-like points around the globe (lat, lon in degrees).
const HUBS = [
  [1.35, 103.8],   // Singapore
  [35.68, 139.69], // Tokyo
  [22.32, 114.17], // Hong Kong
  [19.07, 72.87],  // Mumbai
  [25.27, 55.29],  // Dubai
  [51.5, -0.12],   // London
  [48.85, 2.35],   // Paris
  [40.42, -3.7],   // Madrid
  [40.71, -74.0],  // New York
  [37.77, -122.4], // San Francisco
  [-23.55, -46.63],// São Paulo
  [-33.86, 151.21],// Sydney
];

// Arcs to draw between hubs (indices into HUBS).
const ARCS = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [5, 8],
  [8, 9],
  [8, 10],
  [9, 11],
  [4, 7],
  [7, 5],
];

function clamp01(x) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
function smoothstep(a, b, x) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

function latLonToVec3(lat, lon, r = 1) {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return new THREE.Vector3(
    r * Math.cos(la) * Math.sin(lo),
    r * Math.sin(la),
    r * Math.cos(la) * Math.cos(lo)
  );
}

// Great-circle SLERP between two unit vectors, evaluated at t in [0,1].
function slerp(a, b, t, out) {
  const dot = Math.max(-1, Math.min(1, a.dot(b)));
  const angle = Math.acos(dot);
  const sinA = Math.sin(angle);
  if (sinA < 1e-5) {
    out.copy(a).lerp(b, t);
    return out;
  }
  const w1 = Math.sin((1 - t) * angle) / sinA;
  const w2 = Math.sin(t * angle) / sinA;
  out.set(
    a.x * w1 + b.x * w2,
    a.y * w1 + b.y * w2,
    a.z * w1 + b.z * w2
  );
  return out;
}

// Fibonacci-lattice unit-sphere positions — evenly distributed dot cloud.
function fibonacciSphere(n) {
  const out = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    out[i * 3 + 0] = Math.cos(theta) * radius;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = Math.sin(theta) * radius;
  }
  return out;
}

export function GlobeStage({ progressRef }) {
  const group = useRef(null);
  const dotsRef = useRef(null);
  const dotMatRef = useRef(null);
  const wireRef = useRef(null);
  const wireMatRef = useRef(null);
  const arcRefs = useRef([]);

  // Static geometry: fibonacci dot cloud on unit sphere, scaled per-frame.
  const dotPositions = useMemo(() => fibonacciSphere(N_DOTS), []);
  const dotGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    return g;
  }, [dotPositions]);

  // Hub anchors on the unit sphere.
  const hubVecs = useMemo(
    () => HUBS.map(([lat, lon]) => latLonToVec3(lat, lon, 1)),
    []
  );

  // Pre-compute arc curves (16 samples each, unit radius — scale by GLOBE_R).
  const arcCurves = useMemo(() => {
    const tmp = new THREE.Vector3();
    return ARCS.map(([i, j]) => {
      const a = hubVecs[i];
      const b = hubVecs[j];
      const samples = 24;
      const pts = new Float32Array(samples * 3);
      for (let s = 0; s < samples; s++) {
        const t = s / (samples - 1);
        slerp(a, b, t, tmp);
        // Lift arc slightly above sphere surface.
        tmp.multiplyScalar(1.02);
        pts[s * 3 + 0] = tmp.x;
        pts[s * 3 + 1] = tmp.y;
        pts[s * 3 + 2] = tmp.z;
      }
      return { samples, pts };
    });
  }, [hubVecs]);

  // Pre-build flat arrays used to feed drei's <Line> geometry per frame.
  const arcRuntime = useMemo(
    () => arcCurves.map((c) => new Float32Array(c.samples * 3)),
    [arcCurves]
  );

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const p = progressRef.current;

    const form = smoothstep(FORM_START, FORM_END, p);
    g.visible = form > 0.005;
    if (!g.visible) return;

    // Rotate globe slowly.
    g.rotation.y += dt * 0.12;

    // Dot cloud scales up from 0 to GLOBE_R as the globe forms.
    const scale = form * GLOBE_R;
    if (dotsRef.current) dotsRef.current.scale.setScalar(scale);
    if (wireRef.current) wireRef.current.scale.setScalar(scale);

    // Dot opacity fades in.
    if (dotMatRef.current) {
      dotMatRef.current.opacity = form * 0.9;
    }
    if (wireMatRef.current) {
      wireMatRef.current.opacity = form * 0.14;
    }

    // Progressive arc reveal — spread arc draws across the arc window.
    const arcTotal = arcCurves.length;
    arcCurves.forEach((arc, idx) => {
      const stagger = idx / arcTotal;
      const local = clamp01(
        (p - ARC_START - stagger * 0.05) / (ARC_END - ARC_START)
      );
      const drawT = clamp01(local * 1.4); // slight overshoot -> full draw
      const visSamples = Math.max(
        2,
        Math.floor(arc.samples * drawT)
      );
      const runtime = arcRuntime[idx];
      // Copy visible portion; scale by GLOBE_R.
      for (let s = 0; s < visSamples; s++) {
        const bi = s * 3;
        runtime[bi + 0] = arc.pts[bi + 0] * GLOBE_R;
        runtime[bi + 1] = arc.pts[bi + 1] * GLOBE_R;
        runtime[bi + 2] = arc.pts[bi + 2] * GLOBE_R;
      }
      // Collapse remaining samples onto the last visible point.
      const lx = runtime[(visSamples - 1) * 3 + 0];
      const ly = runtime[(visSamples - 1) * 3 + 1];
      const lz = runtime[(visSamples - 1) * 3 + 2];
      for (let s = visSamples; s < arc.samples; s++) {
        runtime[s * 3 + 0] = lx;
        runtime[s * 3 + 1] = ly;
        runtime[s * 3 + 2] = lz;
      }
      const line = arcRefs.current[idx];
      if (line && line.geometry) {
        // drei Line uses LineGeometry (three-stdlib). setPositions expects a
        // flat number[] or TypedArray of xyz triples.
        line.geometry.setPositions(runtime);
        if (line.material) {
          line.material.opacity = drawT * 0.85;
        }
      }
    });
  });

  return (
    <group ref={group}>
      {/* Inner sphere — darker fill so the dot cloud reads as a globe */}
      <mesh scale={GLOBE_R * 0.98}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#050d24" transparent opacity={0.9} />
      </mesh>

      {/* Fibonacci dot cloud */}
      <points ref={dotsRef} geometry={dotGeom}>
        <pointsMaterial
          ref={dotMatRef}
          size={0.028}
          color="#8ab4ff"
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
        />
      </points>

      {/* Wireframe latitude/longitude for structure */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshBasicMaterial
          ref={wireMatRef}
          color="#4f8bff"
          wireframe
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Arcs between hubs */}
      {arcCurves.map((arc, idx) => (
        <Line
          key={idx}
          ref={(l) => (arcRefs.current[idx] = l)}
          points={Array.from({ length: arc.samples }, (_, s) => [
            arc.pts[s * 3 + 0] * GLOBE_R,
            arc.pts[s * 3 + 1] * GLOBE_R,
            arc.pts[s * 3 + 2] * GLOBE_R,
          ])}
          color="#4fc3f7"
          lineWidth={1.3}
          transparent
          opacity={0}
        />
      ))}

      {/* Hub markers as small emissive dots */}
      {hubVecs.map((v, i) => (
        <mesh
          key={i}
          position={[v.x * GLOBE_R * 1.01, v.y * GLOBE_R * 1.01, v.z * GLOBE_R * 1.01]}
          scale={0.035}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#4fc3f7" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}
