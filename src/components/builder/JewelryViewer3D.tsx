"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Text, Float } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

interface ViewerProps {
  material: string;
  stone: string;
  engraving: string;
  size: number;
}

const RingModel = ({ material, stone, engraving, size }: ViewerProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Material Colors
  const getMetalColor = () => {
    switch(material) {
      case 'gold': return '#FFD700';
      case 'rose-gold': return '#B76E79';
      case 'silver': return '#E5E4E2';
      case 'titanium': return '#1a1a1a';
      default: return '#FFD700';
    }
  };

  const getStoneColor = () => {
    switch(stone) {
      case 'diamond': return '#ffffff';
      case 'ruby': return '#e0115f';
      case 'sapphire': return '#0f52ba';
      case 'emerald': return '#50c878';
      default: return '#ffffff';
    }
  };

  // Base ring scale based on size (10-25)
  const scale = 0.8 + (size / 50);

  return (
    <group ref={groupRef} scale={scale}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        
        {/* The Ring Band */}
        <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.15, 64, 128]} />
          <meshStandardMaterial 
            color={getMetalColor()} 
            metalness={1} 
            roughness={0.05} 
            envMapIntensity={2} 
          />
        </mesh>

        {/* The Stone Setting (Crown) */}
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.1, 0.3, 32]} />
          <meshStandardMaterial color={getMetalColor()} metalness={1} roughness={0.1} />
        </mesh>

        {/* The Gemstone */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <octahedronGeometry args={[0.3, 2]} />
          <meshPhysicalMaterial 
            color={getStoneColor()} 
            metalness={0.1} 
            roughness={0} 
            transmission={0.9} 
            thickness={0.5}
            envMapIntensity={3}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Engraving Text */}
        {engraving && (
          <Text
            position={[0, -0.15, 1.05]}
            rotation={[-0.2, 0, 0]}
            fontSize={0.08}
            color={material === 'titanium' ? '#333' : '#a09d94'}
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff"
          >
            {engraving.toUpperCase()}
          </Text>
        )}

      </Float>
    </group>
  );
};

export default function JewelryViewer3D(props: ViewerProps) {
  return (
    <Canvas shadows camera={{ position: [0, 2, 5], fov: 45 }}>
      <color attach="background" args={["#050508"]} />
      
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <Suspense fallback={null}>
        <group rotation={[0.13, 0.1, 0]}>
          <RingModel {...props} />
        </group>
        
        <Environment preset="studio" />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={10} blur={2} far={4} color="#d4af37" />
      </Suspense>

      <OrbitControls 
        makeDefault 
        enablePan={false} 
        enableZoom={true} 
        minDistance={3} 
        maxDistance={8} 
        autoRotate
        autoRotateSpeed={1}
        maxPolarAngle={Math.PI / 2 + 0.1} 
      />
    </Canvas>
  );
}
