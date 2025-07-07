
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pause, Play, X, Volume2, VolumeX, Trophy, Zap } from 'lucide-react';

interface ProfessionalTopBarProps {
  level: {
    id: number;
    title: string;
  };
  score: number;
  gameState: 'playing' | 'paused' | 'completed';
  audioEnabled: boolean;
  onPause: () => void;
  onResume: () => void;
  onExit: () => void;
  onToggleAudio: () => void;
}

const ProfessionalTopBar: React.FC<ProfessionalTopBarProps> = ({
  level,
  score,
  gameState,
  audioEnabled,
  onPause,
  onResume,
  onExit,
  onToggleAudio
}) => {
  return (
    <div className="flex items-center justify-between h-full px-6">
      {/* Left Section - Level Info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-cyan-900/30 text-cyan-300 px-3 py-1">
            Level {level.id}
          </Badge>
          <h1 className="text-xl font-bold text-white">
            {level.title}
          </h1>
        </div>
      </div>

      {/* Center Section - Score */}
      <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 px-4 py-2 rounded-lg border border-yellow-700/30">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <span className="text-yellow-400 font-bold text-lg">{score.toLocaleString()}</span>
        <span className="text-yellow-300 text-sm">points</span>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleAudio}
          className="text-white hover:bg-white/10 transition-colors"
        >
          {audioEnabled ? (
            <Volume2 className="w-5 h-5 text-green-400" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={gameState === 'playing' ? onPause : onResume}
          className="text-white hover:bg-white/10 transition-colors"
        >
          {gameState === 'playing' ? (
            <Pause className="w-5 h-5 text-blue-400" />
          ) : (
            <Play className="w-5 h-5 text-green-400" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onExit}
          className="text-white hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalTopBar;
