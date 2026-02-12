import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ProcessingScene() {
    const pointsRef = useRef();
    const laserRef = useRef();
    
    // Тот же куб из точек для преемственности дизайна
    const particles = useMemo(() => {
        const size = 3;
        const count = 15; 
        const positions = new Float32Array(count ** 3 * 3);
        let i = 0;
        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                for (let z = 0; z < count; z++) {
                    positions[i++] = (x / count - 0.5) * size;
                    positions[i++] = (y / count - 0.5) * size;
                    positions[i++] = (z / count - 0.5) * size;
                }
            }
        }
        return positions;
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Вращаем куб чуть быстрее, чем в прелоадере
        pointsRef.current.rotation.y = t * 0.4;
        pointsRef.current.rotation.z = t * 0.15;
        
        // Лазер движется энергичнее
        if (laserRef.current) {
            laserRef.current.position.y = Math.sin(t * 3) * 1.5;
        }
    });

    return (
        <group>
            <Points ref={pointsRef} positions={particles} stride={3}>
                <PointMaterial
                    transparent
                    color="#3b82f6"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>

            {/* Сканирующий луч */}
            <mesh ref={laserRef}>
                <boxGeometry args={[4.5, 0.01, 4.5]} />
                <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
            </mesh>

            {/* Вспышки света при сканировании */}
            <pointLight position={[0, 0, 0]} intensity={0.5} color="#3b82f6" />
        </group>
    );
}

export default function ProcessingLoader({ t }) {
    return (
        <div className="fixed inset-0 z-[200] bg-background/40 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-500">
            <div className="w-full h-[50vh]">
                <Canvas camera={{ position: [0, 2, 7], fov: 40 }}>
                    <ambientLight intensity={0.4} />
                    <ProcessingScene />
                </Canvas>
            </div>

            <div className="relative flex flex-col items-center -mt-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                         <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                         <h2 className="text-xl font-bold italic tracking-tighter uppercase">
                            {t('upload.analyzing') || "Comparing Documents"}
                         </h2>
                    </div>
                    
                    {/* Текстовый индикатор статуса */}
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-mono text-blue-500/60 uppercase tracking-[0.3em] animate-pulse">
                            Neural check in progress
                        </span>
                        <div className="w-32 h-[1px] bg-foreground/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-500 animate-[loading_2s_infinite]" />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
