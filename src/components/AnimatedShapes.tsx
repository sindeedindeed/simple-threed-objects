'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Float, Sphere, MeshDistortMaterial, Grid } from '@react-three/drei';

interface SpawnedObject {
  id: string;
  type: 'cube' | 'sphere' | 'custom';
  position: [number, number, number];
}

interface AnimatedShapesProps {
  isAuthenticated: boolean;
  spawnedObjects: SpawnedObject[];
}

function BackgroundShowcase() {
  const cubeRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
    const elapsedTime = timeRef.current;

    // spinning bg elements
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

function WorkspaceObjects({ list }: { list: SpawnedObject[] }) {
  return (
    <>
      {list.map((obj) => {
        if (obj.type === 'cube') {
          return (
            <mesh key={obj.id} position={obj.position}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial wireframe color="#7A6B58" />
            </mesh>
          );
        }
        if (obj.type === 'sphere') {
          return (
            <mesh key={obj.id} position={obj.position}>
              <sphereGeometry args={[0.6, 32, 32]} />
              <meshStandardMaterial wireframe color="#D9A066" />
            </mesh>
          );
        }
        // torus
        return (
          <mesh key={obj.id} position={obj.position}>
            <torusKnotGeometry args={[0.4, 0.12, 120, 16]} />
            <meshStandardMaterial wireframe color="#e8c195" />
          </mesh>
        );
      })}
    </>
  );
}

export default function AnimatedShapes({ isAuthenticated, spawnedObjects }: AnimatedShapesProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 2]} intensity={2.5} />
        <pointLight position={[-4, -3, -2]} intensity={1.5} />

        {!isAuthenticated && <BackgroundShowcase />}

        {isAuthenticated && (
          <>
            <WorkspaceObjects list={spawnedObjects} />
            <Grid
              position={[0, -2.5, 0]}
              args={[10, 10]}
              cellSize={1}
              cellThickness={1}
              cellColor="#7A6B58"
              sectionSize={5}
              sectionThickness={1.5}
              sectionColor="#D9A066"
              fadeDistance={25}
              infiniteGrid
            />
          </>
        )}
      </Canvas>
    </div>
  );
}