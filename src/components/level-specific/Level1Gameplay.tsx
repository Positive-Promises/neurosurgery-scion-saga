import React, { useState, Suspense } from 'react';
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
  
  // Simplified logic for objective completion, perhaps add buttons for regions
  const handleIdentify = (regionId: string) => {
    // Simulate identification
    const newCount = identifiedCount + 1;
    setIdentifiedCount(newCount);
    onObjectiveComplete(`identify_${regionId}`, 10);
    if (newCount === BRAIN_REGIONS.length) {
      onObjectiveComplete('identify_all_regions', 100);
    }
  };

  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [identifiedRegions, setIdentifiedRegions] = useState<Set<string>>(new Set());

  const handleRegionClick = (region: any) => {
    if (region && !identifiedRegions.has(region.id)) {
      const newIdentified = new Set(identifiedRegions);
      newIdentified.add(region.id);
      setIdentifiedRegions(newIdentified);
      handleIdentify(region.id);
    }
  };

  const handleRegionHover = (region: any) => {
    setHoveredRegion(region ? region.name : null);
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
        
        {/* UI Overlay */}
        <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Brain Anatomy Explorer</h3>
          <p className="text-sm mb-2">Click on brain regions to identify them</p>
          <div className="text-sm">
            Progress: {identifiedRegions.size} / {BRAIN_REGIONS.length} regions
          </div>
          {hoveredRegion && (
            <div className="mt-2 text-cyan-300">
              Hovering: {hoveredRegion}
            </div>
          )}
        </div>

        {/* Region buttons for accessibility */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-center">
          {BRAIN_REGIONS.map(region => (
            <button
              key={region.id}
              onClick={() => handleIdentify(region.id)}
              disabled={identifiedRegions.has(region.id)}
              className={`px-3 py-1 rounded text-sm ${
                identifiedRegions.has(region.id)
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>
    </GameErrorBoundary>
  );
};

export default Level1Gameplay;