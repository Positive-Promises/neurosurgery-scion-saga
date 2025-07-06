import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import RealisticBrainModel from '@/components/3d/RealisticBrainModel';
import { BrainRegion, BRAIN_REGIONS } from '@/data/brainAnatomy';

interface Level1GameplayProps {
  onObjectiveComplete: (objective: string, points: number) => void;
  onHoverChange?: (partName: string | null) => void;
}

const Level1Gameplay: React.FC<Level1GameplayProps> = ({ onObjectiveComplete, onHoverChange }) => {
  const [labeledRegions, setLabeledRegions] = useState<Set<string>>(new Set());
  const [selectedRegion, setSelectedRegion] = useState<BrainRegion | null>(null);

  const handleRegionClick = (region: BrainRegion) => {
    if (!labeledRegions.has(region.id)) {
      setLabeledRegions(prev => new Set(prev.add(region.id)));
      setSelectedRegion(region);
      onObjectiveComplete(`Identify ${region.name}`, 100);
      
      // Trigger completion check
      if (labeledRegions.size + 1 >= BRAIN_REGIONS.length) {
        setTimeout(() => {
          onObjectiveComplete('Complete neuroanatomical identification', 500);
        }, 1000);
      }
    }
  };

  const handleRegionHover = (region: BrainRegion | null) => {
    onHoverChange?.(region?.name || null);
  };

  return (
    <>
      {/* Realistic Brain Model */}
      <RealisticBrainModel
        onRegionClick={handleRegionClick}
        onRegionHover={handleRegionHover}
        labeledRegions={labeledRegions}
      />

      {/* Educational floating text */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={8}
        textAlign="center"
      >
        Click on brain regions to identify them
      </Text>

      {/* Progress indicator */}
      <Text
        position={[3, 2, 0]}
        fontSize={0.25}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        Progress: {labeledRegions.size}/{BRAIN_REGIONS.length}
      </Text>

      {/* NINDS Citation */}
      <Text
        position={[0, -3.8, 0]}
        fontSize={0.15}
        color="#888888"
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
        textAlign="center"
      >
        Anatomical information sourced from NINDS Brain Basics
      </Text>
    </>
  );
};

export default Level1Gameplay;