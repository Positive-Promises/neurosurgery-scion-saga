import React from 'react';
import { Html } from '@react-three/drei';
import BioDigitalModel from '@/components/3d/BioDigitalModel';
import { GameErrorBoundary, Canvas3DFallback } from '../game/GameErrorBoundary';

interface Level1GameplayProps {
  onObjectiveComplete: (objective: string, points: number) => void;
  onHoverChange?: (partName: string | null) => void;
}

const Level1Gameplay: React.FC<Level1GameplayProps> = ({ onObjectiveComplete, onHoverChange }) => {
  // The interactivity is now handled within the BioDigital iframe.
  // The original logic for tracking identified regions is removed for now.
  // We can re-introduce objectives based on iframe events later if needed.

  return (
    <GameErrorBoundary fallback={<Canvas3DFallback />}>
      {/* BioDigital Brain Model */}
      <Html
        transform
        position={[0, 0, 0]}
        scale={[0.1, 0.1, 0.1]}
        style={{ width: '1024px', height: '1024px' }}
      >
        <BioDigitalModel modelId="production/maleAdult/male_region_brain_20" />
      </Html>
    </GameErrorBoundary>
  );
};

export default Level1Gameplay;