'use client';

import { useRef, useState } from 'react';
import { useThree, ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface SpawnedObject {
    id: string;
    type: 'cube' | 'sphere' | 'custom';
    position: [number, number, number];
    scale?: number;
    color?: string;
    wireframe?: boolean;
}

interface DraggableMeshProps {
    objectData: SpawnedObject;
    isSelectedExternal: boolean;
    onSelectExternal: () => void;
    onDeselectExternal: () => void;
    onUpdatePosition: (id: string, newPos: [number, number, number]) => void;
    onUpdateType: (id: string, newType: 'cube' | 'sphere' | 'custom') => void;
    onUpdateScale: (id: string, newScale: number) => void;
    onUpdateColor: (id: string, newColor: string) => void;
    onUpdateWireframe: (id: string, isWireframe: boolean) => void;
    onDelete: (id: string) => void;
}

export default function DraggableMesh({ 
    objectData, 
    isSelectedExternal,
    onSelectExternal,
    onDeselectExternal,
    onUpdatePosition, 
    onUpdateType, 
    onUpdateScale,
    onUpdateColor,
    onUpdateWireframe,
    onDelete 
}: DraggableMeshProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { size, camera } = useThree();

    const planeIntersection = new THREE.Vector3();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); 

    const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        const targetEl = e.target as HTMLElement;
        if (targetEl && typeof targetEl.setPointerCapture === 'function') {
            targetEl.setPointerCapture(e.pointerId);
        }
        setIsDragging(true);
        onSelectExternal();
    };

    const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (!isDragging || !meshRef.current) return;
        e.stopPropagation();

        const x = (e.clientX / size.width) * 2 - 1;
        const y = -(e.clientY / size.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        
        raycaster.ray.intersectPlane(dragPlane, planeIntersection);

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

    const objectScale = objectData.scale ?? 1;
    const objectColor = objectData.color ?? '#D9A066';
    const isWireframe = objectData.wireframe ?? true;
    const showMenu = isSelectedExternal;

    return (
        <group position={objectData.position}>
            <mesh
                ref={meshRef}
                scale={[objectScale, objectScale, objectScale]}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setIsHovered(true);
                    document.body.style.cursor = 'grab';
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setIsHovered(false);
                    document.body.style.cursor = 'default';
                }}
            >
                {objectData.type === 'cube' && <boxGeometry args={[0.9, 0.9, 0.9]} />}
                {objectData.type === 'sphere' && <sphereGeometry args={[0.55, 32, 32]} />}
                {objectData.type === 'custom' && <torusKnotGeometry args={[0.38, 0.12, 100, 16]} />}

                <meshStandardMaterial
                    wireframe={isWireframe}
                    color={isHovered || isDragging || showMenu ? '#ffffff' : objectColor}
                    roughness={0.4}
                    metalness={0.1}
                />
            </mesh>

            {showMenu && (
                <Html 
                    distanceFactor={7} 
                    position={[0, 1.6, 0]} 
                    center 
                    className="pointer-events-auto select-none"
                >
                    <div 
                        className="bg-white rounded-2xl shadow-2xl border border-stone-200/80 p-4 flex flex-col w-52 text-left relative transition-all duration-300 ease-out translate-y-0 opacity-100 scale-100 origin-bottom animate-[slideUp_0.2s_ease-out]"
                        onMouseLeave={() => onDeselectExternal()}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1.5 rotate-45 w-3 h-3 bg-white border-r border-b border-stone-200/80 z-10" />
                        
                        <div className="relative z-20 space-y-3.5">
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">Geometry Type</div>
                                <div className="grid grid-cols-3 gap-1 bg-stone-50 p-0.5 rounded-lg border border-stone-100">
                                    <button 
                                        onClick={() => onUpdateType(objectData.id, 'cube')}
                                        className={`text-[10px] py-1 text-center font-bold rounded-md transition-all ${objectData.type === 'cube' ? 'bg-white text-[#4A3319] shadow-xs' : 'text-stone-500 hover:text-stone-800'}`}
                                    >
                                        Cube
                                    </button>
                                    <button 
                                        onClick={() => onUpdateType(objectData.id, 'sphere')}
                                        className={`text-[10px] py-1 text-center font-bold rounded-md transition-all ${objectData.type === 'sphere' ? 'bg-white text-[#4A3319] shadow-xs' : 'text-stone-500 hover:text-stone-800'}`}
                                    >
                                        Ball
                                    </button>
                                    <button 
                                        onClick={() => onUpdateType(objectData.id, 'custom')}
                                        className={`text-[10px] py-1 text-center font-bold rounded-md transition-all ${objectData.type === 'custom' ? 'bg-white text-[#4A3319] shadow-xs' : 'text-stone-500 hover:text-stone-800'}`}
                                    >
                                        Knot
                                    </button>
                                </div>
                            </div>

                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">Shading Material</div>
                                <div className="grid grid-cols-2 gap-1 bg-stone-50 p-0.5 rounded-lg border border-stone-100">
                                    <button 
                                        onClick={() => onUpdateWireframe(objectData.id, true)}
                                        className={`text-[10px] py-1 text-center font-bold rounded-md transition-all ${isWireframe ? 'bg-white text-[#4A3319] shadow-xs' : 'text-stone-500 hover:text-stone-800'}`}
                                    >
                                        Wireframe
                                    </button>
                                    <button 
                                        onClick={() => onUpdateWireframe(objectData.id, false)}
                                        className={`text-[10px] py-1 text-center font-bold rounded-md transition-all ${!isWireframe ? 'bg-white text-[#4A3319] shadow-xs' : 'text-stone-500 hover:text-stone-800'}`}
                                    >
                                        Solid
                                    </button>
                                </div>
                            </div>

                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">Color Hex Picker</div>
                                <div className="flex items-center space-x-3 bg-stone-50 p-1.5 rounded-lg border border-stone-100 justify-between">
                                    <span className="font-mono text-xs text-stone-500 uppercase tracking-tight">{objectColor}</span>
                                    <div className="relative w-7 h-7 rounded-md overflow-hidden border border-stone-200 shadow-xs active:scale-95 transition-transform">
                                        <input 
                                            type="color"
                                            value={objectColor}
                                            onChange={(e) => onUpdateColor(objectData.id, e.target.value)}
                                            className="absolute -inset-2 w-12 h-12 p-0 m-0 border-0 cursor-pointer appearance-none bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                                    <span>Transform Scale</span>
                                    <span className="font-mono text-stone-600 text-xs">{objectScale.toFixed(1)}x</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0.4" 
                                    max="2.2" 
                                    step="0.1"
                                    value={objectScale}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onChange={(e) => onUpdateScale(objectData.id, parseFloat(e.target.value))}
                                    className="w-full accent-[#D9A066] h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer border border-stone-200/40"
                                />
                            </div>

                            <div className="border-t border-stone-100 pt-2 flex items-center justify-end">
                                <button 
                                    onClick={() => onDelete(objectData.id)}
                                    className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center border border-transparent hover:border-red-100"
                                    title="Delete Object"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}