
import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface MedicalModelProps {
  modelPath: string;
  levelId: number;
  interactive?: boolean;
  onInteraction?: (partName: string) => void;
  highlightedParts?: string[];
  crossSection?: boolean;
  xrayMode?: boolean;
}

const MedicalModelLoader: React.FC<MedicalModelProps> = ({
  modelPath,
  levelId,
  interactive = true,
  onInteraction,
  highlightedParts = [],
  crossSection = false,
  xrayMode = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Load GLTF model with error handling
  const { scene, error } = useGLTF(modelPath, true);
  
  // Load medical textures
  const normalMap = useTexture('/textures/medical/tissue-normal.jpg');
  const roughnessMap = useTexture('/textures/medical/tissue-roughness.jpg');

  useEffect(() => {
    if (error) {
      setLoadingError(`Failed to load medical model: ${error.message}`);
      console.error('Medical model loading error:', error);
    }
  }, [error]);

  // Apply medical-grade materials
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Apply PBR materials for realistic tissue rendering
          const material = new THREE.MeshStandardMaterial({
            map: child.material?.map || null,
            normalMap: normalMap,
            roughnessMap: roughnessMap,
            metalness: 0.1,
            roughness: 0.8,
            transparent: xrayMode,
            opacity: xrayMode ? 0.3 : 1,
          });

          // Add subsurface scattering effect for organic tissue
          if (child.name.includes('tissue') || child.name.includes('organ')) {
            material.transparent = true;
            material.opacity = 0.9;
            material.emissive = new THREE.Color(0x220011);
            material.emissiveIntensity = 0.1;
          }

          child.material = material;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene, normalMap, roughnessMap, xrayMode]);

  const handleClick = (event: THREE.Event) => {
    if (!interactive || !onInteraction) return;
    
    event.stopPropagation();
    const intersected = event.intersected;
    if (intersected && intersected.object.name) {
      onInteraction(intersected.object.name);
    }
  };

  const handlePointerOver = (event: THREE.Event) => {
    if (!interactive) return;
    
    const intersected = event.intersected;
    if (intersected && intersected.object.name) {
      setHoveredPart(intersected.object.name);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHoveredPart(null);
    document.body.style.cursor = 'default';
  };

  if (loadingError) {
    return (
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="red" transparent opacity={0.5} />
      </mesh>
    );
  }

  return (
    <group 
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {scene && (
        <primitive 
          object={scene.clone()} 
          scale={[1, 1, 1]}
          position={[0, 0, 0]}
        />
      )}
      
      {/* Cross-sectional cutting plane */}
      {crossSection && (
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[5, 5]} />
          <meshBasicMaterial 
            color="#00ff00" 
            transparent 
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

export default MedicalModelLoader;
