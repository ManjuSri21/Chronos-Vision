import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const Earth = ({ scrollYProgress, isHopeMode }: { scrollYProgress: number; isHopeMode: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  // Calculate color based on mode and scroll
  const earthColor = useMemo(() => {
    if (scrollYProgress > 0.6) {
      return isHopeMode ? '#4ade80' : '#f87171'; // Green vs Red
    }
    return '#60a5fa'; // Blue for present/2030
  }, [scrollYProgress, isHopeMode]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={earthColor}
          speed={3}
          distort={0.2 * scrollYProgress}
          radius={1}
          emissive={earthColor}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      {/* City Hubs (Glowing Points) */}
      {Array.from({ length: 15 }).map((_, i) => (
        <group key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI * 2, 0]}>
          <mesh position={[0, 0, 1.02]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#00f2ff" />
          </mesh>
        </group>
      ))}
    </Float>
  );
};

export const GlobeScene = ({ scrollYProgress, isHopeMode }: { scrollYProgress: number; isHopeMode: boolean }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bc13fe" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <group rotation={[0, 0, 0.1]}>
          <Earth scrollYProgress={scrollYProgress} isHopeMode={isHopeMode} />
        </group>
      </Canvas>
      
      {/* Atmospheric Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05)_0%,rgba(5,5,5,0)_70%)]" />
    </div>
  );
};
