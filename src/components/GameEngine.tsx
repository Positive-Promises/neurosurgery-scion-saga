
import React from 'react';
import { BrainRegion, BRAIN_REGIONS } from '@/data/brainAnatomy';
import MedicalDashboardLayout from './layout/MedicalDashboardLayout';
import ObjectivesPanel from './game/ObjectivesPanel';
import EnhancedBrainEducationPanel from './game/EnhancedBrainEducationPanel';
import ProfessionalTopBar from './game/ProfessionalTopBar';
import { GameCanvas } from './game/GameCanvas';
import { GameOverlays } from './game/GameOverlays';
import { useGameState } from './game/GameStateManager';

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

const GameEngine: React.FC<GameEngineProps> = ({ level, onComplete, onExit }) => {
  const {
    audioEnabled,
    setAudioEnabled,
    gameState,
    setGameState,
    score,
    progress,
    error,
    setError,
    labeledParts,
    setLabeledParts,
    hoveredPart,
    setHoveredPart,
    selectedBrainRegion,
    setSelectedBrainRegion,
    handleObjectiveComplete
  } = useGameState(level);

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

  const handleGameComplete = () => {
    setTimeout(() => {
      onComplete(score);
    }, 1000);
  };

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
      <GameCanvas
        level={level}
        onObjectiveComplete={handleObjectiveCompleteWithTracking}
        onHoverChange={setHoveredPart}
      />

      <GameOverlays
        gameState={gameState}
        score={score}
        onResume={() => setGameState('playing')}
        onExit={onExit}
      />
    </MedicalDashboardLayout>
  );
};

export default GameEngine;
