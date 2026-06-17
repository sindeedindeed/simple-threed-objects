'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function RotatingShapes() {
  const cubeRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  // useFrame hooks run on every single tick
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();

    if (cubeRef.current) {
      cubeRef.current.rotation.x = elapsedTime * 0.2;
      cubeRef.current.rotation.y = elapsedTime * 0.3;
      cubeRef.current.position.y = Math.sin(elapsedTime) * 0.2;
    }

    if (torusRef.current) {
      torusRef.current.rotation.x = -elapsedTime * 0.3;
      torusRef.current.rotation.y = elapsedTime * 0.1;
      torusRef.current.position.y = Math.cos(elapsedTime) * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 5, 2]} intensity={2.5} />
      <pointLight position={[-4, -3, -2]} intensity={1.5} />

      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[1.2, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            wireframe
            color="#D9A066"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.1}
          />
        </Sphere>
      </Float>

      <mesh ref={cubeRef} position={[2, 1.5, -1]}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial wireframe color="#7A6B58" roughness={0.3} metalness={0.8} />
      </mesh>

      <mesh ref={torusRef} position={[-2, -1.5, -1]}>
        <torusGeometry args={[0.6, 0.15, 16, 100]} />
        <meshStandardMaterial wireframe color="#e8c195" roughness={0.4} />
      </mesh>
    </>
  );
}

export default function AnimatedShapes() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <RotatingShapes />
      </Canvas>
    </div>
  );
}