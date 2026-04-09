import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Info } from 'lucide-react';

interface GameOverlaysProps {
  gameState: 'loading' | 'playing' | 'paused' | 'completed';
  score: number;
  hoveredPart: string | null;
  onResume: () => void;
  onExit: () => void;
}

export const GameOverlays: React.FC<GameOverlaysProps> = ({
  gameState,
  score,
  hoveredPart,
  onResume,
  onExit
}) => {
  if (gameState === 'paused') {
    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-600">
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
    );
  }

  if (gameState === 'completed') {
    return (
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
    );
  }

  if (gameState === 'playing' && hoveredPart) {
    return (
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none z-40">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-cyan-500/50 px-6 py-2 rounded-full flex items-center gap-3 shadow-lg shadow-cyan-500/20">
          <Info className="w-5 h-5 text-cyan-400" />
          <span className="text-white font-medium text-lg tracking-wide">
            {hoveredPart}
          </span>
        </div>
      </div>
    );
  }

  return null;
};
