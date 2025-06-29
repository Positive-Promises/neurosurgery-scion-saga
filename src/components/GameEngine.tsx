
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { useAudioManager } from '@/hooks/useAudioManager';
import AnatomyViewer from './game-levels/AnatomyViewer';
import GameUI from './GameUI';

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
  const { preloadAudio, playAudio, stopAudio } = useAudioManager();
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'paused' | 'completed'>('loading');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const gameStartTime = useRef(Date.now());

  useEffect(() => {
    // Preload level-specific audio
    const audioTracks = [
      {
        id: 'level-music',
        src: '/audio/surgical-ambient.mp3',
        category: 'music' as const,
        loop: true,
        volume: 0.4
      },
      {
        id: 'success-sound',
        src: '/audio/success.mp3',
        category: 'sfx' as const,
        volume: 0.7
      },
      {
        id: 'error-sound',
        src: '/audio/error.mp3',
        category: 'sfx' as const,
        volume: 0.6
      },
      {
        id: 'click-sound',
        src: '/audio/click.mp3',
        category: 'sfx' as const,
        volume: 0.5
      }
    ];

    preloadAudio(audioTracks);

    // Start game after loading
    setTimeout(() => {
      setGameState('playing');
      playAudio('level-music');
    }, 2000);

    return () => {
      stopAudio('level-music', true);
    };
  }, [level.id, preloadAudio, playAudio, stopAudio]);

  const handleObjectiveComplete = (objectiveIndex: number, points: number) => {
    playAudio('success-sound');
    setScore(prev => prev + points);
    setProgress(prev => Math.min(100, prev + (100 / level.objectives.length)));
    
    if (progress >= 95) {
      handleGameComplete();
    }
  };

  const handleError = () => {
    playAudio('error-sound');
    setScore(prev => Math.max(0, prev - 10));
  };

  const handleGameComplete = () => {
    setGameState('completed');
    stopAudio('level-music', true);
    playAudio('success-sound');
    
    const timeBonus = Math.max(0, 300 - Math.floor((Date.now() - gameStartTime.current) / 1000));
    const finalScore = score + timeBonus;
    
    setTimeout(() => {
      onComplete(finalScore);
    }, 2000);
  };

  const renderGameContent = () => {
    switch (level.gameType) {
      case 'anatomy':
        return (
          <AnatomyViewer
            levelId={level.id}
            objectives={level.objectives}
            onObjectiveComplete={handleObjectiveComplete}
            onError={handleError}
          />
        );
      default:
        return (
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>
        );
    }
  };

  if (gameState === 'loading') {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading {level.title}</h2>
          <p className="text-gray-300">Preparing surgical environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900">
      {/* 3D Game Canvas */}
      <Canvas className="absolute inset-0">
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {renderGameContent()}
      </Canvas>

      {/* Game UI Overlay */}
      <GameUI
        level={level}
        score={score}
        progress={progress}
        gameState={gameState}
        onPause={() => setGameState('paused')}
        onResume={() => setGameState('playing')}
        onExit={onExit}
      />
    </div>
  );
};

export default GameEngine;
