
import { useState, useRef, useEffect } from 'react';
import { Level } from '../GameLevel';
import { BrainRegion } from '../../data/brainAnatomy';

export interface GameState {
  audioEnabled: boolean;
  gameState: 'loading' | 'playing' | 'paused' | 'completed';
  score: number;
  progress: number;
  error: string | null;
  labeledParts: number;
  hoveredPart: string | null;
  selectedBrainRegion: BrainRegion | null;
}

export const useGameState = (level: Level) => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'paused' | 'completed'>('loading');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
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

  const handleGameComplete = () => {
    setGameState('completed');
    const timeBonus = Math.max(0, 300 - Math.floor((Date.now() - gameStartTime.current) / 1000));
    const finalScore = score + timeBonus;
    setScore(finalScore);
  };

  return {
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
    handleObjectiveComplete,
    handleGameComplete
  };
};
