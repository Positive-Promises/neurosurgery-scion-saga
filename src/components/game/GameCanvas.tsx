
import React, { Suspense, useEffect, useState, lazy } from 'react';
import { useSelector } from 'react-redux';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GameErrorBoundary, Canvas3DFallback } from './GameErrorBoundary';
import { RootState } from '@/store/gameStore';
import { WEBGL } from '@/utils/webgl';

const Level1Gameplay = lazy(() => import('../level-specific/Level1Gameplay'));
const Level2Gameplay = lazy(() => import('../level-specific/Level2Gameplay'));
const Level1Gameplay2D = lazy(() => import('../level-specific/Level1Gameplay2D'));
const Level2Gameplay2D = lazy(() => import('../level-specific/Level2Gameplay2D'));

const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-900">
    <div className="text-white text-xl">Loading Level...</div>
  </div>
);

const WebGLNotSupported = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-red-900/50 text-white p-8">
    <h2 className="text-3xl font-bold mb-4">WebGL Not Supported</h2>
    <p className="text-center">
      Your browser or device does not support WebGL, which is required for the 3D mode of this application.
      <br />
      Please try switching to 2D mode, or use a modern browser like Chrome, Firefox, or Edge on a compatible device.
    </p>
  </div>
);

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
  const viewMode = useSelector((state: RootState) => state.game.viewMode);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  useEffect(() => {
    setIsWebGLSupported(WEBGL.isWebGLAvailable());
  }, []);

  const renderLevelGameplay3D = () => {
    switch (level.id) {
      case 1:
        return <Level1Gameplay 
          onObjectiveComplete={onObjectiveComplete} 
          onHoverChange={onHoverChange}
        />;
      case 2:
        // Note: Level2Gameplay is not inside a Canvas, so it provides its own.
        // This logic might need refinement if more levels are added.
        return <Level2Gameplay onObjectiveComplete={onObjectiveComplete} />;
      default:
        return <Level1Gameplay 
          onObjectiveComplete={onObjectiveComplete}
          onHoverChange={onHoverChange}
        />;
    }
  };

  const renderLevelGameplay2D = () => {
    switch (level.id) {
      case 1:
        return <Level1Gameplay2D />;
      case 2:
        return <Level2Gameplay2D />;
      default:
        return <Level1Gameplay2D />;
    }
  };

  if (viewMode === '3D' && !isWebGLSupported) {
    return <WebGLNotSupported />;
  }

  if (viewMode === '2D') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <div className="w-full h-full">
          {renderLevelGameplay2D()}
        </div>
      </Suspense>
    );
  }

  // For Level 2, the component provides its own canvas, so we render it directly.
  if (level.id === 2) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        {renderLevelGameplay3D()}
      </Suspense>
    );
  }

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
        
        <Suspense fallback={<Canvas3DFallback />}>
          {renderLevelGameplay3D()}
        </Suspense>
      </Canvas>
    </GameErrorBoundary>
  );
};
