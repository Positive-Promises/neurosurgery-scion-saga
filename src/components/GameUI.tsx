import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pause, Play, X, Volume2, VolumeX } from 'lucide-react';
import EnhancedGameUI from '@/components/EnhancedGameUI';

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

const GameUI: React.FC<GameUIProps> = (props) => {
  // Use the enhanced version for better accessibility and design
  return <EnhancedGameUI {...props} />;
};

export default GameUI;
