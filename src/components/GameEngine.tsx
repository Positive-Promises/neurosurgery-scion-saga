
import React, { useEffect, useRef, useState, Suspense } from 'react';
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

// Error Boundary for 3D Canvas
class Canvas3DErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

const GameEngine: React.FC<GameEngineProps> = ({ level, onComplete, onExit }) => {
  const { preloadAudio, playAudio, stopAudio } = useAudioManager();
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'paused' | 'completed'>('loading');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const gameStartTime = useRef(Date.now());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Preload level-specific audio with error handling
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

    try {
      preloadAudio(audioTracks);
    } catch (err) {
      console.warn('Audio preload failed:', err);
    }

    // Start game after loading with error handling
    const startTimer = setTimeout(() => {
      try {
        setGameState('playing');
        playAudio('level-music');
      } catch (err) {
        console.warn('Game start audio failed:', err);
        setGameState('playing'); // Continue without audio
      }
    }, 2000);

    return () => {
      clearTimeout(startTimer);
      try {
        stopAudio('level-music', true);
      } catch (err) {
        console.warn('Audio cleanup failed:', err);
      }
    };
  }, [level.id, preloadAudio, playAudio, stopAudio]);

  const handleObjectiveComplete = (objectiveIndex: number, points: number) => {
    try {
      playAudio('success-sound');
    } catch (err) {
      console.warn('Success audio failed:', err);
    }
    
    setScore(prev => prev + points);
    const newProgress = Math.min(100, progress + (100 / level.objectives.length));
    setProgress(newProgress);
    
    if (newProgress >= 95) {
      handleGameComplete();
    }
  };

  const handleError = () => {
    try {
      playAudio('error-sound');
    } catch (err) {
      console.warn('Error audio failed:', err);
    }
    setScore(prev => Math.max(0, prev - 10));
  };

  const handleGameComplete = () => {
    setGameState('completed');
    try {
      stopAudio('level-music', true);
      playAudio('success-sound');
    } catch (err) {
      console.warn('Completion audio failed:', err);
    }
    
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

  const Canvas3DFallback = () => (
    <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h3 className="text-xl font-bold mb-2">3D Environment Loading...</h3>
        <p className="text-gray-300">Please wait while we prepare the medical simulation</p>
      </div>
    </div>
  );

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

  if (error) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Game Engine Error</h2>
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
    <div className="fixed inset-0 bg-slate-900">
      {/* 3D Game Canvas with Error Boundary */}
      <Canvas3DErrorBoundary fallback={<Canvas3DFallback />}>
        <Canvas 
          ref={canvasRef}
          className="absolute inset-0"
          gl={{ 
            antialias: true,
            alpha: false,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance"
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#1e293b');
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          }}
          onError={(error) => {
            console.error('Canvas error:', error);
            setError('Failed to initialize 3D environment. Please try refreshing the page.');
          }}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              maxDistance={10}
              minDistance={2}
            />
            <Environment preset="studio" />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            
            {renderGameContent()}
          </Suspense>
        </Canvas>
      </Canvas3DErrorBoundary>

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
