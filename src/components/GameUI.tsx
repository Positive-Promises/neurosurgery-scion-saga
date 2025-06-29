
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pause, Play, X, Volume2, VolumeX } from 'lucide-react';
import { useAudioManager } from '@/hooks/useAudioManager';

interface GameUIProps {
  level: {
    id: number;
    title: string;
    objectives: string[];
  };
  score: number;
  progress: number;
  gameState: 'playing' | 'paused' | 'completed';
  onPause: () => void;
  onResume: () => void;
  onExit: () => void;
}

const GameUI: React.FC<GameUIProps> = ({
  level,
  score,
  progress,
  gameState,
  onPause,
  onResume,
  onExit
}) => {
  const { isEnabled, toggleAudio, playAudio } = useAudioManager();

  const handleButtonClick = (action: () => void) => {
    playAudio('click-sound');
    action();
  };

  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex justify-between items-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
            <h2 className="text-white font-bold text-lg">{level.title}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-cyan-400 font-semibold">Score: {score}</span>
              <div className="w-48">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleButtonClick(toggleAudio)}
              className="bg-black/50 backdrop-blur-sm border-gray-600 hover:bg-black/70"
            >
              {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleButtonClick(gameState === 'playing' ? onPause : onResume)}
              className="bg-black/50 backdrop-blur-sm border-gray-600 hover:bg-black/70"
            >
              {gameState === 'playing' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handleButtonClick(onExit)}
              className="bg-black/50 backdrop-blur-sm border-gray-600 hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Objectives Panel */}
      <div className="absolute left-4 top-24 bottom-4 w-80 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 h-full">
          <h3 className="text-white font-semibold mb-3">Learning Objectives</h3>
          <div className="space-y-2">
            {level.objectives.map((objective, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-cyan-400 mt-0.5 flex-shrink-0"></div>
                <span className="text-gray-300 text-sm">{objective}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Game Paused</h2>
            <div className="flex gap-4">
              <Button onClick={() => handleButtonClick(onResume)}>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
              <Button variant="outline" onClick={() => handleButtonClick(onExit)}>
                <X className="w-4 h-4 mr-2" />
                Exit to Menu
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameUI;
