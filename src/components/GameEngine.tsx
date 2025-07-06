import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import GameUI from './GameUI';
import Level1Gameplay from './level-specific/Level1Gameplay';
import Level2Gameplay from './level-specific/Level2Gameplay';

interface GameEngineProps {
  level: {
    id: number;
    title: string;
    gameType: 'anatomy' | 'surgery' | 'diagnosis' | 'emergency';
    objectives: string[];
  };
  onComplete: (score: number) => void;
  onExit: () => void;
}

// Error Boundary for 3D Canvas
class Canvas3DErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

const GameEngine: React.FC<GameEngineProps> = ({ level, onComplete, onExit }) => {
  // Simplified audio - no complex hooks blocking startup
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'paused' | 'completed'>('loading');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const gameStartTime = useRef(Date.now());

  useEffect(() => {
    // Start game immediately - no audio blocking
    const startTimer = setTimeout(() => {
      setGameState('playing');
    }, 500); // Reduced from 2000ms to 500ms

    return () => {
      clearTimeout(startTimer);
    };
  }, [level.id]);

  const handleObjectiveComplete = (objective: string, points: number) => {
    setScore(prev => prev + points);
    const newProgress = Math.min(100, progress + (100 / level.objectives.length));
    setProgress(newProgress);
    
    if (newProgress >= 95) {
      handleGameComplete();
    }
  };

  const handleError = () => {
    setScore(prev => Math.max(0, prev - 10));
  };

  const handleGameComplete = () => {
    setGameState('completed');
    const timeBonus = Math.max(0, 300 - Math.floor((Date.now() - gameStartTime.current) / 1000));
    const finalScore = score + timeBonus;
    
    setTimeout(() => {
      onComplete(finalScore);
    }, 1000);
  };

  // Render level-specific gameplay
  const renderLevelGameplay = () => {
    switch (level.id) {
      case 1:
        return <Level1Gameplay onObjectiveComplete={handleObjectiveComplete} />;
      case 2:
        return <Level2Gameplay onObjectiveComplete={handleObjectiveComplete} />;
      default:
        return <Level1Gameplay onObjectiveComplete={handleObjectiveComplete} />;
    }
  };

  const Canvas3DFallback = () => (
    <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h3 className="text-xl font-bold mb-2">3D Environment Loading...</h3>
        <p className="text-gray-300">Please wait while we prepare the medical simulation</p>
      </div>
    </div>
  );

  if (gameState === 'loading') {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading {level.title}</h2>
          <p className="text-gray-300">Preparing 3D medical environment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">3D Engine Error</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={onExit}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition-colors"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900">
      {/* Render level-specific gameplay directly */}
      <Canvas3DErrorBoundary fallback={<Canvas3DFallback />}>
        {renderLevelGameplay()}
      </Canvas3DErrorBoundary>

      {/* Game UI */}
      <GameUI
        level={level}
        score={score}
        progress={progress}
        gameState={gameState}
        onPause={() => setGameState('paused')}
        onResume={() => setGameState('playing')}
        onExit={onExit}
      />

      {/* Audio Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`px-4 py-2 rounded transition-colors ${
            audioEnabled 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-600 hover:bg-gray-700'
          } text-white`}
        >
          Audio: {audioEnabled ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
};

export default GameEngine;