'use client';

import { useRef, useState } from 'react';
import { useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface SpawnedObject {
    id: string;
    type: 'cube' | 'sphere' | 'custom';
    position: [number, number, number];
}

interface DraggableMeshProps {
    objectData: SpawnedObject;
    onUpdatePosition: (id: string, newPos: [number, number, number]) => void;
}

export default function DraggableMesh({ objectData, onUpdatePosition }: DraggableMeshProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [isDragging, setIsDragging] = useState(false);
    const { size, camera } = useThree();

    // Plane mathematical vector tracking for tracking depth translation arrays
    const planeIntersection = new THREE.Vector3();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); 

    const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        const targetEl = e.target as HTMLElement;
        if (targetEl && typeof targetEl.setPointerCapture === 'function') {
            targetEl.setPointerCapture(e.pointerId);
        }
        setIsDragging(true);
    };

    const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (!isDragging || !meshRef.current) return;
        e.stopPropagation();

        // Convert 2D display tracking coordinates to matching spatial viewport units
        const x = (e.clientX / size.width) * 2 - 1;
        const y = -(e.clientY / size.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        
        // Extract intercept calculations along the Z-axis field line plane container
        raycaster.ray.intersectPlane(dragPlane, planeIntersection);

        // Buffer limits to prevent dragging elements entirely out of sight
        const boundedX = Math.max(-5, Math.min(5, planeIntersection.x));
        const boundedY = Math.max(-3.5, Math.min(3.5, planeIntersection.y));

        onUpdatePosition(objectData.id, [boundedX, boundedY, objectData.position[2]]);
    };

    const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        const targetEl = e.target as HTMLElement;
        if (targetEl && typeof targetEl.releasePointerCapture === 'function') {
            targetEl.releasePointerCapture(e.pointerId);
        }
        setIsDragging(false);
    };

    return (
        <mesh
            ref={meshRef}
            position={objectData.position}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'grab'; }}
            onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'default'; }}
        >
            {objectData.type === 'cube' && <boxGeometry args={[0.9, 0.9, 0.9]} />}
            {objectData.type === 'sphere' && <sphereGeometry args={[0.55, 32, 32]} />}
            {objectData.type === 'custom' && <torusKnotGeometry args={[0.38, 0.12, 100, 16]} />}

            <meshStandardMaterial
                wireframe
                color={isDragging ? '#ffffff' : objectData.type === 'cube' ? '#7A6B58' : objectData.type === 'sphere' ? '#D9A066' : '#e8c195'}
                roughness={0.2}
            />
        </mesh>
    );
}