
import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { BrainModel, SpineModel, DefaultAnatomyModel } from './PlaceholderModels';

interface MedicalModelProps {
  modelPath: string;
  levelId: number;
  isInteractive?: boolean;
  onModelInteraction?: (partName: string) => void;
  highlightedParts?: string[];
  crossSection?: boolean;
  xrayMode?: boolean;
}

const MedicalModelLoader: React.FC<MedicalModelProps> = ({
  modelPath,
  levelId,
  isInteractive = true,
  onModelInteraction,
  highlightedParts = [],
  crossSection = false,
  xrayMode = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [useplaceholder, setUsePlaceholder] = useState(false);

  // Load models and textures at the top level
  const { scene } = useGLTF(modelPath, true, () => {
    setLoadingError('Failed to load 3D model');
    setUsePlaceholder(true);
  });
  const normalMap = useTexture('/textures/medical/tissue-normal.jpg');
  const roughnessMap = useTexture('/textures/medical/tissue-roughness.jpg');

  // Apply medical-grade materials
  useEffect(() => {
    if (scene && !useplaceholder) {
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
  }, [scene, normalMap, roughnessMap, xrayMode, useplaceholder]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!isInteractive || !onModelInteraction) return;
    
    event.stopPropagation();
    const intersected = event.object;
    if (intersected && intersected.name) {
      onModelInteraction(intersected.name);
    }
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    if (!isInteractive) return;
    
    const intersected = event.object;
    if (intersected && intersected.name) {
      setHoveredPart(intersected.name);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHoveredPart(null);
    document.body.style.cursor = 'default';
  };

  // Determine which placeholder model to use based on levelId
  const getPlaceholderModel = () => {
    if (levelId === 1 || levelId === 5 || levelId === 9) {
      return <BrainModel interactive={isInteractive} onInteraction={onModelInteraction} />;
    } else if (levelId === 2 || levelId === 6) {
      return <SpineModel interactive={isInteractive} onInteraction={onModelInteraction} />;
    } else {
      return <DefaultAnatomyModel interactive={isInteractive} onInteraction={onModelInteraction} />;
    }
  };

  if (loadingError || useplaceholder || !scene) {
    return (
      <group 
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {getPlaceholderModel()}
        
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
