import React, { useState, Suspense } from 'react';
import { OrbitControls, Text } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import RealisticBrainModel from '@/components/3d/RealisticBrainModel';
import { BrainRegion, BRAIN_REGIONS } from '@/data/brainAnatomy';
import { GameErrorBoundary } from '../game/GameErrorBoundary';

interface Level1GameplayProps {
  onObjectiveComplete: (objective: string, points: number) => void;
  onHoverChange?: (partName: string | null) => void;
}

const Level1Gameplay: React.FC<Level1GameplayProps> = ({
  onObjectiveComplete,
  onHoverChange,
}) => {
  const [labeledRegions, setLabeledRegions] = useState(new Set<string>());
  const [hoveredRegion, setHoveredRegion] = useState<BrainRegion | null>(null);
  const [identifiedCount, setIdentifiedCount] = useState(0);

  const handleRegionClick = (region: BrainRegion) => {
    if (!labeledRegions.has(region.id)) {
      const newLabeledRegions = new Set(labeledRegions);
      newLabeledRegions.add(region.id);
      setLabeledRegions(newLabeledRegions);

      const newCount = identifiedCount + 1;
      setIdentifiedCount(newCount);
      onObjectiveComplete(`identify_${region.id}`, 10);

      if (newCount === BRAIN_REGIONS.length) {
        onObjectiveComplete('identify_all_regions', 100);
      }
    }
  };

  const handleRegionHover = (region: BrainRegion | null) => {
    setHoveredRegion(region);
    onHoverChange?.(region?.name || null);
  };

  return (
    <GameErrorBoundary>
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 7.5]} intensity={1.5} />
        <Suspense fallback={null}>
          <RealisticBrainModel
            onRegionClick={handleRegionClick}
            onRegionHover={handleRegionHover}
            labeledRegions={labeledRegions}
          />
        </Suspense>
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={3}
          maxDistance={15}
        />
        {hoveredRegion && (
          <Text
            position={[0, -3.5, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {hoveredRegion.name}
          </Text>
        )}
      </Canvas>
    </GameErrorBoundary>
  );
};

export default Level1Gameplay;