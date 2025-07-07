
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

interface GameOverlaysProps {
  gameState: 'loading' | 'playing' | 'paused' | 'completed';
  score: number;
  onResume: () => void;
  onExit: () => void;
}

export const GameOverlays: React.FC<GameOverlaysProps> = ({
  gameState,
  score,
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

  return null;
};
