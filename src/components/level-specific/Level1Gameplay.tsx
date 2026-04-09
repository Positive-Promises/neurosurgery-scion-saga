import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GameErrorBoundary, Canvas3DFallback } from '../game/GameErrorBoundary';
import { BRAIN_REGIONS } from '@/data/brainAnatomy';
import RealisticBrainModel from '@/components/3d/RealisticBrainModel';

interface Level1GameplayProps {
  onObjectiveComplete: (objective: string, points: number) => void;
  onHoverChange?: (partName: string | null) => void;
}

const Level1Gameplay: React.FC<Level1GameplayProps> = ({
  onObjectiveComplete,
  onHoverChange,
}) => {
  const [identifiedCount, setIdentifiedCount] = useState(0);
  const [identifiedRegions, setIdentifiedRegions] = useState<Set<string>>(new Set());
  
  const handleIdentify = (regionId: string) => {
    if (identifiedRegions.has(regionId)) return;

    const region = BRAIN_REGIONS.find(r => r.id === regionId);
    const regionName = region ? region.name : regionId;

    const newIdentified = new Set(identifiedRegions);
    newIdentified.add(regionId);
    setIdentifiedRegions(newIdentified);

    const newCount = identifiedCount + 1;
    setIdentifiedCount(newCount);

    onObjectiveComplete(`Identify ${regionName}`, 10);

    if (newCount === BRAIN_REGIONS.length) {
      onObjectiveComplete('All regions identified', 100);
    }
  };

  const handleRegionClick = (region: any) => {
    if (region) {
      handleIdentify(region.id);
    }
  };

  const handleRegionHover = (region: any) => {
    const name = region ? region.name : null;
    if (onHoverChange) {
      onHoverChange(name);
    }
  };

  return (
    <GameErrorBoundary fallback={<Canvas3DFallback />}>
      <div className="w-full h-full relative">
        <Canvas 
          camera={{ position: [0, 2, 8], fov: 50 }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />

          <Suspense fallback={null}>
            <RealisticBrainModel
              onRegionClick={handleRegionClick}
              onRegionHover={handleRegionHover}
              labeledRegions={identifiedRegions}
            />
          </Suspense>

          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minDistance={3}
            maxDistance={15}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>
    </GameErrorBoundary>
  );
};

export default Level1Gameplay;
