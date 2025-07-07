
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GameErrorBoundary, Canvas3DFallback } from './GameErrorBoundary';
import Level1Gameplay from '../level-specific/Level1Gameplay';
import Level2Gameplay from '../level-specific/Level2Gameplay';

interface GameCanvasProps {
  level: {
    id: number;
    title: string;
    gameType: 'anatomy' | 'surgery' | 'diagnosis' | 'emergency';
    objectives: string[];
  };
  onObjectiveComplete: (objective: string, points: number) => void;
  onHoverChange: (partName: string | null) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  onObjectiveComplete,
  onHoverChange
}) => {
  const renderLevelGameplay = () => {
    switch (level.id) {
      case 1:
        return <Level1Gameplay 
          onObjectiveComplete={onObjectiveComplete} 
          onHoverChange={onHoverChange}
        />;
      case 2:
        return <Level2Gameplay onObjectiveComplete={onObjectiveComplete} />;
      default:
        return <Level1Gameplay 
          onObjectiveComplete={onObjectiveComplete}
          onHoverChange={onHoverChange}
        />;
    }
  };

  return (
    <GameErrorBoundary fallback={<Canvas3DFallback />}>
      <Canvas camera={{ position: [5, 2, 5], fov: 60 }} className="w-full h-full">
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          maxDistance={10}
          minDistance={2}
        />
        
        <Suspense fallback={null}>
          {renderLevelGameplay()}
        </Suspense>
      </Canvas>
    </GameErrorBoundary>
  );
};
