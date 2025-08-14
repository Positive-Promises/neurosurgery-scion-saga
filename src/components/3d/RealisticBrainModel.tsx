
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { BrainRegion, BRAIN_REGIONS } from '@/data/brainAnatomy';
import { BrainModel } from './PlaceholderModels';

interface RealisticBrainModelProps {
  onRegionClick: (region: BrainRegion) => void;
  onRegionHover: (region: BrainRegion | null) => void;
  labeledRegions: Set<string>;
}

const regionNameToIdMap: { [key: string]: string } = {
  cerebrum: 'cerebrum',
  brainstem: 'brain_stem',
  cerebellum: 'cerebellum',
  'frontal-lobe': 'frontal_lobe',
};

const BrainModelAdapter: React.FC<RealisticBrainModelProps> = (props) => {
  const handleInteraction = (partName: string) => {
    const regionId = regionNameToIdMap[partName] || partName;
    const region = BRAIN_REGIONS.find(r => r.id === regionId);
    if (region) props.onRegionClick(region);
  };

  // Simplified hover handling (adapt as needed)
  const handleHover = (partName: string | null) => {
    if (!partName) {
      props.onRegionHover(null);
      return;
    }
    const regionId = regionNameToIdMap[partName] || partName;
    const region = BRAIN_REGIONS.find(r => r.id === regionId);
    if (region) props.onRegionHover(region);
  };

  // BrainModel doesn't support hover directly, so we might need to extend it or simulate
  // For now, using onInteraction for clicks, hover not fully supported in fallback

  return <BrainModel interactive={true} onInteraction={handleInteraction} />;
};

const RealisticBrainModelContent: React.FC<RealisticBrainModelProps> = ({
  onRegionClick,
  onRegionHover,
  labeledRegions
}) => {
  const brainGroupRef = useRef<THREE.Group>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Proper useGLTF usage without try-catch
  const gltfData = useGLTF('/models/brain-anatomy.glb');

  useEffect(() => {
    if (!gltfData) {
      setLoadingError('Failed to load 3D brain model');
    }
  }, [gltfData]);

  if (loadingError || !gltfData) {
    console.warn('Using placeholder brain model due to loading issues');
    return <BrainModelAdapter {...{ onRegionClick, onRegionHover, labeledRegions }} />;
  }

  const { nodes, materials, scene } = gltfData;
  
  const regionNodeMap = {
    'Cerebrum': BRAIN_REGIONS.find(r => r.id === 'cerebrum'),
    'Cerebellum': BRAIN_REGIONS.find(r => r.id === 'cerebellum'),
    'Brain_Stem': BRAIN_REGIONS.find(r => r.id === 'brain_stem'),
    'Frontal_Lobe': BRAIN_REGIONS.find(r => r.id === 'frontal_lobe'),
    'Parietal_Lobe': BRAIN_REGIONS.find(r => r.id === 'parietal_lobe'),
    'Occipital_Lobe': BRAIN_REGIONS.find(r => r.id === 'occipital_lobe'),
    'Temporal_Lobe': BRAIN_REGIONS.find(r => r.id === 'temporal_lobe'),
  };
  
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const handleRegionPointerOver = (regionId: string) => {
    const region = regionNodeMap[regionId];
    if (region) {
      setHoveredRegion(region.id);
      onRegionHover(region);
      document.body.style.cursor = 'pointer';
    }
  };

  const handleRegionPointerOut = () => {
    setHoveredRegion(null);
    onRegionHover(null);
    document.body.style.cursor = 'default';
  };

  const handleRegionClick = (regionId: string) => {
    const region = regionNodeMap[regionId];
    if (region) onRegionClick(region);
  };

  return (
    <group ref={brainGroupRef} position={[0, 0, 0]}>
      {Object.entries(nodes).map(([nodeName, node]) => {
        if (node instanceof THREE.Mesh && node.material) {
          const region = regionNodeMap[nodeName as keyof typeof regionNodeMap];
          const isHovered = hoveredRegion === region?.id;
          const isLabeled = labeledRegions.has(region?.id || '');
          
          return (
            <mesh
              key={nodeName}
              geometry={node.geometry}
              material={node.material}
              onClick={() => handleRegionClick(nodeName.toLowerCase())}
              onPointerOver={() => handleRegionPointerOver(nodeName.toLowerCase())}
              onPointerOut={handleRegionPointerOut}
            >
              {isLabeled && region && (
                <Text position={[0, 1, 0]} fontSize={0.25} color="#ffffff">
                  {region.name}
                </Text>
              )}
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
};

const RealisticBrainModel: React.FC<RealisticBrainModelProps> = (props) => {
  return (
    <Suspense fallback={
      <BrainModelAdapter {...props} />
    }>
      <RealisticBrainModelContent {...props} />
    </Suspense>
  );
};

// Preload the GLB file
useGLTF.preload('/models/brain-anatomy.glb');

export default RealisticBrainModel;
