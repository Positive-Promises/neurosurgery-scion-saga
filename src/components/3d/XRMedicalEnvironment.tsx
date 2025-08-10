
import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, VRButton, ARButton, createXRStore } from '@react-three/xr';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import MedicalModelLoader from './MedicalModelLoader';

interface XRMedicalEnvironmentProps {
  level: {
    id: number;
    title: string;
    objectives: string[];
  };
  onObjectiveComplete: (index: number, points: number) => void;
  onError: () => void;
  enableVR?: boolean;
  enableAR?: boolean;
}

const XRMedicalEnvironment: React.FC<XRMedicalEnvironmentProps> = ({
  level,
  onObjectiveComplete,
  onError,
  enableVR = true,
  enableAR = false
}) => {
  const [currentObjective, setCurrentObjective] = useState(0);
  const sceneRef = useRef<THREE.Group>(null);
  
  // Create XR store
  const store = createXRStore();

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

  const handleModelInteraction = (partName: string) => {
    console.log(`Interacted with: ${partName}`);
    
    // Check if interaction matches current objective
    const objective = level.objectives[currentObjective];
    if (objective && partName.toLowerCase().includes(objective.toLowerCase().split(' ')[0])) {
      onObjectiveComplete(currentObjective, 100);
      setCurrentObjective(prev => Math.min(prev + 1, level.objectives.length - 1));
    } else {
      onError();
    }
  };

  // XR-specific UI components
  const XRInterface = () => (
    <group position={[0, 2, -1]}>
      {/* Floating UI panel for XR */}
      <mesh>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial color="#1a1a2e" transparent opacity={0.8} />
      </mesh>
      
      {/* Objective display */}
      <mesh position={[0, 0.2, 0.01]}>
        <planeGeometry args={[1.8, 0.3]} />
        <meshBasicMaterial color="#16213e" />
      </mesh>
    </group>
  );

  return (
    <div className="relative w-full h-full">
      {/* VR/AR Entry Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {enableVR && (
          <VRButton store={store} />
        )}
        {enableAR && (
          <ARButton store={store} />
        )}
      </div>

      <Canvas
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
          powerPreference: "high-performance"
        }}
        camera={{ position: [0, 0, 5], fov: 75 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0f0f23');
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <XR store={store}>
          {/* Lighting setup for medical visualization */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 10]} 
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Environment */}
          <Environment preset="studio" />

          {/* Medical Model */}
          <group ref={sceneRef}>
            <MedicalModelLoader
              modelPath={getModelPath(level.id)}
              levelId={level.id}
              isInteractive={true}
              onModelInteraction={handleModelInteraction}
              crossSection={showCrossSection}
              xrayMode={xrayMode}
            />
          </group>

          {/* XR-specific components */}
          <XRInterface />

          {/* Fallback orbit controls for non-XR */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={10}
            minDistance={2}
          />
        </XR>
      </Canvas>
    </div>
  );
};

export default XRMedicalEnvironment;
