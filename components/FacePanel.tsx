"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import faceVertex from "@/components/shaders/faceVertex";
import faceFragment from "@/components/shaders/faceFragment";

interface FacePanelProps {
  talking: boolean;
}

interface FaceMeshProps {
  talking: boolean;
}

function FaceMesh({ talking }: FaceMeshProps) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  // Fallback-Heightmap (radial), falls keine Datei vorhanden ist
  const fallbackTexture = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size * 3);

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const nx = (x / size) * 2 - 1;
        const ny = (y / size) * 2 - 1;
        const r = Math.sqrt(nx * nx + ny * ny);
        const base = Math.max(0, 1 - r * 1.1);
        const value = Math.floor(base * 255);
        const index = (y * size + x) * 3;
        data[index] = value;
        data[index + 1] = value;
        data[index + 2] = value;
      }
    }

    const tex = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
    tex.needsUpdate = true;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  const [texture, setTexture] = useState<THREE.Texture | null>(fallbackTexture);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      "/textures/neyraq-face-heightmap.png",
      (loaded) => {
        loaded.wrapS = THREE.ClampToEdgeWrapping;
        loaded.wrapT = THREE.ClampToEdgeWrapping;
        loaded.minFilter = THREE.LinearFilter;
        loaded.magFilter = THREE.LinearFilter;
        setTexture(loaded);
      },
      undefined,
      () => {
        // bleibt beim Fallback
      },
    );
  }, [fallbackTexture]);

  useEffect(() => {
    if (materialRef.current && texture) {
      materialRef.current.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uTime.value = state.clock.elapsedTime;

    const current = material.uniforms.uIntensity.value as number;
    const base = 0.18 + Math.sin(state.clock.elapsedTime * 0.4) * 0.04;
    const target = talking ? base + 0.35 : base;
    const smoothing = 6.0;
    const next = current + (target - current) * (1.0 - Math.exp(-smoothing * delta));
    material.uniforms.uIntensity.value = next;
  });

  if (!texture) {
    return null;
  }

  return (
    <mesh>
      <planeGeometry args={[3.2, 4.6, 200, 260]} />
      <shaderMaterial
        ref={materialRef}
        args={[
          {
            vertexShader: faceVertex,
            fragmentShader: faceFragment,
            uniforms: {
              uTime: { value: 0 },
              uTexture: { value: texture },
              uIntensity: { value: 0.2 },
            },
          },
        ]}
      />
    </mesh>
  );
}

export function FacePanel({ talking }: FacePanelProps) {
  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 0, 4.5], fov: 35 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
    >
      <Suspense fallback={null}>
        <group position={[0, 0, 0]}>
          <FaceMesh talking={talking} />
        </group>
      </Suspense>
    </Canvas>
  );
}
