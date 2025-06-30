
import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useSpatialAudio } from '@/hooks/useSpatialAudio';
import XRMedicalEnvironment from './3d/XRMedicalEnvironment';
import SurgicalPhysics from './3d/SurgicalPhysics';
import MedicalModelLoader from './3d/MedicalModelLoader';
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
  const { 
    createMedicalSoundscape, 
    updateListenerPosition, 
    toggleSpatialAudio,
    isEnabled: spatialAudioEnabled 
  } = useSpatialAudio();
  
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'paused' | 'completed'>('loading');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [useXR, setUseXR] = useState(false);
  const [surgicalTools, setSurgicalTools] = useState([
    {
      id: 'scalpel-1',
      type: 'scalpel' as const,
      position: [1, 0, 1] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number]
    },
    {
      id: 'forceps-1',
      type: 'forceps' as const,
      position: [-1, 0, 1] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number]
    }
  ]);
  
  const gameStartTime = useRef(Date.now());
  const cameraRef = useRef<THREE.Camera>(null);

  useEffect(() => {
    // Initialize both traditional and spatial audio
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
      }
    ];

    try {
      preloadAudio(audioTracks);
      createMedicalSoundscape(level.id);
    } catch (err) {
      console.warn('Audio initialization failed:', err);
    }

    // Start game after loading
    const startTimer = setTimeout(() => {
      try {
        setGameState('playing');
        playAudio('level-music');
      } catch (err) {
        console.warn('Game start audio failed:', err);
        setGameState('playing');
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
  }, [level.id, preloadAudio, playAudio, stopAudio, createMedicalSoundscape]);

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

  const handleToolInteraction = (toolId: string, targetPart: string) => {
    console.log(`Tool ${toolId} interacted with ${targetPart}`);
    handleObjectiveComplete(0, 50);
  };

  const handleModelInteraction = (partName: string) => {
    console.log(`Model interaction: ${partName}`);
    // Check if this matches any current objective
    const objective = level.objectives[0]; // Simplified for now
    if (objective) {
      handleObjectiveComplete(0, 100);
    }
  };

  const handleCameraMove = (position: [number, number, number], rotation: [number, number, number]) => {
    updateListenerPosition(position, rotation);
  };

  // Get model path based on level
  const getModelPath = (levelId: number): string => {
    const modelPaths: Record<number, string> = {
      1: '/models/brain-anatomy.glb',
      2: '/models/spine-anatomy.glb',
      3: '/models/nervous-system.glb',
      4: '/models/surgical-instruments.glb',
      5: '/models/brain-pathology.glb',
      6: '/models/spinal-cord.glb',
      7: '/models/cranial-nerves.glb',
      8: '/models/cerebrovascular.glb',
      9: '/models/tumor-models.glb',
      10: '/models/complex-cases.glb'
    };
    return modelPaths[levelId] || '/models/default-anatomy.glb';
  };

  const renderGameContent = () => {
    if (useXR) {
      return (
        <XRMedicalEnvironment
          level={level}
          onObjectiveComplete={handleObjectiveComplete}
          onError={handleError}
          enableVR={true}
          enableAR={level.id > 5}
        />
      );
    }

    return (
      <group>
        {/* Main medical model */}
        <MedicalModelLoader
          modelPath={getModelPath(level.id)}
          levelId={level.id}
          onInteraction={handleModelInteraction}
          interactive={true}
          xrayMode={level.id > 5}
          crossSection={level.id > 7}
        />
        
        {/* Physics simulation for surgery levels */}
        {level.gameType === 'surgery' && (
          <SurgicalPhysics
            tools={surgicalTools}
            onToolInteraction={handleToolInteraction}
            enableHaptics={true}
          />
        )}
      </group>
    );
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
          <p className="text-gray-300">Preparing advanced 3D medical environment...</p>
          <div className="mt-4 space-x-4">
            <button 
              onClick={() => setUseXR(false)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              Standard 3D
            </button>
            <button 
              onClick={() => setUseXR(true)}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
            >
              XR/VR Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Advanced 3D Engine Error</h2>
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

  if (useXR) {
    return renderGameContent();
  }

  return (
    <div className="fixed inset-0 bg-slate-900">
      {/* Enhanced 3D Canvas with XR capabilities */}
      <Canvas3DErrorBoundary fallback={<Canvas3DFallback />}>
        <Canvas 
          className="absolute inset-0"
          gl={{ 
            antialias: true,
            alpha: false,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance"
          }}
          onCreated={({ gl, camera }) => {
            gl.setClearColor('#1e293b');
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            
            // Store camera reference for spatial audio
            cameraRef.current = camera;
          }}
          onError={(error) => {
            console.error('Enhanced Canvas error:', error);
            setError('Failed to initialize advanced 3D environment. Please try refreshing the page.');
          }}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera 
              makeDefault 
              position={[0, 0, 5]}
              onUpdate={(camera) => {
                const pos = camera.position;
                const rot = camera.rotation;
                handleCameraMove([pos.x, pos.y, pos.z], [rot.x, rot.y, rot.z]);
              }}
            />
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              maxDistance={15}
              minDistance={1}
            />
            <Environment preset="studio" />
            <ambientLight intensity={0.3} />
            <directionalLight 
              position={[10, 10, 10]} 
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            {renderGameContent()}
          </Suspense>
        </Canvas>
      </Canvas3DErrorBoundary>

      {/* Enhanced Game UI */}
      <GameUI
        level={level}
        score={score}
        progress={progress}
        gameState={gameState}
        onPause={() => setGameState('paused')}
        onResume={() => setGameState('playing')}
        onExit={onExit}
      />

      {/* XR/VR Toggle Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => setUseXR(!useXR)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
        >
          {useXR ? 'Exit XR' : 'Enter XR/VR'}
        </button>
      </div>

      {/* Spatial Audio Toggle */}
      <div className="absolute top-4 left-32 z-10">
        <button
          onClick={toggleSpatialAudio}
          className={`px-4 py-2 rounded transition-colors ${
            spatialAudioEnabled 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-600 hover:bg-gray-700'
          } text-white`}
        >
          3D Audio: {spatialAudioEnabled ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
};

export default GameEngine;
