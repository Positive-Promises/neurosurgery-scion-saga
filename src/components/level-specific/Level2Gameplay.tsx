import React from 'react';
import BioDigitalModel from '@/components/3d/BioDigitalModel';
import { GameErrorBoundary, Canvas3DFallback } from '../game/GameErrorBoundary';

interface Level2GameplayProps {
  onObjectiveComplete: (objective: string, points: number) => void;
}

const Level2Gameplay: React.FC<Level2GameplayProps> = ({ onObjectiveComplete }) => {
  // The complex surgical simulation is replaced by the BioDigital model.
  // The new model provides its own interactivity.
  // Objectives can be updated later based on events from the BioDigital Viewer API.

  return (
    <GameErrorBoundary fallback={<Canvas3DFallback />}>
      <div className="w-full h-full">
        <BioDigitalModel modelId="production/maleAdult/major_structures_of_the_cns_guided" />
      </div>
    </GameErrorBoundary>
  );
};

export default Level2Gameplay;