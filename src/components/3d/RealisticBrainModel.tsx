
import React, { useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { BrainRegion, BRAIN_REGIONS } from '@/data/brainAnatomy';

interface RealisticBrainModelProps {
  onRegionClick: (region: BrainRegion) => void;
  onRegionHover: (region: BrainRegion | null) => void;
  labeledRegions: Set<string>;
}

const RealisticBrainModel: React.FC<RealisticBrainModelProps> = ({
  onRegionClick,
  onRegionHover,
  labeledRegions
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const brainGroupRef = useRef<THREE.Group>(null);

  // Create anatomically accurate brain region geometry
  const createRegionGeometry = (region: BrainRegion) => {
    switch (region.shape) {
      case 'ellipsoid':
        return <sphereGeometry args={[1, 20, 16]} />;
      case 'elongated':
        return <cylinderGeometry args={[0.8, 1.2, 1.5, 12]} />;
      case 'irregular':
        return <dodecahedronGeometry args={[1, 1]} />;
      default:
        return <sphereGeometry args={[1, 20, 16]} />;
    }
  };

  const handleRegionClick = (region: BrainRegion) => {
    onRegionClick(region);
  };

  const handleRegionPointerOver = (region: BrainRegion) => {
    setHoveredRegion(region.id);
    onRegionHover(region);
    document.body.style.cursor = 'pointer';
  };

  const handleRegionPointerOut = () => {
    setHoveredRegion(null);
    onRegionHover(null);
    document.body.style.cursor = 'default';
  };

  // Calculate material properties for realistic appearance
  const getMaterialProps = (region: BrainRegion, isHovered: boolean, isLabeled: boolean) => {
    const baseColor = new THREE.Color(region.color);
    
    return {
      color: baseColor,
      transparent: true,
      opacity: isHovered ? 0.9 : isLabeled ? 0.8 : 0.7,
      emissive: isHovered ? new THREE.Color(region.color).multiplyScalar(0.2) : new THREE.Color(0x000000),
      roughness: 0.3,
      metalness: 0.1,
      clearcoat: 0.2,
      clearcoatRoughness: 0.8
    };
  };

  return (
    <group ref={brainGroupRef} position={[0, 0, 0]}>
      {/* Main brain regions */}
      {BRAIN_REGIONS.map((region) => {
        const isHovered = hoveredRegion === region.id;
        const isLabeled = labeledRegions.has(region.id);
        const [scaleX, scaleY, scaleZ] = region.size.map(s => s * 0.4);
        
        return (
          <group key={region.id}>
            {/* Brain region mesh */}
            <mesh
              position={region.position as [number, number, number]}
              scale={[scaleX, scaleY, scaleZ]}
              onClick={() => handleRegionClick(region)}
              onPointerOver={() => handleRegionPointerOver(region)}
              onPointerOut={handleRegionPointerOut}
            >
              {createRegionGeometry(region)}
              <meshPhysicalMaterial 
                {...getMaterialProps(region, isHovered, isLabeled)}
              />
            </mesh>

            {/* Region labels for identified parts */}
            {isLabeled && (
              <Text
                position={[
                  region.position[0],
                  region.position[1] + (region.size[1] * 0.3) + 0.5,
                  region.position[2]
                ]}
                fontSize={0.25}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                maxWidth={2}
                textAlign="center"
              >
                {region.name}
              </Text>
            )}

            {/* Hover tooltip */}
            {isHovered && !isLabeled && (
              <Text
                position={[
                  region.position[0],
                  region.position[1] + (region.size[1] * 0.3) + 0.3,
                  region.position[2]
                ]}
                fontSize={0.2}
                color="#ffff00"
                anchorX="center"
                anchorY="middle"
                maxWidth={3}
                textAlign="center"
              >
                Click to identify
              </Text>
            )}
          </group>
        );
      })}

      {/* Connecting structures - corpus callosum */}
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 2.5, 8]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transparent
          opacity={0.4}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Brain hemisphere separation */}
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshPhysicalMaterial
          color="#333333"
          transparent
          opacity={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Brain surface convolutions - sulci and gyri */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={`sulcus-${i}`}
          position={[
            Math.sin(i * Math.PI / 6) * (1.8 + Math.random() * 0.5),
            Math.cos(i * Math.PI / 8) * 0.8 + 0.5,
            Math.cos(i * Math.PI / 6) * (1.2 + Math.random() * 0.3)
          ]}
          rotation={[Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.4]}
        >
          <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
          <meshPhysicalMaterial
            color="#D4B5A0"
            transparent
            opacity={0.3}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Educational title */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Human Brain Anatomy
      </Text>

      {/* Subtitle with NINDS reference */}
      <Text
        position={[0, 3.0, 0]}
        fontSize={0.2}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        textAlign="center"
      >
        Interactive 3D model based on NINDS Brain Basics
      </Text>
    </group>
  );
};

export default RealisticBrainModel;
