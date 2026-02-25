import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfessionalTopBar from '@/components/game/ProfessionalTopBar';
import Level1Gameplay from '@/components/level-specific/Level1Gameplay';
import LevelCompletionModal from '@/components/LevelCompletionModal';
import { Button } from "@/components/ui/button";
import NeuronAssemblyGame from '@/components/level-specific/neuron-game/NeuronAssemblyGame';
import Level1CSFView from '@/components/level-specific/csf-flow/Level1CSFView';
import Level1BossBattle from '@/components/level-specific/boss-battle/Level1BossBattle';
import { BRAIN_REGIONS } from '@/data/brainAnatomy';

type GameView = 'explorer' | 'neuron_game' | 'csf_flow' | 'boss_battle' | 'battle_lost';

const Level1: React.FC = () => {
  const [view, setView] = useState<GameView>('explorer');
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [objectives, setObjectives] = useState(new Set<string>());
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [explorerComplete, setExplorerComplete] = useState(false);
  const [neuronGameComplete, setNeuronGameComplete] = useState(false);
  const [csfViewComplete, setCsfViewComplete] = useState(false);

  const navigate = useNavigate();

  const levelInfo = {
    id: 1,
    title: "Neuroanatomical Foundations"
  };

  const handleExit = () => {
    navigate('/');
  };

  const handleObjectiveComplete = (objectiveId: string, points: number) => {
    if (!objectives.has(objectiveId)) {
      setScore(prev => prev + points);
      const newObjectives = new Set(objectives);
      newObjectives.add(objectiveId);
      setObjectives(newObjectives);

      const brainRegionsIdentified = Array.from(newObjectives).filter(id => id.startsWith('identify_')).length >= BRAIN_REGIONS.length;
      if (brainRegionsIdentified && !explorerComplete) {
        setExplorerComplete(true);
      }
    }
  };

  const handleHoverChange = (partName: string | null) => {
    setHoveredPart(partName);
  };

  const handleNeuronGameComplete = () => {
    handleObjectiveComplete('neuron_assembly_complete', 150);
    setNeuronGameComplete(true);
    setView('csf_flow');
  };

  const handleCsfViewComplete = () => {
    handleObjectiveComplete('csf_flow_observed', 50);
    setCsfViewComplete(true);
    setView('boss_battle');
  };

  const handleBossBattleWin = () => {
    handleObjectiveComplete('hydrocephalus_crisis_averted', 300);
    setIsLevelComplete(true);
  };

  const handleBossBattleLoss = () => {
      setView('battle_lost');
  }

  const handleReplay = () => {
    setIsLevelComplete(false);
    setScore(0);
    setObjectives(new Set());
    setExplorerComplete(false);
    setNeuronGameComplete(false);
    setCsfViewComplete(false);
    setView('explorer');
  };

  const handleNextLevel = () => {
    navigate('/level2');
  };

  const renderContent = () => {
    switch (view) {
      case 'explorer':
        return <Level1Gameplay onObjectiveComplete={handleObjectiveComplete} onHoverChange={handleHoverChange} />;
      case 'neuron_game':
        return <NeuronAssemblyGame onGameComplete={handleNeuronGameComplete} />;
      case 'csf_flow':
        return <Level1CSFView />;
      case 'boss_battle':
        return <Level1BossBattle onWin={handleBossBattleWin} onLoss={handleBossBattleLoss} />;
      case 'battle_lost':
        return (
            <div className="text-white text-center flex flex-col items-center justify-center h-full">
                <h2 className="text-3xl font-bold mb-4 text-red-500">Procedure Failed</h2>
                <p className="text-lg mb-8">Intracranial pressure exceeded safe limits.</p>
                <Button onClick={handleReplay} size="lg">Try Again</Button>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
      <header className="h-16 bg-gray-800/50 backdrop-blur-sm border-b border-white/10">
        <ProfessionalTopBar
          level={levelInfo}
          score={score}
          gameState={isLevelComplete ? "completed" : "playing"}
          audioEnabled={true}
          onPause={() => {}}
          onResume={() => {}}
          onExit={handleExit}
          onToggleAudio={() => {}}
        />
      </header>
      <main className="flex-grow flex items-center justify-center p-8 relative">
        <div className="w-full max-w-7xl h-full bg-gray-700/30 rounded-xl shadow-2xl p-4 relative">
          <Suspense fallback={<div className="text-white text-center">Loading 3D assets...</div>}>
            {renderContent()}
          </Suspense>
        </div>

        {explorerComplete && !neuronGameComplete && view === 'explorer' && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold mb-4 text-green-400">Brain Scan Complete!</h2>
            <p className="text-lg mb-8">You have successfully identified all major brain regions.</p>
            <Button onClick={() => setView('neuron_game')} size="lg">
              Proceed to Neuron Assembly
            </Button>
          </div>
        )}

        {neuronGameComplete && !csfViewComplete && view === 'csf_flow' && (
           <div className="absolute bottom-16 right-8">
             <Button onClick={handleCsfViewComplete} size="lg">
               Initiate Crisis Scenario
             </Button>
           </div>
        )}

        {hoveredPart && view === 'explorer' && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-md pointer-events-none">
            <p className="font-bold text-lg">{hoveredPart}</p>
          </div>
        )}
      </main>

      {isLevelComplete && (
        <LevelCompletionModal
          level={levelInfo}
          score={score}
          onReplay={handleReplay}
          onNextLevel={handleNextLevel}
        />
      )}
    </div>
  );
};

export default Level1;
