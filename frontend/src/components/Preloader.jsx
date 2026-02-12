import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function ScanningCube() {
  const pointsRef = useRef();
  const laserRef = useRef();
  
  // Создаем сетку точек в форме куба
  const particles = useMemo(() => {
    const size = 3;
    const count = 15; // 15x15x15 точек
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
    // Вращаем куб
    pointsRef.current.rotation.y = t * 0.2;
    pointsRef.current.rotation.x = t * 0.1;
    
    // Двигаем "лазер" вверх-вниз
    if (laserRef.current) {
      laserRef.current.position.y = Math.sin(t * 1.5) * 1.5;
    }
  });

  return (
    <group>
      {/* Облако точек */}
      <Points ref={pointsRef} positions={particles} stride={3}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Сканирующий луч (лазер) */}
      <mesh ref={laserRef}>
        <boxGeometry args={[4, 0.02, 4]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} />
      </mesh>
      
      {/* Дополнительное свечение луча */}
      <mesh position-y={laserRef.current?.position.y}>
        <boxGeometry args={[4.2, 0.1, 4.2]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

export default function Preloader() {
  return (
    <div className="fixed inset-0 z-[999] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full h-[60vh]">
        <Canvas camera={{ position: [0, 2, 8], fov: 35 }}>
          <ambientLight intensity={0.5} />
          <ScanningCube />
        </Canvas>
      </div>

      <div className="relative flex flex-col items-center -mt-20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-white dark:text-black font-black text-xl italic">Q</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tighter italic leading-none">QazZerep</span>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 mt-1 opacity-80">System Analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
}
