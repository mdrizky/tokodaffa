"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Text, Float } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

interface ViewerProps {
  jewelryType?: string;
  material: string;
  stone: string;
  engraving: string;
  size: number;
}

const JewelryModel = ({ jewelryType = "ring", material, stone, engraving, size }: ViewerProps) => {
  const groupRef = useRef<THREE.Group>(null);

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

  const metalMaterial = new THREE.MeshStandardMaterial({
    color: getMetalColor(),
    metalness: 1,
    roughness: 0.05,
    envMapIntensity: 2
  });

  const stoneMaterial = new THREE.MeshPhysicalMaterial({
    color: getStoneColor(),
    metalness: 0.1,
    roughness: 0,
    transmission: 0.9,
    thickness: 0.5,
    envMapIntensity: 3,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  });

  const scale = 0.8 + (size / 50);

  return (
    <group ref={groupRef} scale={scale}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        
        {jewelryType === "ring" && (
          <group>
            {/* The Ring Band */}
            <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]} material={metalMaterial}>
              <torusGeometry args={[1, 0.15, 64, 128]} />
            </mesh>

            {/* The Stone Setting (Crown) */}
            <mesh position={[0, 1.1, 0]} castShadow receiveShadow material={metalMaterial}>
              <cylinderGeometry args={[0.25, 0.1, 0.4, 32]} />
            </mesh>

            {/* The Prongs */}
            {[0, 1, 2, 3].map((i) => (
              <mesh key={i} position={[Math.sin(i * Math.PI/2) * 0.2, 1.3, Math.cos(i * Math.PI/2) * 0.2]} rotation={[0, i * Math.PI/2, Math.PI/12]} material={metalMaterial} castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
              </mesh>
            ))}

            {/* The Gemstone */}
            <mesh position={[0, 1.35, 0]} castShadow material={stoneMaterial}>
              <octahedronGeometry args={[0.35, 2]} />
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
          </group>
        )}

        {jewelryType === "bracelet" && (
          <group rotation={[Math.PI / 6, 0, 0]}>
            <mesh castShadow receiveShadow material={metalMaterial}>
              <torusGeometry args={[2.5, 0.1, 64, 128]} />
            </mesh>
            
            <mesh position={[0, 2.5, 0]} castShadow receiveShadow material={metalMaterial}>
              <boxGeometry args={[0.8, 0.3, 0.4]} />
            </mesh>

            <mesh position={[0, 2.65, 0]} castShadow material={stoneMaterial}>
              <boxGeometry args={[0.5, 0.2, 0.3]} />
            </mesh>

            {engraving && (
              <Text
                position={[0, 2.5, 0.21]}
                fontSize={0.15}
                color={material === 'titanium' ? '#333' : '#a09d94'}
                anchorX="center"
                anchorY="middle"
              >
                {engraving.toUpperCase()}
              </Text>
            )}
          </group>
        )}

        {jewelryType === "necklace" && (
          <group position={[0, 1, 0]}>
            {/* Chain approximation */}
            <mesh castShadow receiveShadow material={metalMaterial} rotation={[0, 0, Math.PI * 1.4]}>
              <torusGeometry args={[1.5, 0.02, 16, 100, Math.PI * 1.2]} />
            </mesh>
            
            <mesh position={[0, -1.6, 0]} castShadow receiveShadow material={metalMaterial}>
              <cylinderGeometry args={[0.3, 0.1, 0.5, 32]} />
            </mesh>

            <mesh position={[0, -1.8, 0]} castShadow material={stoneMaterial}>
              <dodecahedronGeometry args={[0.4, 0]} />
            </mesh>

            {engraving && (
              <Text
                position={[0, -1.6, 0.31]}
                fontSize={0.08}
                color={material === 'titanium' ? '#333' : '#a09d94'}
                anchorX="center"
                anchorY="middle"
              >
                {engraving.toUpperCase()}
              </Text>
            )}
          </group>
        )}

      </Float>
    </group>
  );
};

export default function JewelryViewer3D(props: ViewerProps) {
  // Adjust camera distance based on jewelry type
  const cameraZ = props.jewelryType === 'bracelet' ? 8 : props.jewelryType === 'necklace' ? 6 : 5;

  return (
    <Canvas shadows camera={{ position: [0, 2, cameraZ], fov: 45 }}>
      <color attach="background" args={["#050508"]} />
      
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <Suspense fallback={null}>
        <group rotation={[0.13, 0.1, 0]}>
          <JewelryModel {...props} />
        </group>
        
        <Environment preset="studio" />
        <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={15} blur={2} far={5} color="#d4af37" />
      </Suspense>

      <OrbitControls 
        makeDefault 
        enablePan={false} 
        enableZoom={true} 
        minDistance={3} 
        maxDistance={12} 
        autoRotate
        autoRotateSpeed={1}
        maxPolarAngle={Math.PI / 2 + 0.1} 
      />
    </Canvas>
  );
}
