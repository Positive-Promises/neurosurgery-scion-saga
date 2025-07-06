
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pause, Play, X, Volume2, VolumeX, Trophy, Target, Clock } from 'lucide-react';

interface EnhancedGameUIProps {
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

const EnhancedGameUI: React.FC<EnhancedGameUIProps> = ({
  level,
  score,
  progress,
  gameState,
  onPause,
  onResume,
  onExit
}) => {
  const [isMuted, setIsMuted] = React.useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-900/90 to-transparent p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white">{level.title}</h2>
            <div className="flex items-center space-x-2 text-cyan-400">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">{score}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={gameState === 'playing' ? onPause : onResume}
              className="text-white hover:bg-white/20"
            >
              {gameState === 'playing' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onExit}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Progress</span>
            <span className="text-sm text-cyan-400">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Objectives Panel */}
      <div className="absolute left-4 top-32 z-40 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 max-w-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white">Objectives</h3>
        </div>
        
        <div className="space-y-2">
          {level.objectives.map((objective, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 text-sm ${
                progress >= ((index + 1) / level.objectives.length) * 100
                  ? 'text-green-400'
                  : 'text-gray-300'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  progress >= ((index + 1) / level.objectives.length) * 100
                    ? 'bg-green-400'
                    : 'bg-gray-600'
                }`}
              />
              <span>{objective}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Game State Overlays */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Game Paused</h2>
            <div className="space-x-4">
              <Button onClick={onResume} className="bg-cyan-600 hover:bg-cyan-700">
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
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Level Complete!</h2>
            <p className="text-cyan-400 text-lg mb-4">Final Score: {score}</p>
            <Button onClick={onExit} className="bg-cyan-600 hover:bg-cyan-700">
              Continue
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedGameUI;
