import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import Level1Gameplay from './level-specific/Level1Gameplay';
import Level2Gameplay from './level-specific/Level2Gameplay';
import MedicalDashboardLayout from './layout/MedicalDashboardLayout';
import ObjectivesPanel from './game/ObjectivesPanel';
import EnhancedBrainEducationPanel from './game/EnhancedBrainEducationPanel';
import ProfessionalTopBar from './game/ProfessionalTopBar';
import { BrainRegion, BRAIN_REGIONS } from '@/data/brainAnatomy';

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
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'paused' | 'completed'>('loading');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Level 1 specific state for progress tracking
  const [labeledParts, setLabeledParts] = useState(0);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [selectedBrainRegion, setSelectedBrainRegion] = useState<BrainRegion | null>(null);
  
  const gameStartTime = useRef(Date.now());

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setGameState('playing');
    }, 500);

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

  // Enhanced objective complete handler with progress tracking
  const handleObjectiveCompleteWithTracking = (objective: string, points: number) => {
    handleObjectiveComplete(objective, points);
    setLabeledParts(prev => prev + 1);
    
    // Find brain region for education panel
    const regionName = objective.replace('Identify ', '');
    const region = BRAIN_REGIONS.find(r => r.name === regionName);
    if (region) {
      setSelectedBrainRegion(region);
    }
  };

  // Render level-specific gameplay
  const renderLevelGameplay = () => {
    switch (level.id) {
      case 1:
        return <Level1Gameplay 
          onObjectiveComplete={handleObjectiveCompleteWithTracking} 
          onHoverChange={setHoveredPart}
        />;
      case 2:
        return <Level2Gameplay onObjectiveComplete={handleObjectiveComplete} />;
      default:
        return <Level1Gameplay 
          onObjectiveComplete={handleObjectiveCompleteWithTracking}
          onHoverChange={setHoveredPart}
        />;
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
    <MedicalDashboardLayout
      topBar={
        <ProfessionalTopBar
          level={level}
          score={score}
          gameState={gameState}
          audioEnabled={audioEnabled}
          onPause={() => setGameState('paused')}
          onResume={() => setGameState('playing')}
          onExit={onExit}
          onToggleAudio={() => setAudioEnabled(!audioEnabled)}
        />
      }
      leftPanel={
        <ObjectivesPanel
          level={level}
          score={score}
          progress={progress}
          identifiedCount={labeledParts}
          totalRegions={BRAIN_REGIONS.length}
        />
      }
      rightPanel={
        <EnhancedBrainEducationPanel
          selectedRegion={selectedBrainRegion}
          hoveredRegion={null}
          identifiedCount={labeledParts}
          totalRegions={BRAIN_REGIONS.length}
        />
      }
    >
      {/* 3D Canvas with Error Boundary */}
      <Canvas3DErrorBoundary fallback={<Canvas3DFallback />}>
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
      </Canvas3DErrorBoundary>

      {/* Game State Overlays */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-4">Game Paused</h2>
            <div className="space-x-4">
              <Button onClick={() => setGameState('playing')} className="bg-cyan-600 hover:bg-cyan-700">
                Resume
              </Button>
              <Button onClick={onExit} variant="outline">
                Exit
              </Button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'completed' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-600">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Level Complete!</h2>
            <p className="text-cyan-400 text-lg mb-4">Final Score: {score.toLocaleString()}</p>
            <Button onClick={onExit} className="bg-cyan-600 hover:bg-cyan-700">
              Continue
            </Button>
          </div>
        </div>
      )}
    </MedicalDashboardLayout>
  );
};

export default GameEngine;
